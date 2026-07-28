from http.server import BaseHTTPRequestHandler
import json

def send_json(h, data, status=200):
    body = json.dumps(data).encode()
    h.send_response(status)
    h.send_header("Content-Type", "application/json")
    h.send_header("Access-Control-Allow-Origin", "*")
    h.end_headers()
    h.wfile.write(body)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Memory stats — serverless has no persistent storage, return zeros
        send_json(self, {
            "total_conversations":    0,
            "total_voice_analyses":   0,
            "auto_learned_facts":     0,
            "last_active":            None,
            "has_personality_profile": False,
            "note": "Memory persistence requires local server.py"
        })

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def log_message(self, format, *args):
        pass
