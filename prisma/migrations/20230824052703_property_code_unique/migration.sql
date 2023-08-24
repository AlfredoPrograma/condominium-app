/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Property` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Property_code_key" ON "Property"("code");
