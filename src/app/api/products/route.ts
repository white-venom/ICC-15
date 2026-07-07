import { NextResponse } from 'next/server';
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
    const body = await request.json();
    const filePath = path.join(process.cwd(), 'src/utils/products.json');
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error saving products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
