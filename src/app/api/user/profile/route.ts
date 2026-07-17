import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/utils/prisma";
import { generateUniqueReferralCode } from "@/utils/referral";

const profileSelectFields = {
  id: true,
  name: true,
  email: true,
  tier: true,
  cardNumber: true,
  phone: true,
  address: true,
  apartment: true,
  city: true,
  state: true,
  pincode: true,
  country: true,
  points: true,
  referralCode: true,
  referredBy: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  referrals: {
    select: {
      id: true,
      name: true,
      email: true,
      tier: true
    }
  },
  orders: {
    orderBy: { createdAt: "desc" as const }
  },
  savedItems: {
    orderBy: { createdAt: "desc" as const }
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const email = session.user.email;
    if (!email) {
      return new NextResponse("Invalid Session Email", { status: 400 });
    }

    let userProfile = await prisma.user.findUnique({
      where: { email },
      select: profileSelectFields
    });

    if (!userProfile) {
      // Auto-create user inside the new MySQL database
      const referralCode = await generateUniqueReferralCode();
      await prisma.user.create({
        data: {
          email,
          name: session.user.name || email.split('@')[0],
          tier: "None",
          referralCode
        }
      });

      // Fetch user profile again to load empty relations
      userProfile = await prisma.user.findUnique({
        where: { email },
        select: profileSelectFields
      });
    } else if (!userProfile.referralCode) {
      // Backfill referral code for existing user
      const referralCode = await generateUniqueReferralCode();
      await prisma.user.update({
        where: { id: userProfile.id },
        data: { referralCode }
      });
      userProfile.referralCode = referralCode;
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("GET_PROFILE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const email = session.user.email;
    if (!email) {
      return new NextResponse("Invalid Session Email", { status: 400 });
    }

    const body = await request.json();
    const { name, phone, address, apartment, city, state, pincode, country } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (address !== undefined) data.address = address;
    if (apartment !== undefined) data.apartment = apartment;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (pincode !== undefined) data.pincode = pincode;
    if (country !== undefined) data.country = country;

    const updatedUser = await prisma.user.update({
      where: { email },
      data
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PATCH_PROFILE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
