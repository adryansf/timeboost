import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  await prisma.level.createMany({
    data: [
      {
        name: 'Iniciante',
        pointsRequired: 0,
      },
      {
        name: 'Intermediário',
        pointsRequired: 100,
      },
      {
        name: 'Avançado',
        pointsRequired: 500,
      },
      {
        name: 'Expert',
        pointsRequired: 1000,
      },
    ],
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
