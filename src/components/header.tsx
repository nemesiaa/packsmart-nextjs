"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ROSE = "#f472b6";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false); // menu mobile/tablette

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className="sticky top-6 sm:top-5 md:top-6 z-50 px-3 sm:px-4 md:px-0">
      {/* padding latéral mobile pour éviter que le header touche les bords */}
      <header
        className="
          relative
          w-full max-w-7xl md:mx-auto
          rounded-2xl md:rounded-full
          border border-ui-border
          bg-ui-surface/90 backdrop-blur px-6 md:px-8 py-4 shadow-lg
          ring-1 ring-white/10 text-white/92
          transition-[border-radius] duration-200
        "
        aria-expanded={open}
      >
        <div className="flex justify-between items-center">
          {/* Titre */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xl font-bold text-rose">
                PackSmart
              </Link>
            </div>
          </div>

          {/* ====== DESKTOP (≥ lg) — NAV ORIGINALE, INCHANGÉE ====== */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-white/90 hover:text-rose transition-colors"
            >
              <span className="material-symbols-outlined text-base">home</span>
              Accueil
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-white/90 hover:text-rose transition-colors"
            >
              <span className="material-symbols-outlined text-base">dashboard</span>
              Dashboard
            </Link>

            <Link
              href="/actualite"
              className="flex items-center gap-2 text-white/90 hover:text-rose transition-colors"
            >
              <span className="material-symbols-outlined text-base">newspaper</span>
              Actualité
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-medium flex items-center gap-1 text-white/90">
                  <span className="material-symbols-outlined text-base">account_circle</span>
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm border border-rose text-rose px-3 py-1 rounded-lg bg-ui-base/60 hover:bg-rose/10 transition-all"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-white/90 hover:text-rose transition-colors"
              >
                <span className="material-symbols-outlined text-base">account_circle</span>
                Connexion
              </Link>
            )}
          </nav>

          {/* ====== MOBILE/TABLETTE (< lg) — HAMBURGER ====== */}
          <div className="lg:hidden flex items-center gap-2">
            {user ? (
              <span className="hidden sm:flex font-medium items-center gap-1 text-white/90 max-w-[14ch] truncate">
                <span className="material-symbols-outlined text-base">account_circle</span>
                {user.name || user.email}
              </span>
            ) : null}

            <button
              aria-label="Ouvrir le menu"
              aria-controls="packsmart-mobile-nav"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-lg border border-white/10
                         hover:border-white/20 bg-white/5 hover:bg-white/10
                         w-10 h-10 transition"
            >
              <span className="material-symbols-outlined">{open ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        {/* ====== MOBILE/TABLETTE — NAV EN FLUX (pousse la page) ====== */}
        <div
          id="packsmart-mobile-nav"
          className={`
            lg:hidden
            overflow-hidden
            transition-[max-height,opacity] duration-200 ease-out
            ${open ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="pt-2">
            <div className="mx-auto max-w-7xl px-1">
              <div className="grid gap-1">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/90 hover:text-rose hover:bg-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">home</span>
                  Accueil
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/90 hover:text-rose hover:bg-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">dashboard</span>
                  Dashboard
                </Link>

                <Link
                  href="/actualite"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/90 hover:text-rose hover:bg-white/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">newspaper</span>
                  Actualité
                </Link>

                {user ? (
                  <div className="mt-1 flex items-center justify-between gap-3 rounded-xl px-3 py-2 bg-white/5">
                    <span className="flex items-center gap-2 text-white/90 truncate">
                      <span className="material-symbols-outlined text-base">account_circle</span>
                      <span className="truncate">{user.name || user.email}</span>
                    </span>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="text-xs border border-rose text-rose px-3 py-1.5 rounded-lg bg-ui-base/60 hover:bg-rose/10 transition-all"
                    >
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-white/90 hover:text-rose hover:bg-white/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">account_circle</span>
                    Connexion
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
