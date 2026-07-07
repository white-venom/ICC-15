import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { prisma } from "@/utils/prisma";

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

    const userProfile = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        tier: true,
        phone: true,
        address: true,
        apartment: true,
        city: true,
        state: true,
        pincode: true,
        country: true,
        orders: {
          orderBy: { createdAt: "desc" }
        },
        savedItems: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!userProfile) {
      return new NextResponse("User not found", { status: 404 });
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
