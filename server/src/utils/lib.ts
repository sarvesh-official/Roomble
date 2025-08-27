import { prisma } from "../prisma/client";

export const generateRoomId = async () => {
  
  const { customAlphabet } = await import("nanoid/non-secure");
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nanoid = customAlphabet(alphabet, 6);
  return nanoid();
};


export const userDetails = async (userId: string) => {

  await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, profileUrl: true },
  });
} 