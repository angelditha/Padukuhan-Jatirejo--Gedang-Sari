"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  ZoomIn,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle,
  Upload,
  ChevronDown,
  Play,
  Film,
  Video,
} from "lucide-react";
import { galeriData, GaleriItem } from "@/data/galeriData";
import { useAdmin } from "./AdminContext";

type FilterType = "semua" | "foto" | "video" | "kegiatan" | "potensi" | "budaya";

export default function Galeri() {
  const { isAdmin } = useAdmin();
  const [images, setImages] = useState<GaleriItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("semua");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Form states for adding custom media (Photo or Video)
  const [showAddForm, setShowAddForm] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"kegiatan" | "potensi" | "budaya">("kegiatan");
  const [newUrl, setNewUrl] = useState("");
  const [uploadedBase64, setUploadedBase64] = useState("");
  const [videoPoster, setVideoPoster] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage and sync from Cloud API for multi-device support
  useEffect(() => {
    const saved = localStorage.getItem("galeri_images");
    if (saved) {
      try {
        setImages(JSON.parse(saved));
      } catch (e) {
        setImages(galeriData);
      }
    } else {
      setImages(galeriData);
    }

    // Async Cloud Sync fetch across all devices
    fetch("/api/cloud-sync")
      .then((res) => res.json())
      .then((resData) => {
        if (resData?.success && resData?.data?.galeri && Array.isArray(resData.data.galeri)) {
          setImages(resData.data.galeri);
          localStorage.setItem("galeri_images", JSON.stringify(resData.data.galeri));
        }
      })
      .catch((err) => console.warn("Cloud sync fetch fallback:", err));
  }, []);

  const syncToCloud = (updatedList: GaleriItem[]) => {
    setImages(updatedList);
    localStorage.setItem("galeri_images", JSON.stringify(updatedList));

    // Push update to Cloud API
    fetch("/api/cloud-sync")
      .then((res) => res.json())
      .then((currentData) => {
        const fullPayload = {
          ...(currentData?.data || {}),
          galeri: updatedList,
        };
        return fetch("/api/cloud-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fullPayload),
        });
      })
      .catch((e) => console.error("Cloud push failed:", e));
  };

  const filteredData = images.filter((item) => {
    if (filter === "semua") return true;
    if (filter === "foto") return item.mediaType !== "video";
    if (filter === "video") return item.mediaType === "video" || !!item.videoUrl;
    return item.category === filter;
  });

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      const prevIdx = selectedIdx === 0 ? filteredData.length - 1 : selectedIdx - 1;
      setSelectedIdx(prevIdx);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      const nextIdx = selectedIdx === filteredData.length - 1 ? 0 : selectedIdx + 1;
      setSelectedIdx(nextIdx);
    }
  };

  // Convert local File (Image or Video document) to Data URL / Canvas Poster
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setFormError("Ukuran file terlalu besar! Maksimal 25MB.");
      return;
    }

    setFormError("");

    if (file.type.startsWith("video/")) {
      // Process Video File
      setMediaType("video");
      const reader = new FileReader();
      reader.onload = (event) => {
        const videoDataUrl = event.target?.result as string;
        setUploadedBase64(videoDataUrl);
        setNewUrl("");

        // Generate thumbnail from video file frame
        const videoElem = document.createElement("video");
        videoElem.src = videoDataUrl;
        videoElem.currentTime = 0.5;
        videoElem.onloadeddata = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 640;
          canvas.height = 360;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
          setVideoPoster(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
      reader.readAsDataURL(file);
    } else {
      // Process Image File
      setMediaType("image");
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
          setVideoPoster("");
          setNewUrl("");
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Extract YouTube ID if link is provided
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMediaSrc = uploadedBase64 || newUrl.trim();

    if (!newTitle.trim()) {
      setFormError("Judul media wajib diisi!");
      return;
    }

    if (!finalMediaSrc) {
      setFormError("Silakan pilih file foto/video (upload) atau masukkan Link URL!");
      return;
    }

    let itemPoster = videoPoster;
    let targetVideoUrl = "";

    if (mediaType === "video") {
      targetVideoUrl = finalMediaSrc;
      const ytId = getYouTubeId(finalMediaSrc);
      if (ytId) {
        itemPoster = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      } else if (!itemPoster) {
        itemPoster = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80";
      }
    } else {
      itemPoster = finalMediaSrc;
    }

    const newItem: GaleriItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      imageUrl: itemPoster,
      mediaType: mediaType,
      videoUrl: mediaType === "video" ? targetVideoUrl : undefined,
    };

    const updated = [newItem, ...images];
    syncToCloud(updated);

    // Reset Form & Show Success
    setNewTitle("");
    setNewUrl("");
    setUploadedBase64("");
    setVideoPoster("");
    setFormError("");
    setFormSuccess(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => {
      setFormSuccess(false);
      setShowAddForm(false);
    }, 1500);
  };

  const handleDeleteImage = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = images.filter((item) => item.id !== id);
    syncToCloud(updated);
    setSelectedIdx(null);
  };

  const handleResetGallery = () => {
    if (window.confirm("Apakah Anda yakin ingin mengembalikan galeri ke default? Semua foto & video tambahan akan dihapus.")) {
      syncToCloud(galeriData);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const categories: { key: FilterType; label: string }[] = [
    { key: "semua", label: "Semua Media" },
    { key: "foto", label: "Foto" },
    { key: "video", label: "Video" },
    { key: "kegiatan", label: "Kegiatan" },
    { key: "potensi", label: "Potensi Desa" },
    { key: "budaya", label: "Budaya & Adat" },
  ];

  return (
    <section
      id="galeri"
      className="py-20 bg-white dark:bg-zinc-900 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 font-sans">
            Dokumentasi Visual & Video
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white leading-tight font-sans">
            Galeri Foto & Video Jatirejo
          </p>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Gallery Controls (Filter + Add/Reset Buttons) - Centered */}
        <div className="flex flex-col items-center justify-center gap-4 mb-12 border-b border-slate-100 dark:border-zinc-800/80 pb-8 text-center">
          {/* Filter Buttons Centered */}
          <div className="flex flex-wrap justify-center items-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setFilter(cat.key);
                  setShowAll(false);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  filter === cat.key
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10 border border-emerald-500/20"
                    : "bg-emerald-100/80 dark:bg-zinc-800 text-emerald-900 dark:text-zinc-400 border border-emerald-300/80 dark:border-zinc-800 hover:bg-emerald-200/80 dark:hover:bg-zinc-700/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Admin Tools (Only visible to logged in admin) */}
          {isAdmin && (
            <div className="flex items-center justify-center gap-3 mt-2">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Tambah Foto / Video</span>
              </button>
              {images.length !== galeriData.length && (
                <button
                  onClick={handleResetGallery}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-zinc-300 dark:border-zinc-700 cursor-pointer"
                  title="Kembalikan galeri default"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Collapsible Add Image/Video Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="p-6 bg-emerald-100/80 dark:bg-zinc-800/80 rounded-3xl border border-emerald-300/80 dark:border-zinc-700 space-y-4 max-w-2xl mx-auto shadow-lg">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white font-sans flex items-center gap-2">
                  <Film className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Tambah Dokumentasi Foto atau Video
                </h3>

                {formSuccess ? (
                  <div className="flex flex-col items-center justify-center text-center py-6 space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce" />
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Dokumentasi berhasil ditambahkan ke galeri!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleAddMedia} className="space-y-4 text-sm font-sans">
                    {formError && (
                      <p className="text-xs font-semibold text-rose-600 bg-rose-100 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/30">
                        {formError}
                      </p>
                    )}

                    {/* Media Type Switcher */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-emerald-900 dark:text-zinc-300">Jenis Media</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setMediaType("image")}
                          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                            mediaType === "image"
                              ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                              : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                          }`}
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>Foto / Gambar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setMediaType("video")}
                          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                            mediaType === "video"
                              ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                              : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                          }`}
                        >
                          <Video className="w-4 h-4 text-amber-300" />
                          <span>Video</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Judul */}
                      <div className="sm:col-span-8 space-y-1">
                        <label className="text-xs font-bold text-emerald-900 dark:text-zinc-300">Judul Media</label>
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          placeholder={mediaType === "video" ? "Contoh: Video Dokumentasi Pentas Karawitan" : "Contoh: Kegiatan Rapat RT 02"}
                        />
                      </div>
                      {/* Kategori */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-xs font-bold text-emerald-900 dark:text-zinc-300">Kategori</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                          <option value="kegiatan">Kegiatan</option>
                          <option value="potensi">Potensi Desa</option>
                          <option value="budaya">Budaya & Adat</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* File Upload Option (Image or Video document) */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-emerald-900 dark:text-zinc-300">
                          Upload Dokumen {mediaType === "video" ? "Video (MP4/WEBM)" : "Foto (PNG/JPG)"}
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-300 dark:border-zinc-700 border-dashed rounded-xl cursor-pointer bg-white dark:bg-zinc-900 hover:bg-emerald-50 dark:hover:bg-zinc-800 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                              <p className="text-xs text-zinc-700 dark:text-zinc-300 text-center px-2">
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Klik untuk upload dokumen</span>
                              </p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">
                                {mediaType === "video" ? "Video MP4, WEBM, MOV (Maks 25MB)" : "Foto PNG, JPG, WEBP (Maks 8MB)"}
                              </p>
                            </div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept={mediaType === "video" ? "video/*" : "image/*"}
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Web URL Option */}
                      <div className="space-y-4 flex flex-col justify-between">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-emerald-900 dark:text-zinc-300">
                            Atau Masukkan Link URL {mediaType === "video" ? "Video (YouTube / MP4)" : "Foto"}
                          </label>
                          <input
                            type="text"
                            value={newUrl}
                            onChange={(e) => {
                              setNewUrl(e.target.value);
                              setUploadedBase64("");
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            placeholder={mediaType === "video" ? "https://www.youtube.com/watch?v=... atau link .mp4" : "https://images.unsplash.com/photo-..."}
                          />
                        </div>

                        {/* File Preview inside form */}
                        {(uploadedBase64 || videoPoster) && (
                          <div className="relative w-36 h-20 rounded-xl overflow-hidden border border-emerald-300 dark:border-zinc-700 shadow-sm">
                            {mediaType === "video" ? (
                              <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center">
                                {videoPoster ? (
                                  <img src={videoPoster} alt="Poster" className="w-full h-full object-cover" />
                                ) : (
                                  <Film className="w-8 h-8 text-amber-400 animate-pulse" />
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Play className="w-6 h-6 text-amber-400 fill-amber-400" />
                                </div>
                              </div>
                            ) : (
                              <img src={uploadedBase64} alt="Preview" className="w-full h-full object-cover" />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setUploadedBase64("");
                                setVideoPoster("");
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="absolute top-1 right-1 p-1 rounded-full bg-zinc-950/80 text-white hover:bg-zinc-950 cursor-pointer z-10"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-zinc-700">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold cursor-pointer shadow-sm"
                      >
                        Simpan {mediaType === "video" ? "Video" : "Foto"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {(showAll ? filteredData : filteredData.slice(0, 9)).map((item, index) => {
              const isVideo = item.mediaType === "video" || !!item.videoUrl;
              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedIdx(index)}
                  className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-emerald-300/80 dark:border-zinc-800 cursor-pointer bg-emerald-100/80 dark:bg-zinc-800"
                >
                  {/* Media Cover Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Video Play Badge Badge Overlay */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-xl border border-amber-400/40 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-emerald-950 transition-all duration-300">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Media Type Badge (Top Right) */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-zinc-950/70 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider border border-amber-400/20 backdrop-blur-sm z-10">
                    {isVideo ? "🎬 VIDEO" : "📷 FOTO"}
                  </div>

                  {/* Trash button overlay (Only visible to admin) */}
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDeleteImage(e, item.id)}
                      className="absolute top-3 left-3 p-2 bg-zinc-950/80 hover:bg-rose-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 cursor-pointer border border-white/10 shadow-md"
                      title="Hapus media ini"
                    >
                      <Trash2 className="w-3.5 h-3.5 hover:scale-110 transition-transform" />
                    </button>
                  )}

                  {/* Hover overlay details */}
                  <div className="absolute inset-0 bg-zinc-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-10">
                    <ZoomIn className="absolute top-4 right-14 w-5 h-5 text-amber-400 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 transform scale-75 group-hover:scale-100" />
                    <div className="space-y-1 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-sans">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-semibold text-white font-sans leading-snug">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Expand / Show More Button if media > 9 */}
        {filteredData.length > 9 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer border border-emerald-500/20"
            >
              <span>
                {showAll
                  ? "Tampilkan Lebih Sedikit"
                  : `Lihat Selengkapnya (${filteredData.length - 9} Media Lainnya)`}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox / Video Player Modal */}
      <AnimatePresence>
        {selectedIdx !== null && filteredData[selectedIdx] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdx(null)}
              className="absolute inset-0 bg-zinc-950/95 backdrop-blur-sm"
            />

            {/* Content Container */}
            <div className="relative w-full max-w-5xl h-full flex flex-col justify-center items-center z-10 py-12">
              {/* Close Button */}
              <button
                onClick={() => setSelectedIdx(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white transition-colors cursor-pointer z-30"
                aria-label="Tutup"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Left */}
              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white transition-colors cursor-pointer z-30"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-6 h-6 text-amber-400" />
              </button>

              {/* Media Frame (Photo or Video Player) */}
              <div className="relative flex-1 max-w-full w-full max-h-[72vh] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  {filteredData[selectedIdx].mediaType === "video" || !!filteredData[selectedIdx].videoUrl ? (
                    <motion.div
                      key={filteredData[selectedIdx].id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full max-w-4xl flex items-center justify-center"
                    >
                      {getYouTubeId(filteredData[selectedIdx].videoUrl || filteredData[selectedIdx].imageUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(filteredData[selectedIdx].videoUrl || filteredData[selectedIdx].imageUrl)}?autoplay=1`}
                          title={filteredData[selectedIdx].title}
                          className="w-full aspect-video rounded-2xl shadow-2xl border border-emerald-500/20"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={filteredData[selectedIdx].videoUrl || filteredData[selectedIdx].imageUrl}
                          controls
                          autoPlay
                          className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl border border-emerald-500/20"
                        />
                      )}
                    </motion.div>
                  ) : (
                    <motion.img
                      key={filteredData[selectedIdx].id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      src={filteredData[selectedIdx].imageUrl}
                      alt={filteredData[selectedIdx].title}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Right */}
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white transition-colors cursor-pointer z-30"
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-6 h-6 text-amber-400" />
              </button>

              {/* Description Panel */}
              <div className="text-center mt-6 max-w-2xl px-4 text-white">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-sans mb-1">
                  {filteredData[selectedIdx].mediaType === "video" || !!filteredData[selectedIdx].videoUrl ? "🎬 Video" : "📷 Foto"} {selectedIdx + 1} dari {filteredData.length} • {filteredData[selectedIdx].category}
                </span>
                <p className="text-base font-medium font-sans leading-relaxed">
                  {filteredData[selectedIdx].title}
                </p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
