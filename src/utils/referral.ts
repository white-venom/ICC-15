import { prisma } from "./prisma";

export async function generateUniqueReferralCode(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let isUnique = false;
  let code = '';
  
  while (!isUnique) {
    let tempCode = 'ICC-';
    for (let i = 0; i < 5; i++) {
      tempCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const existing = await prisma.user.findUnique({
      where: { referralCode: tempCode }
    });
    
    if (!existing) {
      code = tempCode;
      isUnique = true;
    }
  }
  return code;
}
