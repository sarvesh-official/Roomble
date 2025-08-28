import { prisma } from "../prisma/client";

export const createUser = async (userData: any) => {
  return prisma.user.create({
    data: {
      id: userData.id,
      email: userData.email_addresses[0].email_address,
      name: `${userData.first_name} ${userData.last_name || ""}`.trim(),
      profileUrl: userData.image_url,
    },
  });
};

export const deleteUser = async (userData: any) => {
  return prisma.user.delete({
    where: { id: userData.id },
  });
};