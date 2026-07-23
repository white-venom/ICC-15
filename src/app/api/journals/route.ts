import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import fs from "fs";
import path from "path";

const journalsFilePath = path.join(process.cwd(), "src", "utils", "journals.json");

export async function GET() {
  try {
    if (!fs.existsSync(journalsFilePath)) {
      return NextResponse.json([]);
    }
    const fileContents = fs.readFileSync(journalsFilePath, "utf8");
    const journals = JSON.parse(fileContents);
    return NextResponse.json(journals);
  } catch (error) {
    console.error("GET_JOURNALS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Require admin authentication
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || "info@inkandcottonclub.com";
    if (!session?.user?.email || session.user.email !== adminEmail) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    fs.writeFileSync(journalsFilePath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST_JOURNALS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
