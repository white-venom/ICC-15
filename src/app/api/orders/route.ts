import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/utils/prisma";
import { assignMembershipCard } from "@/utils/cardAssigner";
import { sendOrderEmails } from "@/utils/mailer";

// Memory lock for active order placements
const activeLocks = new Set<string>();

// Memory cache for completed order idempotency keys
const completedIdempotencyKeys = new Map<string, { order: any; timestamp: number }>();

// Clean up keys older than 15 minutes
function cleanupIdempotencyKeys() {
  const now = Date.now();
  for (const [key, value] of completedIdempotencyKeys.entries()) {
    if (now - value.timestamp > 15 * 60 * 1000) {
      completedIdempotencyKeys.delete(key);
    }
  }
}

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
  let lockKey = "";
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

    const body = await request.json();
    const {
      idempotencyKey,
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

    // 1. Idempotency Check using client-provided idempotencyKey
    if (idempotencyKey) {
      lockKey = idempotencyKey;
      cleanupIdempotencyKeys();

      // Check if already completed
      const cached = completedIdempotencyKeys.get(idempotencyKey);
      if (cached) {
        return NextResponse.json(cached.order);
      }

      // Check concurrent lock
      if (activeLocks.has(idempotencyKey)) {
        return new NextResponse("Order is already being processed. Please wait.", { status: 409 });
      }
      activeLocks.add(idempotencyKey);
    }

    // 2. Database Idempotency Check using Razorpay payment reference if present
    let paymentRef = "";
    if (paymentMethod) {
      const match = paymentMethod.match(/(?:Ref:\s*)(pay_[A-Za-z0-9_]+|order_[A-Za-z0-9_]+|pay_sim_[A-Za-z0-9_]+)/);
      if (match) {
        paymentRef = match[1];
      }
    }

    if (paymentRef) {
      const existingOrder = await prisma.order.findFirst({
        where: {
          paymentMethod: {
            contains: paymentRef
          }
        }
      });
      if (existingOrder) {
        if (idempotencyKey) {
          completedIdempotencyKeys.set(idempotencyKey, {
            order: existingOrder,
            timestamp: Date.now()
          });
        }
        return NextResponse.json(existingOrder);
      }
    }

    const parsedItems = typeof items === "string" ? JSON.parse(items) : items;

    // 3. Verify stock is still available and deduct it atomically
    const decrementedItems: { productId: string; size: string; colorName: string; quantity: number }[] = [];
    try {
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
          // Rollback any decrements made in this request so far
          for (const dec of decrementedItems) {
            await prisma.inventory.update({
              where: { productId_size_colorName: { productId: dec.productId, size: dec.size, colorName: dec.colorName } },
              data: { stock: { increment: dec.quantity } }
            });
          }
          return new NextResponse(`Out of stock: "${item.name}" (Size ${size}) is sold out!`, { status: 400 });
        }

        // Atomically decrement
        const updatedInv = await prisma.inventory.update({
          where: { productId_size_colorName: { productId, size, colorName } },
          data: { stock: { decrement: item.quantity } }
        });

        decrementedItems.push({ productId, size, colorName, quantity: item.quantity });

        // If stock drops below zero due to concurrency race, roll back and fail
        if (updatedInv.stock < 0) {
          for (const dec of decrementedItems) {
            await prisma.inventory.update({
              where: { productId_size_colorName: { productId: dec.productId, size: dec.size, colorName: dec.colorName } },
              data: { stock: { increment: dec.quantity } }
            });
          }
          return new NextResponse(`Out of stock: "${item.name}" (Size ${size}) has just sold out!`, { status: 400 });
        }
      }
    } catch (stockErr) {
      // Rollback database updates on error
      for (const dec of decrementedItems) {
        await prisma.inventory.update({
          where: { productId_size_colorName: { productId: dec.productId, size: dec.size, colorName: dec.colorName } },
          data: { stock: { increment: dec.quantity } }
        });
      }
      throw stockErr;
    }

    // 4. Generate tracking number
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

    // Save success in idempotency cache
    if (idempotencyKey) {
      completedIdempotencyKeys.set(idempotencyKey, {
        order,
        timestamp: Date.now()
      });
    }

    // 5. Auto-cancel conflicting pending orders if stock drops to 0
    try {
      for (const dec of decrementedItems) {
        const inv = await prisma.inventory.findUnique({
          where: { productId_size_colorName: { productId: dec.productId, size: dec.size, colorName: dec.colorName } }
        });

        if (inv && inv.stock <= 0) {
          const processingOrders = await prisma.order.findMany({
            where: {
              status: "Processing",
              id: { not: order.id } // exclude current order
            }
          });

          for (const otherOrder of processingOrders) {
            const otherItems = JSON.parse(otherOrder.items || "[]");
            const containsSoldOutItem = otherItems.some((oi: any) => {
              const [oiProdId, oiSize] = oi.id.split('-');
              return oiProdId === dec.productId && oiSize === dec.size && oi.colorName === dec.colorName;
            });

            if (containsSoldOutItem) {
              await prisma.order.update({
                where: { id: otherOrder.id },
                data: { status: "Out of Stock (Cancelled)" }
              });
            }
          }
        }
      }
    } catch (cancelErr) {
      console.error("Failed to auto-cancel conflicting orders:", cancelErr);
    }

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
  } finally {
    if (lockKey) {
      activeLocks.delete(lockKey);
    }
  }
}
