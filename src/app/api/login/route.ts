// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Debug minimal (tu peux commenter ces lignes en prod)
    console.log("🔍 login:", { email, ok: !!user });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const { password: _omit, ...userWithoutPassword } = user;
    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.error("Erreur login:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
