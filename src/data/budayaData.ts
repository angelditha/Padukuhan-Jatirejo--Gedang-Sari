export interface BudayaItem {
  id: string;
  title: string;
  description: string;
  fullDetails: string;
  imageUrl: string;
  category?: string;
  frequency?: string;
  highlights?: string[];
}

export const budayaData: BudayaItem[] = [
  {
    id: "gotong-royong",
    title: "Budaya Gotong Royong (Sambatan)",
    description: "Semangat kebersamaan yang kokoh dalam membangun rumah warga, jalan desa, maupun membersihkan fasilitas publik.",
    fullDetails: "Gotong Royong merupakan budaya yang terus dilestarikan oleh masyarakat Padukuhan Jatirejo sebagai wujud kebersamaan, kepedulian, dan tanggung jawab bersama terhadap lingkungan. Kegiatan ini diwujudkan melalui Jumat Bersih yang dilaksanakan setiap hari Jumat di masing-masing RT. Warga secara bersama-sama membersihkan jalan lingkungandan berbagai fasilitas umum agar lingkungan tetap bersih, sehat, dan nyaman. Selain itu, semangat gotong royong juga terlihat dalam berbagai kegiatan kemasyarakatan, seperti memperbaiki jalan lingkungan, serta mendukung pelaksanaan kegiatan adat dan sosial. Tradisi ini tidak hanya menjaga kebersihan dan keindahan lingkungan, tetapi juga mempererat tali persaudaraan, menumbuhkan rasa saling peduli, serta memperkuat nilai-nilai kebersamaan yang telah diwariskan secara turun-temurun di Padukuhan Jatirejo.",
    imageUrl: "/images/gotong-royong.jpg"
  },
  {
    id: "rasulan",
    title: "Upacara Rasulan (Bersih Dusun)",
    description: "Tradisi tahunan sebagai bentuk rasa syukur atas panen yang melimpah, diisi dengan kenduri massal dan pertunjukan kesenian.",
    fullDetails: "Upacara Rasulan merupakan tradisi masyarakat Padukuhan Jatirejo sebagai wujud rasa syukur atas hasil panen yang telah diperoleh. Sebelum memasuki musim tanam, masyarakat juga melaksanakan tradisi wiwitan sebagai doa dan harapan agar proses bercocok tanam berjalan dengan baik. Rangkaian Rasulan diawali dengan Kirab Rasulan atau Bersih Dusun, yang dimulai dari Balai Kalurahan menuju lapangan dan diikuti oleh seluruh padukuhan dengan menampilkan berbagai potensi serta kekhasan masing-masing. Setelah kirab, kegiatan dilanjutkan dengan kenduri, yaitu tradisi makan bersama di mana setiap warga membawa makanan untuk dikumpulkan dan dinikmati secara bersama sebagai simbol rasa syukur, kebersamaan, dan kerukunan masyarakat.",
    imageUrl: "/images/rasulan.jpg"
  },
  {
    id: "karawitan",
    title: "Seni Karawitan",
    description: "Kelompok karawitan warga yang melestarikan alunan musik gamelan Jawa klasik secara turun-temurun.",
    fullDetails: "Seni Karawitan merupakan salah satu kesenian tradisional yang masih dilestarikan oleh masyarakat Padukuhan Jatirejo. Kegiatan ini menjadi wadah untuk menjaga warisan budaya Jawa melalui permainan gamelan yang dimainkan secara bersama-sama. Selain sebagai hiburan, seni karawitan juga sering ditampilkan pada berbagai kegiatan masyarakat, seperti peringatan hari besar, acara adat, dan pertunjukan budaya, sehingga turut mempererat kebersamaan serta melestarikan nilai-nilai budaya lokal.",
    imageUrl: "/images/karawitan.jpg"
  }
];
