const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Built-in Ayurvedic knowledge fallback if API hits free-tier rate limits (429)
const getAyurvedicFallback = (msg = "") => {
  const lower = msg.toLowerCase();
  if (lower.includes("stomach") || lower.includes("pain") || lower.includes("digestion") || lower.includes("acid")) {
    return "For mild stomach discomfort, sipping warm ginger or cumin tea and resting in an upright posture (Vajrasana) can be soothing. If pain is severe, sharp, or persistent, please consult a healthcare professional immediately.";
  }
  if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("tired")) {
    return "To support restful sleep, try drinking warm turmeric golden milk before bed, disconnecting from screens 30 minutes before sleep, and practicing 4-7-8 relaxing breathing.";
  }
  if (lower.includes("stress") || lower.includes("anxiety") || lower.includes("tension")) {
    return "For stress relief, try 5 minutes of alternate nostril breathing (Nadi Shodhana) and take a short walk in natural light.";
  }
  return "Namaste! I am your Nurova AI Wellness Guide. I'm here to offer mindful Ayurvedic advice for your daily routines, stress relief, and holistic health. How can I support you right now?";
};

const chatWithWellnessAI = async (req, res) => {
  try {
    const { message, history = [], userHealthContext } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    const systemInstruction = `
      You are Nurova's Ayurvedic & Wellness AI Assistant.
      You provide holistic, grounding, empathetic, and scientifically backed wellness routines.
      Tone: Calm, supportive, mindful, and rooted in earthy Ayurveda and modern wellness.
      Current User Context: ${JSON.stringify(userHealthContext || {})}
      Keep responses structured, concise, actionable, and under 150 words when possible.
    `;

    // Format chat history
    const contents = [
      ...history.map((h) => ({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.status(200).json({
      success: true,
      reply: response.text,
    });
  } catch (error) {
    console.warn("AI Chat Note:", error?.message || error);

    // If rate limited (429) or connection blip, return smart Ayurvedic fallback seamlessly
    return res.status(200).json({
      success: true,
      reply: getAyurvedicFallback(req.body?.message),
    });
  }
};

module.exports = {
  chatWithWellnessAI,
};