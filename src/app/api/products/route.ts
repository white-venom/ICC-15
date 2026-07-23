import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/utils/products.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([], { status: 404 });
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('API error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Require admin authentication
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@inkandcottonclub.com";
    if (!session?.user?.email || session.user.email !== adminEmail) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const filePath = path.join(process.cwd(), 'src/utils/products.json');
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error saving products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
