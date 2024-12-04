/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `URL` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "URL_uid_key" ON "URL"("uid");
