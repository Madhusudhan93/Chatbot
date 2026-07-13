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

  async function sendMessage(voiceText = null)  {
   const currentMessage = voiceText || message;

if (!currentMessage.trim()) return;

    // Show user message
    setMessages((prev) => [
      ...prev,
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

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
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

  function copyMessage(text) {
    navigator.clipboard.writeText(text);
    alert("✅ Copied!");
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Listening...");
    };

    recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;

  console.log("🎤 You said:", transcript);

  // Show recognized speech in the input
  setMessage(transcript);

  // Automatically send it
  setTimeout(() => {
    sendMessage(transcript);
  }, 300);
};

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        console.log("Recognition aborted.");
      } else if (event.error === "no-speech") {
        alert("Please speak immediately after clicking the microphone.");
      } else {
        console.error(event.error);
      }
    };

    recognition.onend = () => {
      console.log("Recognition ended.");
    };

    recognition.start();
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
            <span
              style={{
                fontSize: "22px",
                marginRight: "8px",
              }}
            >
              {msg.sender === "user" ? "👤" : "🤖"}
            </span>

            <strong>
              {msg.sender === "user" ? "You" : "AI"}:
            </strong>

            <br />

            {msg.text}

            {msg.sender === "bot" && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => copyMessage(msg.text)}
                  style={{
                    fontSize: "12px",
                    padding: "5px 10px",
                  }}
                >
                  📋 Copy
                </button>
              </div>
            )}
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

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Send"}
          </button>

          <button onClick={startListening}>
            🎤
          </button>

          <button onClick={clearChat}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;