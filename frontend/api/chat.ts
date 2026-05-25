import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    console.log("📩 Incoming messages:", messages);

    // 🧠 Call Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // ✅ your working style
          messages: messages,
          temperature: 0.7,
          max_tokens: 256,
        }),
      }
    );

    const data = await response.json();

    console.log("🤖 FULL GROQ RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("❌ Groq API error:", data);
      return res.status(500).json({ error: data });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "No response from Groq",
        raw: data,
      });
    }

    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error("💥 Server error:", error);

    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
}