"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ROSE = "#f472b6";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    // un peu plus d’offset pour mieux “décoller”
    <div className="sticky top-6 sm:top-5 md:top-6 z-50">
      <header
        className="
          mx-auto w-full max-w-7xl rounded-full border border-ui-border
                   bg-ui-surface/90 backdrop-blur px-8 py-4 shadow-lg
                   ring-1 ring-white/10 text-white/92
        "
      >
        <div className="flex justify-between items-center">
          {/* Titre en blanc doux */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xl font-bold text-rose">
                PackSmart
              </Link>
            </div>


          </div>

          {/* Liens en blanc doux, hover rose */}
          <nav className="flex items-center gap-8">
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
        </div>
      </header>
    </div>
  );
}
