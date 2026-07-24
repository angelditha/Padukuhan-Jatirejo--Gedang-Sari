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
      "Kerajinan anyaman bambu merupakan salah satu potensi ekonomi kreatif yang dimiliki oleh Padukuhan Jatirejo. Sebagian masyarakat memanfaatkan bambu yang tersedia sebagai bahan baku untuk membuat tambir melalui proses pengerjaan secara tradisional. Hasil kerajinan tersebut dipasarkan melalui pengepul dan menjadi salah satu sumber pendapatan bagi warga. Selain memiliki nilai ekonomi, kegiatan ini juga menjadi bagian dari upaya menjaga keterampilan menganyam yang telah diwariskan secara turun-temurun.",
    iconName: "ShoppingBag",
    imageUrl: "/images/Anyaman Bambu.jpg",
  },
  {
    id: "peternakan",
    title: "Peternakan Mandiri",
    description:
      "Peternakan sapi menjadi salah satu kegiatan yang dilakukan oleh sebagian masyarakat Padukuhan Jatirejo. Ternak sapi dipelihara secara mandiri sebagai salah satu sumber pendapatan dan tabungan bagi keluarga.",
    fullDetails:
      "Peternakan sapi merupakan salah satu kegiatan ekonomi yang dilakukan oleh sebagian masyarakat Padukuhan Jatirejo. Ternak dipelihara secara mandiri dengan skala rumah tangga sebagai usaha sampingan maupun sumber pendapatan tambahan. Selain memiliki nilai ekonomi, kegiatan peternakan juga menjadi bagian dari kehidupan masyarakat yang berpadu dengan aktivitas pertanian, sehingga turut mendukung keberlangsungan mata pencaharian warga di Padukuhan Jatirejo.",
    iconName: "Beef",
    imageUrl: "/images/Peternakan.jpg",
  },
];