"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, User, BookOpen } from "lucide-react";
import { beritaData, BeritaItem } from "@/data/beritaData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

interface PageProps {
  params: {
    id: string;
  };
}

const categoryColors: Record<string, string> = {
  Pembangunan:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200/30 dark:border-blue-900/30",
  Kesehatan:
    "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-200/30 dark:border-rose-900/30",
  Kegiatan:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/30 dark:border-emerald-900/30",
  Budaya:
    "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/30 dark:border-amber-900/30",
};

export default function BeritaDetail({ params }: PageProps) {
  const rawId = params.id;
  const decodedId = decodeURIComponent(rawId);
  const [berita, setBerita] = useState<BeritaItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Initial check in local storage & default data
    const saved = localStorage.getItem("jatirejo_berita");
    let initialList = beritaData;
    if (saved) {
      try {
        initialList = JSON.parse(saved);
      } catch (e) {
        initialList = beritaData;
      }
    }

    const initialFound = initialList.find(
      (item) => item.id === decodedId || item.id === rawId
    );
    if (initialFound) {
      setBerita(initialFound);
      setIsLoaded(true);
    }

    // 2. Fetch latest Cloud Sync data to handle cross-device created articles
    fetch("/api/cloud-sync")
      .then((res) => res.json())
      .then((resData) => {
        if (
          resData?.success &&
          resData?.data?.berita &&
          Array.isArray(resData.data.berita)
        ) {
          const cloudList: BeritaItem[] = resData.data.berita;
          const cloudFound = cloudList.find(
            (item) => item.id === decodedId || item.id === rawId
          );
          if (cloudFound) {
            setBerita(cloudFound);
          }
        }
      })
      .catch((err) => console.warn("Cloud sync fetch article error:", err))
      .finally(() => {
        setIsLoaded(true);
      });
  }, [decodedId, rawId]);

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 bg-slate-50 dark:bg-zinc-950">
          <div className="animate-pulse text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Memuat Artikel Berita...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!berita) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 px-4 bg-slate-50 dark:bg-zinc-950 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white font-sans">
              Berita Tidak Ditemukan
            </h1>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-sans font-light">
              Maaf, artikel berita atau kegiatan yang Anda cari tidak ditemukan
              atau telah dihapus.
            </p>
          </div>

          <Link
            href="/#berita"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors text-sm shadow-sm"
          >
            Kembali ke Beranda
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const categoryStyle =
    categoryColors[berita.category] ||
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-200/30 dark:border-emerald-900/30";

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-white dark:bg-zinc-950 transition-colors duration-300 pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back Button */}
          <div>
            <Link
              href="/#berita"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-amber-500 transition-colors uppercase tracking-wider font-sans group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Warta Berita</span>
            </Link>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border font-sans ${categoryStyle}`}
              >
                {berita.category}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-zinc-650 dark:text-zinc-400 font-sans">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>{berita.date}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-zinc-650 dark:text-zinc-400 font-sans">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>{berita.author || "Tim Redaksi Padukuhan Jatirejo"}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white font-sans leading-tight">
              {berita.title}
            </h1>
          </div>

          {/* Featured Image */}
          <div className="relative h-72 sm:h-[420px] rounded-3xl overflow-hidden shadow-md border border-slate-100 dark:border-zinc-850">
            <img
              src={berita.imageUrl}
              alt={berita.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Summary / Lead */}
          <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border-l-4 border-emerald-500 text-zinc-700 dark:text-zinc-300 font-sans text-base sm:text-lg font-medium leading-relaxed italic">
            &ldquo;{berita.summary}&rdquo;
          </div>

          {/* Article Content */}
          <div className="space-y-6 text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed text-base font-light whitespace-pre-line">
            {typeof berita.content === "string"
              ? berita.content
              : (berita.content as string[]).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
          </div>

          {/* Footer Navigation */}
          <div className="pt-8 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
            <Link
              href="/#berita"
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </article>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}