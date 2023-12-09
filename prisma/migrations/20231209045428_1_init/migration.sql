/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `startup` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `startup` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "startup" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "startup_email_key" ON "startup"("email");
