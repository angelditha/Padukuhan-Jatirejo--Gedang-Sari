"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Leaf, Phone, Mail, MapPin, ArrowRight } from "lucide-react";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19c1.71.46 8.59.46 8.59.46s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    if (pathname === "/") {
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
    } else {
      router.push(`/#${id}`);
    }
  };

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-amber-500/20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-800 text-white p-2 rounded-lg border border-amber-400/20">
                <Leaf className="w-5 h-5 text-amber-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-none">
                  Padukuhan Jatirejo
                </span>
                <span className="text-[10px] text-amber-400 tracking-wider uppercase font-medium">
                  Hargomulyo • DIY
                </span>
              </div>
            </div>
            <p className="text-sm text-emerald-200/80 leading-relaxed font-sans font-light">
              Media Informasi Resmi dan Digitalisasi Padukuhan Jatirejo, Kalurahan Hargomulyo, Kapanewon Gedangsari, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta (DIY)
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-base font-semibold text-amber-400 mb-4 tracking-wide font-sans">
              Peta Situs
            </h3>
            <ul className="space-y-2.5 text-sm font-sans font-light">
              {[
                { id: "home", label: "Beranda" },
                { id: "profil", label: "Profil Padukuhan" },
                { id: "potensi", label: "Potensi Desa" },
                { id: "budaya", label: "Budaya & Tradisi" },
                { id: "berita", label: "Berita & Kegiatan" },
                { id: "galeri", label: "Galeri Foto" },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className="flex items-center gap-1.5 hover:text-amber-300 transition-colors duration-200 group text-emerald-200/80"
                  >
                    <ArrowRight className="w-3 h-3 text-amber-500/60 group-hover:translate-x-1 transition-transform" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Info */}
          <div>
            <h3 className="text-base font-semibold text-amber-400 mb-4 tracking-wide font-sans">
              Kontak Kami
            </h3>
            <ul className="space-y-3.5 text-sm font-sans font-light text-emerald-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Jatirejo, Hargomulyo, Gedangsari, Kabupaten Gunungkidul, Daerah Istimewa Yogyakarta 55863
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <a
                  href="https://wa.me/6283891925807"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors"
                >
                  +62 838-9192-5807 (Bu Dukuh)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                <a
                  href="mailto:jatirejopadukuhan@gmail.com"
                  className="hover:text-amber-300 transition-colors"
                >
                  jatirejopadukuhan@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Additional Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-amber-400 mb-4 tracking-wide font-sans">
              Jam Pelayanan
            </h3>
            <div className="text-sm font-sans font-light space-y-2 text-emerald-200/80">
              <div className="flex justify-between border-b border-emerald-900 pb-1">
                <span>Setiap Hari:</span>
                <span className="font-medium text-white">08:00 - 23:00</span>
              </div>
            </div>
            <p className="text-xs text-emerald-300/60 leading-relaxed pt-1">
              *Pelayanan darurat oleh RT/RW/Dukuh tersedia 24 jam via kontak telepon/WhatsApp.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-800 to-transparent my-10" />

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans font-light text-emerald-300/70">
          <p>
            © {new Date().getFullYear()} Padukuhan Jatirejo. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="flex items-center gap-1">
            Dibuat untuk program KKN & Digitalisasi Desa oleh
            <span className="font-medium text-amber-400">Tim KKN Jatirejo UAJY - Febriola</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
