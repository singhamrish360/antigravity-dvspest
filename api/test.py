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
        send_json(self, {"status": "ok", "message": "Python API is working on Vercel"})
