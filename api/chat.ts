import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
          model: "llama3-70b-8192",
          messages,
        }),
      }
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