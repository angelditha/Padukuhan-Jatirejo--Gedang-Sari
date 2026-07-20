"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Lock, LogOut, Key, X, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

interface AdminContextType {
  isAdmin: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const DEFAULT_USER = "PadukuhanJatirejo";
const DEFAULT_PASS = "Jatirejo20";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Form states inside modal
  const [activeTab, setActiveTab] = useState<"login" | "password">("login");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // Change password states
  const [oldPassInput, setOldPassInput] = useState("");
  const [newPassInput, setNewPassInput] = useState("");
  const [confirmPassInput, setConfirmPassInput] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const sessionAdmin = localStorage.getItem("jatirejo_admin_logged_in");
    if (sessionAdmin === "true") {
      setIsAdmin(true);
    }
  }, []);

  const getSavedPassword = () => {
    return localStorage.getItem("jatirejo_admin_pass") || DEFAULT_PASS;
  };

  const login = (user: string, pass: string): boolean => {
    const currentPass = getSavedPassword();
    if (user.trim() === DEFAULT_USER && pass === currentPass) {
      setIsAdmin(true);
      localStorage.setItem("jatirejo_admin_logged_in", "true");
      setErrorMsg("");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("jatirejo_admin_logged_in");
    setIsLoginModalOpen(false);
  };

  const changePassword = (oldPass: string, newPass: string): boolean => {
    const currentPass = getSavedPassword();
    if (oldPass !== currentPass) {
      return false;
    }
    localStorage.setItem("jatirejo_admin_pass", newPass);
    return true;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(usernameInput, passwordInput)) {
      setSuccessMsg("Login Admin Berhasil!");
      setTimeout(() => {
        setSuccessMsg("");
        setIsLoginModalOpen(false);
        setUsernameInput("");
        setPasswordInput("");
      }, 1000);
    } else {
      setErrorMsg("Username atau Password salah!");
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassInput || !newPassInput || !confirmPassInput) {
      setErrorMsg("Semua kolom password wajib diisi!");
      return;
    }
    if (newPassInput !== confirmPassInput) {
      setErrorMsg("Konfirmasi password baru tidak cocok!");
      return;
    }
    if (newPassInput.length < 5) {
      setErrorMsg("Password baru minimal 5 karakter!");
      return;
    }

    if (changePassword(oldPassInput, newPassInput)) {
      setSuccessMsg("Password Admin Berhasil Diubah!");
      setErrorMsg("");
      setOldPassInput("");
      setNewPassInput("");
      setConfirmPassInput("");
      setTimeout(() => {
        setSuccessMsg("");
        setActiveTab("login");
      }, 1500);
    } else {
      setErrorMsg("Password lama tidak sesuai!");
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        login,
        logout,
        changePassword,
        isLoginModalOpen,
        openLoginModal: () => {
          setErrorMsg("");
          setSuccessMsg("");
          setIsLoginModalOpen(true);
        },
        closeLoginModal: () => setIsLoginModalOpen(false),
      }}
    >
      {children}

      {/* Admin Portal Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 dark:border-zinc-800 space-y-6">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-sans">
                Portal Admin Padukuhan
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans font-light">
                {isAdmin
                  ? "Anda telah masuk sebagai Admin Padukuhan Jatirejo."
                  : "Masukkan username & password untuk mengedit website."}
              </p>
            </div>

            {isAdmin ? (
              <div className="space-y-4">
                {activeTab === "login" ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 text-center space-y-1">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block font-sans uppercase tracking-wider">
                        Status: Admin Terverifikasi
                      </span>
                    </div>

                    {successMsg && (
                      <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> {successMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => {
                          setErrorMsg("");
                          setSuccessMsg("");
                          setActiveTab("password");
                        }}
                        className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Key className="w-4 h-4 text-amber-500" />
                        Ganti Password
                      </button>
                      <button
                        onClick={logout}
                        className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-xs">
                    {errorMsg && (
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 text-xs font-semibold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> {errorMsg}
                      </div>
                    )}
                    {successMsg && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> {successMsg}
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-600 dark:text-zinc-300">Password Lama</label>
                      <input
                        type="password"
                        value={oldPassInput}
                        onChange={(e) => setOldPassInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                        placeholder="Masukkan password saat ini"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-600 dark:text-zinc-300">Password Baru</label>
                      <input
                        type="password"
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                        placeholder="Masukkan password baru"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-zinc-600 dark:text-zinc-300">Konfirmasi Password Baru</label>
                      <input
                        type="password"
                        value={confirmPassInput}
                        onChange={(e) => setConfirmPassInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                        placeholder="Ulangi password baru"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg("");
                          setActiveTab("login");
                        }}
                        className="w-1/2 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm cursor-pointer"
                      >
                        Simpan
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 text-xs font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {successMsg}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-300">Username Admin</label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-sans"
                    placeholder="Masukkan Username Admin"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-zinc-600 dark:text-zinc-300">Password Admin</label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-sans"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Masuk Sebagai Admin</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
