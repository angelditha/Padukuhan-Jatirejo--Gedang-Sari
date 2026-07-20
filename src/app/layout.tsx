import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminProvider } from "@/components/AdminContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Website Resmi Padukuhan Jatirejo - Hargomulyo, Gunungkidul",
  description:
    "Portal Resmi dan Media Informasi Padukuhan Jatirejo, Kalurahan Hargomulyo, Kapanewon Gedangsari, Kabupaten Gunungkidul, D.I. Yogyakarta. Mengenal potensi tani, kerajinan UMKM, seni budaya, dan warta kegiatan warga.",
  keywords: [
    "Padukuhan Jatirejo",
    "Jatirejo Hargomulyo",
    "Jatirejo Gedangsari",
    "Jatirejo Gunungkidul",
    "Hargomulyo Gunungkidul",
    "Digitalisasi Desa",
    "Wisata Gunungkidul",
    "Seni Budaya Yogyakarta",
    "KKN Jatirejo",
  ],
  authors: [{ name: "Kependudukan Padukuhan Jatirejo" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${outfit.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-sans">
        <ThemeProvider>
          <AdminProvider>{children}</AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

