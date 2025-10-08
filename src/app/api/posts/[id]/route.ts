import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Vérifier que l'ID est fourni et est numérique
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ ok: false, error: "ID invalide" }, { status: 400 });
    }

    // Supprimer le post
    const deletedPost = await prisma.post.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ ok: true, deletedPost });
  } catch (error: any) {
    console.error('Erreur suppression post:', error);
    
    // Si le post n'existe pas
    if (error.code === 'P2025') {
      return NextResponse.json({ ok: false, error: "Post non trouvé" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}