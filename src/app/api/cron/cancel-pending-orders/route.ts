import { NextResponse } from 'next/server';

import prisma from "../../../../../prisma/db";


export async function GET() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find order with pending status older than 24 hours
      const pendingOrders = await tx.order.findMany({
        where: {
          status: 'PENDING',
          createdAt: { lte: new Date(Date.now() - 1000 * 60 * 60 * 24) } // 24 hours
        }
      });

      if (pendingOrders.length === 0) {
        return {
          message: 'No pending orders to release',
          ordersUpdated: 0
        };
      }

      // Manually update each order
      const updatePromises = pendingOrders.map((order) =>
        tx.order.update({
          where: { id: order.id },
          data: {
            status: 'CANCELED',
          }
        })
      );

      const updatedOrders = await Promise.all(updatePromises);

      return {
        message: 'Pending orders cancelled',
        ordersUpdated: updatedOrders.length
      };
    }, {
      maxWait: 5000,
      timeout: 10000
    });

    // Log the result
    console.log(`${result.message}: ${result.ordersUpdated} products`);

    // Return a proper NextResponse
    return NextResponse.json(result, {
      status: result.ordersUpdated > 0 ? 200 : 204
    });

  } catch (error) {
    console.error('Error cancelling pending orders:', error);

    return NextResponse.json(
      {
        message: 'Failed to cancel orders with pending state',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}