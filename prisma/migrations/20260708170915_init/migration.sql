-- CreateTable
CREATE TABLE "Farmer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "district" TEXT NOT NULL DEFAULT 'Warangal',
    "language" TEXT NOT NULL DEFAULT 'te',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Plot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "farmerId" TEXT NOT NULL,
    "acres" REAL NOT NULL,
    "soilType" TEXT,
    "cropSeason" TEXT NOT NULL DEFAULT 'kharif',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Plot_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plotId" TEXT NOT NULL,
    "crops" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "reasoningTe" TEXT NOT NULL,
    "riskScores" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Recommendation_plotId_fkey" FOREIGN KEY ("plotId") REFERENCES "Plot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "farmerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "messageTe" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Alert_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "Farmer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "farmerId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "disease" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "action" TEXT NOT NULL,
    "actionTe" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RSKTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diagnosisId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "expertNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME,
    CONSTRAINT "RSKTicket_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "Diagnosis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "RSKTicket_diagnosisId_key" ON "RSKTicket"("diagnosisId");
