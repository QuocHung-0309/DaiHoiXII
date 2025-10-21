/*
  Warnings:

  - Made the column `mssv` on table `Vote` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "choice" TEXT NOT NULL,
    "mssv" TEXT NOT NULL,
    "unit" TEXT,
    "ip" TEXT,
    "ua" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Vote" ("choice", "createdAt", "documentId", "id", "ip", "mssv", "ua", "unit") SELECT "choice", "createdAt", "documentId", "id", "ip", "mssv", "ua", "unit" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE INDEX "Vote_documentId_idx" ON "Vote"("documentId");
CREATE INDEX "Vote_mssv_idx" ON "Vote"("mssv");
CREATE UNIQUE INDEX "Vote_documentId_mssv_key" ON "Vote"("documentId", "mssv");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
