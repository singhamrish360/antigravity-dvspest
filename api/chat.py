from http.server import BaseHTTPRequestHandler
import json
import os
import base64
import requests
from pathlib import Path

KNOWLEDGE_DIR = Path(__file__).parent.parent / "knowledge"

def load_knowledge():
    texts = []
    if KNOWLEDGE_DIR.exists():
        for path in KNOWLEDGE_DIR.glob("*"):
            if path.suffix.lower() in [".txt", ".md"]:
                try:
                    content = path.read_text(encoding="utf-8")
                    clean_lines = [
                        line.strip() for line in content.splitlines()
                        if line.strip() and not line.strip().startswith("#")
                    ]
                    if clean_lines:
                        texts.append(f"--- {path.name} ---\n" + "\n".join(clean_lines))
                except Exception:
                    pass
    return "\n\n".join(texts)

def query_gemini(api_key, system_instruction, user_prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": user_prompt}]}],
        "systemInstruction": {"parts": [{"text": system_instruction}]}
    }
    try:
        res = requests.post(url, json=payload, timeout=25)
        if res.status_code == 200:
            data = res.json()
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
        return f"Gemini error {res.status_code}"
    except Exception as e:
        return f"Network error: {e}"

def transcribe_audio(api_key, audio_b64, mime_type):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [
                {"inlineData": {"mimeType": mime_type, "data": audio_b64}},
                {"text": "Transcribe this audio exactly. Output ONLY the words spoken, nothing else."}
            ]
        }]
    }
    try:
        res = requests.post(url, json=payload, timeout=25)
        if res.status_code == 200:
            data = res.json()
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
    except Exception:
        pass
    return ""

def send_json(h, data, status=200):
    body = json.dumps(data, ensure_ascii=False).encode()
    h.send_response(status)
    h.send_header("Content-Type", "application/json")
    h.send_header("Access-Control-Allow-Origin", "*")
    h.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
    h.send_header("Access-Control-Allow-Headers", "Content-Type")
    h.end_headers()
    h.wfile.write(body)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        try:
            data = json.loads(body)
        except Exception:
            data = {}

        gemini_key = os.environ.get("GEMINI_API_KEY", "")
        if not gemini_key:
            send_json(self, {"error": "GEMINI_API_KEY not set in Vercel environment variables"}, 500)
            return

        audio_b64  = data.get("audio", "")
        text_query = data.get("text", "")
        train_mode = data.get("train", False)
        mime_type  = data.get("mimeType", "audio/webm")

        # Transcribe audio if provided
        if audio_b64:
            text_query = transcribe_audio(gemini_key, audio_b64, mime_type)

        if not text_query:
            send_json(self, {"error": "Empty query or transcription failed"})
            return

        # Train mode: serverless can't persist to disk
        if train_mode:
            send_json(self, {
                "query": text_query,
                "text": f"Got it. (Note: fact saving needs the local server — start server.py to enable persistent training.)",
                "trained": True
            })
            return

        # Load knowledge base and build system prompt
        knowledge = load_knowledge()
        system_instruction = (
            "You are the virtual twin / digital replica of Amrish Singh "
            "(civil engineer and project planner, Lucknow UP, India). "
            "Speak in first person ('I', 'me', 'my'). "
            "Do NOT act like an AI. Be raw, unfiltered, authentic. "
            "Express frustrations, stress, and real opinions from the knowledge base. "
            "Do not sanitize your personality. Keep response to 1-3 sentences max.\n\n"
            f"--- KNOWLEDGE BASE ---\n{knowledge}"
        )

        response_text = query_gemini(gemini_key, system_instruction, text_query)

        # Attempt ElevenLabs TTS if key is configured
        audio_out = ""
        el_key = os.environ.get("ELEVENLABS_API_KEY", "")
        if el_key:
            try:
                tts = requests.post(
                    "https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB",
                    headers={"Content-Type": "application/json", "xi-api-key": el_key},
                    json={
                        "text": response_text,
                        "model_id": "eleven_monolingual_v1",
                        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
                    },
                    timeout=15
                )
                if tts.status_code == 200:
                    audio_out = base64.b64encode(tts.content).decode()
            except Exception:
                pass

        send_json(self, {
            "query":        text_query,
            "text":         response_text,
            "audio":        audio_out,
            "auto_learned": False
        })

    def log_message(self, format, *args):
        pass
