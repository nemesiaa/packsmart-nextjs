"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/"); // retour Home
      } else {
        alert(data.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page section-dark text-textSoft relative">
      {/* bouton retour accueil (ghost) */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="btn-ghost">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Accueil
        </Link>
      </div>

      {/* centre */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md card text-left">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-rose">Créer un compte</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm mb-2">Nom</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2">Mot de passe</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#171a1f] border border-ui-border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-rose w-full inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
              )}
              {loading ? "Inscription..." : "Créer le compte"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-rose hover:text-rose/80 transition-colors">
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}