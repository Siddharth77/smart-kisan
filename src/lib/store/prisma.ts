import { db } from "@/lib/db";
import type {
  CreateAlertInput,
  CreateDiagnosisInput,
  CreateFarmerInput,
  CreateRecommendationInput,
  DataStore,
  FarmerWithPlots,
  UpdateTicketInput,
} from "./types";

export const prismaStore: DataStore = {
  mode: "database",

  async countFarmers() {
    return db.farmer.count();
  },

  async reset() {
    await db.rSKTicket.deleteMany();
    await db.diagnosis.deleteMany();
    await db.alert.deleteMany();
    await db.recommendation.deleteMany();
    await db.plot.deleteMany();
    await db.farmer.deleteMany();

    return db.farmer.create({
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
  },

  async createFarmer(input: CreateFarmerInput) {
    return db.farmer.create({
      data: {
        name: input.name,
        phone: input.phone,
        village: input.village,
        district: input.district,
        plots: {
          create: {
            acres: input.acres,
            soilType: input.soilType,
            cropSeason: input.cropSeason,
          },
        },
      },
      include: { plots: true },
    });
  },

  async listFarmers() {
    return db.farmer.findMany({
      include: { plots: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async findLatestFarmer() {
    return db.farmer.findFirst({ orderBy: { createdAt: "desc" } });
  },

  async findPlotWithFarmer(plotId: string) {
    return db.plot.findUnique({
      where: { id: plotId },
      include: { farmer: true },
    });
  },

  async createRecommendation(input: CreateRecommendationInput) {
    return db.recommendation.create({ data: input });
  },

  async listAlerts(farmerId?: string) {
    return db.alert.findMany({
      where: farmerId ? { farmerId } : undefined,
      orderBy: { createdAt: "desc" },
    });
  },

  async createAlert(input: CreateAlertInput) {
    return db.alert.create({ data: input });
  },

  async markAlertRead(id: string) {
    return db.alert.update({ where: { id }, data: { read: true } });
  },

  async createDiagnosis(input: CreateDiagnosisInput) {
    return db.diagnosis.create({ data: input });
  },

  async createTicket(diagnosisId: string) {
    return db.rSKTicket.create({ data: { diagnosisId } });
  },

  async listTickets() {
    return db.rSKTicket.findMany({
      include: { diagnosis: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateTicket(id: string, input: UpdateTicketInput) {
    return db.rSKTicket.update({
      where: { id },
      data: {
        status: input.status,
        expertNote: input.expertNote,
        resolvedAt: input.resolvedAt,
      },
      include: { diagnosis: true },
    });
  },
};

export async function seedPrismaDatabase(): Promise<FarmerWithPlots> {
  return prismaStore.reset();
}
