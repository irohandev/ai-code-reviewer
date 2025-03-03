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
  // State variables to manage code input, review response, loading state, and errors
  const [code, setCode] = useState("// Enter your JavaScript code here...");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Run syntax highlighting when the component mounts
  useEffect(() => {
    prism.highlightAll();
  }, []);

  // Function to send code to the API and get a review
  async function reviewCode() {
    try {
      setIsLoading(true);  // Indicate loading state
      setError(null);  // Reset previous errors

      // Send a POST request with the code to the API
      const response = await axios.post('http://localhost:3000/ai/get-review', { code });

      // Update state with the received review
      setReview(response.data);
    } catch (err) {
      // Handle errors and update error message
      setError("Failed to get review. Please try again.");
      console.error("Review request failed:", err);
    } finally {
      setIsLoading(false);  // Reset loading state
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Code Review Assistant</h1>
      </header>

      <main className="app-content">
        {/* Code editor section */}
        <section className="editor-section">
          <h2>Your Code</h2>
          <div className="code-editor-container">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}  // Update code state on change
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}  // Apply syntax highlighting
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

          {/* Button to trigger code review */}
          <button 
            onClick={reviewCode}
            disabled={isLoading || !code.trim()}  // Disable button when loading or no code entered
            className="review-button"
          >
            {isLoading ? "Analyzing..." : "Review Code"}
          </button>
        </section>

        {/* Section to display review results */}
        <section className="review-section">
          <h2>Code Review</h2>
          <div className="review-content">
            {error && <div className="error-message">{error}</div>}  {/* Display error if present */}
            {isLoading && <div className="loading-indicator">Analyzing your code...</div>}  {/* Show loading indicator */}
            {!isLoading && !error && !review && <div className="empty-state">Your code review will appear here</div>}  {/* Placeholder if no review */}
            {!isLoading && !error && review && (
              <Markdown rehypePlugins={[rehypeHighlight]}>
                {review}  {/* Render the review response as Markdown */}
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
