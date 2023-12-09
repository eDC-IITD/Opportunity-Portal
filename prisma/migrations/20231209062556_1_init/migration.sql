/*
  Warnings:

  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "admin_email_key";

-- AlterTable
ALTER TABLE "admin" DROP CONSTRAINT "admin_pkey",
DROP COLUMN "email",
ADD COLUMN     "username" TEXT NOT NULL,
ADD CONSTRAINT "admin_pkey" PRIMARY KEY ("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");
