"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Connexion réussie - rediriger vers la page d'accueil
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        // Erreur de connexion
        alert(data.error || "Erreur de connexion");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Header minimaliste */}
      <div className="absolute top-6 right-6">
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="flex items-center gap-2 hover:text-yellow-400"
          >
            🏠 Accueil
          </Link>
          <span className="flex items-center gap-2">📊 Dashboard</span>
        </nav>
      </div>

      {/* Conteneur principal centré */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Titre avec emoji */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-2">
              🤝 Connexion
            </h1>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-white"
                required
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-white"
                required
              />
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Lien créer un compte */}
          <div className="mt-6 text-center">
            <Link
              href="/register"
              className="text-yellow-400 hover:text-yellow-500 transition-colors"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
