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

// DELETE /api/packages/:id
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "id invalide" }, { status: 400 });
  }

  try {
    // Si tu as des éléments liés (ex: PackageItem) et pas de cascade en DB,
    // dé-commente cette ligne pour éviter l'erreur de contrainte FK (P2003).
    // await prisma.packageItem.deleteMany({ where: { packageId: id } });

    await prisma.package.delete({ where: { id } });

    // No Content
    return new NextResponse(null, { status: 204 });
  } catch (e: any) {
    console.error("DELETE /api/packages/:id error:", e);
    // P2025 = record not found ; sinon 500
    const status = e?.code === "P2025" ? 404 : 500;
    return NextResponse.json({ error: e?.code || "Erreur serveur" }, { status });
  }
}
