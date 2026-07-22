const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Groq client is created lazily (only when askGroq is actually called),
// so a missing GROQ_API_KEY never crashes the whole server on startup.
let groqClient = null;
function getGroqClient() {
  if (!groqClient) {
    groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return groqClient;
}

// async function askGemini(message, history = []) {
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//   const chat = model.startChat({
//     history: history.map((h) => ({
//       role: h.role === "assistant" ? "model" : "user",
//       parts: [{ text: h.content }],
//     })),
//   });

//   const result = await chat.sendMessage(message);
//   return result.response.text();
// }

async function askGroq(message, history = []) {
  const messages = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: message },
  ];

  const completion = await getGroqClient().chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
  });

  return completion.choices[0].message.content;
}

module.exports = { askGroq };