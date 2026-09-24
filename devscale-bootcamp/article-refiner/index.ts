import { Pipeline } from "@anvia/core/pipeline";
import { z } from "zod";
import { askAI } from "./llm.js";

const articleRefiner = new Pipeline({
  id: "article-refiner",
  inputSchema: z.string(),
})
  .step({
    id: "draft",
    run: async (context) => ({
      draft: await askAI(
        `Tulis draft artikel singkat dan informatif tentang: ${context.input}`
      ),
    }),
  })
  .step({
    id: "critique",
    run: async (context) => ({
      draft: context.input.draft,
      critique: await askAI(
        `Kritik draft artikel berikut. Berikan kritik tentang struktur, kejelasan, informasi, dan gaya penulisannya.

Draft:
${context.input.draft}`
      ),
    }),
  })
  .step({
    id: "rewrite",
    run: async (context) =>
      askAI(
        `Tulis ulang artikel berikut berdasarkan kritik yang diberikan.

DRAFT:
${context.input.draft}

KRITIK:
${context.input.critique}

Hasil akhir harus berupa artikel yang sudah diperbaiki, bukan penjelasan tentang proses rewrite.`
      ),
  });

console.log(
  await articleRefiner.run({
    input: "manfaat olahraga pagi",
  })
);