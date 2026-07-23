import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/utils/prisma";
import CARDS from "@/utils/cards.json";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || "info@inkandcottonclub.com";
    if (!session || !session.user || session.user.email !== adminEmail) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Get all users who have a card number
    const assignedUsers = await prisma.user.findMany({
      where: { cardNumber: { not: null } },
      select: {
        id: true,
        name: true,
        email: true,
        tier: true,
        cardNumber: true
      }
    });

    const totalCards = CARDS.length;
    const assignedCount = assignedUsers.length;
    const leftCount = totalCards - assignedCount;

    // Create a detailed list of all cards and who they are assigned to
    const detailedCards = CARDS.map(card => {
      const assignedUser = assignedUsers.find(u => u.cardNumber === card.cardNumber);
      return {
        cardNumber: card.cardNumber,
        tier: card.tier,
        pin: card.pin,
        validThru: card.validThru,
        status: assignedUser ? "Assigned" : "Available",
        assignedTo: assignedUser ? {
          id: assignedUser.id,
          name: assignedUser.name,
          email: assignedUser.email,
          tier: assignedUser.tier
        } : null
      };
    });

    return NextResponse.json({
      summary: {
        total: totalCards,
        assigned: assignedCount,
        left: leftCount
      },
      cards: detailedCards
    });
  } catch (error) {
    console.error("ADMIN_GET_CARDS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
