// src/components/footer.tsx
export default function Footer() {
  return (
    <footer className="site-footer bg-ui-base border-t border-ui-border">
      <div className="site-footer__in">
        <div className="site-footer__grid">
          {/* colonne 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold" style={{ color: "var(--rose)" }}>PackSmart</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">Application Next.js avec React et Prisma.</p>
            <p className="text-gray-400 text-sm">Architecture modulaire et dynamique.</p>
          </div>

          {/* colonne 2 */}
          <div>
            <h4 className="font-bold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white text-sm">Accueil</a></li>
              <li><a href="/dashboard" className="text-gray-400 hover:text-white text-sm">Dashboard</a></li>
              <li><a href="/actualite" className="text-gray-400 hover:text-white text-sm">Actualité</a></li>
            </ul>
          </div>

          {/* colonne 3 */}
          <div>
            <ul>
            <li><p className="font-bold mb-4">Contactez nous</p></li>
            <li><p className="text-gray-500 text-sm">packsmart.info@outlook.fr</p></li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bot">
          <p className="text-gray-500 text-sm">© 2025 Nina App. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
