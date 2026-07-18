import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@inkandcottonclub.com";
    if (!session || !session.user || session.user.email !== adminEmail) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            tier: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("ADMIN_GET_ORDERS_ERROR", error);
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
    const { id, status, trackingNumber } = body;

    if (!id) {
      return new NextResponse("Order ID required", { status: 400 });
    }

    // Get the current order details from the main database
    const currentOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!currentOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Prevent modification of completed (Delivered) or cancelled orders
    if (currentOrder.status === "Delivered" || currentOrder.status === "Out of Stock (Cancelled)") {
      if (status && status !== currentOrder.status) {
        return new NextResponse("Cannot change the status of a completed or cancelled order.", { status: 400 });
      }
    }

    // If status is transitioning to "Out of Stock (Cancelled)", restore stock for items
    if (status === "Out of Stock (Cancelled)" && (currentOrder.status === "Processing" || currentOrder.status === "Shipped" || currentOrder.status === "Out for Delivery")) {
      try {
        const items = JSON.parse(currentOrder.items || "[]");
        for (const item of items) {
          const [productId, size] = item.id.split('-');
          const colorName = item.colorName;
          await prisma.inventory.update({
            where: { productId_size_colorName: { productId, size, colorName } },
            data: { stock: { increment: item.quantity } }
          });
        }
      } catch (err) {
        console.error("Failed to restore stock on cancellation:", err);
      }
    }

    const data: any = {};
    if (status) data.status = status;
    if (trackingNumber) data.trackingNumber = trackingNumber;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("ADMIN_UPDATE_ORDER_ERROR", error);
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
      return new NextResponse("Order ID required", { status: 400 });
    }

    const orderToDelete = await prisma.order.findUnique({
      where: { id }
    });

    if (orderToDelete && (orderToDelete.status === "Processing" || orderToDelete.status === "Shipped" || orderToDelete.status === "Out for Delivery")) {
      try {
        const items = JSON.parse(orderToDelete.items || "[]");
        for (const item of items) {
          const [productId, size] = item.id.split('-');
          const colorName = item.colorName;
          await prisma.inventory.update({
            where: { productId_size_colorName: { productId, size, colorName } },
            data: { stock: { increment: item.quantity } }
          });
        }
      } catch (err) {
        console.error("Failed to restore stock on deletion:", err);
      }
    }

    await prisma.order.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_DELETE_ORDER_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
