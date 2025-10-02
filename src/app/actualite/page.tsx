// src/app/actualite/page.tsx
import Header from "@/components/header";
import Footer from "@/components/footer";

const ROSE = "#B48EAD";

export default function Actualite() {
  return (
    <div className="min-h-screen bg-[#2A2D34] text-[#F5F5F7]">
      <Header />
      <main className="max-w-5xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold mb-4" style={{ color: ROSE }}>Actualité</h1>
        <p className="text-gray-300">Ici tu pourras afficher les news / changelogs de PackSmart.</p>
      </main>
      <Footer />
    </div>
  );
}
