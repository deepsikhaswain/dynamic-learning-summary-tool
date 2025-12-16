from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import re
from collections import Counter

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.environ.get("AIzaSyCuUL7Ml_GuMnvF83bVwlBKgVKFZxNNVJQ")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


# ----------------- UTIL: SMART KEYWORD EXTRACTION -----------------
def extract_keywords(text, k=5):
    words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())
    stopwords = {
        "this","that","with","from","they","their","which","would",
        "there","about","could","should","these","those","because",
        "while","where","when","what","have","been","being"
    }
    words = [w for w in words if w not in stopwords]
    freq = Counter(words)
    return [w for w, _ in freq.most_common(k)]


# ----------------- GEMINI CALL -----------------
def call_gemini(prompt):
    if not GEMINI_API_KEY:
        raise Exception("Missing Gemini API key")

    response = requests.post(
        GEMINI_URL,
        headers={"Content-Type": "application/json"},
        params={"key": GEMINI_API_KEY},
        json={
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        },
        timeout=20
    )

    response.raise_for_status()
    data = response.json()
    return data["candidates"][0]["content"]["parts"][0]["text"]


# ----------------- ANALYZE TEXT -----------------
@app.route("/analyze-text", methods=["POST"])
def analyze_text():
    data = request.json
    document_text = data.get("text", "").strip()

    if not document_text:
        return jsonify({"questions": []})

    prompt = f"""
You are an expert educator.

Based ONLY on the following document, generate 5 deep, specific, non-generic questions.
Each question must clearly reference ideas, concepts, causes, effects, or solutions mentioned in the text.
Avoid generic wording.

Document:
{document_text}

Return ONLY a numbered list of 5 questions.
"""

    try:
        output = call_gemini(prompt)

        questions = [
            q.strip("0123456789. ").strip()
            for q in output.split("\n")
            if q.strip()
        ]

        if len(questions) >= 5:
            return jsonify({"questions": questions[:5]})

        raise Exception("Gemini output insufficient")

    except Exception as e:
        print("Gemini FAILED:", e)

        # ---------- SMART FALLBACK ----------
        keywords = extract_keywords(document_text)

        fallback_questions = [
            f"How does the text explain the role of {keywords[0]}?",
            f"What causes {keywords[1]} according to the document?",
            f"What impact does {keywords[2]} have as described in the text?",
            f"What challenges related to {keywords[3]} are mentioned?",
            f"How could issues involving {keywords[4]} be addressed based on the text?"
        ]

        return jsonify({"questions": fallback_questions})


# ----------------- EVALUATE ANSWER -----------------
@app.route("/evaluate-answer", methods=["POST"])
def evaluate_answer():
    data = request.json
    question = data.get("question", "")
    answer = data.get("answer", "")

    if not answer.strip():
        return jsonify({"feedback": "Please provide an answer before submitting."})

    prompt = f"""
You are a strict but helpful evaluator.

Question:
{question}

Student Answer:
{answer}

Instructions:
- Judge the answer strictly based on the question.
- Clearly state what parts of the answer are correct.
- Clearly state what is missing, incorrect, or unclear.
- Suggest exactly how the student can improve the answer.
- Keep feedback concise but specific.
- Do NOT ask new questions.


Keep feedback concise.
"""

    try:
        feedback = call_gemini(prompt)
        return jsonify({"feedback": feedback})

    except Exception as e:
        print("Gemini FAILED (evaluation):", e)

        return jsonify({
            "feedback": (
                "Your answer reminds relevant ideas, but it could be clearer and more specific. "
                "Try directly linking your points to the question and adding one concrete example."
            )
        })


# ----------------- RUN -----------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)