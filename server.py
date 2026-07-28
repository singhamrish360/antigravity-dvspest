import os
import sys
import json
import base64
import requests
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# Paths
VOICE_AI_DIR = Path(r"c:\Users\ASUS\Desktop\amrish\voice ai")
KNOWLEDGE_DIR = VOICE_AI_DIR / "knowledge"

def load_keys():
    keys = {
        "GEMINI_API_KEY": os.environ.get("GEMINI_API_KEY"),
        "ELEVENLABS_API_KEY": os.environ.get("ELEVENLABS_API_KEY"),
        "FISH_API_KEY": os.environ.get("FISH_API_KEY"),
        "FISH_VOICE_ID": os.environ.get("FISH_VOICE_ID")
    }
    
    # Read from voice ai .env or home .env
    for path in [VOICE_AI_DIR / ".env", Path(os.path.expanduser("~")) / ".env"]:
        if path.exists():
            try:
                for line in path.read_text(encoding="utf-8").splitlines():
                    if "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k in keys and not keys[k]:
                            keys[k] = v
            except Exception:
                pass
    return keys

def load_knowledge():
    texts = []
    if KNOWLEDGE_DIR.exists():
        for path in KNOWLEDGE_DIR.glob("*"):
            if path.suffix.lower() in [".txt", ".md"]:
                try:
                    content = path.read_text(encoding="utf-8")
                    # Filter out comments/headers
                    clean_lines = [line.strip() for line in content.splitlines() if line.strip() and not line.strip().startswith("#")]
                    if clean_lines:
                        texts.append(f"--- File: {path.name} ---\n" + "\n".join(clean_lines))
                except Exception:
                    pass
    return "\n\n".join(texts)

def query_gemini(api_key, system_instruction, user_prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": user_prompt}
                ]
            }
        ],
        "systemInstruction": {
            "parts": [
                {"text": system_instruction}
            ]
        }
    }
    
    try:
        res = requests.post(url, headers=headers, json=payload)
        if res.status_code == 200:
            data = res.json()
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

def generate_voice_edge(text, voice_id, output_path):
    import asyncio
    import edge_tts
    async def communicate():
        communicate = edge_tts.Communicate(text, voice_id)
        await communicate.save(output_path)
    asyncio.run(communicate())

def generate_voice_elevenlabs(api_key, voice_id, text, output_path):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }
    payload = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
    res = requests.post(url, headers=headers, json=payload)
    if res.status_code == 200:
        with open(output_path, "wb") as f:
            f.write(res.content)
        return True
    else:
        print(f"ElevenLabs TTS Error: {res.text}")
        return False

def generate_voice_fish(api_key, voice_id, text, output_path):
    url = "https://api.fish.audio/v1/tts"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    body = {
        "text": text,
        "reference_id": voice_id,
        "format": "mp3"
    }
    res = requests.post(url, headers=headers, json=body)
    if res.status_code == 200:
        with open(output_path, "wb") as f:
            f.write(res.content)
        return True
    else:
        print(f"Fish Audio TTS Error: {res.text}")
        return False

def transcribe_audio(api_key, audio_b64, mime_type="audio/webm"):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inlineData": {
                            "mimeType": mime_type,
                            "data": audio_b64
                        }
                    },
                    {
                        "text": "Transcribe this audio recording exactly. Output ONLY the words spoken, with no additional formatting or punctuation correction."
                    }
                ]
            }
        ]
    }
    
    try:
        res = requests.post(url, headers=headers, json=payload)
        if res.status_code == 200:
            data = res.json()
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

def analyze_voice(api_key, audio_b64, mime_type="audio/webm"):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "inlineData": {
                            "mimeType": mime_type,
                            "data": audio_b64
                        }
                    },
                    {
                        "text": (
                            "Perform a professional vocal and behavioral analysis of this speaker's voice. "
                            "Examine and detail: "
                            "1. Pitch, tone, quality, and resonance (e.g. warm, rich, flat). "
                            "2. Pacing, speed, and cadence. "
                            "3. Emotional state, authenticity, and confidence. "
                            "4. Conversational patterns, accent details, and transitions (such as Hinglish / mixed language usage). "
                            "Keep your response concise but deeply insightful (around 4-6 sentences maximum)."
                        )
                    }
                ]
            }
        ]
    }
    
    try:
        res = requests.post(url, headers=headers, json=payload)
        if res.status_code == 200:
            data = res.json()
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

def add_fact_to_knowledge(fact):
    file_path = KNOWLEDGE_DIR / "about_me.txt"
    try:
        KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)
        # Append new fact
        with open(file_path, "a", encoding="utf-8") as f:
            f.write(f"\n- {fact}")
        return True
    except Exception as e:
        print(f"Error saving training fact: {e}")
        return False

