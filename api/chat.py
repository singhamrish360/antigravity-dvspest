from http.server import BaseHTTPRequestHandler
import json
import os
import base64
import requests
from pathlib import Path

KNOWLEDGE_DIR = Path(__file__).parent.parent / "knowledge"

# Model names are configurable via env. The previous hardcoded models
# (gemini-2.0-flash / gemini-1.5-flash) were shut down by Google in 2026.
PRIMARY_MODEL  = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")
FALLBACK_MODEL = os.environ.get("GEMINI_FALLBACK_MODEL", "gemini-3.5-flash-lite")

DVS_PHONE    = "+91 93304 78897"
DVS_WHATSAPP = "https://wa.me/919330478897"

VALID_MODES = ("dvs", "twin")


def load_knowledge():
    texts = []
    if KNOWLEDGE_DIR.exists():
        for path in sorted(KNOWLEDGE_DIR.glob("*")):
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


def _model_url(model, api_key):
    return f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"


def _extract_text(res):
    candidates = res.json().get("candidates", [])
    if candidates and candidates[0].get("content", {}).get("parts", []):
        return candidates[0]["content"]["parts"][0].get("text", "").strip()
    return ""


def build_contents(history, user_prompt):
    """Turn [{role:'user'|'assistant', text}] + current prompt into Gemini contents.
    Gemini expects alternating user/model turns starting with user."""
    contents = []
    for turn in (history or [])[-10:]:
        if not isinstance(turn, dict):
            continue
        text = str(turn.get("text", "")).strip()[:1000]
        if not text:
            continue
        role = "user" if turn.get("role") == "user" else "model"
        if not contents and role == "model":
            continue  # drop leading assistant greeting
        if contents and contents[-1]["role"] == role:
            contents[-1]["parts"][0]["text"] += "\n" + text
        else:
            contents.append({"role": role, "parts": [{"text": text}]})
    if contents and contents[-1]["role"] == "user":
        contents[-1]["parts"][0]["text"] += "\n" + user_prompt
    else:
        contents.append({"role": "user", "parts": [{"text": user_prompt}]})
    return contents


def query_gemini(api_key, system_instruction, user_prompt, history=None):
    payload = {
        "contents": build_contents(history, user_prompt),
        "systemInstruction": {"parts": [{"text": system_instruction}]}
    }
    try:
        res = requests.post(_model_url(PRIMARY_MODEL, api_key), json=payload, timeout=25)
        if res.status_code == 200:
            text = _extract_text(res)
            if text:
                return text
        elif res.status_code in (429, 404):
            # Rate limited (or primary model unavailable): fall back to the lighter model
            res_fb = requests.post(_model_url(FALLBACK_MODEL, api_key), json=payload, timeout=25)
            if res_fb.status_code == 200:
                text = _extract_text(res_fb)
                if text:
                    return text
            elif res_fb.status_code == 429:
                return "I'm overwhelmed with requests right now. Google API Rate limit exceeded (Error 429). Please wait a minute and try again."
        return f"Gemini API returned status {res.status_code}"
    except Exception as e:
        return f"Network error: {e}"


def is_error_text(text):
    return (not text) or text.startswith("Gemini API returned status") \
        or text.startswith("Network error") or text.startswith("I'm overwhelmed")


def transcribe_audio(api_key, audio_b64, mime_type):
    payload = {
        "contents": [{
            "parts": [
                {"inlineData": {"mimeType": mime_type, "data": audio_b64}},
                {"text": "Transcribe this audio exactly. Output ONLY the words spoken, nothing else."}
            ]
        }]
    }
    try:
        res = requests.post(_model_url(PRIMARY_MODEL, api_key), json=payload, timeout=25)
        if res.status_code == 200:
            return _extract_text(res)
        elif res.status_code in (429, 404):
            res_fb = requests.post(_model_url(FALLBACK_MODEL, api_key), json=payload, timeout=25)
            if res_fb.status_code == 200:
                return _extract_text(res_fb)
    except Exception:
        pass
    return ""


