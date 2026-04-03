# LinguaBot 🤖 – English to Hindi/Telugu Translator Chatbot

A simple, lightweight web application built with Python (Flask) and HuggingFace Transformers that acts as an English to Hindi and Telugu translator.

## Features & How It Works
- **Architecture**: LinguaBot consists of a vanilla HTML/CSS/JS frontend communicating with a lightweight Flask backend REST API (`POST /translate`).
- **Translation Engine**: Under the hood, it uses HuggingFace `MarianMT` architectures offline without any external translation APIs.
- **Model Details**:
  - **English to Hindi**: `Helsinki-NLP/opus-mt-en-hi` - a dedicated Marian model optimized for Hindi mappings.
  - **English to Telugu**: `Helsinki-NLP/opus-mt-en-dra` - a broader model tailored specifically for Dravidian languages (such as Telugu, Kannada, Malayalam, Tamil). This model provides vastly improved meaning-based translation (e.g. "Yesu") compared to generic multilingual transliterators.
- **Lazy Loading**: PyTorch models are loaded lazily into memory dynamically during the first request to save on server startup times.
- **UI Details**: Dark mode theme with sleek chat bubbles, auto-scrolling, loading indicators, and translation copying features.

## Setup Instructions

Make sure you have Python 3.8+ installed.

1. **Install dependencies:**
   Make sure you are in the project folder root where `requirements.txt` is located, then run:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Flask application:**
   Move to the `backend` folder and start the server:
   ```bash
   cd backend
   python app.py
   ```

3. **Use the App:**
   Open your browser and navigate to `http://localhost:5000/`.

**Note:** The HuggingFace MarianMT translation models may take some time to download and load during your very first translation request. Subsequent translations will be quite fast!

## Project Structure
```
LinguaBot/
├── backend/
│   ├── app.py           # Flask server & REST API
│   └── translator.py    # Transformer translation functions
├── frontend/
│   ├── index.html       # Chatbot UI HTML
│   ├── style.css        # Visual styling
│   └── script.js        # JavaScript event logic & fetches
├── requirements.txt     # Python Dependencies
└── README.md            # Setup details
```
