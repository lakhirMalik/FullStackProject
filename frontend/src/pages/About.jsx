import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance";

export default function About() {
  const [content, setContent] = useState(null);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, rolesRes] = await Promise.all([
          api.get("/content/about"),
          api.get("/roles"),
        ]);

        setContent(contentRes.data);
        setRoles(rolesRes.data);
      } catch (err) {
        console.error(err);
        setError("Could not load page content");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="auth-container">
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/chat">Chat</Link>
      </nav>

      {error && <p className="error">{error}</p>}

      {!error && !content ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>{content?.title}</h1>
          <p>{content?.description}</p>

          <h4 style={{ marginTop: "1.5rem" }}>Features</h4>
          <ul>
            {content && content?.features?.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          <h4 style={{ marginTop: "1.5rem" }}>Roles</h4>
          <ul>
            {roles.map((role) => (
              <li key={role.id}>{role.name}</li>
            ))}
          </ul>
        </>
      )}

      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/">
          <button>← Back to Home</button>
        </Link>
      </div>
    </div>
  );
}