import { prisma } from "../prisma/client";

export const createuser = async (userData: any) => {
  try {
    const existinguser = await prisma.user.findUnique({
      where: { id: userData.id }
    });
    
    if (existinguser) {
      console.log(`user ${userData.id} already exists, skipping creation`);
      return existinguser;
    }
    
    return await prisma.user.create({
      data: {
        id: userData.id,
        email: userData.email_addresses[0].email_address,
        name: `${userData.first_name} ${userData.last_name || ""}`.trim(),
        profileUrl: userData.image_url,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteuser = async (userData: any) => {
  try {
    const existinguser = await prisma.user.findUnique({
      where: { id: userData.id }
    });
    
    if (!existinguser) {
      console.log(`user ${userData.id} not found, skipping deletion`);
      return null;
    }
    
    return await prisma.user.delete({
      where: { id: userData.id },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return null;
  }
};