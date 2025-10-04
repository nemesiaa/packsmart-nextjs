"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const ROSE = "#B48EAD";

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
    // sticky + z-50 to stay above the hero at all times
    <header className="site-header sticky top-0 z-50 flex justify-between items-center px-8 py-4 border-b border-b-pink-200/60">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold" style={{ color: ROSE }}>PackSmart</span>
      </div>

      <nav className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined" style={{ color: ROSE }}>home</span> Accueil
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined" style={{ color: ROSE }}>dashboard</span> Dashboard
        </Link>
        <Link href="/actualite" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined" style={{ color: ROSE }}>newspaper</span> Actualité
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="font-medium flex items-center gap-1" style={{ color: ROSE }}>
              <span className="material-symbols-outlined" style={{ color: ROSE }}>account_circle</span>
              {user.name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined" style={{ color: ROSE }}>account_circle</span> Connexion
          </Link>
        )}
      </nav>
    </header>
  );
}
