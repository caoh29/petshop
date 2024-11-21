export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import { NextResponse } from 'next/server';

import prisma from "../../../../../prisma/db";


export async function GET() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find products with reserved stock older than 24 hours
      const productsWithReservedStock = await tx.product.findMany({
        where: {
          reservedStock: { gt: 0 },
          updatedAt: { lte: new Date(Date.now() - 1000 * 60 * 60 * 24) } // 24 hours
          // updatedAt: { lte: new Date(Date.now()) } // Now
        }
      });

      if (productsWithReservedStock.length === 0) {
        return {
          message: 'No products with reserved stock to release',
          productsUpdated: 0
        };
      }

      // Manually update each product
      const updatePromises = productsWithReservedStock.map(product =>
        tx.product.update({
          where: { id: product.id },
          data: {
            stock: { increment: product.reservedStock },
            reservedStock: 0
          }
        })
      );

      const updatedProducts = await Promise.all(updatePromises);

      return {
        message: 'Reserved stock released',
        productsUpdated: updatedProducts.length
      };
    }, {
      maxWait: 5000,
      timeout: 10000
    });

    // Log the result
    console.log(`${result.message}: ${result.productsUpdated} products`);

    // Return a proper NextResponse
    return NextResponse.json(result, {
      status: result.productsUpdated > 0 ? 200 : 204
    });

  } catch (error) {
    console.error('Error releasing reserved stock:', error);

    return NextResponse.json(
      {
        message: 'Failed to release reserved stock',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}