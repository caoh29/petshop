/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `billingAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pickupPerson` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `SelectedProduct` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SelectedProduct" DROP CONSTRAINT "SelectedProduct_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "billingAddress",
DROP COLUMN "pickupPerson",
ADD COLUMN     "timestamp" TEXT NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("userId", "timestamp");

-- AlterTable
ALTER TABLE "SelectedProduct" DROP COLUMN "orderId",
ADD COLUMN     "timestamp" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "SelectedProduct" ADD CONSTRAINT "SelectedProduct_userId_timestamp_fkey" FOREIGN KEY ("userId", "timestamp") REFERENCES "Order"("userId", "timestamp") ON DELETE SET NULL ON UPDATE CASCADE;
