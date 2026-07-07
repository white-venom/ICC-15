import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean up filename (replace spaces & special chars with underscores)
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    // Ensure public/assets directory exists
    const dirPath = path.join(process.cwd(), 'public', 'assets');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, cleanName);
    
    // Write file to local disk
    fs.writeFileSync(filePath, buffer);

    // Return the public web access path
    return NextResponse.json({ path: `/assets/${cleanName}` });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
