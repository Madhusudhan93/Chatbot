import { useState } from "react";
import "./App.css";



function App() {

  const [message, setMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [botMessage, setBotMessage] = useState("Hi Madhu! How can I help you?");

async function sendMessage() {

    setUserMessage(message);

    const response = await fetch("http://127.0.0.1:5000/chat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            message: message,
        }),
    });

    const data = await response.json();

    setBotMessage(data.reply);

    setMessage("");
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
/>

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;