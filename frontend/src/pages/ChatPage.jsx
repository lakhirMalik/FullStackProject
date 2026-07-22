import { Link } from "react-router-dom";
import ChatBot from "../components/ChatBot";

export default function ChatPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f6",
        padding: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 500, marginBottom: 12 }}>
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#3b82f6",
            fontWeight: 500,
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      <ChatBot />
    </div>
  );
}