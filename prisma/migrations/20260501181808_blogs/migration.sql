-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CategoryTag" AS ENUM ('EARNING', 'PRODUCTIVITY', 'SAFETY', 'LIFESTYLE');

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" VARCHAR(255) NOT NULL,
    "category" "CategoryTag" NOT NULL,
    "tags" TEXT[],
    "coverImage" TEXT,
    "readTimeMin" INTEGER NOT NULL DEFAULT 5,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_slug_idx" ON "blogs"("slug");

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
