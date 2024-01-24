/*
  Warnings:

  - You are about to drop the column `lastPostedDate` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "lastPostedDate",
ADD COLUMN     "lastUpdate" TIMESTAMP(3);
