"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Compass } from "lucide-react";

export default function Hero() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-zinc-950 text-white"
    >
      {/* Background Image with Parallax & Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80')",
          opacity: 0.45,
        }}
      />
      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-zinc-950/80 to-zinc-950 z-0" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-sm"
        >
          <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
          <span>Selamat Datang Di Portal Digital</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight"
        >
          Padukuhan <span className="text-gradient bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">Jatirejo</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto font-sans font-light leading-relaxed"
        >
         Terwujudnya Padukuhan Jatirejo yang maju, mandiri, aman, rukun, sejahtera, berbudaya, serta berlandaskan nilai-nilai gotong royong dan kepedulian terhadap lingkungan.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => handleScrollTo("profil")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer border border-emerald-500/30"
          >
            Jelajahi Profil
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => handleScrollTo("potensi")}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-white/10"
          >
            Lihat Potensi
          </button>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => handleScrollTo("profil")}
      >
        <span className="text-xs text-zinc-400 font-sans tracking-widest uppercase">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-emerald-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
