import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-yellow-400 text-gray-900 px-8 py-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Préparez votre prochaine
              <br />
              aventure en toute sérénité
            </h1>
            <p className="text-lg mb-8 leading-relaxed">
              PackSmart vous accompagne pour faire vos bagages intelligemment,
              en générant des listes personnalisées selon votre destination,
              votre style de voyage et vos préférences personnelles.
            </p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Commencer
            </button>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="text-9xl">🎒</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Fonctionnalités principales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-gray-800 border border-gray-700 rounded-xl hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20">
              <div className="text-5xl text-yellow-400 mb-6">📋</div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Checklist intelligente
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Générez automatiquement la liste idéale pour votre sac selon la
                destination, la saison et le type de voyage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 bg-gray-800 border border-gray-700 rounded-xl hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20">
              <div className="text-5xl text-yellow-400 mb-6">🧳</div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Gestion de voyages
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Créez, modifiez et sauvegardez vos voyages et sacs personnalisés
                pour chaque aventure.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 bg-gray-800 border border-gray-700 rounded-xl hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20">
              <div className="text-5xl text-yellow-400 mb-6">⚖️</div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Calcul du poids & alertes
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Suivez le poids total de votre sac et recevez des alertes en cas
                de dépassement du poids maximal autorisé.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-8 bg-gray-800 border border-gray-700 rounded-xl hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/20">
              <div className="text-5xl text-yellow-400 mb-6">🌤️</div>
              <h3 className="text-xl font-bold mb-4 text-white">
                Suggestions IA & météo
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                Profitez de conseils personnalisés grâce à l'IA et adaptez votre
                checklist à la météo en temps réel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎒</span>
              <span className="text-xl font-bold text-yellow-400">
                PackSmart
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2">
              Application Node.js avec TypeScript, Express et Prisma.
            </p>
            <p className="text-gray-400 text-sm">
              Architecture MVC moderne et performante.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links - Section supprimée comme demandé */}
          <div>
            <p className="text-gray-500 text-sm">Fait avec TypeScript</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Nina App. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
