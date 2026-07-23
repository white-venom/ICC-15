import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/utils/prisma";
import { generateUniqueReferralCode } from "@/utils/referral";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, referralCode } = body;

    if (!email || !password) {
      return new NextResponse("Missing Info", { status: 400 });
    }

    // Password strength validation
    if (password.length < 8) {
      return new NextResponse("Password must be at least 8 characters long.", { status: 400 });
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return new NextResponse("Password must contain at least one uppercase letter, one lowercase letter, and one number.", { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (exist) {
      // Generic error to prevent account enumeration
      return new NextResponse("Registration failed. Please try again or sign in.", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let referrerId: string | null = null;

    if (referralCode) {
      const trimmedCode = referralCode.trim().toUpperCase();
      const referrer = await prisma.user.findUnique({
        where: { referralCode: trimmedCode },
        select: { id: true, referrals: { select: { id: true } } }
      });

      if (!referrer) {
        return new NextResponse("Invalid referral code.", { status: 400 });
      }

      if (referrer.referrals.length >= 5) {
        return new NextResponse("This referral code has reached its maximum limit of 5 referrals.", { status: 400 });
      }

      referrerId = referrer.id;
    }

    const myReferralCode = await generateUniqueReferralCode();

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          referralCode: myReferralCode,
          referredById: referrerId,
          points: referrerId ? 100 : 0
        }
      });

      if (referrerId) {
        await tx.user.update({
          where: { id: referrerId },
          data: {
            points: {
              increment: 100
            }
          }
        });
      }

      return newUser;
    });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
