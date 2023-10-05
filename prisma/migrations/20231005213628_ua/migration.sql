/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `AboutPage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `ContactPage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `SkillsPage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AboutPage_userId_key" ON "AboutPage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactPage_userId_key" ON "ContactPage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillsPage_userId_key" ON "SkillsPage"("userId");
