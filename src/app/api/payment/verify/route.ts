import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await request.json();

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new NextResponse("Missing verification parameters", { status: 400 });
    }

    // Reject simulated/sandbox IDs in production
    if (razorpay_order_id.startsWith("order_sim_") || razorpay_payment_id.startsWith("pay_sim_")) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ verified: false, message: "Simulated payments are not accepted" }, { status: 400 });
      }
      // Only allow in development mode
      console.warn("[DEV ONLY] Accepting simulated payment verification.");
      return NextResponse.json({ verified: true, simulated: true });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret || keySecret.includes("dummy")) {
      console.error("RAZORPAY_KEY_SECRET is not configured. Payment verification rejected.");
      return NextResponse.json({ verified: false, message: "Payment gateway not configured" }, { status: 500 });
    }

    // Verify cryptographic signature: HMAC SHA256 (order_id + "|" + payment_id, keySecret)
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    const isVerified = generatedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(razorpay_signature));

    if (isVerified) {
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json({ verified: false, message: "Signature verification failed" }, { status: 400 });
    }
  } catch (error) {
    console.error("VERIFY_SIGNATURE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
