// index.ts
//
// PIPELINE 01: ARTICLE REFINER (versi TypeScript + @anvia/core)
// Alur: Draft -> Critique -> Rewrite, dibangun sebagai Pipeline dengan
// tahapan (.step()) yang eksplisit dan type-safe.

import { Pipeline } from "@anvia/core/pipeline";
import { z } from "zod";
import { askAI } from "./llm.js";

const articleRefiner = new Pipeline({
  id: "article-refiner",
  inputSchema: z.string(),
})
  .step({
    id: "draft",
    run: async (input) => ({
      draft: await askAI(`Tulis draft artikel tentang: ${input}`),
    }),
  })
  .step({
    id: "critique",
    run: async (input) => ({
      draft: input.draft,
      critique: await askAI(`Kritik draft berikut: ${input.draft}`),
    }),
  })
  .step({
    id: "rewrite",
    run: async (input) =>
      askAI(
        `Tulis ulang draft berdasarkan kritik.\nDraft: ${input.draft}\nKritik: ${input.critique}`
      ),
  });

console.log(await articleRefiner.run({ input: "manfaat olahraga pagi" }));
