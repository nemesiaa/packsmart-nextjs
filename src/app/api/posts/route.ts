// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ ok: true, posts });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, userName, userAvatar, imageData, description } = body || {};

    if (!userEmail || !imageData) {
      return NextResponse.json({ ok: false, error: "Champs requis manquants." }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        userEmail,
        userName: userName || null,
        userAvatar: userAvatar || null,
        imageData,
        description: description || null,
      },
    });

    return NextResponse.json({ ok: true, post });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
