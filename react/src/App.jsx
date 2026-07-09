import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [botMessage, setBotMessage] = useState("Hi Madhu! How can I help you?");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;

    const currentMessage = message;

    setUserMessage(currentMessage);
    setMessage("");
    setLoading(true);
    setBotMessage("🤖 AI is thinking...");

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Response Data:", data);

      setBotMessage(data.reply);
    } catch (error) {
      console.error("Fetch Error:", error);
      setBotMessage("❌ Error connecting to AI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>🤖 Madhu AI ChatBot</h1>

      <div className="chat-box">
        <div className="user">
          <strong>You:</strong> {userMessage}
        </div>

        <div className="bot">
          <strong>AI:</strong> {botMessage}
        </div>
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}

export default App;