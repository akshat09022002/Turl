/*
  Warnings:

  - You are about to drop the column `title` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pageUID]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pageUID` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Page` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "title",
ADD COLUMN     "pageUID" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Page_pageUID_key" ON "Page"("pageUID");
