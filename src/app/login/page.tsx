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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/"); // retour Home après login
      } else {
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
    // Fond mauve sombre comme la home
    <div className="min-h-screen flex page section-dark text-textSoft">
      {/* Bouton "Accueil" moderne (ghost) */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose/40 text-rose hover:bg-rose/10 hover:border-rose transition-colors text-sm"
          aria-label="Retour à l’accueil"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Accueil
        </Link>
      </div>

      {/* Conteneur principal centré */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md card bg-anthraciteDark">
          {/* Titre sans emoji */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-rose">Connexion</h1>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#171a1f] border border-violetDark/60 rounded-lg focus:ring-2 focus:ring-violet focus:border-transparent outline-none text-textSoft"
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#171a1f] border border-violetDark/60 rounded-lg focus:ring-2 focus:ring-violet focus:border-transparent outline-none text-textSoft"
                required
              />
            </div>

            {/* Bouton de connexion + spinner */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose text-anthraciteDark py-3 px-6 rounded-lg font-semibold hover:bg-violet transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
              )}
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          {/* Lien créer un compte */}
          <div className="mt-6 text-center">
            <Link href="/register" className="text-rose hover:text-violet transition-colors">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
