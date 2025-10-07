// src/app/api/packages/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/packages/:id
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      return NextResponse.json({ error: "id invalide" }, { status: 400 });
    }

    const body = await request.json();
    const { description } = body ?? {};

    const updated = await prisma.package.update({
      where: { id: numericId },
      data: { description: description ?? null },
      select: { id: true, name: true, description: true, updatedAt: true },
    });

    return NextResponse.json({ package: updated }, { status: 200 });
  } catch (e) {
    console.error("PATCH /api/packages/:id error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/packages/:id
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (!Number.isFinite(numericId)) {
      return NextResponse.json({ error: "id invalide" }, { status: 400 });
    }

    // Si tu as des items liés et pas de cascade, tu peux activer :
    // await prisma.packageItem.deleteMany({ where: { packageId: numericId } });

    await prisma.package.delete({ where: { id: numericId } });

    return new Response(null, { status: 204 });
  } catch (e: any) {
    console.error("DELETE /api/packages/:id error:", e);
    const status = e?.code === "P2025" ? 404 : 500;
    return NextResponse.json({ error: e?.code || "Erreur serveur" }, { status });
  }
}
