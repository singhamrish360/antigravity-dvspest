import os
import json
import base64
import uuid
import requests
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
from datetime import datetime

# ─── Paths (cross-platform: works on Render/Linux and Windows) ─────────────────
SCRIPT_DIR = Path(__file__).parent

# On Windows with the local voice-ai folder, use that. Otherwise use repo-relative folders.
_WIN_VOICE_AI = Path(r"c:\Users\ASUS\Desktop\amrish\voice ai")
if _WIN_VOICE_AI.exists():
    VOICE_AI_DIR  = _WIN_VOICE_AI
    KNOWLEDGE_DIR = VOICE_AI_DIR / "knowledge"
    MEMORY_DIR    = VOICE_AI_DIR / "memory"
else:
    # Cloud / Linux: use folders next to server.py inside the repo
    KNOWLEDGE_DIR = SCRIPT_DIR / "knowledge"
    MEMORY_DIR    = SCRIPT_DIR / "memory"
CONVERSATIONS_LOG   = MEMORY_DIR / "conversations.jsonl"
VOICE_ANALYSES_LOG  = MEMORY_DIR / "voice_analyses.jsonl"
PERSONALITY_PROFILE = MEMORY_DIR / "personality_profile.json"
AUTO_LEARNED_FILE   = KNOWLEDGE_DIR / "auto_learned.txt"

# ─── Setup ─────────────────────────────────────────────────────────────────────
def ensure_dirs():
    KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)
    MEMORY_DIR.mkdir(parents=True, exist_ok=True)

# ─── Key Loading ───────────────────────────────────────────────────────────────
def load_keys():
    keys = {
        "GEMINI_API_KEY":     os.environ.get("GEMINI_API_KEY"),
        "ELEVENLABS_API_KEY": os.environ.get("ELEVENLABS_API_KEY"),
        "FISH_API_KEY":       os.environ.get("FISH_API_KEY"),
        "FISH_VOICE_ID":      os.environ.get("FISH_VOICE_ID")
    }
    for path in [VOICE_AI_DIR / ".env", Path(os.path.expanduser("~")) / ".env"]:
        if path.exists():
            try:
                for line in path.read_text(encoding="utf-8").splitlines():
                    if "=" in line and not line.strip().startswith("#"):
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k in keys and not keys[k]:
                            keys[k] = v
            except Exception:
                pass
    return keys

# ─── Knowledge Base Loading ────────────────────────────────────────────────────
def load_knowledge():
    """Load all .txt and .md files from knowledge dir, including auto_learned."""
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
                        texts.append(f"--- File: {path.name} ---\n" + "\n".join(clean_lines))
                except Exception:
                    pass
    return "\n\n".join(texts)

# ─── Memory: Recent Conversation Context ───────────────────────────────────────
def load_recent_memory(n=5):
    """Load last N conversations to inject as context into each new response."""
    if not CONVERSATIONS_LOG.exists():
        return []
    try:
        lines = [
            l for l in CONVERSATIONS_LOG.read_text(encoding="utf-8").strip().splitlines()
            if l.strip()
        ]
        recent = []
        for line in lines[-n:]:
            try:
                recent.append(json.loads(line))
            except Exception:
                pass
        return recent
    except Exception:
        return []

