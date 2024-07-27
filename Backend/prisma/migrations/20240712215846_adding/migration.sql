/*
  Warnings:

  - Added the required column `visitorCount` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "description" TEXT,
ADD COLUMN     "visitorCount" INTEGER NOT NULL;
