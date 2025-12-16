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

## Setup Instructions

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export GEMINI_API_KEY=your_api_key_here
python app.py