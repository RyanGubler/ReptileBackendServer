-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reptile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "species" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" DATETIME NOT NULL,
    CONSTRAINT "Reptile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Reptile" ("createAt", "id", "name", "sex", "species", "updateAt", "userId") SELECT "createAt", "id", "name", "sex", "species", "updateAt", "userId" FROM "Reptile";
DROP TABLE "Reptile";
ALTER TABLE "new_Reptile" RENAME TO "Reptile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
