import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const analyzeText = async () => {
    setLoading(true);
    setQuestions([]);
    setSelectedQuestion("");
    setAnswer("");
    setFeedback("");

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      alert("Failed to generate questions");
    }

    setLoading(false);
  };

  const evaluateAnswer = async () => {
    if (!selectedQuestion || !answer) {
      alert("Select a question and write an answer");
      return;
    }

    setEvaluating(true);
    setFeedback("");

    try {
      const res = await fetch("http://127.0.0.1:5000/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion,
          answer: answer,
        }),
      });

      const data = await res.json();
      setFeedback(data.feedback || "No feedback received");
    } catch (err) {
      setFeedback("Evaluation failed");
    }

    setEvaluating(false);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9fafb",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        📘 Dynamic Learning Tool
      </h1>
      <p style={{ textAlign: "center", color: "#555" }}>
        Paste text → Get questions → Answer → Receive feedback
      </p>

      {/* TEXT INPUT */}
      <textarea
        rows="8"
        placeholder="Paste your document text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginTop: "20px",
        }}
      />

      <button
        onClick={analyzeText}
        disabled={loading || !text.trim()}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#2563eb",
          color: "white",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Generate Questions"}
      </button>

      {/* QUESTIONS */}
      {questions.length > 0 && (
        <>
          <h3 style={{ marginTop: "30px" }}>📌 Generated Questions</h3>
          <ul style={{ paddingLeft: "20px" }}>
            {questions.map((q, i) => (
              <li
                key={i}
                onClick={() => {
                  setSelectedQuestion(q);
                  setFeedback("");
                }}
                style={{
                  marginBottom: "8px",
                  cursor: "pointer",
                  color:
                    selectedQuestion === q ? "#2563eb" : "#000",
                  fontWeight:
                    selectedQuestion === q ? "bold" : "normal",
                }}
              >
                {q}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ANSWER BOX */}
      {selectedQuestion && (
        <>
          <h3 style={{ marginTop: "25px" }}>✍️ Your Answer</h3>
          <textarea
            rows="5"
            placeholder="Write your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={evaluateAnswer}
            disabled={evaluating}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#16a34a",
              color: "white",
              cursor: "pointer",
            }}
          >
            {evaluating ? "Evaluating..." : "Submit Answer"}
          </button>
        </>
      )}

      {/* FEEDBACK */}
      {feedback && (
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            backgroundColor: "#ecfeff",
            borderRadius: "6px",
            border: "1px solid #67e8f9",
          }}
        >
          <h3>🧠 Feedback</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export default App;