// index.js
//
// PIPELINE 02: IDEA REVIEW BOARD
// Alur: 1 pitch -> fan-out ke 3 reviewer (CEO, Analyst, CTO) -> merge jadi 1 verdict
//
// Catatan: versi ini masih SIMULASI (belum terhubung ke AI/LLM beneran).

// ---------------------------------------------
// REVIEWER 1: CEO
// Menilai dari sisi bisnis/strategi.
// ---------------------------------------------
function reviewAsCEO(pitch) {
  console.log("CEO sedang menilai pitch...");
  const result = `[CEO] Dari sisi bisnis, ide "${pitch}" punya potensi pasar yang menarik, tapi perlu strategi go-to-market yang jelas.`;
  return result;
}

// ---------------------------------------------
// REVIEWER 2: ANALYST
// Menilai dari sisi data/angka.
// ---------------------------------------------
function reviewAsAnalyst(pitch) {
  console.log("Analyst sedang menilai pitch...");
  const result = `[Analyst] Dari sisi data, ide "${pitch}" perlu validasi ukuran pasar dan proyeksi pendapatan yang lebih konkret.`;
  return result;
}

// ---------------------------------------------
// REVIEWER 3: CTO
// Menilai dari sisi teknis.
// ---------------------------------------------
function reviewAsCTO(pitch) {
  console.log("CTO sedang menilai pitch...");
  const result = `[CTO] Dari sisi teknis, ide "${pitch}" bisa dibangun, tapi perlu diperhatikan skalabilitas sistemnya.`;
  return result;
}

// ---------------------------------------------
// MERGE
// Menggabungkan ketiga hasil review menjadi satu verdict akhir.
// ---------------------------------------------
function mergeReviews(ceoReview, analystReview, ctoReview) {
  console.log("Menggabungkan semua review menjadi satu verdict...");
  const result = [
    "=== VERDICT AKHIR ===",
    ceoReview,
    analystReview,
    ctoReview,
    "",
    "Kesimpulan: Ide ini layak dipertimbangkan lebih lanjut dengan catatan dari ketiga sudut pandang di atas.",
  ].join("\n");
  return result;
}

// ---------------------------------------------
// PIPELINE RUNNER
// Menjalankan fan-out (3 review sekaligus) lalu merge.
// ---------------------------------------------
function runPipeline(pitch) {
  console.log("Pitch diterima:", pitch);
  console.log("Mengirim ke 3 reviewer sekaligus (fan-out)...\n");

  // Fan-out: pitch yang sama dikirim ke 3 fungsi berbeda
  const ceoReview = reviewAsCEO(pitch);
  const analystReview = reviewAsAnalyst(pitch);
  const ctoReview = reviewAsCTO(pitch);

  // Merge: gabungkan hasil ketiganya
  const finalVerdict = mergeReviews(ceoReview, analystReview, ctoReview);

  console.log("\n" + finalVerdict);

  return finalVerdict;
}

// ---------------------------------------------
// JALANKAN PIPELINE
// ---------------------------------------------
runPipeline("Aplikasi antar jemput laundry berbasis subscription");