import { SNCO_SYSTEM_PROMPT } from "../lib/systemPrompt";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const { message } = await req.json();
  const SYSTEM = SNCO_SYSTEM_PROMPT;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: message || "" },
      ],
      temperature: 0.2,
    }),
  });

  if (!r.ok) {
    return new Response(await r.text(), {
      status: r.status,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const data = await r.json();
  const reply = data?.choices?.[0]?.message?.content ?? "No reply.";
  return new Response(reply, { headers: { "Content-Type": "text/plain" } });
}

