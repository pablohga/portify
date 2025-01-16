import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import { Hero } from "@/models/hero";
import { authOptions } from "@/lib/auth-options";
import cloudinary from "cloudinary";

// Configuração do Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    await dbConnect();
    const hero = await Hero.findOne(userId ? { userId } : {}).sort({ createdAt: -1 });
    return NextResponse.json(hero || {});
  } catch (error) {
    console.error("Erro ao buscar dados do Hero:", error);
    return NextResponse.json({ error: "Failed to fetch hero data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();

    // Verifique se há um Hero existente para o usuário atual
    const existingHero = await Hero.findOne({ userId: session.user.id });

    // Excluir a imagem antiga do Cloudinary se ela existir
    if (existingHero?.backgroundImageId) {
      
      try {
        await cloudinary.v2.uploader.destroy(existingHero.backgroundImageId);
        console.log("Imagem antiga removida do Cloudinary:", existingHero.backgroundImageId);
      } catch (error) {
        console.error("Erro ao excluir imagem antiga do Cloudinary:", error);
      }
    }

    // Delete os dados anteriores do Hero para este usuário
    await Hero.deleteMany({ userId: session.user.id });

    // Certifique-se de que backgroundImageId está presente nos dados enviados
    const { backgroundImage, backgroundImageId, ...otherData } = data;
    console.log('backgroundImageId', backgroundImageId)
    if (!backgroundImage || !backgroundImageId) {
      return NextResponse.json(
        { error: "Missing background image data" },
        { status: 400 }
      );
    }

    // Crie os novos dados do Hero
    const hero = await Hero.create({
      ...otherData,
      backgroundImage,
      backgroundImageId,
      userId: session.user.id,
    });
    console.log('existingHero.backgroundImageId::', existingHero.backgroundImageId)
    console.log('existingHero::', existingHero)

    console.log("Hero criado com sucesso:", hero);
    return NextResponse.json(hero);
  } catch (error) {
    console.error("Erro no POST do Hero:", error);
    return NextResponse.json({ error: "Failed to update hero data" }, { status: 500 });
  }
}
