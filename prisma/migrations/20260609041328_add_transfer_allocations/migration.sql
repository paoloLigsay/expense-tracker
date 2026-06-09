/*
  Warnings:

  - You are about to drop the column `allocationId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_allocationId_fkey";

-- DropIndex
DROP INDEX "Transaction_allocationId_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "allocationId",
ADD COLUMN     "allocationFromId" TEXT,
ADD COLUMN     "allocationToId" TEXT;

-- CreateIndex
CREATE INDEX "Transaction_allocationFromId_idx" ON "Transaction"("allocationFromId");

-- CreateIndex
CREATE INDEX "Transaction_allocationToId_idx" ON "Transaction"("allocationToId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_allocationFromId_fkey" FOREIGN KEY ("allocationFromId") REFERENCES "Allocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_allocationToId_fkey" FOREIGN KEY ("allocationToId") REFERENCES "Allocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
