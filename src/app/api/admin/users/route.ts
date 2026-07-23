import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/utils/prisma";
import { assignMembershipCard } from "@/utils/cardAssigner";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@inkandcottonclub.com";
    if (!session || !session.user || session.user.email !== adminEmail) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const users = await (prisma.user.findMany as any)({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        tier: true,
        cardNumber: true,
        createdAt: true,
        _count: {
          select: {
            order: true,
            saveditem: true
          }
        }
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("ADMIN_GET_USERS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@inkandcottonclub.com";
    if (!session || !session.user || session.user.email !== adminEmail) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await request.json();
    const { id, tier } = body;

    if (!id || !tier) {
      return new NextResponse("ID and Tier required", { status: 400 });
    }

    const updatedUser = await assignMembershipCard(id, tier);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("ADMIN_UPDATE_USER_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@inkandcottonclub.com";
    if (!session || !session.user || session.user.email !== adminEmail) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("User ID required", { status: 400 });
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_DELETE_USER_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
