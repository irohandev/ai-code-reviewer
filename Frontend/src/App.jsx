import { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from "react-simple-code-editor";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import prism from "prismjs";

import "prismjs/themes/prism-tomorrow.css";
import "highlight.js/styles/github-dark.css";
import './App.css';

function App() {
  const [code, setCode] = useState("// Enter your JavaScript code here...");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });
      setReview(response.data);
    } catch (err) {
      setError("Failed to get review. Please try again.");
      console.error("Review request failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Code Review Assistant</h1>
      </header>
      
      <main className="app-content">
        <section className="editor-section">
          <h2>Your Code</h2>
          <div className="code-editor-container">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={16}
              className="prism-editor__textarea"
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 16,
                height: "100%",
                width: "100%",
                backgroundColor: "#1e1e1e",
                color: "#f8f8f2",
              }}
            />
          </div>
          
          <button 
            onClick={reviewCode}
            disabled={isLoading || !code.trim()}
            className="review-button"
          >
            {isLoading ? "Analyzing..." : "Review Code"}
          </button>
        </section>

        <section className="review-section">
          <h2>Code Review</h2>
          <div className="review-content">
            {error && <div className="error-message">{error}</div>}
            {isLoading && <div className="loading-indicator">Analyzing your code...</div>}
            {!isLoading && !error && !review && <div className="empty-state">Your code review will appear here</div>}
            {!isLoading && !error && review && (
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review}
              </Markdown>
            )}
          </div>
        </section>
      </main>
      
      <footer className="app-footer">
        <p>Powered by AI Code Review</p>
      </footer>
    </div>
  );
}

export default App;