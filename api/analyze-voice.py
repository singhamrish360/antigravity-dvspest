from http.server import BaseHTTPRequestHandler
import json
import os
import requests

def query_gemini_multimodal(api_key, audio_b64, mime_type, prompt_text):
    payload = {
        "contents": [{
            "parts": [
                {"inlineData": {"mimeType": mime_type, "data": audio_b64}},
                {"text": prompt_text}
            ]
        }]
    }
    
    # Try 2.0-flash first
    url_2 = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    try:
        res = requests.post(url_2, json=payload, timeout=25)
        if res.status_code == 200:
            candidates = res.json().get("candidates", [])
            if candidates and candidates[0].get("content", {}).get("parts", []):
                return candidates[0]["content"]["parts"][0].get("text", "").strip()
        elif res.status_code == 429:
            # Fallback to 1.5-flash if 2.0 is rate-limited
            url_15 = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            res_15 = requests.post(url_15, json=payload, timeout=25)
            if res_15.status_code == 200:
                candidates = res_15.json().get("candidates", [])
                if candidates and candidates[0].get("content", {}).get("parts", []):
                    return candidates[0]["content"]["parts"][0].get("text", "").strip()
            elif res_15.status_code == 429:
                return "Google Gemini API rate limit exceeded (Error 429). You are speaking or analyzing too fast. Please wait 1 minute and try again."
        return f"Analysis error: Google API returned status {res.status_code}"
    except Exception as e:
        return f"Network error: {e}"

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
            send_json(self, {"error": "GEMINI_API_KEY not configured"}, 500)
            return

        audio_b64 = data.get("audio", "")
        mime_type = data.get("mimeType", "audio/webm")

        if not audio_b64:
            send_json(self, {"error": "No audio data provided"})
            return

        analysis = query_gemini_multimodal(
            gemini_key,
            audio_b64,
            mime_type,
            (
                "Perform a professional vocal and behavioral analysis of this speaker's voice. "
                "Examine: 1. Pitch, tone, quality, resonance. "
                "2. Pacing, speed, cadence. "
                "3. Emotional state, authenticity, confidence. "
                "4. Conversational patterns, accent, Hinglish usage if present. "
                "Be concise and deeply insightful (4-6 sentences max)."
            )
        )

        send_json(self, {"analysis": analysis})

    def log_message(self, format, *args):
        pass
