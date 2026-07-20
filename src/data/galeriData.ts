export interface GaleriItem {
  id: string;
  title: string;
  category: "kegiatan" | "potensi" | "budaya";
  imageUrl: string;
  mediaType?: "image" | "video";
  videoUrl?: string;
}

export const galeriData: GaleriItem[] = [
  {
    id: "galeri-1",
    title: "Arisan dan Sosialisasi Kepada Masyarakat",
    category: "kegiatan",
    imageUrl: "/galeri/Kegiatan1.jpeg",
    mediaType: "image",
  },
  {
    id: "galeri-2",
    title: "Proses Pembuatan Pupuk Organik",
    category: "kegiatan",
    imageUrl: "/galeri/PupukWarga2.jpeg",
    mediaType: "image",
  },
  {
    id: "galeri-3",
    title: "Pembuatan Pupuk Organik Bersama Warga Jatirejo",
    category: "kegiatan",
    imageUrl: "/galeri/PupukWarga1.jpeg",
    mediaType: "image",
  },
  {
    id: "galeri-4",
    title: "Senam Bersama Lansia",
    category: "kegiatan",
    imageUrl: "/galeri/SenamLansia2.jpeg",
    mediaType: "image",
  },
  {
    id: "galeri-5",
    title: "Pemeriksaan Kesehatan Anak-anak dan Lansia di Posyandu",
    category: "kegiatan",
    imageUrl: "/galeri/Posyandu1.jpeg",
    mediaType: "image",
  },
  {
    id: "galeri-6",
    title: "Pemeriksaan Kesehatan Lansia di Posyandu",
    category: "kegiatan",
    imageUrl: "/galeri/Lansia1.jpeg",
    mediaType: "image",
  },
  {
    id: "galeri-7",
    title: "Pelatihan Pembuatan Pupuk Organik Kepada Masyarakat Jatirejo",
    category: "kegiatan",
    imageUrl: "/galeri/TTG1.jpeg",
    mediaType: "image",
  },
  {
    id: "galeri-8",
    title: "Turnamen Tahunan Bola Voli - Pewakilan dari Padukuhan Jatirejo",
    category: "kegiatan",
    imageUrl: "/galeri/Voli2.jpeg",
    mediaType: "image",
  },
  {
    id: "galeri-9",
    title: "Foto Bersama",
    category: "kegiatan",
    imageUrl: "/galeri/Fotobersamaposyandu.jpeg",
    mediaType: "image",
  },
];
