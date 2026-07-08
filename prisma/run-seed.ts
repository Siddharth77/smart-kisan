import { seedDatabase } from "../src/lib/store";

async function main() {
  const farmer = await seedDatabase();
  console.log(`Seeded farmer: ${farmer.name} (${farmer.id})`);
  console.log(`Seeded plot: ${farmer.plots[0].id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
