import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/utils/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const size = searchParams.get("size");
    const colorName = searchParams.get("colorName");

    if (productId && size && colorName) {
      // Find or create default stock level for this item in the inventory database
      let inv = await prisma.inventory.findUnique({
        where: {
          productId_size_colorName: { productId, size, colorName }
        }
      });

      if (!inv) {
        inv = await prisma.inventory.create({
          data: {
            productId,
            size,
            colorName,
            stock: 3 // Default stock level is 3
          }
        });
      }

      return NextResponse.json(inv);
    }

    // Get all inventory levels
    const allInventory = await prisma.inventory.findMany();
    return NextResponse.json(allInventory);
  } catch (error) {
    console.error("GET_INVENTORY_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Require admin authentication
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@inkandcottonclub.com";
    if (!session?.user?.email || session.user.email !== adminEmail) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { productId, size, colorName, stock } = body;

    if (!productId || !size || !colorName || stock === undefined) {
      return new NextResponse("Missing Fields", { status: 400 });
    }

    const inv = await prisma.inventory.upsert({
      where: {
        productId_size_colorName: { productId, size, colorName }
      },
      update: { stock: Number(stock) },
      create: {
        productId,
        size,
        colorName,
        stock: Number(stock)
      }
    });

    return NextResponse.json(inv);
  } catch (error) {
    console.error("POST_INVENTORY_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
