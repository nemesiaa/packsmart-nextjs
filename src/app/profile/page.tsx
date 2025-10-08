"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

type User = {
  id?: number | string;
  email: string;
  name?: string;
  avatarUrl?: string | null;
  description?: string | null;
};

const LS_USER = "user";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<null | string>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_USER);
      if (raw) {
        const u: User = JSON.parse(raw);
        setUser(u);
        setName(u.name ?? "");
        setDescription(u.description ?? "");
      }
    } catch {
      setUser(null);
    }
  }, []);

  const initials = useMemo(() => {
    const src = user?.name || user?.email || "";
    const parts = src.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const second = parts.length > 1 ? parts[1]?.[0] || "" : "";
    return (first + second || "?").toUpperCase();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-dvh bg-ui-base text-textSoft flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center px-6">
          <div className="text-center">
            <div className="text-4xl mb-4">👤</div>
            <p className="text-textSoft/80">Aucun utilisateur connecté.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSave = async () => {
    const cleanName = name.trim();
    const cleanDesc = description.trim();

    if (!cleanName) {
      setSavedMsg("Le nom ne peut pas être vide.");
      return;
    }

    setSaving(true);
    try {
      const updated: User = { ...user, name: cleanName, description: cleanDesc };
      localStorage.setItem(LS_USER, JSON.stringify(updated));
      setUser(updated);
      setSavedMsg("Modifications enregistrées ✅");

      // Notifie le header (optionnel) pour rafraîchir l’affichage du nom
      window.dispatchEvent(new CustomEvent("packsmart:user-updated"));
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMsg(null), 2000);
    }
  };

  const handleReset = () => {
    setName(user.name ?? "");
    setDescription(user.description ?? "");
    setSavedMsg(null);
  };

  return (
    <div className="min-h-dvh bg-ui-base text-textSoft flex flex-col">
      <Header />

      {/* main prend toute la hauteur restante -> footer reste en bas */}
      <main className="flex-1 px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-5xl">
          {/* Titre */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-rose">Mon profil</h1>
            <p className="text-textSoft/70 mt-1">Aperçu de vos informations PackSmart</p>
          </div>

          {/* Carte profil */}
          <section className="bg-ui-surface border border-ui-border rounded-2xl p-8 shadow-lg shadow-black/20 hover:border-rose/40 transition-all">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border border-ui-border shadow-inner"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/5 border border-ui-border grid place-items-center">
                  <span className="text-lg font-semibold text-white/90 tracking-wide">
                    {initials}
                  </span>
                </div>
              )}

              <div className="min-w-0">
                <div className="text-xl font-semibold text-white/90 truncate">
                  {user.name || user.email}
                </div>
                <div className="text-white/70 truncate">{user.email}</div>
              </div>
            </div>

            {/* Formulaire d'édition simple */}
            <div className="mt-8 grid gap-6">
              <div>
                <label className="block text-sm mb-2 text-white/80">Nom affiché</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-ui-border px-4 py-2.5 outline-none focus:border-rose/60"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-white/80">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl bg-white/5 border border-ui-border px-4 py-2.5 outline-none focus:border-rose/60 resize-y"
                  placeholder="Parlez un peu de vous (facultatif)"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg border border-rose text-rose px-4 py-2 bg-ui-base/60 hover:bg-rose/10 disabled:opacity-60"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-white/15 text-white/85 px-4 py-2 bg-white/5 hover:bg-white/10"
                >
                  Annuler
                </button>

                {savedMsg && (
                  <span className="text-sm text-white/80 ml-2">{savedMsg}</span>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