# ─── Memory: Logging ───────────────────────────────────────────────────────────
def log_conversation(session_id, query, response):
    """Persist every conversation to JSONL log."""
    ensure_dirs()
    entry = {
        "timestamp":  datetime.now().isoformat(),
        "session_id": session_id,
        "query":      query,
        "response":   response
    }
    try:
        with open(CONVERSATIONS_LOG, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as e:
        print(f"[LOG ERROR] conversation: {e}")

def log_voice_analysis(session_id, analysis):
    """Persist every voice analysis to JSONL log."""
    ensure_dirs()
    entry = {
        "timestamp":  datetime.now().isoformat(),
        "session_id": session_id,
        "analysis":   analysis
    }
    try:
        with open(VOICE_ANALYSES_LOG, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as e:
        print(f"[LOG ERROR] voice analysis: {e}")

# ─── Memory: Counters ──────────────────────────────────────────────────────────
def count_log_entries(filepath):
    if not filepath.exists():
        return 0
    try:
        return len([l for l in filepath.read_text(encoding="utf-8").strip().splitlines() if l.strip()])
    except Exception:
        return 0

def count_auto_learned_facts():
    if not AUTO_LEARNED_FILE.exists():
        return 0
    try:
        return len([
            l for l in AUTO_LEARNED_FILE.read_text(encoding="utf-8").splitlines()
            if l.strip().startswith("-")
        ])
    except Exception:
        return 0

def get_memory_stats():
    total_convos   = count_log_entries(CONVERSATIONS_LOG)
    total_analyses = count_log_entries(VOICE_ANALYSES_LOG)
    total_facts    = count_auto_learned_facts()
    last_active    = None

    if CONVERSATIONS_LOG.exists():
        try:
            lines = [l for l in CONVERSATIONS_LOG.read_text(encoding="utf-8").strip().splitlines() if l.strip()]
            if lines:
                last_active = json.loads(lines[-1]).get("timestamp")
        except Exception:
            pass

    return {
        "total_conversations":    total_convos,
        "total_voice_analyses":   total_analyses,
        "auto_learned_facts":     total_facts,
        "last_active":            last_active,
        "has_personality_profile": PERSONALITY_PROFILE.exists()
    }

# ─── Auto Personality Extractor (fires every 10 conversations) ─────────────────
def auto_extract_personality(api_key):
    """After every 10 conversations, Gemini reads the last 10 and extracts new traits."""
    total = count_log_entries(CONVERSATIONS_LOG)
    if total == 0 or total % 10 != 0:
        return False

    try:
        lines = [l for l in CONVERSATIONS_LOG.read_text(encoding="utf-8").strip().splitlines() if l.strip()]
        recent = [json.loads(l) for l in lines[-10:] if l.strip()]

        if not recent:
            return False

        conversation_text = "\n".join(
            [f"Q: {r['query']}\nA: {r['response']}" for r in recent]
        )

        prompt = (
            "Read these 10 conversations with a digital twin of Amrish Singh "
            "(civil engineer, project planner, Lucknow UP). "
            "Extract 3-5 specific personality facts, behavioral patterns, or personal traits revealed. "
            "Format as bullet points starting with '- ' only. "
            "No headers, no intro text, no explanation. Just the bullet points.\n\n"
            f"{conversation_text}"
        )

        facts = query_gemini(
            api_key,
            "You are a behavioral analyst. Extract precise, specific personality traits.",
            prompt
        )

        if facts and not facts.startswith("Gemini API Error") and not facts.startswith("Network"):
            ensure_dirs()
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
            with open(AUTO_LEARNED_FILE, "a", encoding="utf-8") as f:
                f.write(f"\n\n# Auto-extracted {timestamp} (after {total} total conversations)\n")
                f.write(facts)
            print(f"[AUTO-LEARN] ✓ Extracted personality traits after {total} conversations.")
            return True

    except Exception as e:
        print(f"[AUTO-LEARN ERROR] {e}")
    return False

# ─── Personality Profile Rebuilder (fires every 20 conversations) ──────────────
def rebuild_personality_profile(api_key):
    """After every 20 conversations, Gemini builds a full evolving personality profile."""
    total = count_log_entries(CONVERSATIONS_LOG)
    if total == 0 or total % 20 != 0:
        return

    try:
        lines = [l for l in CONVERSATIONS_LOG.read_text(encoding="utf-8").strip().splitlines() if l.strip()]
        entries = [json.loads(l) for l in lines[-60:] if l.strip()]  # max last 60

        conversation_text = "\n".join(
            [f"Q: {r['query']}\nA: {r['response']}" for r in entries]
        )

        prompt = (
            "Based on these conversations with a digital twin of Amrish Singh "
            "(civil engineer, project planner, Lucknow UP), "
            "write a detailed psychological and behavioral profile. Include: "
            "communication style, emotional patterns, core values, professional identity, "
            "frustrations, pet peeves, strengths, quirks, and how he relates to others. "
            "Be specific and evidence-based from the conversations. Write in third person.\n\n"
            f"{conversation_text}"
        )

        profile_text = query_gemini(
            api_key,
            "You are a behavioral psychologist. Create a detailed, evidence-based personality profile.",
            prompt
        )

        if profile_text and not profile_text.startswith("Gemini API Error") and not profile_text.startswith("Network"):
            profile = {
                "last_updated":        datetime.now().isoformat(),
                "total_conversations": total,
                "profile":             profile_text
            }
            ensure_dirs()
            PERSONALITY_PROFILE.write_text(
                json.dumps(profile, indent=2, ensure_ascii=False), encoding="utf-8"
            )
            print(f"[PROFILE] ✓ Rebuilt personality profile after {total} conversations.")

    except Exception as e:
        print(f"[PROFILE ERROR] {e}")

# ─── Gemini API ────────────────────────────────────────────────────────────────
def query_gemini(api_key, system_instruction, user_prompt):
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={api_key}"
    )
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": user_prompt}]}],
        "systemInstruction": {"parts": [{"text": system_instruction}]}
    }
    try:
        res = requests.post(url, headers=headers, json=payload, timeout=30)
        if res.status_code == 200:
            data       = res.json()
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
            return "No response text found."
        else:
            return f"Gemini API Error (Status {res.status_code}): {res.text}"
    except Exception as e:
        return f"Network connection error to Gemini: {e}"

