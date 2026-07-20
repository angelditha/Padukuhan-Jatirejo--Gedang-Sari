"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Profil from "@/components/Profil";
import Potensi from "@/components/Potensi";
import Budaya from "@/components/Budaya";
import BeritaKegiatan from "@/components/BeritaKegiatan";
import Galeri from "@/components/Galeri";
import PetaKontak from "@/components/PetaKontak";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  // Smooth scroll to hash anchor when loading page from a link with hash (e.g. from /berita/[id] to /#section)
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(hash);
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
      }, 300); // Small delay to let components render first
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Sticky Header */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* Hero Banner Section */}
        <Hero />

        {/* Profil Padukuhan Section */}
        <Profil />

        {/* Potensi Padukuhan Section */}
        <Potensi />

        {/* Budaya & Tradisi Section */}
        <Budaya />

        {/* Berita & Kegiatan Terbaru Section */}
        <BeritaKegiatan />

        {/* Galeri Foto Section */}
        <Galeri />

        {/* Peta Lokasi & Kontak Section */}
        <PetaKontak />
      </main>

      {/* Footer Details */}
      <Footer />

      {/* Float Scroll Indicator */}
      <BackToTop />
    </div>
  );
}
