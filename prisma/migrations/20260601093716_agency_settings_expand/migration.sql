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
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AgencySettings" ("agencyName", "id", "updatedAt", "yourEmail", "yourName", "yourPhone") SELECT "agencyName", "id", "updatedAt", "yourEmail", "yourName", "yourPhone" FROM "AgencySettings";
DROP TABLE "AgencySettings";
ALTER TABLE "new_AgencySettings" RENAME TO "AgencySettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
