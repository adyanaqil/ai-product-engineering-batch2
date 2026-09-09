// index.js
//
// PIPELINE 01: ARTICLE REFINER (versi terhubung ke AI asli)
// Alur: Draft -> Critique -> Rewrite
// Setiap tahap memanggil AI (model gpt-5.6-luna via Devscale AI gateway).

import "dotenv/config";
import OpenAI from "openai";

// Setup koneksi ke AI, pakai gateway Devscale (bukan OpenAI resmi langsung)
const ai = new OpenAI({
  apiKey: process.env.MUX_API_KEY,
  baseURL: "https://gateway.devscale.id/v1",
});

// ---------------------------------------------
// Helper: fungsi pembantu untuk manggil AI
// Semua step pakai fungsi ini, cuma beda prompt-nya.
// ---------------------------------------------
async function askAI(prompt) {
  const response = await ai.chat.completions.create({
    model: "gpt-5.6-luna",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

// ---------------------------------------------
// STEP 1: DRAFT
// ---------------------------------------------
async function draft(topic) {
  console.log("Step 1 (Draft): menghubungi AI untuk membuat draft...");
  const prompt = `Tulis draft singkat (3-4 kalimat) tentang topik: "${topic}". Ini masih draft awal, tidak perlu sempurna.`;
  const result = await askAI(prompt);
  return result;
}

// ---------------------------------------------
// STEP 2: CRITIQUE
// ---------------------------------------------
async function critique(draftText) {
  console.log("Step 2 (Critique): menghubungi AI untuk mengkritik draft...");
  const prompt = `Berikut adalah draft artikel:\n\n"${draftText}"\n\nBerikan kritik singkat (2-3 poin) tentang apa yang bisa diperbaiki dari draft ini.`;
  const result = await askAI(prompt);
  return result;
}

// ---------------------------------------------
// STEP 3: REWRITE
// ---------------------------------------------
async function rewrite(draftText, critiqueText) {
  console.log("Step 3 (Rewrite): menghubungi AI untuk menulis ulang...");
  const prompt = `Draft asli:\n"${draftText}"\n\nKritik yang diberikan:\n"${critiqueText}"\n\nTulis ulang draft di atas menjadi versi yang lebih baik, dengan mempertimbangkan kritik tersebut.`;
  const result = await askAI(prompt);
  return result;
}

// ---------------------------------------------
// PIPELINE RUNNER
// ---------------------------------------------
async function runPipeline(topic) {
  const draftResult = await draft(topic);
  const critiqueResult = await critique(draftResult);
  const finalResult = await rewrite(draftResult, critiqueResult);

  console.log("\n=== DRAFT AWAL ===");
  console.log(draftResult);

  console.log("\n=== KRITIK ===");
  console.log(critiqueResult);

  console.log("\n=== HASIL AKHIR (setelah rewrite) ===");
  console.log(finalResult);

  return finalResult;
}

// ---------------------------------------------
// JALANKAN PIPELINE
// ---------------------------------------------
runPipeline("manfaat olahraga pagi");
