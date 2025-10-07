import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nom, email et mot de passe requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Un compte avec cet email existe déjà" }, { status: 409 });
    }

    // Créer l'utilisateur (mot de passe en clair pour le moment, comme dans login)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Note: en production, il faudrait hasher le mot de passe
      },
    });

    // Debug minimal
    console.log("🆕 register:", { email, name, ok: !!user });

    // Retourner l'utilisateur sans le mot de passe
    const { password: _omit, ...userWithoutPassword } = user;
    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Erreur register:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
