import "dotenv/config";
import OpenAI from "openai";
import { z } from "zod";

const ai = new OpenAI({
  apiKey: process.env.MUX_API_KEY,
  baseURL: "https://gateway.devscale.id/v1",
});

const model = "deepseek-v4.1-flash";

const reviewSchema = z.object({
  reviewer: z.string(),
  assessment: z.string(),
  strengths: z.array(z.string()),
  concerns: z.array(z.string()),
  recommendation: z.string(),
});

type Review = z.infer<typeof reviewSchema>;

async function askReviewer(
  role: string,
  pitch: string,
  instruction: string
): Promise<Review> {
  const response = await ai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: `Kamu adalah ${role} dalam startup review board.

${instruction}

Balas HANYA dengan JSON valid dengan struktur:
{
  "reviewer": "${role}",
  "assessment": "...",
  "strengths": ["...", "..."],
  "concerns": ["...", "..."],
  "recommendation": "..."
}`,
      },
      {
        role: "user",
        content: `Review ide bisnis berikut:

${pitch}`,
      },
    ],
  });

  const content = response.choices[0]?.message.content;

  if (!content) {
    throw new Error(`${role} tidak menghasilkan response`);
  }

  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return reviewSchema.parse(JSON.parse(cleaned));
}

async function mergeReviews(
  pitch: string,
  reviews: Review[]
): Promise<string> {
  const response = await ai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: `Kamu adalah moderator startup review board.

Gabungkan hasil review CEO, Analyst, dan CTO menjadi satu review akhir.

Bahas:
1. Ringkasan ide
2. Insight CEO
3. Insight Analyst
4. Insight CTO
5. Risiko utama
6. Langkah validasi berikutnya

Jangan menghilangkan perbedaan pandangan antar reviewer.`,
      },
      {
        role: "user",
        content: `IDE:
${pitch}

REVIEW CEO:
${JSON.stringify(reviews[0], null, 2)}

REVIEW ANALYST:
${JSON.stringify(reviews[1], null, 2)}

REVIEW CTO:
${JSON.stringify(reviews[2], null, 2)}`,
      },
    ],
  });

  return response.choices[0]?.message.content ?? "";
}

async function runBoard(pitch: string) {
  console.log("Pitch diterima:", pitch);
  console.log("\nMenjalankan 3 reviewer secara paralel...\n");

  // Fan-out: ketiga reviewer dijalankan secara paralel.
  const [ceo, analyst, cto] = await Promise.all([
    askReviewer(
      "CEO",
      pitch,
      "Fokus pada pasar, customer, model bisnis, dan strategi go-to-market."
    ),
    askReviewer(
      "Analyst",
      pitch,
      "Fokus pada data, ukuran pasar, asumsi bisnis, dan kebutuhan validasi."
    ),
    askReviewer(
      "CTO",
      pitch,
      "Fokus pada feasibility teknis, arsitektur, keamanan, dan skalabilitas."
    ),
  ]);

  console.log("CEO selesai.");
  console.log("Analyst selesai.");
  console.log("CTO selesai.");

  // Merge: satu LLM menggabungkan ketiga review.
  const finalReview = await mergeReviews(pitch, [
    ceo,
    analyst,
    cto,
  ]);

  console.log("\n=== REVIEW BOARD ===\n");
  console.log(finalReview);
}

runBoard("Aplikasi antar jemput laundry berbasis subscription").catch(
  (error) => {
    console.error(error);
    process.exit(1);
  }
);