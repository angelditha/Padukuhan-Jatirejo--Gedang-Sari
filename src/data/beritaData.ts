export interface BeritaItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: "Pembangunan" | "Kesehatan" | "Kegiatan" | "Budaya";
  author: string;
  imageUrl: string;
}

export const beritaData: BeritaItem[] = [
  {
    id: "posyandu-Juli-2026",
    title: "Kegiatan Posyandu Balita dan Lansia Jatirejo Berjalan Lancar",
    summary: "Pelayanan kesehatan bulanan untuk pemantauan tumbuh kembang balita serta cek kesehatan gratis bagi lansia Padukuhan Jatirejo.",
    content: `Kader Kesehatan Padukuhan Jatirejo selalu menyelenggarakan kegiatan rutin bulanan Posyandu Balita dan Posyandu Lansia "Pudak Wangi" bertempat di Balai Dusun Jatirejo.

Dalam kegiatan ini, sebanyak 29 balita mendapatkan penimbangan berat badan and pengukuran tinggi badan. Sementara itu, untuk kelompok lansia, dilakukan pemeriksaan tekanan darah.`,
    date: "11 Juli 2026",
    category: "Kesehatan",
    author: "Pengurus Kesehatan",
    imageUrl: "https://i.imgur.com/K3rl06O.png"
  },
  {
    id: "Turnamen Bola Voli Kelurahan",
    title: "Pemuda Karang Taruna Mengikuti Turnamen Bola Voli Kelurahan Hargomulyo Tahun 2026",
    summary: "Turnamen Bola Voli Kelurahan Hargomulyo Tahun 2026 yang diselenggarakan oleh Karang Taruna berlangsung pada 27 Juni–10 Juli 2026 di Lapangan Voli Gelora Mulya Tama. Kegiatan ini menjadi ajang mempererat kebersamaan, menjunjung sportivitas, serta meningkatkan semangat olahraga antarpadukuhan di Kalurahan Hargomulyo.",
    content: `Hargomulyo, Gedangsari – Karang Taruna Kalurahan Hargomulyo kembali menyelenggarakan Turnamen Bola Voli Kalurahan Hargomulyo Tahun 2026 sebagai ajang kompetisi olahraga sekaligus sarana mempererat tali persaudaraan antarpadukuhan. Kegiatan ini berlangsung mulai 27 Juni hingga 10 Juli 2026 di Lapangan Voli Gelora Mulya Tama, Kalurahan Hargomulyo, Kapanewon Gedangsari, Kabupaten Gunungkidul.

Turnamen ini diikuti oleh tim-tim perwakilan dari berbagai padukuhan di Kalurahan Hargomulyo yang bertanding secara sportif untuk memperebutkan gelar juara. Selain menjadi ajang kompetisi, kegiatan ini juga bertujuan untuk meningkatkan semangat olahraga, membangun kebersamaan masyarakat, serta memberikan hiburan bagi warga.

Selama penyelenggaraan turnamen, masyarakat menunjukkan antusiasme yang tinggi dengan hadir memberikan dukungan kepada tim kebanggaannya masing-masing. Sorak sorai penonton dan semangat para pemain menciptakan suasana pertandingan yang meriah dan penuh kekeluargaan.

Melalui penyelenggaraan Turnamen Bola Voli Kalurahan Hargomulyo Tahun 2026, Karang Taruna Kalurahan Hargomulyo berharap kegiatan ini dapat menjadi wadah pembinaan generasi muda di bidang olahraga, memperkuat persatuan antarwarga, serta menumbuhkan semangat hidup sehat melalui aktivitas olahraga. Turnamen ini juga menjadi salah satu agenda tahunan yang mampu mempererat hubungan sosial sekaligus memperkuat rasa kebersamaan di lingkungan Kalurahan Hargomulyo.`,
    date: "27 Juni 2026",
    category: "Kegiatan",
    author: "Karang Taruna",
    imageUrl: "https://i.imgur.com/Oei3eM5.png" // default/placeholder voli or custom image. Let's keep it clean
  },
];
