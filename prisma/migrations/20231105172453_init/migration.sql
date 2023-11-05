-- CreateTable
CREATE TABLE "Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "title" TEXT
);

-- CreateTable
CREATE TABLE "PageSaves" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saveType" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL,
    CONSTRAINT "PageSaves_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_url_key" ON "Page"("url");
