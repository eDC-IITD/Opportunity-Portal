-- CreateEnum
CREATE TYPE "NotifiedStatus" AS ENUM ('notified', 'rejected', 'tobedecided', 'tobenotified');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('receive', 'notreceive', 'updreceive', 'updnotreceive');

-- AlterTable
ALTER TABLE "job" ADD COLUMN     "notifiedStatus" "NotifiedStatus" NOT NULL DEFAULT 'tobedecided';

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "notificationStatus" "NotificationStatus" NOT NULL DEFAULT 'notreceive';
