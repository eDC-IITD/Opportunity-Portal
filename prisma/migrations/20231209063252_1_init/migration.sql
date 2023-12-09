/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `admin` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "admin" DROP CONSTRAINT "admin_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "admin_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_id_key" ON "admin"("id");
