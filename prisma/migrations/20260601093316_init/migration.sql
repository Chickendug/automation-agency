-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "niche" TEXT,
    "rating" REAL,
    "reviewCount" INTEGER,
    "googlePlaceId" TEXT,
    "callStatus" TEXT NOT NULL DEFAULT 'not_called',
    "painSignals" TEXT,
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "lastCalledAt" DATETIME,
    "callbackAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CallLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CallLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT,
    "businessName" TEXT NOT NULL,
    "contactName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "packageId" TEXT,
    "packageName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'prospect',
    "setupFee" INTEGER NOT NULL DEFAULT 0,
    "monthlyFee" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "startedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AgencySettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "agencyName" TEXT NOT NULL DEFAULT 'Your Automation Agency',
    "yourName" TEXT,
    "yourPhone" TEXT,
    "yourEmail" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_googlePlaceId_key" ON "Lead"("googlePlaceId");

-- CreateIndex
CREATE INDEX "Lead_callStatus_idx" ON "Lead"("callStatus");

-- CreateIndex
CREATE INDEX "Lead_niche_city_idx" ON "Lead"("niche", "city");

-- CreateIndex
CREATE INDEX "Lead_callbackAt_idx" ON "Lead"("callbackAt");

-- CreateIndex
CREATE INDEX "CallLog_leadId_idx" ON "CallLog"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_leadId_key" ON "Client"("leadId");

-- CreateIndex
CREATE INDEX "Client_status_idx" ON "Client"("status");
