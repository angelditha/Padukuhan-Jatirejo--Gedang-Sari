"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, Users, Home, Landmark } from "lucide-react";

export default function Profil() {
  const stats = [
    { label: "Luas Wilayah", value: "± 42 Hektar", icon: MapPin },
    { label: "Jumlah Penduduk", value: "± 400 Jiwa", icon: Users },
    { label: "Kepala Keluarga (KK)", value: "± 174 KK", icon: Home },
    { label: "Rukun Tetangga (RT)", value: "4 RT (RT 01 - 04)", icon: Landmark },
  ];

  const missions = [
    "Meningkatkan kualitas pelayanan kepada masyarakat secara cepat, transparan, dan bertanggung jawab.",
    "Memperkuat kerukunan, persatuan, dan semangat gotong royong antar warga.",
    "Mendorong pemberdayaan ekonomi masyarakat melalui pengembangan usaha, pertanian dan perternakan, dan UMKM.",
    "Meningkatkan kualitas sumber daya manusia melalui pendidikan, kesehatan dan pembinaan generasi muda.",
    "Menjaga keamanan, ketertiban, dan kenyamanan lingkungan bersama seluruh elemen masyarakat.",
    "Melestarikan adat istiadat, seni budaya, dan kearifan lokal sebagai identitas Padukuhan Jatirejo.",
    "Mewujudkan lingkungan yang bersih, sehat, hijau, dan tangguh terhadap bencana.",
    "meningkatkan partisipasi masyarakat dalam setiap kegiatan pembangunan dan pengambilan keputusan di Padukuhan."
  ];

  return (
    <section
      id="profil"
      className="py-20 bg-white dark:bg-zinc-900 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single Box Visi & Misi matching user screenshot (Widened to max-w-5xl) */}
        <div className="max-w-5xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white p-8 sm:p-14 rounded-3xl border border-amber-500/30 shadow-2xl space-y-8 relative overflow-hidden"
          >
            {/* Top Shield Icon */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                <ShieldCheck className="w-9 h-9 text-amber-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans text-white">
                Visi & Misi
              </h3>
              <div className="h-px w-full bg-white/10 my-4" />
            </div>

            {/* VISI Sub-section */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block font-sans">
                VISI
              </span>
              <p className="text-lg sm:text-xl font-semibold leading-relaxed italic font-sans text-emerald-50">
                &ldquo;Terwujudnya Padukuhan Jatirejo yang maju, mandiri, aman, rukun, sejahtera, berbudaya, serta berlandaskan nilai-nilai gotong royong dan kepedulian terhadap lingkungan.&rdquo;
              </p>
            </div>

            {/* MISI Sub-section */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block font-sans">
                MISI
              </span>
              <ol className="space-y-4 text-sm sm:text-base font-sans font-light text-emerald-100">
                {missions.map((misi, index) => (
                  <li key={index} className="flex items-start gap-3 leading-relaxed">
                    <span className="font-extrabold text-amber-400 shrink-0 text-base">
                      {index + 1}.
                    </span>
                    <span>{misi}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>

        {/* Demographic / Stats Bar (Green-Tinted Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-100 dark:border-zinc-800/50">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-500/20 text-center space-y-2 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="mx-auto w-11 h-11 rounded-xl bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-emerald-500/20">
                  <Icon className="w-5.5 h-5.5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-emerald-950 dark:text-white font-sans">
                  {stat.value}
                </div>
                <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider font-sans">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
