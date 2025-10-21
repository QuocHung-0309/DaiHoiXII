/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `documentId` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `ua` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `documentId` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `documentCode` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentTitle` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentCode` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentTitle` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Document";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullname" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "documentCode" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Feedback" ("content", "createdAt", "email", "fileUrl", "fullname", "id", "studentId", "unit") SELECT "content", "createdAt", "email", "fileUrl", "fullname", "id", "studentId", "unit" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
CREATE INDEX "Feedback_documentCode_idx" ON "Feedback"("documentCode");
CREATE TABLE "new_Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentCode" TEXT NOT NULL,
    "documentTitle" TEXT NOT NULL,
    "choice" TEXT NOT NULL,
    "mssv" TEXT,
    "unit" TEXT,
    "ip" TEXT,
    "ua" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Vote" ("choice", "createdAt", "id", "ip", "mssv", "ua", "unit") SELECT "choice", "createdAt", "id", "ip", "mssv", "ua", "unit" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE INDEX "Vote_documentCode_idx" ON "Vote"("documentCode");
CREATE INDEX "Vote_mssv_idx" ON "Vote"("mssv");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
