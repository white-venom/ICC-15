import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;

    const savedItems = await prisma.savedItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(savedItems);
  } catch (error) {
    console.error("GET_SAVED_ITEMS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return new NextResponse("Product ID required", { status: 400 });
    }

    const userId = (session.user as any).id;

    // Check if already saved
    const existing = await prisma.savedItem.findFirst({
      where: { userId, productId }
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const savedItem = await prisma.savedItem.create({
      data: {
        userId,
        productId
      }
    });

    return NextResponse.json(savedItem);
  } catch (error) {
    console.error("SAVE_ITEM_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return new NextResponse("Product ID required", { status: 400 });
    }

    const userId = (session.user as any).id;

    await prisma.savedItem.deleteMany({
      where: { userId, productId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE_SAVED_ITEM_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
