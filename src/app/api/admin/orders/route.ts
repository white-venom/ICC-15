import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET() {
  try {
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

    // Check if status is transitioning to Shipped/Delivered (indicating payment confirmed/fulfillment)
    // and the order is currently in "Processing" status
    const isConfirmingPayment = (status === "Shipped" || status === "Delivered") && currentOrder.status === "Processing";

    if (isConfirmingPayment) {
      const items = JSON.parse(currentOrder.items || "[]");

      // 1. Verify stock for all items in this order in the separate inventory database
      for (const item of items) {
        const [productId, size] = item.id.split('-');
        const colorName = item.colorName;
        
        let inv = await prisma.inventory.findUnique({
          where: { productId_size_colorName: { productId, size, colorName } }
        });

        // Initialize default stock level of 3 if it doesn't exist
        if (!inv) {
          inv = await prisma.inventory.create({
            data: { productId, size, colorName, stock: 3 }
          });
        }

        if (inv.stock < item.quantity) {
          return new NextResponse(
            `Fulfillment failed: "${item.name}" (Size ${size}) is out of stock!`,
            { status: 400 }
          );
        }
      }

      // 2. Deduct stock and auto-cancel conflicting pending orders if stock drops to 0
      for (const item of items) {
        const [productId, size] = item.id.split('-');
        const colorName = item.colorName;

        const updatedInv = await prisma.inventory.update({
          where: { productId_size_colorName: { productId, size, colorName } },
          data: { stock: { decrement: item.quantity } }
        });

        // If stock drops to 0, cancel other pending orders that request this item
        if (updatedInv.stock <= 0) {
          const processingOrders = await prisma.order.findMany({
            where: {
              status: "Processing",
              id: { not: id }
            }
          });

          for (const otherOrder of processingOrders) {
            const otherItems = JSON.parse(otherOrder.items || "[]");
            const containsSoldOutItem = otherItems.some((oi: any) => {
              const [oiProdId, oiSize] = oi.id.split('-');
              return oiProdId === productId && oiSize === size && oi.colorName === colorName;
            });

            if (containsSoldOutItem) {
              // Cancel conflicting order as Out of Stock
              await prisma.order.update({
                where: { id: otherOrder.id },
                data: { status: "Out of Stock (Cancelled)" }
              });
            }
          }
        }
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Order ID required", { status: 400 });
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
