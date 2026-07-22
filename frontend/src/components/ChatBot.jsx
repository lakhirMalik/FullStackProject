import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/chatService";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { reply } = await sendChatMessage(input, messages);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "⚠️ Error getting response. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, maxWidth: 500 }}>
      <h3 style={{ marginTop: 0 }}>💬 AI Chatbot (Gemini)</h3>

      <div style={{ height: 300, overflowY: "auto", border: "1px solid #eee", padding: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", margin: "6px 0" }}>
            <span
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 12,
                background: m.role === "user" ? "#3b82f6" : "#e5e7eb",
                color: m.role === "user" ? "#fff" : "#111",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div style={{ fontStyle: "italic", color: "#888" }}>Typing...</div>}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", marginTop: 8, gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleSend} disabled={loading}>Send</button>
      </div>
    </div>
  );
}