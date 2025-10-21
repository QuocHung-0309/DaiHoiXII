/*
  Warnings:

  - You are about to drop the column `documentCode` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `documentTitle` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `documentId` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
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
    "documentId" TEXT NOT NULL,
    "fileUrl" TEXT,
    "tag" TEXT,
    "ip" TEXT,
    "ua" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Feedback" ("consent", "content", "createdAt", "email", "fileUrl", "fullname", "id", "studentId", "unit", "updatedAt") SELECT "consent", "content", "createdAt", "email", "fileUrl", "fullname", "id", "studentId", "unit", "updatedAt" FROM "Feedback";
DROP TABLE "Feedback";
ALTER TABLE "new_Feedback" RENAME TO "Feedback";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
