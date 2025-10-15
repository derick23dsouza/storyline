/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `collection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "collection_userId_bookId_key" ON "collection"("userId", "bookId");
