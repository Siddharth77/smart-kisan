import type {
  Alert,
  CreateAlertInput,
  CreateDiagnosisInput,
  CreateFarmerInput,
  CreateRecommendationInput,
  DataStore,
  Diagnosis,
  Farmer,
  FarmerWithPlots,
  Plot,
  PlotWithFarmer,
  Recommendation,
  RSKTicket,
  RSKTicketWithDiagnosis,
  UpdateTicketInput,
} from "./types";

function id(): string {
  return crypto.randomUUID();
}

interface MemoryState {
  farmers: FarmerWithPlots[];
  recommendations: Recommendation[];
  alerts: Alert[];
  diagnoses: Diagnosis[];
  tickets: RSKTicket[];
}

const globalStore = globalThis as unknown as { __kisanMemory?: MemoryState };

function state(): MemoryState {
  if (!globalStore.__kisanMemory) {
    globalStore.__kisanMemory = {
      farmers: [],
      recommendations: [],
      alerts: [],
      diagnoses: [],
      tickets: [],
    };
  }
  return globalStore.__kisanMemory;
}

function lakshmiSeed(): FarmerWithPlots {
  const farmerId = id();
  const plotId = id();
  const now = new Date();
  const plot: Plot = {
    id: plotId,
    farmerId,
    acres: 2,
    soilType: "red_loam",
    cropSeason: "kharif",
    createdAt: now,
  };
  return {
    id: farmerId,
    name: "Lakshmi Devi",
    phone: "9876543210",
    village: "Hanamkonda",
    district: "Warangal",
    language: "te",
    createdAt: now,
    plots: [plot],
  };
}

function ensureSeeded(): void {
  if (state().farmers.length === 0) {
    state().farmers.push(lakshmiSeed());
  }
}

export const memoryStore: DataStore = {
  mode: "memory",

  async countFarmers() {
    ensureSeeded();
    return state().farmers.length;
  },

  async reset() {
    const s = state();
    s.farmers = [];
    s.recommendations = [];
    s.alerts = [];
    s.diagnoses = [];
    s.tickets = [];
    const farmer = lakshmiSeed();
    s.farmers.push(farmer);
    return farmer;
  },

  async createFarmer(input: CreateFarmerInput) {
    ensureSeeded();
    const farmerId = id();
    const now = new Date();
    const plot: Plot = {
      id: id(),
      farmerId,
      acres: input.acres,
      soilType: input.soilType,
      cropSeason: input.cropSeason,
      createdAt: now,
    };
    const farmer: FarmerWithPlots = {
      id: farmerId,
      name: input.name,
      phone: input.phone,
      village: input.village,
      district: input.district,
      language: "te",
      createdAt: now,
      plots: [plot],
    };
    state().farmers.unshift(farmer);
    return farmer;
  },

  async listFarmers() {
    ensureSeeded();
    return [...state().farmers].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  },

  async findLatestFarmer() {
    ensureSeeded();
    const sorted = [...state().farmers].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    return sorted[0] ?? null;
  },

  async findPlotWithFarmer(plotId: string) {
    ensureSeeded();
    for (const farmer of state().farmers) {
      const plot = farmer.plots.find((p) => p.id === plotId);
      if (plot) {
        const { plots: _, ...farmerData } = farmer;
        return { ...plot, farmer: farmerData };
      }
    }
    return null;
  },

  async createRecommendation(input: CreateRecommendationInput) {
    const rec: Recommendation = {
      id: id(),
      ...input,
      createdAt: new Date(),
    };
    state().recommendations.push(rec);
    return rec;
  },

  async listAlerts(farmerId?: string) {
    ensureSeeded();
    let alerts = state().alerts;
    if (farmerId) alerts = alerts.filter((a) => a.farmerId === farmerId);
    return [...alerts].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  },

  async createAlert(input: CreateAlertInput) {
    const alert: Alert = {
      id: id(),
      ...input,
      read: false,
      createdAt: new Date(),
    };
    state().alerts.unshift(alert);
    return alert;
  },

  async markAlertRead(alertId: string) {
    const alert = state().alerts.find((a) => a.id === alertId);
    if (!alert) throw new Error("Alert not found");
    alert.read = true;
    return alert;
  },

  async createDiagnosis(input: CreateDiagnosisInput) {
    const diagnosis: Diagnosis = {
      id: id(),
      ...input,
      createdAt: new Date(),
    };
    state().diagnoses.push(diagnosis);
    return diagnosis;
  },

  async createTicket(diagnosisId: string) {
    const ticket: RSKTicket = {
      id: id(),
      diagnosisId,
      status: "open",
      expertNote: null,
      createdAt: new Date(),
      resolvedAt: null,
    };
    state().tickets.unshift(ticket);
    return ticket;
  },

  async listTickets() {
    ensureSeeded();
    return state()
      .tickets.map((ticket) => {
        const diagnosis = state().diagnoses.find((d) => d.id === ticket.diagnosisId);
        if (!diagnosis) return null;
        return { ...ticket, diagnosis };
      })
      .filter((t): t is RSKTicketWithDiagnosis => t !== null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async updateTicket(ticketId: string, input: UpdateTicketInput) {
    const ticket = state().tickets.find((t) => t.id === ticketId);
    if (!ticket) throw new Error("Ticket not found");
    ticket.status = input.status;
    if (input.expertNote !== undefined) ticket.expertNote = input.expertNote;
    if (input.resolvedAt !== undefined) ticket.resolvedAt = input.resolvedAt;
    const diagnosis = state().diagnoses.find((d) => d.id === ticket.diagnosisId);
    if (!diagnosis) throw new Error("Diagnosis not found");
    return { ...ticket, diagnosis };
  },
};

ensureSeeded();
