
function draft(topic) {
  console.log("Step 1: Membuat draft untuk topik:", topic);
  const result = `Ini adalah draft awal tentang ${topic}. Masih sangat sederhana.`;
  return result;
}

function critique(draftText) {
  console.log("Step 2: Mengkritik draft...");
  const result = `Kritik: draft ini terlalu pendek dan kurang detail. (Draft asli: "${draftText}")`;
  return result;
}

function rewrite(critiqueText) {
  console.log("Step 3: Menulis ulang berdasarkan kritik...");
  const result = `Versi revisi yang lebih baik, mempertimbangkan: ${critiqueText}`;
  return result;
}

function runPipeline(topic) {
  const draftResult = draft(topic);
  const critiqueResult = critique(draftResult);
  const finalResult = rewrite(critiqueResult);

  console.log("\n=== HASIL AKHIR ===");
  console.log(finalResult);
}

runPipeline("manfaat olahraga pagi");