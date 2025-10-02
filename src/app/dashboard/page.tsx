// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

/**
 * Cheminement important : si pas de session dans localStorage -> redirection /login
 */
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ totalTrips: 0, totalPackages: 0, completedChecklists: 0 });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    setStats({ totalTrips: 3, totalPackages: 5, completedChecklists: 8 }); // démo
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-yellow-400">Bienvenue, {user.name || user.email} ! 👋</h1>
            <p className="text-gray-400 text-lg">Gérez vos voyages et préparez vos bagages intelligemment</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div><p className="text-blue-200 text-sm">Total Voyages</p><p className="text-3xl font-bold">{stats.totalTrips}</p></div>
                <div className="text-4xl opacity-80">✈️</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div><p className="text-green-200 text-sm">Mes Sacs</p><p className="text-3xl font-bold">{stats.totalPackages}</p></div>
                <div className="text-4xl opacity-80">🧳</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div><p className="text-purple-200 text-sm">Checklists</p><p className="text-3xl font-bold">{stats.completedChecklists}</p></div>
                <div className="text-4xl opacity-80">📋</div>
              </div>
            </div>
          </div>

          {/* …tes cartes/actions existantes ici (inchangées) */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
