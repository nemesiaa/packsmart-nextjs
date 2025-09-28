"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎒</span>
        <span className="text-xl font-bold text-yellow-400">PackSmart</span>
      </div>

      <nav className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
          🏠 Accueil
        </Link>
        <Link href="/dashboard" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
          📊 Dashboard
        </Link>
        <a href="#" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
          📰 Actualité
        </a>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 font-medium">👤 {user.name || user.email}</span>
            <button 
              onClick={handleLogout}
              className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
            👤 Connexion
          </Link>
        )}
      </nav>
    </header>
  );
}
