/*
  Warnings:

  - Added the required column `title` to the `AboutPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ContactPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `SkillsPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AboutPage" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ContactPage" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SkillsPage" ADD COLUMN     "title" TEXT NOT NULL;
