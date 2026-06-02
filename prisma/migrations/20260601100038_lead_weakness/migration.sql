-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "pitchHook" TEXT;
ALTER TABLE "Lead" ADD COLUMN "primaryWeakness" TEXT;
ALTER TABLE "Lead" ADD COLUMN "recommendedPackageId" TEXT;
ALTER TABLE "Lead" ADD COLUMN "weaknessScore" INTEGER;

-- CreateIndex
CREATE INDEX "Lead_weaknessScore_idx" ON "Lead"("weaknessScore");

-- CreateIndex
CREATE INDEX "Lead_primaryWeakness_idx" ON "Lead"("primaryWeakness");
