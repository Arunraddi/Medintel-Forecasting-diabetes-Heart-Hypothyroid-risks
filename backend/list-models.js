const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("YOUR_GAIzaSyBBzkWingDV0UfdZcztQCbFDePiLUXsx4MEMINI_API_KEY");

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log("Available models for this API key:");
    for (const model of models) {
      console.log(model.name);
    }
  } catch (e) {
    console.error("Error listing models:", e);
  }
}
listModels();