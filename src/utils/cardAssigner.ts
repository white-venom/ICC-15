import { prisma } from "./prisma";
import CARDS from "./cards.json";

export async function assignMembershipCard(userId: string, targetTier: string) {
  // Normalize tier name
  const normalizedTier = targetTier.charAt(0).toUpperCase() + targetTier.slice(1).toLowerCase(); // "Silver", "Gold", "None"

  // Fetch the user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, tier: true, cardNumber: true }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // If new tier is "None", remove the card association
  if (normalizedTier === "None") {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        tier: "None",
        cardNumber: null
      }
    });
  }

  // Check if they already have a card matching this tier
  if (user.tier === normalizedTier && user.cardNumber) {
    const cardMatch = CARDS.find(c => c.cardNumber === user.cardNumber);
    if (cardMatch && cardMatch.tier === normalizedTier) {
      return user; // Already has correct card number
    }
  }

  // Otherwise, find a new card from the pool
  const assignedUsers = await prisma.user.findMany({
    where: { cardNumber: { not: null } },
    select: { cardNumber: true }
  });
  const assignedCardNumbers = assignedUsers.map(u => u.cardNumber);

  // Find first available card in cards.json of target tier
  const availableCard = CARDS.find(c => 
    c.tier.toLowerCase() === normalizedTier.toLowerCase() && 
    !assignedCardNumbers.includes(c.cardNumber)
  );

  if (!availableCard) {
    throw new Error(`No available ${normalizedTier} card numbers left in the pool.`);
  }

  // Assign the card number
  return await prisma.user.update({
    where: { id: userId },
    data: {
      tier: normalizedTier,
      cardNumber: availableCard.cardNumber
    }
  });
}
