export interface PotensiItem {
  id: string;
  title: string;
  description: string;
  fullDetails: string;
  iconName: string; // Used to dynamically map Lucide Icons
  imageUrl: string;
  category?: string;
  shortDesc?: string;
}

export const potensiData: PotensiItem[] = [
  {
    id: "pertanian",
    title: "Pertanian & Hasil Bumi",
    description:
      "Sektor pertanian menjadi salah satu mata pencaharian utama masyarakat Padukuhan Jatirejo. Berbagai hasil pertanian seperti padi dibudidayakan oleh warga dan berperan dalam mendukung perekonomian masyarakat setempat.",
    fullDetails:
      "Pertanian merupakan salah satu sektor yang memiliki peran penting dalam kehidupan masyarakat Padukuhan Jatirejo. Sebagian warga memanfaatkan lahan pertanian untuk membudidayakan padi sebagai sumber penghasilan dan pemenuhan kebutuhan sehari-hari. Selain mendukung perekonomian masyarakat, kegiatan pertanian juga mencerminkan semangat gotong royong dan kearifan lokal dalam mengelola lahan serta menjaga keberlanjutan sumber daya alam di Padukuhan Jatirejo.",
    iconName: "Sprout",
    imageUrl: "/images/Pertanian.jpg",
  },
  {
    id: "Kerajinan Lokal",
    title: "Kerajinan Lokal",
    description:
      "Kerajinan anyaman bambu menjadi salah satu usaha rumahan yang masih ditekuni oleh sebagian masyarakat Padukuhan Jatirejo. Produk yang dihasilkan berupa tambir dan berbagai anyaman sederhana yang kemudian dipasarkan melalui pengepul sebagai salah satu sumber pendapatan warga.",
    fullDetails:
      "Kerajinan anyaman bambu merupakan salah satu potensi ekonomi kreatif yang dimiliki oleh Padukuhan Jatirejo. Sebagian masyarakat memanfaatkan bambu yang tersedia sebagai bahan baku untuk membuat tambir melalui proses pengerjaan secara tradisional. Hasil kerajinan tersebut dipasarkan melalui pengepul and menjadi salah satu sumber pendapatan bagi warga. Selain memiliki nilai ekonomi, kegiatan ini juga menjadi bagian dari upaya menjaga keterampilan menganyam yang telah diwariskan secara turun-temurun.",
    iconName: "ShoppingBag",
    imageUrl: "/images/Anyaman Bambu.jpg",
  },
  {
    id: "peternakan",
    title: "Peternakan Mandiri",
    description:
      "Pemeliharaan Ternak di Padukuhan Jatirejo dilakukan oleh masyarakat dalam skala rumah tangga dengan memelihara kambing, ayam, bebek, dan sapi.",
    fullDetails:
      "Pemeliharaan Ternak di Padukuhan Jatirejo umumnya dilakukan oleh masyarakat dalam skala rumah tangga. Warga memelihara berbagai jenis ternak, seperti kambing, ayam, bebek, dan sapi, sebagai bagian dari kegiatan sehari-hari. Kegiatan ini juga mendukung aktivitas pertanian masyarakat, misalnya melalui pemanfaatan kotoran ternak sebagai pupuk organik, sehingga tercipta hubungan yang saling mendukung antara sektor pertanian dan pemeliharaan ternak di Padukuhan Jatirejo.",
    iconName: "Beef",
    imageUrl: "/images/Peternakan.jpg",
  },
];