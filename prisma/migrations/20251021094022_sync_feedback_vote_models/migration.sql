/*
  Warnings:

  - You are about to drop the column `documentCode` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `documentTitle` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `documentId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Feedback_documentCode_idx";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
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
CREATE INDEX "Vote_documentId_idx" ON "Vote"("documentId");
CREATE INDEX "Vote_mssv_idx" ON "Vote"("mssv");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
