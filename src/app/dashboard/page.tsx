// src/app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Modales (minuscules comme chez toi)
import TripModal from "@/components/modals/tripmodal";
import BagModal from "@/components/modals/bagmodal";
import AIModal from "@/components/modals/aimodal";

type ModalType = "trip" | "bag" | "ai" | null;

export default function Dashboard() {
  const router = useRouter();

  // --- state de page (inchangé visuellement) ---
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalPackages: 0,
    completedChecklists: 0,
  });
  const [modal, setModal] = useState<ModalType>(null);

  // --- liste des packages pour la modale IA ---
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  // Bouton rose réutilisable (tes classes d’avant)
  const btnRose = useMemo(
    () =>
      "w-full rounded-xl border border-rose text-rose bg-ui-base " +
      "py-3 px-6 font-semibold transition-all duration-200 " +
      "hover:bg-rose/10 hover:shadow-[0_8px_30px_rgba(244,114,182,0.18)] hover:-translate-y-0.5 " +
      "focus:outline-none focus:ring-2 focus:ring-rose/40",
    []
  );

  // Charge user + démo stats (comme avant)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    setStats({ totalTrips: 3, totalPackages: 5, completedChecklists: 8 }); // démo
  }, [router]);

  // Fetch des packages UNIQUEMENT quand la modale IA s’ouvre
  useEffect(() => {
    if (modal !== "ai" || !user?.id) return;

    let cancelled = false;
    (async () => {
      try {
        setLoadingPackages(true);
        const res = await fetch(`/api/packages?userId=${user.id}`, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setPackagesList(data.packages ?? []);
      } catch (e) {
        console.error("fetch /api/packages:", e);
        if (!cancelled) setPackagesList([]);
      } finally {
        if (!cancelled) setLoadingPackages(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [modal, user?.id]);

  // Ouvrir / fermer modales (avec retour navigateur)
  const handlePopstateOnce = () => setModal(null);
  const openModal = (type: Exclude<ModalType, null>) => {
    setModal(type);
    try {
      window.history.pushState({ modal: type }, "", `?modal=${type}`);
      window.addEventListener("popstate", handlePopstateOnce, { once: true });
    } catch {}
  };
  const closeModal = () => {
    try {
      window.history.back();
    } catch {
      setModal(null);
    }
  };

  // Incrémente le compteur voyages quand on crée un voyage
  const handleTripCreated = () =>
    setStats((s) => ({ ...s, totalTrips: s.totalTrips + 1 }));

  // Loading initial
  if (!user) {
    return (
      <div className="min-h-screen bg-ui-base flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎒</div>
          <div className="text-textSoft text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ui-base text-textSoft relative isolate dash">
      {/* fond aurora si présent dans tes styles */}
      <div className="dash__bg" aria-hidden />

      <Header />

      <main className="px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-7xl">
          {/* Titre */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-rose">
              Bienvenue, {user.name || user.email} ! 👋
            </h1>
            <p className="text-textSoft/70 text-lg">
              Gérez vos voyages et préparez vos bagages intelligemment
            </p>
          </div>

          {/* === Statistiques (tes classes d’avant : bleu / vert / violet) === */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="kpi kpi--lilac p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi__label">Total Voyages</p>
                  <p className="kpi__num">{stats.totalTrips}</p>
                </div>
                <div className="text-4xl opacity-90">✈️</div>
              </div>
            </div>

            <div className="kpi kpi--orchid p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi__label">Mes Sacs</p>
                  <p className="kpi__num">{stats.totalPackages}</p>
                </div>
                <div className="text-4xl opacity-90">🧳</div>
              </div>
            </div>

            <div className="kpi kpi--plum p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi__label">Checklists</p>
                  <p className="kpi__num">{stats.completedChecklists}</p>
                </div>
                <div className="text-4xl opacity-90">📋</div>
              </div>
            </div>
          </div>


          {/* === 3 cartes d’action (tes classes d’avant) === */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-ui-surface border border-ui-border p-8 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-rose hover:shadow-xl hover:shadow-rose/20 hover:bg-[#b48ead26] group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">✈️</div>
              <h3 className="text-2xl font-bold mb-4 text-textSoft">Nouveau Voyage</h3>
              <p className="text-textSoft/70 mb-6 leading-relaxed">
                Planifiez votre prochaine aventure et générez automatiquement vos listes de bagages
              </p>
              <button className={btnRose} onClick={() => openModal("trip")}>
                Créer un voyage
              </button>
            </div>

            <div className="bg-ui-surface border border-ui-border p-8 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-rose hover:shadow-xl hover:shadow-rose/20 hover:bg-[#b48ead26] group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🧳</div>
              <h3 className="text-2xl font-bold mb-4 text-textSoft">Mes Sacs</h3>
              <p className="text-textSoft/70 mb-6 leading-relaxed">
                Organisez et personnalisez vos différents types de bagages selon vos besoins
              </p>
              <button className={btnRose} onClick={() => openModal("bag")}>
                Gérer les sacs
              </button>
            </div>

            <div className="bg-ui-surface border border-ui-border p-8 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:border-rose hover:shadow-xl hover:shadow-rose/20 hover:bg-[#b48ead26] group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="text-2xl font-bold mb-4 text-textSoft">IA Assistant</h3>
              <p className="text-textSoft/70 mb-6 leading-relaxed">
                Générez des suggestions personnalisées basées sur la météo et votre destination
              </p>
              <button className={btnRose} onClick={() => openModal("ai")}>
                Demander conseil
              </button>
            </div>
          </div>

          {/* Voyages récents (démo) */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-textSoft">Mes Voyages Récents</h2>
              <button className="text-rose hover:text-rose/80 transition-colors">Voir tout →</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-ui-surface border border-ui-border p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-textSoft">Vacances d'été 2024</h3>
                    <p className="text-textSoft/70">Barcelone, Espagne</p>
                  </div>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Terminé</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-textSoft/70">
                    <span>15-22 Juillet • 2 sacs</span>
                  </div>
                  <button className="text-rose hover:text-rose/80">Voir détails</button>
                </div>
              </div>

              <div className="bg-ui-surface border border-ui-border p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-textSoft">Weekend à Paris</h3>
                    <p className="text-textSoft/70">Paris, France</p>
                  </div>
                  <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">En cours</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-textSoft/70">
                    <span>1-3 Oct • 1 sac</span>
                  </div>
                  <button className="text-rose hover:text-rose/80">Continuer</button>
                </div>
              </div>
            </div>
          </div>

          {/* Astuce du jour */}
          <div className="bg-gradient-to-r from-ui-surface to-ui-base border border-ui-border p-8 rounded-2xl">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">💡</div>
              <h2 className="text-xl font-bold text-textSoft">Astuce du jour</h2>
            </div>
            <p className="text-textSoft/80 mb-4">
              Saviez-vous que vous pouvez sauvegarder vos listes de bagages comme modèles réutilisables ?
              Créez une fois, utilisez pour tous vos voyages similaires !
            </p>
            <button className={btnRose}>En savoir plus</button>
          </div>
        </div>
      </main>

      {/* Modales (fonctionnel) */}
      {/* Modales (fonctionnel) */}
<TripModal open={modal === "trip"} onClose={closeModal} onCreated={handleTripCreated} />
<BagModal  open={modal === "bag"}  onClose={closeModal} />
<AIModal   open={modal === "ai"}   onClose={closeModal} packages={packagesList} loading={loadingPackages} />


      <Footer />
    </div>
  );
}
