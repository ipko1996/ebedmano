/*
  Warnings:

  - Added the required column `validUntil` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "validUntil" TIMESTAMP(3) NOT NULL;
