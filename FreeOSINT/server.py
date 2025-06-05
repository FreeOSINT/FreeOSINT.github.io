import http.server
import socketserver
import os
import sys
import webbrowser
from urllib.parse import urlparse

# Default port
PORT = 8000

# Allow port to be specified as command line argument
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        print(f"Invalid port number: {sys.argv[1]}")
        print(f"Using default port {PORT}")

# Custom request handler with improved MIME types
class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    # Update MIME types for better browser compatibility
    extensions_map = {
        '.html': 'text/html',
        '.htm': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.webp': 'image/webp',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.otf': 'font/otf',
        '.eot': 'application/vnd.ms-fontobject',
        '.md': 'text/markdown',
        '': 'application/octet-stream',  # Default
    }
    
    def log_message(self, format, *args):
        """Custom logging to show more useful information"""
        path = urlparse(self.path).path
        sys.stderr.write(f"{self.log_date_time_string()} - {self.address_string()} - {path} - {format % args}\n")

# Ensure we're in the right directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create the server
try:
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        server_url = f"http://localhost:{PORT}"
        print(f"[OK] Server started successfully at {server_url}")
        print(f"[INFO] Serving files from: {os.getcwd()}")
        print("[INFO] Available pages:")
        print(f"   - Home: {server_url}/index.html")
        print(f"   - Training: {server_url}/pages/training.html")
        print(f"   - Resources: {server_url}/pages/resources.html")
        print(f"   - About: {server_url}/pages/about.html")
        print("\n[NOTICE] Press Ctrl+C to stop the server")
        
        # Open browser automatically
        try:
            webbrowser.open(server_url)
            print("[INFO] Browser opened automatically")
        except:
            print("[ERROR] Could not open browser automatically")
        
        # Start the server
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n[INFO] Server stopped by user")
except Exception as e:
    print(f"[ERROR] Error starting server: {e}")
    print(f"[TIP] Try using a different port: python server.py <port_number>")
    sys.exit(1)