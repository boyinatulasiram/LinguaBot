from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import traceback

# Import our customized translator
from translator import translator_instance

# Setup absolute path to frontend directory to serve static files correctly
frontend_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
app = Flask(__name__, static_folder=frontend_folder, static_url_path='')

# Allow Cross-Origin requests so the frontend can easily communicate with the backend
CORS(app)

@app.route('/')
def index():
    """Serves the main HTML page"""
    return send_from_directory(frontend_folder, 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    """Serves other static files like CSS and JS"""
    return send_from_directory(frontend_folder, path)

@app.route('/translate', methods=['POST'])
def translate():
    """API endpoint to handle translation requests"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data or 'language' not in data:
            return jsonify({'error': 'Invalid request format. Missing "text" or "language".'}), 400
            
        text = data['text']
        lang = data['language']
        
        if not text.strip():
            return jsonify({'error': 'Text cannot be empty.'}), 400
            
        # Call model to translate text
        translated_text = translator_instance.translate(text, lang)
        
        return jsonify({'translation': translated_text})
        
    except Exception as e:
        print(f"Error during translation: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': 'An error occurred during translation. Please check the backend logs.'}), 500

if __name__ == '__main__':
    print(f"Serving frontend from: {frontend_folder}")
    print("Starting Flask server...")
    app.run(debug=True, port=5000)