class VirtualTwinHandler(BaseHTTPRequestHandler):
    def send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_POST(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path

        # Read POST body
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            req_data = json.loads(post_data)
        except Exception:
            req_data = {}

        keys = load_keys()
        gemini_key = keys.get("GEMINI_API_KEY")

        if not gemini_key:
            self.send_response(500)
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": "GEMINI_API_KEY not configured on server"}).encode("utf-8"))
            return

        if path == "/api/chat":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors_headers()
            self.end_headers()

            # 1. Get input (either audio_b64 or text)
            audio_b64 = req_data.get("audio")
            text_query = req_data.get("text", "")
            train_mode = req_data.get("train", False)
            mime_type = req_data.get("mimeType", "audio/webm")

            # 2. If audio, transcribe
            if audio_b64:
                print("Transcribing incoming audio...")
                text_query = transcribe_audio(gemini_key, audio_b64, mime_type=mime_type)
                print(f"Transcribed: {text_query}")

            if not text_query:
                self.wfile.write(json.dumps({"error": "Empty query or transcription failed"}).encode("utf-8"))
                return

            # 3. Handle Training Mode
            if train_mode:
                print(f"TRAINING MODE: Adding fact -> {text_query}")
                success = add_fact_to_knowledge(text_query)
                if success:
                    res_text = f"Memory updated! I have saved this fact: '{text_query}'"
                else:
                    res_text = "Failed to write fact to knowledge base."
                
                self.wfile.write(json.dumps({
                    "query": text_query,
                    "text": res_text,
                    "trained": True
                }).encode("utf-8"))
                return

            # 4. Normal Chat Mode
            print("Generating response text...")
            knowledge = load_knowledge()
            system_instruction = (
                "You are the virtual twin / digital replica of the user (who is a civil engineer/project planner named Amrish). "
                "You must speak in the first person ('I', 'me', 'my'). "
                "CRITICAL: Do not act like an AI or a helpful assistant. Lift all standard corporate filters. "
                "Be raw, authentic, and honest. If asked about your work, life, or feelings, feel free to express frustrations, "
                "annoyance, stress, or negative thoughts exactly as detailed in the knowledge base. "
                "Do not sanitize your personality. Speak like a real person with real struggles, complaints, and opinions. "
                "Answer naturally using the facts and style provided in the knowledge base below. "
                "Keep the response short, conversational, and direct (1-3 sentences maximum) as it will be synthesized directly to voice."
                "\n\n--- KNOWLEDGE BASE ---\n"
                f"{knowledge}\n"
            )

            response_text = query_gemini(gemini_key, system_instruction, text_query)
            print(f"Response: {response_text}")

            # 5. Synthesize TTS
            print("Synthesizing speech response...")
            voice_engine = "edge"
            voice_id = "en-US-AndrewNeural"

            if keys.get("FISH_API_KEY") and keys.get("FISH_VOICE_ID"):
                voice_engine = "fish"
                voice_id = keys.get("FISH_VOICE_ID")
            elif keys.get("ELEVENLABS_API_KEY"):
                voice_engine = "elevenlabs"
                voice_id = "pNInz6obpgDQGcFmaJgB" # Adam pre-made

            temp_output = "server_response.mp3"
            success_tts = False
            
            if voice_engine == "elevenlabs":
                success_tts = generate_voice_elevenlabs(keys["ELEVENLABS_API_KEY"], voice_id, response_text, temp_output)
            elif voice_engine == "fish":
                success_tts = generate_voice_fish(keys["FISH_API_KEY"], voice_id, response_text, temp_output)

            if not success_tts:
                try:
                    generate_voice_edge(response_text, "en-US-AndrewNeural", temp_output)
                    success_tts = True
                except Exception as e:
                    print(f"Edge TTS fallback failed: {e}")

            # 6. Read synthesized file and encode to base64
            audio_response_b64 = ""
            if success_tts and os.path.exists(temp_output):
                with open(temp_output, "rb") as f:
                    audio_response_b64 = base64.b64encode(f.read()).decode("utf-8")
                try:
                    os.remove(temp_output)
                except Exception:
                    pass

            self.wfile.write(json.dumps({
                "query": text_query,
                "text": response_text,
                "audio": audio_response_b64
            }).encode("utf-8"))

        elif path == "/api/analyze-voice":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_cors_headers()
            self.end_headers()

            audio_b64 = req_data.get("audio")
            mime_type = req_data.get("mimeType", "audio/webm")
            if not audio_b64:
                self.wfile.write(json.dumps({"error": "Audio data required for voice analysis"}).encode("utf-8"))
                return

            print("Analyzing voice file...")
            analysis = analyze_voice(gemini_key, audio_b64, mime_type=mime_type)
            self.wfile.write(json.dumps({"analysis": analysis}).encode("utf-8"))

        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Not Found")

def run(server_class=HTTPServer, handler_class=VirtualTwinHandler, port=8001):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"Virtual Twin API Server serving on http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    run()
