// Vercel Serverless Function: /api/chat  (OpenAI)
// المفتاح بيتحط في Vercel كـ Environment Variable باسم OPENAI_API_KEY (مش هنا في الكود)

const MODEL = "gpt-4o-mini"; // غيّره لأي موديل متاح في حسابك

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  try {
    const { prompt, message, image } = req.body || {};
    const content = [{ type: "text", text: prompt || message || "" }];

    // الصورة بتيجي كـ data:image/...;base64,xxxx
    if (image && image.startsWith("data:")) {
      content.push({ type: "image_url", image_url: { url: image } });
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model: MODEL, messages: [{ role: "user", content }] }),
    });
    const j = await r.json();
    const reply = j?.choices?.[0]?.message?.content || null;
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ reply: null });
  }
}
