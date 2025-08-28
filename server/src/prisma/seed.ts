import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Predefined category tags
  const predefinedTags = [
    { name: 'Tech', isCategory: true },
    { name: 'Business', isCategory: true },
    { name: 'Education', isCategory: true },
    { name: 'Social', isCategory: true },
    { name: 'Entertainment', isCategory: true },
    { name: 'Events', isCategory: true },
    { name: 'Finance', isCategory: true },
    { name: 'Health', isCategory: true }
  ];

  console.log('Seeding predefined tags...');

  // Create tags if they don't exist
  for (const tag of predefinedTags) {
    const existingTag = await prisma.tag.findUnique({
      where: { name: tag.name }
    });

    if (!existingTag) {
      await prisma.tag.create({
        data: tag
      });
      console.log(`Created tag: ${tag.name}`);
    } else {
      console.log(`Tag already exists: ${tag.name}`);
    }
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
