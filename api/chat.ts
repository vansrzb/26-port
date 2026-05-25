import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ CORS HEADERS (REQUIRED)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  console.log("🔥 API HIT:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    console.log("📩 Incoming messages:", messages);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages,
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();

    console.log("🤖 Groq response:", data);

    return res.status(200).json({
      reply: data?.choices?.[0]?.message?.content || "No response",
    });
  } catch (error: any) {
    console.error("💥 Server error:", error);

    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
}
