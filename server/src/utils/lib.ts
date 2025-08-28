import { prisma } from "../prisma/client";


export const generateRoomId = (): string => {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = 6;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    result += alphabet[randomIndex];
  }
  
  return result;
};


export const userDetails = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, profileUrl: true },
  });
} 