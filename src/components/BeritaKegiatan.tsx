"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { beritaData, BeritaItem } from "@/data/beritaData";
import { useAdmin } from "./AdminContext";

export default function BeritaKegiatan() {
  const { isAdmin } = useAdmin();
  const [items, setItems] = useState<BeritaItem[]>([]);

  // Admin Form States
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<BeritaItem | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kegiatan Padukuhan");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedBase64, setUploadedBase64] = useState("");
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("jatirejo_berita");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems(beritaData);
      }
    } else {
      setItems(beritaData);
    }

    // Cloud Sync fetch
    fetch("/api/cloud-sync", { cache: "no-store" })
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.success && resData?.data?.berita && Array.isArray(resData.data.berita)) {
          setItems(resData.data.berita);
          localStorage.setItem("jatirejo_berita", JSON.stringify(resData.data.berita));
        }
      })
      .catch((e) => console.warn("Cloud sync fetch:", e));
  }, []);

  const saveToStorage = (newItems: BeritaItem[]) => {
    setItems(newItems);
    localStorage.setItem("jatirejo_berita", JSON.stringify(newItems));

    // Cloud Push
    fetch("/api/cloud-sync", { cache: "no-store" })
      .then((res) => res.json())
      .then((currentData) => {
        const fullPayload = {
          ...(currentData?.data || {}),
          berita: newItems,
        };
        return fetch("/api/cloud-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullPayload),
        });
      })
      .catch((e) => console.error("Cloud push failed:", e));
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
        const MAX_WIDTH = 850;
        const MAX_HEIGHT = 650;
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

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
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
    setCategory("Kegiatan");
    const today = new Date();
    const formattedDate = today.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setDate(formattedDate);
    setSummary("");
    setContent("");
    setImageUrl("");
    setUploadedBase64("");
    setFormError("");
    setShowForm(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, item: BeritaItem) => {
    e.stopPropagation();
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDate(item.date);
    setSummary(item.summary);
    setContent(item.content);
    setImageUrl(item.imageUrl);
    setUploadedBase64("");
    setFormError("");
    setShowForm(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      const updated = items.filter((it) => it.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = uploadedBase64 || imageUrl.trim();

    if (!title.trim() || !summary.trim() || !finalImage) {
      setFormError("Judul, ringkasan berita, dan foto wajib diisi!");
      return;
    }

    if (editingItem) {
      const updated = items.map((it) =>
        it.id === editingItem.id
          ? {
              ...it,
              title: title.trim(),
              category: category as any,
              date: date.trim(),
              summary: summary.trim(),
              content: content.trim() || summary.trim(),
              imageUrl: finalImage,
            }
          : it
      );
      saveToStorage(updated);
    } else {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
      const newItem: BeritaItem = {
        id: `${newSlug}-${Date.now()}`,
        title: title.trim(),
        category: (category as any) || "Kegiatan",
        date: date.trim(),
        summary: summary.trim(),
        content: content.trim() || summary.trim(),
        imageUrl: finalImage,
        author: "Tim Redaksi Padukuhan Jatirejo",
      };
      saveToStorage([newItem, ...items]);
    }

    setShowForm(false);
  };

  return (
    <section
      id="berita"
      className="py-20 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 font-sans">
            Kabar Padukuhan
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white leading-tight font-sans">
            Berita & Informasi Terbaru
          </p>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />

          {isAdmin && (
            <div className="mt-6">
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Tulis Berita Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* Berita Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group rounded-3xl bg-emerald-100/80 dark:bg-gradient-to-br dark:from-emerald-950/80 dark:via-zinc-900 dark:to-emerald-950/90 border border-emerald-300/80 dark:border-emerald-500/25 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative"
            >
              {/* Image Cover */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur-md text-amber-400 font-extrabold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-amber-500/20 font-sans">
                  {item.category}
                </div>

                {/* Admin Controls Overlay */}
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button
                      onClick={(e) => handleOpenEdit(e, item)}
                      className="p-2 bg-zinc-900/80 hover:bg-amber-500 text-white hover:text-zinc-950 rounded-xl transition-colors cursor-pointer border border-white/10"
                      title="Edit Berita Ini"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-2 bg-zinc-900/80 hover:bg-rose-600 text-white rounded-xl transition-colors cursor-pointer border border-white/10"
                      title="Hapus Berita Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-650 dark:text-zinc-400 font-sans">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-sans group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed font-light line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                {/* Read Article Link */}
                <Link
                  href={`/berita/${item.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-amber-500 transition-colors uppercase tracking-wider pt-2 group/btn cursor-pointer"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

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
                  {editingItem ? "Edit Berita Padukuhan" : "Tulis Berita Baru"}
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
                  <label className="font-semibold text-zinc-600 dark:text-zinc-300">Judul Berita</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    placeholder="Contoh: Kerja Bakti Pembangunan Jalan Dusun"
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
                      placeholder="Pembangunan / Kesehatan / Kegiatan / Budaya"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-zinc-600 dark:text-zinc-300">Tanggal Berita</label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      placeholder="18 Juli 2026"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-300">Ringkasan Singkat (Summary)</label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    placeholder="Ringkasan 1-2 kalimat untuk tampilan card..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-300">Isi Artikel Lengkap (Gunakan 2x Enter untuk Paragraf Baru)</label>
                  <textarea
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    placeholder="Tuliskan isi berita artikel secara mendalam di sini..."
                  />
                </div>

                {/* Photo Upload / URL */}
                <div className="space-y-2">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-300">Foto Berita</label>
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
                    Simpan Berita
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
