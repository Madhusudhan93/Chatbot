import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi Madhu! How can I help you?",
    },
  ]);
  const chatEndRef = useRef(null);

  async function sendMessage() {
    if (!message.trim()) return;

    const currentMessage = message;

    // Store user message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "user",
        text: currentMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

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

      // Store AI reply
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "❌ Error connecting to AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }
  function clearChat() {
  setMessages([
    {
      sender: "bot",
      text: "Hi Madhu! How can I help you?",
    },
  ]);
}
useEffect(() => {
  chatEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);
  return (
    <div className="container">
      <h1>🤖 Madhu AI ChatBot</h1>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user" : "bot"}
          >
            <strong>{msg.sender === "user" ? "You" : "AI"}:</strong>{" "}
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="input-area">
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

      <div style={{ display: "flex", gap: "10px" }}>
  <button onClick={sendMessage} disabled={loading}>
    {loading ? "Thinking..." : "Send"}
  </button>

  <button onClick={clearChat}>
    Clear Chat
  </button>
</div>
      </div>
    </div>
  );
}

export default App;