import "dotenv/config";
import OpenAI from "openai";
import { z } from "zod";

const ai = new OpenAI({
  apiKey: process.env.MUX_API_KEY,
  baseURL: "https://gateway.devscale.id/v1",
});

const model = "deepseek-v4.1-flash";

const ticketSchema = z.object({
  priority: z.enum(["low", "medium", "high"]),
  category: z.string(),
  summary: z.string(),
  reasoning: z.string(),
});

async function classifyTicket(ticket: string) {
  const response = await ai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: `Kamu adalah customer support ticket triage system.

Klasifikasikan ticket berdasarkan urgensi.

Priority:
- low = tidak mendesak
- medium = perlu ditangani oleh support
- high = masalah kritis yang membutuhkan on-call

Balas HANYA dengan JSON valid:

{
  "priority": "low | medium | high",
  "category": "...",
  "summary": "...",
  "reasoning": "..."
}`,
      },
      {
        role: "user",
        content: ticket,
      },
    ],
  });

  const content = response.choices[0]?.message.content;

  if (!content) {
    throw new Error("Model tidak menghasilkan response");
  }

  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return ticketSchema.parse(parsed);
}

function routeTicket(
  priority: z.infer<typeof ticketSchema>["priority"]
) {
  switch (priority) {
    case "low":
      return "backlog";

    case "medium":
      return "support";

    case "high":
      return "on-call";
  }
}

async function runTriage(ticket: string) {
  console.log("Ticket:");
  console.log(ticket);

  const result = await classifyTicket(ticket);
  const destination = routeTicket(result.priority);

  console.log("\n=== TRIAGE RESULT ===");
  console.log(JSON.stringify(result, null, 2));
  console.log(`\nRoute: ${destination}`);
}
runTriage(
  "Semua pengguna tidak bisa login sejak pagi dan transaksi pembayaran juga gagal."
).catch((error) => {
  console.error(error);
  process.exit(1);
}
);