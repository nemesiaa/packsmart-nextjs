import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Vérifier que les champs sont fournis
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Chercher l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("🔍 Debug login:");
    console.log("Email reçu:", email);
    console.log("Password reçu:", password);
    console.log("User trouvé:", user);
    console.log("Password en DB:", user?.password);

    // Vérifier si l'utilisateur existe et si le mot de passe correspond
    if (!user || user.password !== password) {
      console.log("❌ Connexion échouée");
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    console.log("✅ Connexion réussie");

    // Connexion réussie - retourner les infos utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erreur login:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
