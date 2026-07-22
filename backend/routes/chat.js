const express = require("express");
const verifyToken = require("../middleware/verifyToken.js");
const { askGroq } = require("../services/aiService.js");
// const { askGemini } = require("../services/aiService.js"); // Gemini comment out

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Gemini filhal comment out — sirf Groq use ho raha hai
    // const reply = await askGemini(message, history);
    const reply = await askGroq(message, history);
    res.json({ reply });
  } catch (err) {
    console.error("AI chat error (groq):", err.message);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

module.exports = router;