import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
