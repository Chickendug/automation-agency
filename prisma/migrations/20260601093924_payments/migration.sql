-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "method" TEXT,
    "externalId" TEXT,
    "notes" TEXT,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AgencySettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "agencyName" TEXT NOT NULL DEFAULT 'Your Automation Agency',
    "yourName" TEXT,
    "yourPhone" TEXT,
    "yourEmail" TEXT,
    "defaultNiche" TEXT NOT NULL DEFAULT 'HVAC / plumbing',
    "defaultCity" TEXT,
    "defaultPackageId" TEXT NOT NULL DEFAULT 'missed-call-recovery',
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "stripePaymentLinkSetup" TEXT,
    "stripePaymentLinkMonthly" TEXT,
    "paypalEmail" TEXT,
    "venmoHandle" TEXT,
    "zellePhone" TEXT,
    "bankTransferNotes" TEXT,
    "invoicePrefix" TEXT NOT NULL DEFAULT 'INV',
    "collectTax" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AgencySettings" ("agencyName", "defaultCity", "defaultNiche", "defaultPackageId", "id", "onboardingDone", "updatedAt", "yourEmail", "yourName", "yourPhone") SELECT "agencyName", "defaultCity", "defaultNiche", "defaultPackageId", "id", "onboardingDone", "updatedAt", "yourEmail", "yourName", "yourPhone" FROM "AgencySettings";
DROP TABLE "AgencySettings";
ALTER TABLE "new_AgencySettings" RENAME TO "AgencySettings";
CREATE TABLE "new_Client" (
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
    "setupPaymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "monthlyPaymentStatus" TEXT NOT NULL DEFAULT 'n/a',
    "setupPaidAt" DATETIME,
    "setupPaidAmount" INTEGER,
    "lastPaymentRequestAt" DATETIME,
    "stripeSessionId" TEXT,
    "notes" TEXT,
    "startedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Client_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("businessName", "contactName", "createdAt", "email", "id", "leadId", "monthlyFee", "notes", "packageId", "packageName", "phone", "setupFee", "startedAt", "status", "updatedAt") SELECT "businessName", "contactName", "createdAt", "email", "id", "leadId", "monthlyFee", "notes", "packageId", "packageName", "phone", "setupFee", "startedAt", "status", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_leadId_key" ON "Client"("leadId");
CREATE INDEX "Client_status_idx" ON "Client"("status");
CREATE INDEX "Client_setupPaymentStatus_idx" ON "Client"("setupPaymentStatus");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Payment_clientId_idx" ON "Payment"("clientId");
