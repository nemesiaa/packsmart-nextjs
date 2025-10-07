// src/app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TripModal from "@/components/modals/tripmodal";
import BagModal from "@/components/modals/bagmodal";
import ChecklistModal from "@/components/modals/checklistmodal";

// Sections découpées (fichiers en minuscules, exports en PascalCase)
import BagsSection from "@/app/dashboard/bagSection";
import TripsSection from "@/app/dashboard/tripSection";
import ChecklistSection from "@/app/dashboard/checklistSection";

type ModalType = "trip" | "bag" | "checklist" | null;

export default function Dashboard() {
  const router = useRouter();

  // State principal
  const [user, setUser] = useState<any>(null);
  const [modal, setModal] = useState<ModalType>(null);

  // Données
  const [trips, setTrips] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [packagesList, setPackagesList] = useState<any[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  // KPI
  const [stats, setStats] = useState({ totalTrips: 0, totalPackages: 0, completedChecklists: 0 });

  // Ancres pour scroller depuis les KPI
  const tripsRef = useRef<HTMLDivElement | null>(null);
  const bagsRef = useRef<HTMLDivElement | null>(null);
  const checksRef = useRef<HTMLDivElement | null>(null);

  const btnRose = useMemo(
    () =>
      "w-full rounded-xl border border-rose text-rose bg-ui-base py-3 px-6 font-semibold transition-all " +
      "hover:bg-rose/10 hover:shadow-[0_8px_30px_rgba(244,114,182,0.18)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-rose/40",
    []
  );

  // Init (user + local)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(userData);
    setUser(u);
    setTrips(JSON.parse(localStorage.getItem("trips") || "[]") || []);
    setChecklists(JSON.parse(localStorage.getItem("checklists") || "[]") || []);
  }, [router]);

  // Fetch sacs
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoadingPackages(true);
        const res = await fetch(`/api/packages?userId=${user.id}`, { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setPackagesList(Array.isArray(data.packages) ? data.packages : []);
      } catch {
        if (!cancelled) setPackagesList([]);
      } finally {
        if (!cancelled) setLoadingPackages(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Refetch auto après création / MAJ d’un sac (événements issus de BagModal)
  useEffect(() => {
    const refetch = async (userId?: number) => {
      if (!userId) return;
      try {
        setLoadingPackages(true);
        const res = await fetch(`/api/packages?userId=${userId}`, { cache: "no-store" });
        const data = await res.json();
        setPackagesList(Array.isArray(data.packages) ? data.packages : []);
      } finally {
        setLoadingPackages(false);
      }
    };
    const onCreated = () => refetch(user?.id);
    const onUpdated = () => refetch(user?.id);
    window.addEventListener("packsmart:bag:created", onCreated);
    window.addEventListener("packsmart:bag:updated", onUpdated);
    return () => {
      window.removeEventListener("packsmart:bag:created", onCreated);
      window.removeEventListener("packsmart:bag:updated", onUpdated);
    };
  }, [user?.id]);

  // KPI dynamiques
  useEffect(() => {
    setStats({
      totalTrips: trips.length,
      totalPackages: packagesList.length,
      completedChecklists: checklists.filter((c: any) => c?.done).length,
    });
  }, [trips, packagesList, checklists]);

  // Modales
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

  // Actions
  const goToTrips = () => tripsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const goToBags = () => bagsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const goToChecks = () => checksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const handleTripCreated = () => {
    const list = JSON.parse(localStorage.getItem("trips") || "[]");
    setTrips(Array.isArray(list) ? list : []);
  };
  const handleChecklistCreate = (payload: { title: string; prefill?: boolean }) => {
  const newChecklist = { id: Date.now(), name: (payload.title || "Nouvelle checklist").trim(), done: false };
  const next = [newChecklist, ...checklists];
  setChecklists(next);
  localStorage.setItem("checklists", JSON.stringify(next));
};

  // [ADD] SUPPRESSION — voyages (localStorage)
  const handleDeleteTrip = (id: number) => {
    if (!confirm("Supprimer ce voyage ?")) return;
    const next = trips.filter((t: any) => t.id !== id);
    setTrips(next);
    localStorage.setItem("trips", JSON.stringify(next));
  };

  // [ADD] SUPPRESSION — checklists (localStorage)
  const handleDeleteChecklist = (id: number) => {
    if (!confirm("Supprimer cette checklist ?")) return;
    const next = checklists.filter((c: any) => c.id !== id);
    setChecklists(next);
    localStorage.setItem("checklists", JSON.stringify(next));
  };

  // [ADD] SUPPRESSION — sacs (API + state)
  const handleDeleteBag = async (id: number) => {
    if (!confirm("Supprimer ce sac ?")) return;
    try {
      const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("DELETE failed");
      setPackagesList((prev) => prev.filter((b: any) => b.id !== id));
    } catch {
      alert("Suppression impossible pour le moment.");
    }
  };

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
      <div className="dash__bg" aria-hidden />
      <Header />

      <main className="px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-7xl">
          {/* Titre */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-rose">Bienvenue, {user.name || user.email} ! 👋</h1>
            <p className="text-textSoft/70 text-lg">Gérez vos voyages et préparez vos bagages intelligemment</p>
          </div>

          {/* KPI cliquables */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <button onClick={goToTrips} className="kpi kpi--lilac p-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi__label">Total Voyages</p>
                  <p className="kpi__num">{stats.totalTrips}</p>
                </div>
                <div className="text-4xl opacity-90">✈️</div>
              </div>
            </button>

            <button onClick={goToBags} className="kpi kpi--orchid p-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi__label">Mes Sacs</p>
                  <p className="kpi__num">{stats.totalPackages}</p>
                </div>
                <div className="text-4xl opacity-90">🧳</div>
              </div>
            </button>

            <button onClick={goToChecks} className="kpi kpi--plum p-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <p className="kpi__label">Checklists</p>
                  <p className="kpi__num">{stats.completedChecklists}</p>
                </div>
                <div className="text-4xl opacity-90">📋</div>
              </div>
            </button>
          </div>

          {/* Cartes d’action */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-ui-surface border border-ui-border p-8 rounded-2xl transition-all hover:-translate-y-0.5 hover:border-rose hover:shadow-xl hover:shadow-rose/20 hover:bg-[#b48ead26] group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">✈️</div>
              <h3 className="text-2xl font-bold mb-4 text-textSoft">Nouveau Voyage</h3>
              <p className="text-textSoft/70 mb-6 leading-relaxed">Planifiez votre prochaine aventure et générez automatiquement vos listes de bagages</p>
              <button className={btnRose} onClick={() => openModal("trip")}>Créer un voyage</button>
            </div>

            <div className="bg-ui-surface border border-ui-border p-8 rounded-2xl transition-all hover:-translate-y-0.5 hover:border-rose hover:shadow-xl hover:shadow-rose/20 hover:bg-[#b48ead26] group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🧳</div>
              <h3 className="text-2xl font-bold mb-4 text-textSoft">Mes Sacs</h3>
              <p className="text-textSoft/70 mb-6 leading-relaxed">Organisez et personnalisez vos différents types de bagages selon vos besoins</p>
              <button className={btnRose} onClick={() => openModal("bag")}>Créer un sac</button>
            </div>

            <div className="bg-ui-surface border border-ui-border p-8 rounded-2xl transition-all hover:-translate-y-0.5 hover:border-rose hover:shadow-xl hover:shadow-rose/20 hover:bg-[#b48ead26] group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="text-2xl font-bold mb-4 text-textSoft">Mes Checklists</h3>
              <p className="text-textSoft/70 mb-6 leading-relaxed">Créez et gérez vos listes pour chaque voyage</p>
              <button className={btnRose} onClick={() => openModal("checklist")}>Créer une checklist</button>
            </div>

          </div>

          {/* Sections découpées */}
          <TripsSection
            sectionRef={tripsRef}
            trips={trips}
            onOpenCreate={() => openModal("trip")}
            onDeleteTrip={handleDeleteTrip}        // [ADD]
          />

          <BagsSection
            sectionRef={bagsRef}
            loading={loadingPackages}
            bags={packagesList}
            onOpenCreate={() => openModal("bag")}
            onDeleteBag={handleDeleteBag}          // [ADD]
          />

          <ChecklistSection
            sectionRef={checksRef}
            checklists={checklists}
            onAdd={() => {
              const next = [...checklists, { id: Date.now(), name: "Nouvelle checklist", done: false }];
              setChecklists(next);
              localStorage.setItem("checklists", JSON.stringify(next));
            }}
            onToggle={(id) => {
              const next = checklists.map((x) => (x.id === id ? { ...x, done: !x.done } : x));
              setChecklists(next);
              localStorage.setItem("checklists", JSON.stringify(next));
            }}
            onDeleteChecklist={handleDeleteChecklist} // [ADD]
          />

          {/* Astuce */}
          <div className="bg-gradient-to-r from-ui-surface to-ui-base border border-ui-border p-8 rounded-2xl">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">💡</div>
              <h2 className="text-xl font-bold text-textSoft">Astuce du jour</h2>
            </div>
            <p className="text-textSoft/80 mb-4">
              Saviez-vous que vous pouvez sauvegarder vos listes de bagages comme modèles réutilisables ?
            </p>
            <button className={btnRose}>En savoir plus</button>
          </div>
        </div>
      </main>

      {/* Modales */}
      <TripModal open={modal === "trip"} onClose={closeModal} onCreated={handleTripCreated} />
      <BagModal open={modal === "bag"} onClose={closeModal} />
      <ChecklistModal open={modal === "checklist"} onClose={closeModal} onCreate={handleChecklistCreate} />
      <Footer />
    </div>
  );
}
