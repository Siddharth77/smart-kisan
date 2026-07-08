import { seedDatabase } from "../src/lib/seed-db";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const farmer = await seedDatabase(prisma);
  console.log(`Seeded farmer: ${farmer.name} (${farmer.id})`);
  console.log(`Seeded plot: ${farmer.plots[0].id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
