# Dynamic Learning Summary Tool

## Overview
This project is a Dynamic Learning Summary Tool built using React (frontend) and Flask (backend).
It allows users to paste large text documents and generates 5 meaningful, text-specific analytical questions using the **Google Gemini API**.

The tool also supports single-turn answer evaluation and feedback.

---

## Features
- Accepts large text input
- Generates document-specific questions using Gemini
- Allows users to answer one question
- Provides AI-based feedback
- Simple and clean UI

---

## Tech Stack
- Frontend: React (Vite)
- Backend: Flask (Python)
- AI Model: Google Gemini API (gemini-1.5-flash / gemini-pro)

---
## Gemini API Usage
This project makes direct API calls to the Google Gemini API to:
- Generate document-specific analytical questions
- Evaluate user-submitted answers and provide AI feedback

The application uses Gemini models such as `gemini-1.5-flash` via REST API calls.

## Setup Instructions

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY=your_api_key_here
python app.py

### Frontend
```bash
cd frontend
npm install
npm run dev
The frontend runs on http://localhost:5173 and connects to the Flask backend.

## API Key Disclaimer
This project requires a Google Gemini API key.
Do NOT commit your API key to GitHub.
Set it as an environment variable:

## API Key Disclaimer
This project requires a Google Gemini API key.
Do NOT commit your API key to GitHub.
Set it as an environment variable:

## API Key Disclaimer

This project uses the Google Gemini API.

⚠️ Do NOT commit your actual API key to GitHub.

Set your API key as an environment variable before running the backend:

```bash
export GEMINI_API_KEY=your_api_key_here