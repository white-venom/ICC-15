import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { assignMembershipCard } from "@/utils/cardAssigner";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
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
            orders: true,
            savedItems: true
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
