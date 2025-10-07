-- CreateTable
CREATE TABLE "public"."Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PackageItem" (
    "id" SERIAL NOT NULL,
    "packageId" INTEGER NOT NULL,
    "itemId" INTEGER,
    "customName" TEXT,
    "customWeight" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PackageItem_packageId_idx" ON "public"."PackageItem"("packageId");

-- CreateIndex
CREATE INDEX "PackageItem_itemId_idx" ON "public"."PackageItem"("itemId");

-- CreateIndex
CREATE INDEX "Package_userId_idx" ON "public"."Package"("userId");

-- AddForeignKey
ALTER TABLE "public"."PackageItem" ADD CONSTRAINT "PackageItem_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PackageItem" ADD CONSTRAINT "PackageItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "public"."Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