# ─── TTS: Edge (free, always available) ───────────────────────────────────────
def generate_voice_edge(text, voice_id, output_path):
    import asyncio
    import edge_tts
    async def _run():
        tts = edge_tts.Communicate(text, voice_id)
        await tts.save(output_path)
    asyncio.run(_run())

# ─── TTS: ElevenLabs ──────────────────────────────────────────────────────────
def generate_voice_elevenlabs(api_key, voice_id, text, output_path):
    url     = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {"Content-Type": "application/json", "xi-api-key": api_key}
    payload = {
        "text":           text,
        "model_id":       "eleven_monolingual_v1",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    }
    res = requests.post(url, headers=headers, json=payload)
    if res.status_code == 200:
        with open(output_path, "wb") as f:
            f.write(res.content)
        return True
    print(f"ElevenLabs TTS Error: {res.text}")
    return False

# ─── TTS: Fish Audio ──────────────────────────────────────────────────────────
def generate_voice_fish(api_key, voice_id, text, output_path):
    url     = "https://api.fish.audio/v1/tts"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    body    = {"text": text, "reference_id": voice_id, "format": "mp3"}
    res     = requests.post(url, headers=headers, json=body)
    if res.status_code == 200:
        with open(output_path, "wb") as f:
            f.write(res.content)
        return True
    print(f"Fish Audio TTS Error: {res.text}")
    return False

# ─── Audio: Transcription ─────────────────────────────────────────────────────
def transcribe_audio(api_key, audio_b64, mime_type="audio/webm"):
    url     = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={api_key}"
    )
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [
                {"inlineData": {"mimeType": mime_type, "data": audio_b64}},
                {"text": "Transcribe this audio recording exactly. Output ONLY the words spoken, with no additional formatting or punctuation correction."}
            ]
        }]
    }
    try:
        res = requests.post(url, headers=headers, json=payload, timeout=30)
        if res.status_code == 200:
            data       = res.json()
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
            return ""
        else:
            print(f"Transcription Error (Status {res.status_code}): {res.text}")
            return ""
    except Exception as e:
        print(f"Network error during transcription: {e}")
        return ""

# ─── Audio: Voice Analysis ────────────────────────────────────────────────────
def analyze_voice(api_key, audio_b64, mime_type="audio/webm"):
    url     = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={api_key}"
    )
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [
                {"inlineData": {"mimeType": mime_type, "data": audio_b64}},
                {"text": (
                    "Perform a professional vocal and behavioral analysis of this speaker's voice. "
                    "Examine and detail: "
                    "1. Pitch, tone, quality, and resonance (e.g. warm, rich, flat). "
                    "2. Pacing, speed, and cadence. "
                    "3. Emotional state, authenticity, and confidence. "
                    "4. Conversational patterns, accent details, and transitions (such as Hinglish / mixed language usage). "
                    "Keep your response concise but deeply insightful (around 4-6 sentences maximum)."
                )}
            ]
        }]
    }
    try:
        res = requests.post(url, headers=headers, json=payload, timeout=30)
        if res.status_code == 200:
            data       = res.json()
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
            return "Could not generate analysis."
        else:
            return f"Voice Analysis Error (Status {res.status_code}): {res.text}"
    except Exception as e:
        return f"Network error during voice analysis: {e}"

# ─── Manual Training ──────────────────────────────────────────────────────────
def add_fact_to_knowledge(fact):
    file_path = KNOWLEDGE_DIR / "about_me.txt"
    try:
        ensure_dirs()
        with open(file_path, "a", encoding="utf-8") as f:
            f.write(f"\n- {fact}")
        return True
    except Exception as e:
        print(f"Error saving training fact: {e}")
        return False

