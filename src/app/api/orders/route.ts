import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/utils/prisma";
import { assignMembershipCard } from "@/utils/cardAssigner";
import { sendOrderEmails } from "@/utils/mailer";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const trackingNumber = searchParams.get("trackingNumber");

    if (id) {
      const order = await prisma.order.findUnique({
        where: { id }
      });
      if (!order) return new NextResponse("Order not found", { status: 404 });
      return NextResponse.json(order);
    }

    if (trackingNumber) {
      const order = await prisma.order.findFirst({
        where: { trackingNumber }
      });
      if (!order) return new NextResponse("Order not found", { status: 404 });
      return NextResponse.json(order);
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET_ORDERS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

    const body = await request.json();
    const {
      items,
      totalPrice,
      shippingAddress,
      pincode,
      paymentMethod,
      contactEmail,
      contactPhone,
      customerName,
      address,
      apartment,
      city,
      state,
      country
    } = body;

    if (!items || !totalPrice) {
      return new NextResponse("Missing order details", { status: 400 });
    }

    const parsedItems = typeof items === "string" ? JSON.parse(items) : items;

    // 1. Verify stock is still available in the separate inventory database
    for (const item of parsedItems) {
      const [productId, size] = item.id.split('-');
      const colorName = item.colorName;

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
            stock: 3 // Default stock level
          }
        });
      }

      if (inv.stock < item.quantity) {
        return new NextResponse(`Out of stock: "${item.name}" (Size ${size}) is sold out!`, { status: 400 });
      }
    }

    // 2. Generate tracking number
    const trackingNumber = "ICC-" + Math.floor(100000 + Math.random() * 900000);

    const orderData: any = {
      items: typeof items === "string" ? items : JSON.stringify(items),
      totalPrice: parseFloat(totalPrice),
      trackingNumber,
      status: "Processing",
      shippingAddress,
      pincode,
      paymentMethod,
      contactEmail,
      contactPhone,
      customerName
    };

    if (userId) {
      orderData.userId = userId;
    }

    const order = await prisma.order.create({
      data: orderData
    });

    if (userId) {
      // 1. Save/sync address to user's profile database entry
      await prisma.user.update({
        where: { id: userId },
        data: {
          phone: contactPhone,
          address,
          apartment,
          city,
          state,
          pincode,
          country,
          name: customerName
        }
      });

      // 2. Update user's membership tier and assign card numbers dynamically based on purchase rules
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, tier: true, cardNumber: true }
      });

      let targetTier = currentUser?.tier || "None";

      // One-time purchase of more than 40000 -> Gold Card
      if (parseFloat(totalPrice) > 40000) {
        targetTier = "Gold";
      } else if (targetTier !== "Gold") {
        targetTier = "Silver";
      }

      let finalUser = currentUser;
      if (targetTier !== "None") {
        try {
          const updated = await assignMembershipCard(userId, targetTier);
          finalUser = {
            id: updated.id,
            tier: updated.tier,
            cardNumber: updated.cardNumber || null
          };
        } catch (assignError) {
          console.error("DYNAMIC_CARD_ASSIGNMENT_ERROR", assignError);
          // Fallback: update tier directly if card pool is exhausted
          const updated = await prisma.user.update({
            where: { id: userId },
            data: { tier: targetTier }
          });
          finalUser = {
            id: updated.id,
            tier: updated.tier,
            cardNumber: updated.cardNumber || null
          };
        }
      }

      // 3. Calculate points earned from this purchase and reward buyer + referrer
      const pointsMultiplier = targetTier === "Gold" ? 0.10 : targetTier === "Silver" ? 0.05 : 0.02;
      const earnedPoints = Math.round(parseFloat(totalPrice) * pointsMultiplier);

      if (earnedPoints > 0) {
        // Fetch referredById
        const userDetails = await prisma.user.findUnique({
          where: { id: userId },
          select: { referredById: true }
        });

        let buyerPoints = earnedPoints;
        let referrerShare = 0;

        // If this user was referred by someone, deduct 20% points from buyer and send to referrer
        if (userDetails?.referredById) {
          referrerShare = Math.round(earnedPoints * 0.20);
          buyerPoints = earnedPoints - referrerShare;
        }

        // Award points to the buyer
        await prisma.user.update({
          where: { id: userId },
          data: {
            points: {
              increment: buyerPoints
            }
          }
        });

        // Award the shared points to the referrer
        if (referrerShare > 0 && userDetails?.referredById) {
          await prisma.user.update({
            where: { id: userDetails.referredById },
            data: {
              points: {
                increment: referrerShare
              }
            }
          });
        }
      }

      // Dispatch user invoice and admin notification emails
      try {
        await sendOrderEmails(order, finalUser);
      } catch (mailError) {
        console.error("ORDER_MAIL_DISPATCH_ERROR", mailError);
      }
    } else {
      // Guest checkout email dispatch
      try {
        await sendOrderEmails(order, null);
      } catch (mailError) {
        console.error("GUEST_ORDER_MAIL_DISPATCH_ERROR", mailError);
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("CREATE_ORDER_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
