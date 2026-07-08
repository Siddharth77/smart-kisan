export interface Plot {
  id: string;
  farmerId: string;
  acres: number;
  soilType: string | null;
  cropSeason: string;
  createdAt: Date;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  language: string;
  createdAt: Date;
}

export type FarmerWithPlots = Farmer & { plots: Plot[] };

export type PlotWithFarmer = Plot & { farmer: Farmer };

export interface Recommendation {
  id: string;
  plotId: string;
  crops: string;
  reasoning: string;
  reasoningTe: string;
  riskScores: string;
  createdAt: Date;
}

export interface Alert {
  id: string;
  farmerId: string;
  type: string;
  message: string;
  messageTe: string;
  read: boolean;
  createdAt: Date;
}

export interface Diagnosis {
  id: string;
  farmerId: string;
  imagePath: string;
  disease: string;
  confidence: number;
  action: string;
  actionTe: string;
  createdAt: Date;
}

export interface RSKTicket {
  id: string;
  diagnosisId: string;
  status: string;
  expertNote: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
}

export type RSKTicketWithDiagnosis = RSKTicket & { diagnosis: Diagnosis };

export interface CreateFarmerInput {
  name: string;
  phone: string;
  village: string;
  district: string;
  acres: number;
  soilType: string;
  cropSeason: string;
}

export interface CreateRecommendationInput {
  plotId: string;
  crops: string;
  reasoning: string;
  reasoningTe: string;
  riskScores: string;
}

export interface CreateAlertInput {
  farmerId: string;
  type: string;
  message: string;
  messageTe: string;
}

export interface CreateDiagnosisInput {
  farmerId: string;
  imagePath: string;
  disease: string;
  confidence: number;
  action: string;
  actionTe: string;
}

export interface UpdateTicketInput {
  status: string;
  expertNote?: string;
  resolvedAt?: Date | null;
}

export interface DataStore {
  readonly mode: "memory" | "database";
  countFarmers(): Promise<number>;
  reset(): Promise<FarmerWithPlots>;
  createFarmer(input: CreateFarmerInput): Promise<FarmerWithPlots>;
  listFarmers(): Promise<FarmerWithPlots[]>;
  findLatestFarmer(): Promise<Farmer | null>;
  findPlotWithFarmer(plotId: string): Promise<PlotWithFarmer | null>;
  createRecommendation(input: CreateRecommendationInput): Promise<Recommendation>;
  listAlerts(farmerId?: string): Promise<Alert[]>;
  createAlert(input: CreateAlertInput): Promise<Alert>;
  markAlertRead(id: string): Promise<Alert>;
  createDiagnosis(input: CreateDiagnosisInput): Promise<Diagnosis>;
  createTicket(diagnosisId: string): Promise<RSKTicket>;
  listTickets(): Promise<RSKTicketWithDiagnosis[]>;
  updateTicket(id: string, input: UpdateTicketInput): Promise<RSKTicketWithDiagnosis>;
}
