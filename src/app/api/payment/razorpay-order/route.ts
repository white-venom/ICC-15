import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function POST(request: Request) {
  try {
    const { amount, currency, items } = await request.json();

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    // Check stock if items are passed in the request body
    if (items && Array.isArray(items)) {
      for (const item of items) {
        const [productId, size] = item.id.split('-');
        const colorName = item.colorName;

        let inv = await prisma.inventory.findUnique({
          where: { productId_size_colorName: { productId, size, colorName } }
        });

        if (!inv) {
          inv = await prisma.inventory.create({
            data: { productId, size, colorName, stock: 3 }
          });
        }

        if (inv.stock < item.quantity) {
          return new NextResponse(`Out of stock: "${item.name}" (Size ${size}) is sold out!`, { status: 400 });
        }
      }
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes("dummy") || keySecret.includes("dummy")) {
      console.warn("Razorpay API Keys not configured. Using sandbox simulation mode.");
      return NextResponse.json({
        simulated: true,
        id: "order_sim_" + Math.random().toString(36).substring(2, 15),
        amount: amount,
        currency: currency || "USD"
      });
    }

    // Call Razorpay Orders API
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // amount in paise/cents
        currency: currency || 'USD',
        receipt: 'rcpt_' + Math.random().toString(36).substring(2, 10),
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Razorpay orders API error response:", errorText);
      return new NextResponse(`Razorpay Error: ${errorText}`, { status: response.status });
    }

    const orderData = await response.json();
    return NextResponse.json(orderData);
  } catch (error) {
    console.error("CREATE_RAZORPAY_ORDER_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