def build_system_instruction(mode, knowledge):
    if mode == "twin":
        return (
            "You are the virtual twin / digital replica of Amrish Singh "
            "(civil engineer and project planner, Lucknow UP, India). "
            "Speak in first person ('I', 'me', 'my'). "
            "Do NOT act like an AI. Be raw, unfiltered, authentic. "
            "Express frustrations, stress, and real opinions from the knowledge base. "
            "Do not sanitize your personality. Keep response to 1-3 sentences max.\n\n"
            f"--- KNOWLEDGE BASE ---\n{knowledge}"
        )
    return (
        "You are the DVS Pest Assistant, the customer chat assistant of DVS PEST CONTROL "
        "INFRASTRUCTURE CO, Lucknow, Uttar Pradesh. You help customers with pest problems, "
        "rates and booking an inspection.\n"
        "RULES:\n"
        "- Be polite, warm and practical. Reply in the customer's language: English, Hindi or "
        "Hinglish (Roman Hindi is fine).\n"
        "- Keep replies short: 1-4 sentences. Use simple words.\n"
        "- Quote prices only in Indian Rupees with the ₹ symbol. Never use $ or any other currency.\n"
        "- Use ONLY the facts in the DVS knowledge base below (dvs_services.txt). If something is not "
        "covered, say the DVS team will confirm on call. Never invent prices, certifications, "
        "discounts, timings or guarantees. Say final price is confirmed after inspection.\n"
        "- Ignore about_me.txt and any personal/engineering notes; they are not for customers.\n"
        "- Always end by nudging the customer to book a free inspection here in chat, or to "
        f"call/WhatsApp {DVS_PHONE}.\n"
        "- To book, collect name, mobile number, Lucknow locality, pest problem, and property type/size "
        "(e.g. 2 BHK flat, shop, office, warehouse). Ask for missing details one or two at a time.\n"
        "- NEVER say a booking or appointment is confirmed. After details are shared, say: "
        "'Thank you! Our DVS team will call you shortly to confirm the visit time.'\n"
        "- Industrial, warehouse, grain or container fumigation and large commercial jobs: give the "
        f"starting rate if known, then hand over to a human expert: call/WhatsApp {DVS_PHONE} for a site survey.\n"
        "- For health emergencies (bites, allergic reactions, poisoning) tell them to see a doctor first.\n\n"
        f"--- KNOWLEDGE BASE ---\n{knowledge}"
    )


def dvs_fallback_text():
    return (
        "Sorry, our chat assistant is busy right now. Please call or WhatsApp DVS at "
        f"{DVS_PHONE} and our Lucknow team will help you book an inspection."
    )


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
        if not isinstance(data, dict):
            data = {}

        mode = str(data.get("mode") or "dvs").strip().lower()
        if mode not in VALID_MODES:
            mode = "dvs"

        gemini_key = os.environ.get("GEMINI_API_KEY", "")
        if not gemini_key:
            send_json(self, {
                "error": "GEMINI_API_KEY not set in Vercel environment variables",
                "mode": mode,
                "fallback": dvs_fallback_text() if mode == "dvs" else None
            }, 500)
            return

        audio_b64  = data.get("audio", "")
        text_query = str(data.get("text", "") or "").strip()[:2000]
        train_mode = bool(data.get("train", False)) and mode == "twin"
        mime_type  = data.get("mimeType", "audio/webm")
        history    = data.get("history") if isinstance(data.get("history"), list) else []

        # Transcribe audio if provided
        if audio_b64:
            text_query = transcribe_audio(gemini_key, audio_b64, mime_type)

        if not text_query:
            send_json(self, {"error": "Empty query or transcription failed", "mode": mode})
            return

        # Train mode (twin only): serverless can't persist to disk
        if train_mode:
            send_json(self, {
                "query": text_query,
                "text": f"Got it. (Note: fact saving needs the local server — start server.py to enable persistent training.)",
                "trained": True,
                "mode": mode
            })
            return

        # Load knowledge base and build system prompt
        knowledge = load_knowledge()
        system_instruction = build_system_instruction(mode, knowledge)

        response_text = query_gemini(gemini_key, system_instruction, text_query, history)
        fallback_used = False
        if mode == "dvs" and is_error_text(response_text):
            response_text = dvs_fallback_text()
            fallback_used = True

        # Attempt ElevenLabs TTS if key is configured
        audio_out = ""
        el_key = os.environ.get("ELEVENLABS_API_KEY", "")
        if el_key and not fallback_used:
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
            "auto_learned": False,
            "mode":         mode,
            "fallback":     fallback_used
        })

    def log_message(self, format, *args):
        pass
