-- AlterTable
ALTER TABLE "Client" ADD COLUMN "lastMonthlyPaidAt" DATETIME;
ALTER TABLE "Client" ADD COLUMN "lastMonthlyRequestAt" DATETIME;
ALTER TABLE "Client" ADD COLUMN "monthlyBillingDay" INTEGER;
ALTER TABLE "Client" ADD COLUMN "nextMonthlyDueAt" DATETIME;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN "billingPeriod" TEXT;

-- CreateIndex
CREATE INDEX "Payment_billingPeriod_idx" ON "Payment"("billingPeriod");
