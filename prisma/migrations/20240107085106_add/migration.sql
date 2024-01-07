/*
  Warnings:

  - A unique constraint covering the columns `[uniqueId]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uniqueId` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "uniqueId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_uniqueId_key" ON "Restaurant"("uniqueId");
