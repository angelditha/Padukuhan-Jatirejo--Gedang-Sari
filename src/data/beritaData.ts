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
    content: `Kader Kesehatan Padukuhan Jatirejo bersama petugas Puskesmas Kapanewon kembali menyelenggarakan kegiatan rutin bulanan Posyandu Balita dan Posyandu Lansia "Mekar Sari" bertempat di Balai Pertemuan Jatirejo.

Dalam kegiatan ini, sebanyak 35 balita mendapatkan penimbangan berat badan, pengukuran tinggi badan, pemberian imunisasi dasar, serta pembagian Makanan Pendamping ASI (PMT) bergizi tinggi yang dibuat sendiri oleh kader posyandu.

Sementara itu, untuk kelompok lansia, dilakukan pemeriksaan tekanan darah, cek kadar gula darah, asam urat, serta konseling kesehatan gratis. Selain pemeriksaan fisik, petugas puskesmas juga menyampaikan penyuluhan mengenai pentingnya menjaga pola makan sehat bagi lansia guna mencegah penyakit degeneratif seperti hipertensi dan diabetes di usia senja.`,
    date: "11 Juli 2026",
    category: "Kesehatan",
    author: "Pengurus Kesehatan",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "Turnamen Bola Voli Kelurahan",
    title: "Pemuda Karang Taruna Mengikuti Turnamen Bola Voli Kelurahan Hargomulyo Tahun 2026",
    summary: "Karang Taruna Padukuhan Jatirejo menyelenggarakan pelatihan pembuatan toko online dan pemasaran sosial media bagi pelaku usaha mikro.",
    content: `Dalam rangka mendorong digitalisasi padukuhan, Karang Taruna bekerja sama dengan mahasiswa KKN menyelenggarakan lokakarya 'Pemasaran Digital untuk UMKM Desa' bagi warga pelaku usaha mikro di Jatirejo.

Pelatihan ini mencakup cara memotret produk agar terlihat menarik menggunakan smartphone, mendaftarkan toko di platform e-commerce, mengelola akun WhatsApp Business, serta dasar-dasar iklan gratis lewat media sosial seperti Instagram dan Facebook.

Tujuan utama kegiatan ini adalah memperluas pasar produk kerajinan anyaman bambu dan camilan olahan singkong khas Jatirejo agar bisa dikenal luas hingga luar daerah. Dengan memanfaatkan platform digital, diharapkan margin pendapatan UMKM meningkat dan menciptakan kemandirian ekonomi desa berbasis teknologi.`,
    date: "05 Juni 2026",
    category: "Kegiatan",
    author: "Karang Taruna",
    imageUrl: "/galeri/Voli2.jpeg"
  },
];
