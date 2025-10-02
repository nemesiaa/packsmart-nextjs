"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";   // sinon "../../components/header"
import Footer from "@/components/footer";   // sinon "../../components/footer"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalPackages: 0,
    completedChecklists: 0,
  });
  const router = useRouter();

  // Redirige si pas connecté + charge des stats de démo (comme avant)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Données de démo
    setStats({
      totalTrips: 3,
      totalPackages: 5,
      completedChecklists: 8,
    });
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎒</div>
          <div className="text-white text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header du dashboard */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-yellow-400">
              Bienvenue, {user.name || user.email} ! 👋
            </h1>
            <p className="text-gray-400 text-lg">
              Gérez vos voyages et préparez vos bagages intelligemment
            </p>
          </div>

          {/* Statistiques (3 cartes en gradient) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Voyages</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.totalTrips}
                  </p>
                </div>
                <div className="text-4xl opacity-80">✈️</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Mes Sacs</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.totalPackages}
                  </p>
                </div>
                <div className="text-4xl opacity-80">🧳</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Checklists</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.completedChecklists}
                  </p>
                </div>
                <div className="text-4xl opacity-80">📋</div>
              </div>
            </div>
          </div>

          {/* Actions principales (3 grosses cartes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                ✈️
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                Nouveau Voyage
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Planifiez votre prochaine aventure et générez automatiquement
                vos listes de bagages
              </p>
              <button className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                Créer un voyage
              </button>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                🧳
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Mes Sacs</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Organisez et personnalisez vos différents types de bagages selon
                vos besoins
              </p>
              <button className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                Gérer les sacs
              </button>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20 group">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">
                IA Assistant
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Générez des suggestions personnalisées basées sur la météo et
                votre destination
              </p>
              <button className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                Demander conseil
              </button>
            </div>
          </div>

          {/* Voyages récents */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Mes Voyages Récents
              </h2>
              <button className="text-yellow-400 hover:text-yellow-500 transition-colors">
                Voir tout →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Vacances d'été 2024
                    </h3>
                    <p className="text-gray-400">Barcelone, Espagne</p>
                  </div>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Terminé
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    <span>15-22 Juillet • 2 sacs</span>
                  </div>
                  <button className="text-yellow-400 hover:text-yellow-500">
                    Voir détails
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Weekend à Paris
                    </h3>
                    <p className="text-gray-400">Paris, France</p>
                  </div>
                  <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                    En cours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    <span>1-3 Oct • 1 sac</span>
                  </div>
                  <button className="text-yellow-400 hover:text-yellow-500">
                    Continuer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Astuce du jour */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 p-8 rounded-xl">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">💡</div>
              <h2 className="text-xl font-bold text-white">Astuce du jour</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Saviez-vous que vous pouvez sauvegarder vos listes de bagages
              comme modèles réutilisables ? Créez une fois, utilisez pour tous
              vos voyages similaires !
            </p>
            <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
              En savoir plus
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
