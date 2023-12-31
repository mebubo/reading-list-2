-- CreateTable
CREATE TABLE "PageHighlights" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "highlight" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL,
    CONSTRAINT "PageHighlights_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
