"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header du dashboard */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Bienvenue, {user.name || user.email} ! 🎒
              </h1>
              <p className="text-gray-400">
                Gérez vos voyages et préparez vos bagages intelligemment
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Se déconnecter
            </button>
          </div>

          {/* Cards du dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card Mes Voyages */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl mb-4">✈️</div>
              <h3 className="text-xl font-bold mb-2">Mes Voyages</h3>
              <p className="text-gray-400 mb-4">Créez et gérez vos voyages</p>
              <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors">
                Nouveau voyage
              </button>
            </div>

            {/* Card Mes Sacs */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl mb-4">🧳</div>
              <h3 className="text-xl font-bold mb-2">Mes Sacs</h3>
              <p className="text-gray-400 mb-4">Organisez vos bagages</p>
              <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors">
                Nouveau sac
              </button>
            </div>

            {/* Card Checklists */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">Checklists</h3>
              <p className="text-gray-400 mb-4">Générez vos listes</p>
              <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors">
                Nouvelle checklist
              </button>
            </div>
          </div>

          {/* Section récente */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Activité récente</h2>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-400 text-center py-8">
                Aucune activité récente. Commencez par créer votre premier
                voyage !
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
