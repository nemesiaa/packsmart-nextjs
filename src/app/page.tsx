// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";   // ou ../components/header si tu n'utilises pas l'alias @
import Footer from "@/components/footer";

/**
 * Important :
 * - Image placée à /public/img/mountains.jpg
 * - Référence : src="/img/mountains.jpg" (jamais /public/…)
 * - Page serveur : aucun event handler React ici.
 */
export default function Home() {
  const features = [
    {
      icon: "📋",
      title: "Checklist intelligente",
      text:
        "Générez automatiquement la liste idéale pour votre sac selon la destination, la saison et le type de voyage.",
    },
    {
      icon: "🧳",
      title: "Gestion de voyages",
      text:
        "Créez, modifiez et sauvegardez vos voyages et sacs personnalisés pour chaque aventure.",
    },
    {
      icon: "⚖️",
      title: "Calcul du poids & alertes",
      text:
        "Suivez le poids total et recevez des alertes en cas de dépassement du poids autorisé.",
    },
    {
      icon: "🌤️",
      title: "Suggestions IA & météo",
      text:
        "Adaptez votre checklist à la météo en temps réel grâce à l’IA.",
    },
  ];

  return (
    <div className="page">
      <Header />

      {/* ============== HERO ============== */}
      <section className="hero">
        {/* Image + overlays (z-0) */}
        <div className="hero__bg" aria-hidden>
          <Image
            src="/img/mountains.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero__img"
          />
          <div className="hero__shade" />
          <div className="hero__tint" />
          <div className="hero__vignette" />
        </div>

        {/* Contenu au-dessus (z-10) */}
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title text-rose">
              Préparez votre prochaine
              <br />
              aventure en toute sérénité
            </h1>

            <p className="hero__lead">
              PackSmart vous accompagne pour faire vos bagages intelligemment,
              en générant des listes personnalisées selon votre destination,
              votre style de voyage et vos préférences personnelles.
            </p>

            <Link href="/dashboard" className="btn-rose">
              Commencer
            </Link>
          </div>
        </div>
      </section>

      {/* ======= FONCTIONNALITÉS ======= */}
      <section className="section-dark">
        <div className="container">
          <h2 className="section-title text-rose">Fonctionnalités principales</h2>

          <div className="cards-grid">
            {features.map((f, i) => (
              <div key={i} className="card card--rose">
                <div className="card__icon icon-rose-bright">{f.icon}</div>
                <h3 className="card__title text-rose">{f.title}</h3>
                <p className="card__text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