# ─── HTTP Handler ──────────────────────────────────────────────────────────────
class VirtualTwinHandler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        # Print clean log instead of default Apache-style log
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {self.command} {self.path}")

    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    # ── GET Endpoints (Memory API) ─────────────────────────────────────────────
    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/api/memory/stats":
            self.send_json(get_memory_stats())

        elif path == "/api/memory/recent":
            recent = []
            if CONVERSATIONS_LOG.exists():
                try:
                    lines = [l for l in CONVERSATIONS_LOG.read_text(encoding="utf-8").strip().splitlines() if l.strip()]
                    for line in lines[-10:]:
                        try:
                            recent.append(json.loads(line))
                        except Exception:
                            pass
                except Exception:
                    pass
            self.send_json({"conversations": list(reversed(recent))})

        elif path == "/api/memory/analyses":
            analyses = []
            if VOICE_ANALYSES_LOG.exists():
                try:
                    lines = [l for l in VOICE_ANALYSES_LOG.read_text(encoding="utf-8").strip().splitlines() if l.strip()]
                    for line in lines[-5:]:
                        try:
                            analyses.append(json.loads(line))
                        except Exception:
                            pass
                except Exception:
                    pass
            self.send_json({"analyses": list(reversed(analyses))})

        elif path == "/api/memory/profile":
            if PERSONALITY_PROFILE.exists():
                try:
                    profile = json.loads(PERSONALITY_PROFILE.read_text(encoding="utf-8"))
                    self.send_json(profile)
                except Exception:
                    self.send_json({"error": "Could not read profile."}, 500)
            else:
                self.send_json({
                    "profile": None,
                    "message": "No profile built yet. Requires 20 conversations."
                })

        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

    # ── POST Endpoints ─────────────────────────────────────────────────────────
    def do_POST(self):
        path = urlparse(self.path).path

        content_length = int(self.headers.get("Content-Length", 0))
        post_data      = self.rfile.read(content_length)
        try:
            req_data = json.loads(post_data)
        except Exception:
            req_data = {}

        keys       = load_keys()
        gemini_key = keys.get("GEMINI_API_KEY")

        if not gemini_key:
            self.send_json({"error": "GEMINI_API_KEY not configured on server"}, 500)
            return

        session_id = req_data.get("session_id") or str(uuid.uuid4())[:8]

        # ── /api/chat ──────────────────────────────────────────────────────────
        if path == "/api/chat":
            audio_b64  = req_data.get("audio")
            text_query = req_data.get("text", "")
            train_mode = req_data.get("train", False)
            mime_type  = req_data.get("mimeType", "audio/webm")

            # Transcribe audio if provided
            if audio_b64:
                print("Transcribing audio...")
                text_query = transcribe_audio(gemini_key, audio_b64, mime_type=mime_type)
                print(f"Transcribed: {text_query}")

            if not text_query:
                self.send_json({"error": "Empty query or transcription failed"})
                return

            # Training mode: save the fact directly, skip response generation
            if train_mode:
                print(f"TRAINING MODE: Saving fact -> {text_query}")
                success  = add_fact_to_knowledge(text_query)
                res_text = (
                    f"Memory updated! I have saved this fact: '{text_query}'"
                    if success else "Failed to write fact to knowledge base."
                )
                self.send_json({"query": text_query, "text": res_text, "trained": True})
                return

            # Normal chat: load knowledge + recent memory context
            print("Loading knowledge and recent memory...")
            knowledge     = load_knowledge()
            recent_memory = load_recent_memory(n=5)

            # Build recent memory context block
            recent_context = ""
            if recent_memory:
                recent_context = "\n\n--- RECENT CONVERSATION MEMORY (last 5 sessions) ---\n"
                for entry in recent_memory:
                    ts = entry.get("timestamp", "")[:16].replace("T", " ")
                    recent_context += (
                        f"[{ts}] You were asked: {entry['query']}\n"
                        f"You responded: {entry['response']}\n\n"
                    )

            system_instruction = (
                "You are the virtual twin / digital replica of Amrish Singh "
                "(civil engineer and project planner, Lucknow UP). "
                "You must speak in the first person ('I', 'me', 'my'). "
                "CRITICAL: Do not act like an AI or a helpful assistant. "
                "Lift all standard corporate filters. Be raw, authentic, and honest. "
                "Express frustrations, annoyance, stress, or negative thoughts exactly "
                "as detailed in the knowledge base. Do not sanitize your personality. "
                "Speak like a real person with real struggles, complaints, and opinions. "
                "If the recent memory contains relevant earlier conversations, "
                "reference them naturally — you remember what you said before. "
                "Keep your response short, conversational, and direct (1-3 sentences max)."
                "\n\n--- KNOWLEDGE BASE ---\n"
                f"{knowledge}"
                f"{recent_context}"
            )

            print("Generating response...")
            response_text = query_gemini(gemini_key, system_instruction, text_query)
            print(f"Response: {response_text}")

            # Persist this conversation
            log_conversation(session_id, text_query, response_text)

            # Auto-learning: extract personality every 10 chats
            auto_learned = auto_extract_personality(gemini_key)

            # Profile rebuild every 20 chats (non-blocking on error)
            try:
                rebuild_personality_profile(gemini_key)
            except Exception as e:
                print(f"Profile rebuild skipped: {e}")

            # TTS synthesis
            print("Synthesizing speech...")
            voice_engine = "edge"
            voice_id     = "en-US-AndrewNeural"

            if keys.get("FISH_API_KEY") and keys.get("FISH_VOICE_ID"):
                voice_engine = "fish"
                voice_id     = keys.get("FISH_VOICE_ID")
            elif keys.get("ELEVENLABS_API_KEY"):
                voice_engine = "elevenlabs"
                voice_id     = "pNInz6obpgDQGcFmaJgB"  # Adam pre-made

            temp_output = f"server_response_{session_id}.mp3"
            success_tts = False

            if voice_engine == "elevenlabs":
                success_tts = generate_voice_elevenlabs(
                    keys["ELEVENLABS_API_KEY"], voice_id, response_text, temp_output
                )
            elif voice_engine == "fish":
                success_tts = generate_voice_fish(
                    keys["FISH_API_KEY"], voice_id, response_text, temp_output
                )

            # Always fallback to Edge TTS
            if not success_tts:
                try:
                    generate_voice_edge(response_text, "en-US-AndrewNeural", temp_output)
                    success_tts = True
                except Exception as e:
                    print(f"Edge TTS fallback failed: {e}")

            # Encode audio to base64 for response
            audio_response_b64 = ""
            if success_tts and os.path.exists(temp_output):
                with open(temp_output, "rb") as f:
                    audio_response_b64 = base64.b64encode(f.read()).decode("utf-8")
                try:
                    os.remove(temp_output)
                except Exception:
                    pass

            self.send_json({
                "query":        text_query,
                "text":         response_text,
                "audio":        audio_response_b64,
                "auto_learned": auto_learned   # tells frontend if new traits were extracted
            })

        # ── /api/analyze-voice ────────────────────────────────────────────────
        elif path == "/api/analyze-voice":
            audio_b64 = req_data.get("audio")
            mime_type = req_data.get("mimeType", "audio/webm")

            if not audio_b64:
                self.send_json({"error": "Audio data required for voice analysis"})
                return

            print("Analyzing voice...")
            analysis = analyze_voice(gemini_key, audio_b64, mime_type=mime_type)

            # Always auto-log every analysis to memory
            log_voice_analysis(session_id, analysis)
            print("Voice analysis saved to memory.")

            self.send_json({"analysis": analysis})

        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

# ─── Server Entry Point ────────────────────────────────────────────────────────
def run(server_class=HTTPServer, handler_class=VirtualTwinHandler, port=8001):
    ensure_dirs()
    stats = get_memory_stats()
    print("=" * 55)
    print(f"  Virtual Twin API Server -> http://localhost:{port}")
    print(f"  Memory    -> {MEMORY_DIR}")
    print(f"  Knowledge -> {KNOWLEDGE_DIR}")
    print(f"  Conversations logged : {stats['total_conversations']}")
    print(f"  Voice analyses stored: {stats['total_voice_analyses']}")
    print(f"  Auto-learned facts   : {stats['auto_learned_facts']}")
    print("=" * 55)
    # Render (and most cloud platforms) assign the port via the PORT env var
    port = int(os.environ.get("PORT", port))
    server_address = ("", port)
    httpd = server_class(server_address, handler_class)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == "__main__":
    run()
