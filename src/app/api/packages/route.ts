import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, description } = body ?? {};

    if (!userId || !name) {
      return NextResponse.json(
        { error: "userId et name requis" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.create({
      data: {
        userId: Number(userId),
        name: String(name),
        // description optionnelle (ex: liste d'objets en texte libre)
        description: description ?? null,
      },
      select: { id: true, name: true, description: true, updatedAt: true },
    });

    return NextResponse.json({ package: pkg }, { status: 201 });
  } catch (e) {
    console.error("POST /api/packages error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId") || NaN);
    if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 });

    const packages = await prisma.package.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, weight: true, description: true, updatedAt: true },
    });

    return NextResponse.json({ packages });
  } catch (e) {
    console.error("GET /api/packages error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
