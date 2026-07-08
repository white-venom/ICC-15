import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/utils/prisma";

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

      // 2. Update user's tier to Gold if total spent is >= $300
      const allOrders = await prisma.order.findMany({
        where: { userId }
      });
      const totalSpent = allOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      
      if (totalSpent >= 300) {
        await prisma.user.update({
          where: { id: userId },
          data: { tier: "Gold" }
        });
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("CREATE_ORDER_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
