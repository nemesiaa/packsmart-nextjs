import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/packages/:id
// Body attendu (exemples):
//   { description: "T-shirt (0.2kg)\nChargeur (0.1kg)\n..." }
//   { description: null }   // pour vider la description
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "id invalide" }, { status: 400 });
    }

    const body = await request.json();
    const { description } = body ?? {};

    const updated = await prisma.package.update({
      where: { id },
      data: { description: description ?? null },
      select: { id: true, name: true, description: true, updatedAt: true },
    });

    return NextResponse.json({ package: updated }, { status: 200 });
  } catch (e) {
    console.error("PATCH /api/packages/:id error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}