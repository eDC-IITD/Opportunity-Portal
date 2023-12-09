/*
  Warnings:

  - You are about to drop the column `duratio` on the `job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "job" DROP COLUMN "duratio",
ADD COLUMN     "duration" TEXT;
