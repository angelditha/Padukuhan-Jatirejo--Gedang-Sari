"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, ShoppingBag, Compass, Beef, Droplet, X, ArrowRight, Plus, Edit, Trash2, Upload, CheckCircle2 } from "lucide-react";
import { potensiData, PotensiItem } from "@/data/potensiData";
import { useAdmin } from "./AdminContext";
import { fetchCloudData, saveCloudData } from "../lib/cloudSync";

const iconMap: Record<string, React.ComponentType<any>> = {
  Sprout: Sprout,
  ShoppingBag: ShoppingBag,
  Compass: Compass,
  Beef: Beef,
  Droplet: Droplet,
};

export default function Potensi() {
  const { isAdmin } = useAdmin();
  const [items, setItems] = useState<PotensiItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PotensiItem | null>(null);

  // Admin Form States
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PotensiItem | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [iconName, setIconName] = useState("Sprout");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDetails, setFullDetails] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedBase64, setUploadedBase64] = useState("");
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSavedRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem("jatirejo_potensi");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems(potensiData);
      }
    } else {
      setItems(potensiData);
    }

    // Cloud Sync fetch directly from browser
    fetchCloudData()
      .then((data) => {
        if (data && data.potensi && Array.isArray(data.potensi)) {
          const cloudList: PotensiItem[] = data.potensi;
          if (Date.now() - lastSavedRef.current > 6000) {
            setItems(cloudList);
            localStorage.setItem("jatirejo_potensi", JSON.stringify(cloudList));
          }
        }
      })
      .catch((e) => console.warn("Cloud sync fetch:", e));

    // Real-time polling interval (every 4 seconds) directly from browser
    const interval = setInterval(() => {
      fetchCloudData()
        .then((data) => {
          if (data && data.potensi && Array.isArray(data.potensi)) {
            if (Date.now() - lastSavedRef.current > 6000) {
              setItems(data.potensi);
              localStorage.setItem("jatirejo_potensi", JSON.stringify(data.potensi));
            }
          }
        })
        .catch((e) => console.warn("Realtime poll error:", e));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const saveToStorage = (newItems: PotensiItem[]) => {
    lastSavedRef.current = Date.now();
    setItems(newItems);
    localStorage.setItem("jatirejo_potensi", JSON.stringify(newItems));

    // Cloud Push directly from browser
    saveCloudData("potensi", newItems)
      .then((success) => {
        if (!success) {
          throw new Error("Gagal menyimpan ke cloud");
        }
      })
      .catch((e) => {
        console.error("Cloud push failed:", e);
        alert("Gagal menyimpan perubahan ke cloud database! Pastikan koneksi internet stabil dan coba lagi.");
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setFormError("Ukuran file terlalu besar! Maksimal 8MB.");
      return;
    }

    setFormError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 480;
        const MAX_HEIGHT = 360;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.4);
        setUploadedBase64(compressedBase64);
        setImageUrl("");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle("");
    setCategory("Sektor Unggulan");
    setIconName("Sprout");
    setShortDesc("");
    setFullDetails("");
    setImageUrl("");
    setUploadedBase64("");
    setFormError("");
    setShowForm(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, item: PotensiItem) => {
    e.stopPropagation();
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category || "Sektor Unggulan");
    setIconName(item.iconName || "Sprout");
    setShortDesc(item.shortDesc || item.description);
    setFullDetails(item.fullDetails);
    setImageUrl(item.imageUrl);
    setUploadedBase64("");
    setFormError("");
    setShowForm(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus sektor potensi ini?")) {
      const updated = items.filter((it) => it.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = uploadedBase64 || imageUrl.trim();

    if (!title.trim() || !shortDesc.trim() || !finalImage) {
      setFormError("Judul, deskripsi singkat, dan foto wajib diisi!");
      return;
    }

    if (editingItem) {
      const updated = items.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              title: title.trim(),
              category: category.trim(),
              iconName,
              shortDesc: shortDesc.trim(),
              description: shortDesc.trim(),
              fullDetails: fullDetails.trim() || shortDesc.trim(),
              imageUrl: finalImage,
            }
          : it
      );
      saveToStorage(updated);
    } else {
      const newItem: PotensiItem = {
        id: `potensi-${Date.now()}`,
        title: title.trim(),
        category: category.trim(),
        iconName,
        shortDesc: shortDesc.trim(),
        description: shortDesc.trim(),
        fullDetails: fullDetails.trim() || shortDesc.trim(),
        imageUrl: finalImage,
      };
      saveToStorage([newItem, ...items]);
    }

    setShowForm(false);
  };

  return (
    <section
      id="potensi"
      className="py-20 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 font-sans">
            Potensi Padukuhan
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white leading-tight font-sans">
            Sektor Unggulan & Sumber Daya Jatirejo
          </p>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />

          {isAdmin && (
            <div className="mt-6">
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Tambah Potensi</span>
              </button>
            </div>
          )}
        </div>

        {/* Potensi Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const Icon = iconMap[item.iconName] || Sprout;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group rounded-3xl bg-emerald-100/80 dark:bg-gradient-to-br dark:from-emerald-950/80 dark:via-zinc-900 dark:to-emerald-950/90 border border-emerald-300/80 dark:border-emerald-500/25 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative"
              >
                {/* Image Cover */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 bg-emerald-600 dark:bg-emerald-500 text-white p-2.5 rounded-2xl shadow-md border border-white/10 group-hover:bg-amber-500 group-hover:text-emerald-950 transition-colors duration-300">
                    <Icon className="w-5.5 h-5.5" />
                  </div>

                  {/* Admin Edit/Delete Buttons Overlay */}
                  {isAdmin && (
                    <div className="absolute top-4 left-4 flex gap-2 z-20">
                      <button
                        onClick={(e) => handleOpenEdit(e, item)}
                        className="p-2 bg-zinc-900/80 hover:bg-amber-500 text-white hover:text-zinc-950 rounded-xl transition-colors cursor-pointer border border-white/10"
                        title="Edit Sektor"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-2 bg-zinc-900/80 hover:bg-rose-600 text-white rounded-xl transition-colors cursor-pointer border border-white/10"
                        title="Hapus Sektor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block font-sans">
                      {item.category || "Sektor Unggulan"}
                    </span>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed font-light line-clamp-3">
                      {item.shortDesc || item.description}
                    </p>
                  </div>

                  {/* CTA Link */}
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors uppercase tracking-wider pt-2 group/btn cursor-pointer"
                  >
                    <span>Lihat Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl z-10 border border-slate-200 dark:border-zinc-800"
            >
              <div className="relative h-64 sm:h-80">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-zinc-950/60 hover:bg-zinc-950 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-4 max-h-[50vh] overflow-y-auto">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block font-sans">
                  {selectedItem.category || "Sektor Unggulan"}
                </span>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white font-sans">
                  {selectedItem.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 font-sans leading-relaxed whitespace-pre-line font-light">
                  {selectedItem.fullDetails}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 dark:border-zinc-800 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-sans">
                  {editingItem ? "Edit Potensi Padukuhan" : "Tambah Potensi Baru"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <p className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/30">
                  {formError}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-300">Judul Potensi</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    placeholder="Contoh: Pertanian Jagung & Ketahanan Pangan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 dark:text-zinc-300">Kategori</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      placeholder="Sektor Unggulan / UMKM / Wisata"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 dark:text-zinc-300">Ikon Representatif</label>
                    <select
                      value={iconName}
                      onChange={(e) => setIconName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    >
                      <option value="Sprout">Sprout (Pertanian)</option>
                      <option value="ShoppingBag">ShoppingBag (UMKM)</option>
                      <option value="Compass">Compass (Wisata)</option>
                      <option value="Beef">Beef (Peternakan)</option>
                      <option value="Droplet">Droplet (Air/SDA)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-300">Deskripsi Ringkas</label>
                  <textarea
                    rows={2}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    placeholder="Penjelasan singkat yang muncul di card..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-300">Detail Lengkap Modal</label>
                  <textarea
                    rows={4}
                    value={fullDetails}
                    onChange={(e) => setFullDetails(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    placeholder="Penjelasan mendalam saat card diklik..."
                  />
                </div>

                {/* Photo Upload / URL */}
                <div className="space-y-2">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-300">Foto Cover Sektor</label>
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center p-3 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100">
                      <Upload className="w-4 h-4 text-emerald-600 mr-2" />
                      <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Upload dari Komputer</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setUploadedBase64("");
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    placeholder="Atau masukkan Link URL Gambar (https://...)"
                  />

                  {(uploadedBase64 || imageUrl) && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 mt-2">
                      <img src={uploadedBase64 || imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm"
                  >
                    Simpan Sektor
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
