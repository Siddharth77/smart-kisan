import { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";

export async function seedDatabase(client: PrismaClient = db) {
  await client.rSKTicket.deleteMany();
  await client.diagnosis.deleteMany();
  await client.alert.deleteMany();
  await client.recommendation.deleteMany();
  await client.plot.deleteMany();
  await client.farmer.deleteMany();

  return client.farmer.create({
    data: {
      name: "Lakshmi Devi",
      phone: "9876543210",
      village: "Hanamkonda",
      district: "Warangal",
      language: "te",
      plots: {
        create: {
          acres: 2,
          soilType: "red_loam",
          cropSeason: "kharif",
        },
      },
    },
    include: { plots: true },
  });
}
