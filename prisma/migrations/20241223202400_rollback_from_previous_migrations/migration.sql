/*
  Warnings:

  - You are about to drop the column `shippingMethod` on the `Order` table. All the data in the column will be lost.
  - Added the required column `deliveryMethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingMethod",
ADD COLUMN     "deliveryMethod" TEXT NOT NULL,
ADD COLUMN     "pickupPerson" TEXT,
ALTER COLUMN "trackingNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "reservedStock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "_UserWishlist" ADD CONSTRAINT "_UserWishlist_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_UserWishlist_AB_unique";
