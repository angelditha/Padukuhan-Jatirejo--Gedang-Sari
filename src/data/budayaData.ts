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
    id: "rasulan",
    title: "Upacara Rasulan (Bersih Dusun)",
    description: "Tradisi tahunan sebagai bentuk rasa syukur atas panen yang melimpah, diisi dengan kenduri massal dan pertunjukan kesenian.",
    fullDetails: "Rasulan atau Bersih Dusun adalah upacara adat terbesar di Padukuhan Jatirejo yang diselenggarakan setelah panen raya. Kegiatan ini dimulai dengan membersihkan seluruh lingkungan padukuhan, diikuti dengan kenduri bersama (sedekah bumi) di mana warga berkumpul membawa 'sarang' (nasi dan lauk-pauk). Acara ini ditutup dengan pagelaran seni tradisional seperti ketoprak atau wayang kulit sebagai sarana pelestarian budaya sekaligus hiburan warga.",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "gotong-royong",
    title: "Budaya Gotong Royong (Sambatan)",
    description: "Semangat kebersamaan yang kokoh dalam membangun rumah warga, jalan desa, maupun membersihkan fasilitas publik.",
    fullDetails: "Sambatan adalah kearifan lokal gotong royong yang masih sangat kental di Jatirejo. Ketika ada warga yang hendak membangun atau memperbaiki rumah, warga lainnya akan datang membantu secara sukarela tanpa mengharapkan upah finansial. Kebiasaan ini memupuk rasa persaudaraan dan solidaritas antar-warga yang kuat melampaui perbedaan sosial ekonomi.",
    imageUrl: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "karawitan",
    title: "Seni Karawitan",
    description: "Kelompok karawitan warga yang melestarikan alunan musik gamelan Jawa klasik secara turun-temurun.",
    fullDetails: "Kesenian karawitan di Jatirejo digerakkan oleh sanggar seni lokal yang beranggotakan lintas generasi, mulai dari sesepuh hingga anak-anak muda. Latihan rutin diadakan di balai pertemuan padukuhan untuk melatih kepekaan rasa dan harmoni melalui tabuhan gamelan. Musik ini sering dipentaskan dalam acara hajatan warga maupun perayaan desa.",
    imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80"
  }
];
