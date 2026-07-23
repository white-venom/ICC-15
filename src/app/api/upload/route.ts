import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const ALLOWED_MIME_PREFIXES = ['image/'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    // 1. Require admin authentication
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@inkandcottonclub.com";
    if (!session?.user?.email || session.user.email !== adminEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    // 3. Validate file extension
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: `File type "${ext}" is not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(', ')}` }, { status: 400 });
    }

    // 4. Validate MIME type
    if (!ALLOWED_MIME_PREFIXES.some(prefix => file.type.startsWith(prefix))) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Generate a random filename to prevent overwrites and path traversal
    const safeName = crypto.randomUUID() + ext;
    
    // Ensure public/assets directory exists
    const dirPath = path.join(process.cwd(), 'public', 'assets');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, safeName);
    
    // Write file to local disk
    fs.writeFileSync(filePath, buffer);

    // Return the public web access path
    return NextResponse.json({ path: `/assets/${safeName}` });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
