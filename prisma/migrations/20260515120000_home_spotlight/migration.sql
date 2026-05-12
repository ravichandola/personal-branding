-- CreateTable
CREATE TABLE "HomeSpotlight" (
    "id" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "narrative" TEXT NOT NULL,
    "projectSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeSpotlight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomeSpotlight_published_sortOrder_idx" ON "HomeSpotlight"("published", "sortOrder");
