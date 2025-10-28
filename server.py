import http.server
import socketserver
import os

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom log format to see 404 errors
        if args[1] != '200':
            print(f"❌ {self.address_string()} - [{self.log_date_time_string()}] {format % args}")
        else:
            print(f"✅ {self.address_string()} - [{self.log_date_time_string()}] {format % args}")

print(f"🚀 Starting server at http://localhost:{PORT}")
print("�� Serving files from:", os.getcwd())

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("🔧 Server ready - monitoring for 404 errors...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
