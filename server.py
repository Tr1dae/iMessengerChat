from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define the directory where your HTML and other static files are located
STATIC_DIR = os.path.join(os.path.dirname(__file__), 'static')

@app.route('/')
def serve_index():
    """Serve the index.html file."""
    return send_from_directory(STATIC_DIR, 'index.html')

@app.route('/take-screenshot', methods=['POST'])
def take_screenshot():
    """Handle the screenshot request."""
    data = request.json
    window_title = data.get('window_title')
    output_file = data.get('output_file')
    aspect_ratio = data.get('aspect_ratio')

    print(f"Received request: window_title={window_title}, output_file={output_file}, aspect_ratio={aspect_ratio}")

    try:
        # Run the screenshotCrop.py script
        result = subprocess.run(
            ['python', 'screenshotCrop.py', window_title, output_file, aspect_ratio],
            capture_output=True,
            text=True
        )

        print(f"Script output: {result.stdout}")
        print(f"Script error: {result.stderr}")

        if result.returncode == 0:
            return jsonify({"status": "success", "message": result.stdout})
        else:
            return jsonify({"status": "error", "message": result.stderr}), 500

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Run Flask with HTTPS
    app.run(
        host='0.0.0.0',  # Listen on all available interfaces
        port=5000,       # Default Flask port
        ssl_context=('cert.pem', 'key.pem')  # SSL certificate and private key
    )