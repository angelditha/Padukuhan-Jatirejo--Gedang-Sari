"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface FormState {
  nama: string;
  email: string;
  telepon: string;
  subjek: string;
  pesan: string;
}

const initialForm: FormState = {
  nama: "",
  email: "",
  telepon: "",
  subjek: "",
  pesan: "",
};

export default function PetaKontak() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.nama.trim()) {
      newErrors.nama = "Nama lengkap wajib diisi";
    } else if (form.nama.trim().length < 3) {
      newErrors.nama = "Nama minimal 3 karakter";
    }

    if (!form.email.trim()) {
      newErrors.email = "Alamat email wajib diisi";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!form.telepon.trim()) {
      newErrors.telepon = "Nomor WhatsApp wajib diisi";
    } else if (!/^\d{10,14}$/.test(form.telepon.trim())) {
      newErrors.telepon = "Nomor tidak valid (10-14 digit angka)";
    }

    if (!form.subjek.trim()) {
      newErrors.subjek = "Subjek pesan wajib diisi";
    }

    if (!form.pesan.trim()) {
      newErrors.pesan = "Isi pesan wajib diisi";
    } else if (form.pesan.trim().length < 10) {
      newErrors.pesan = "Pesan minimal 10 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSendWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const textMessage = `Halo Pak Dukuh Jatirejo,\n\nSaya *${form.nama.trim()}*\nEmail: ${form.email.trim()}\nNo. HP: ${form.telepon.trim()}\n\n*Subjek:* ${form.subjek.trim()}\n\n*Pesan / Aspirasi:* \n${form.pesan.trim()}`;
      const encodedMessage = encodeURIComponent(textMessage);
      const targetPhone = "6285932608870"; // Ganti dengan nomor WA Pak Dukuh yang asli
      const waUrl = `https://wa.me/${targetPhone}?text=${encodedMessage}`;

      window.open(waUrl, "_blank");
      setIsSuccess(true);
      setForm(initialForm);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const emailSubject = encodeURIComponent(`[Aspirasi Warga] ${form.subjek.trim()}`);
      const emailBody = encodeURIComponent(
        `Halo Pak Dukuh Jatirejo,\n\nSaya:\nNama: ${form.nama.trim()}\nEmail: ${form.email.trim()}\nNo. HP / WA: ${form.telepon.trim()}\n\nSubjek: ${form.subjek.trim()}\n\nPesan / Aspirasi:\n${form.pesan.trim()}`
      );
      const mailtoUrl = `mailto:dithaangelditha@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      window.open(mailtoUrl, "_blank");
      setIsSuccess(true);
      setForm(initialForm);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="kontak"
      className="py-20 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 font-sans">
            Hubungi Kami
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white leading-tight font-sans">
            Hubungi Dukuh & Kirim Saran Warga
          </p>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Form and Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Side: Info & Map */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Quick Contacts (Enlarged Email Box & Green-Tinted Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-emerald-100/80 dark:bg-gradient-to-br dark:from-emerald-950/80 dark:via-zinc-900 dark:to-emerald-950/90 border border-emerald-300/80 dark:border-emerald-500/25 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                <div className="p-3.5 rounded-xl bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shrink-0 border border-emerald-500/20">
                  <Phone className="w-5.5 h-5.5 text-amber-500" />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block font-sans">
                    WhatsApp Dukuh
                  </span>
                  <a
                    href="https://wa.me/6285932608870"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base font-bold text-emerald-950 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-sans block truncate"
                  >
                    +62 812-3456-789
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-100/80 dark:bg-gradient-to-br dark:from-emerald-950/80 dark:via-zinc-900 dark:to-emerald-950/90 border border-emerald-300/80 dark:border-emerald-500/25 shadow-sm flex items-start gap-4 hover:shadow-md transition-all">
                <div className="p-3.5 rounded-xl bg-emerald-600/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 shrink-0 border border-emerald-500/20">
                  <Mail className="w-5.5 h-5.5 text-amber-500" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block font-sans">
                    Surat Elektronik
                  </span>
                  <a
                    href="mailto:dithaangelditha@gmail.com"
                    className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-sans block break-all leading-snug"
                    title="jatirejo.hargomulyo@gmail.com"
                  >
                    jatirejo.hargomulyo@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Wrapper */}
            <div className="flex-1 min-h-[300px] rounded-3xl overflow-hidden border border-emerald-300/80 dark:border-emerald-500/20 shadow-sm relative group bg-slate-100 dark:bg-zinc-800">
              <iframe
                title="Peta Padukuhan Jatirejo, Hargomulyo"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15814.770932578505!2d110.59089065!3d-7.82228495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a4f78e47e30d3%3A0xe1db0bc75467dbb6!2sHargomulyo%2C%20Gedangsari%2C%2520Gunung%2520Kidul%2520Regency%252C%2520Special%2520Region%2520of%2520Yogyakarta!5e0!3m2!1sen!2sid!4v1720000000000!5m2!1sen!2sid"
                className="absolute inset-0 w-full h-full border-0 filter grayscale dark:invert dark:opacity-85 transition-all duration-500 group-hover:grayscale-0 dark:group-hover:invert-0"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Side: Interactive Form (Green-Tinted Container) */}
          <div className="lg:col-span-6 bg-emerald-100/80 dark:bg-gradient-to-br dark:from-emerald-950/80 dark:via-zinc-900 dark:to-emerald-950/90 rounded-3xl p-6 sm:p-8 border border-emerald-300/80 dark:border-emerald-500/25 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSendWhatsApp}
                  className="space-y-4"
                  noValidate
                >
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white font-sans flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Formulir Aspirasi & Hubungi Dukuh
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="nama" className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="nama"
                        name="nama"
                        value={form.nama}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-light bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                          errors.nama ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-zinc-800 focus:border-emerald-500"
                        }`}
                        placeholder="Budi Santoso"
                      />
                      {errors.nama && (
                        <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> {errors.nama}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-light bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                          errors.email ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-zinc-800 focus:border-emerald-500"
                        }`}
                        placeholder="budi@email.com"
                      />
                      {errors.email && (
                        <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="telepon" className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                        Nomor WhatsApp
                      </label>
                      <input
                        type="text"
                        id="telepon"
                        name="telepon"
                        value={form.telepon}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-light bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                          errors.telepon ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-zinc-800 focus:border-emerald-500"
                        }`}
                        placeholder="081234567890"
                      />
                      {errors.telepon && (
                        <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> {errors.telepon}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="subjek" className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                        Subjek Pesan
                      </label>
                      <input
                        type="text"
                        id="subjek"
                        name="subjek"
                        value={form.subjek}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-light bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                          errors.subjek ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-zinc-800 focus:border-emerald-500"
                        }`}
                        placeholder="Saran Pembangunan Desa"
                      />
                      {errors.subjek && (
                        <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-0.5">
                          <AlertCircle className="w-3 h-3" /> {errors.subjek}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="pesan" className="text-xs font-semibold text-zinc-550 dark:text-zinc-400">
                      Pesan atau Saran
                    </label>
                    <textarea
                      id="pesan"
                      name="pesan"
                      rows={4}
                      value={form.pesan}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-light bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all resize-none ${
                        errors.pesan ? "border-rose-500 focus:border-rose-500" : "border-slate-200 dark:border-zinc-800 focus:border-emerald-500"
                      }`}
                      placeholder="Tuliskan masukan, aduan, atau aspirasi Anda untuk padukuhan..."
                    />
                    {errors.pesan && (
                      <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-0.5">
                        <AlertCircle className="w-3 h-3" /> {errors.pesan}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm font-sans"
                    >
                      <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Kirim via WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendEmail}
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-emerald-950 font-extrabold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs sm:text-sm font-sans"
                    >
                      <Mail className="w-4 h-4 text-emerald-950 shrink-0" />
                      <span>Kirim via Email</span>
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-16 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans">
                    Pesan Berhasil Terkirim!
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm font-sans font-light leading-relaxed">
                    Terima kasih atas aspirasi Anda. Pesan telah diteruskan ke Dukuh Jatirejo dan akan segera kami tindak lanjuti.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-semibold text-zinc-650 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Kirim Pesan Lain
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
