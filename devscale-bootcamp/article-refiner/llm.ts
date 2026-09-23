// llm.ts
//
// Helper terpusat untuk memanggil AI (LLM).
// Semua pipeline (article-refiner, idea-review-board, ticket-triage)
// akan menggunakan fungsi askAI() ini, supaya konfigurasi koneksi AI
// hanya ditulis SEKALI di sini, bukan diulang-ulang di tiap file.

import "dotenv/config";
import OpenAI from "openai";

const ai = new OpenAI({
  apiKey: process.env.MUX_API_KEY,
  baseURL: "https://gateway.devscale.id/v1",
});

export async function askAI(prompt: string): Promise<string> {
  const response = await ai.chat.completions.create({
    model: "gpt-5.6-luna",
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0]?.message.content;
  if (!content) throw new Error("Model tidak mengembalikan teks");
  return content;
}
