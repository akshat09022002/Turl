-- DropForeignKey
ALTER TABLE "URL" DROP CONSTRAINT "URL_pageId_fkey";

-- AddForeignKey
ALTER TABLE "URL" ADD CONSTRAINT "URL_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("pageUID") ON DELETE SET NULL ON UPDATE CASCADE;
