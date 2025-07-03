const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.API_KEY; // keep this secret!

app.post("/api/gemini-chat", async (req, res) => {
  try {
    const { history, input } = req.body;
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
    const instruction = "You are a helpful assistant for a health care project. Only answer questions related to health care or this project. If a question is unrelated, politely respond: 'I'm only able to answer questions about health care or this project.'";



    const chatHistory = [
      { role: "user", parts: [{ text: instruction }] },
      ...(history || []).map(m => ({
        role: m.from === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }))
    ];

    const result = await model.generateContent({
      contents: [
        ...chatHistory,
        { role: "user", parts: [{ text: input }] }
      ]
    });

    res.json({ reply: result.response.text() });
  } catch (e) {
    console.error("Gemini API error:", e); // <--- Add this line
    res.status(500).json({ reply: "Sorry, I couldn't process your request." });
  }
});

app.listen(5001, () => console.log("Gemini backend running on port 5001"));
