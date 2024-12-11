'use server';

import { Cart, SelectedProduct, ValidProduct } from '@/api/types';
import prisma from "../../../../prisma/db";

const getCart = async (userId: string): Promise<Cart> => {
  // Retrieve the cart from the database
  const dbCart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      products: {
        select: {
          productId: true,
          quantity: true,
          size: true,
          color: true,
          product: {
            select: {
              name: true,
              price: true,
              image: true,
              category: true,
              subcategory: true,
            }
          }
        }
      }
    }
  });

  // If the cart is not found, return an empty cart structure
  if (!dbCart) {
    // Create a new cart in the database
    const newCart = await prisma.cart.create({
      data: {
        userId,
      },
    });
    return {
      id: newCart.id,
      userId: newCart.userId,
      products: [],
      validatedProducts: [],
    };
  }

  // Map the cart data to the expected structure
  const cart: Cart = {
    id: dbCart.id,
    userId: dbCart.userId,
    // Map product object from DB to satisfied frontend requirements SelectedProduct object
    products: dbCart.products.map(({ quantity, size, color, productId, product }) => (
      {
        productId,
        productImage: product.image,
        productName: product.name,
        productPrice: product.price,
        productCategory: product.category,
        productSubcategory: product.subcategory,
        size: size ?? '',
        color: color ?? '',
        quantity: quantity,
      }
    )),
    validatedProducts: [],
  };

  return cart;
};

export const getCartAction = async (userId: string): Promise<Cart> => getCart(userId ?? '');

export const addProductToCartAction = async (
  productId: string,
  quantity: number,
  options: {
    size?: string;
    color?: string;
  },
  userId?: string,
): Promise<SelectedProduct> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // First, ensure the cart exists
  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  // If cart doesn't exist, create it
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  // Check if the product exists in the cart
  const existingCartProduct = await prisma.selectedProduct.findFirst({
    where: {
      cartId: cart.id,
      productId,
      size: options.size,
      color: options.color,
    },
  });

  let updatedCartProduct;

  if (existingCartProduct) {
    // Update existing cart product
    updatedCartProduct = await prisma.selectedProduct.update({
      where: {
        id: existingCartProduct.id,
      },
      data: {
        quantity: existingCartProduct.quantity + quantity,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            image: true,
            category: true,
            subcategory: true,
          }
        }
      }
    });
  } else {
    // Create new cart product
    updatedCartProduct = await prisma.selectedProduct.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        size: options.size,
        color: options.color,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            image: true,
            category: true,
            subcategory: true,
          }
        }
      }
    });
  }

  // Transform the result into SelectedProduct type
  const selectedProduct: SelectedProduct = {
    productId: updatedCartProduct.productId,
    productImage: updatedCartProduct.product.image,
    productName: updatedCartProduct.product.name,
    productPrice: updatedCartProduct.product.price,
    productCategory: updatedCartProduct.product.category,
    productSubcategory: updatedCartProduct.product.subcategory,
    size: updatedCartProduct.size ?? '',
    color: updatedCartProduct.color ?? '',
    quantity: updatedCartProduct.quantity,
  };

  return selectedProduct;
};

export const updateProductCartAction = async (
  id: string,
  quantity: number,
  options: {
    size?: string;
    color?: string;
  },
  userId?: string,
): Promise<SelectedProduct> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Get the cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  // Update the selected product
  const { count: affectedElements } = await prisma.selectedProduct.updateMany({
    where: {
      cartId: cart.id,
      productId: id,
      size: options.size,
      color: options.color,
    },
    data: {
      quantity: quantity,
    },
  });

  if (affectedElements > 0) {
    const dbSelectedProduct = await prisma.selectedProduct.findFirst({
      where: {
        cartId: cart.id,
        productId: id,
        size: options.size,
        color: options.color,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            image: true,
            category: true,
            subcategory: true,
          }
        }
      }
    });

    const selectedProduct: SelectedProduct = {
      productId: dbSelectedProduct?.productId ?? '',
      productImage: dbSelectedProduct?.product.image ?? '',
      productName: dbSelectedProduct?.product.name ?? '',
      productPrice: dbSelectedProduct?.product.price ?? 0,
      productCategory: dbSelectedProduct?.product.category ?? '',
      productSubcategory: dbSelectedProduct?.product.subcategory ?? '',
      size: dbSelectedProduct?.size ?? '',
      color: dbSelectedProduct?.color ?? '',
      quantity: dbSelectedProduct?.quantity ?? 0
    };

    return selectedProduct;
  };
  throw new Error('Product not found in cart');
}

export const deleteProductCartAction = async (
  id: string,
  options: {
    size?: string;
    color?: string;
  },
  userId?: string,
): Promise<number> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Get the cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new Error('Cart not found');
  }

  // Update the selected product
  const { count: affectedElements } = await prisma.selectedProduct.deleteMany({
    where: {
      cartId: cart.id,
      productId: id,
      size: options.size,
      color: options.color,
    },
  });

  if (affectedElements > 0) {
    return affectedElements;
  }

  throw new Error('Product not found in cart');
}

export const validateStockAction = async (selectedProducts: SelectedProduct[]): Promise<ValidProduct[]> => {
  const stockValidation = await Promise.all(
    selectedProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      return {
        productId: item.productId,
        isAvailable: product.stock >= item.quantity,
        quantity: item.quantity
      };
    })
  );

  return stockValidation;
}

export const reserveStockAction = async (selectedProducts: SelectedProduct[]) => {
  return prisma.$transaction(async (tx) => {
    const updateResults = await Promise.all(
      selectedProducts.map(async (item) => {
        // Check stock before updating
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        return tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            reservedStock: { increment: item.quantity }
          }
        });
      })
    );

    if (updateResults.length === selectedProducts.length) return {
      message: 'Stock reserved',
      productsUpdated: updateResults.length
    };
    throw new Error('Error reserving stock');
  }, {
    maxWait: 5000,
    timeout: 10000
  });
}

export const releaseReservedStockAction = async (selectedProducts: SelectedProduct[]) => {
  return prisma.$transaction(async (tx) => {
    const updateResults = await Promise.all(
      selectedProducts.map(async (item) => {
        return await tx.product.update({
          where: { id: item.productId },
          data: {
            reservedStock: { decrement: item.quantity }
          }
        });

      })
    );

    return {
      message: 'Reserved stock released',
      productsUpdated: updateResults.length
    };
  }, {
    maxWait: 5000,
    timeout: 10000
  });
}

interface CartSummaryParams {
  cart: Cart;
  isCheckout: boolean;
  deliveryMethod?: 'ship' | 'pickup';
  zip?: string;
  country?: string;
}

const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 9.99;

export async function getCartSummaryAction({ cart,
  isCheckout,
  deliveryMethod,
  zip,
  country
}: CartSummaryParams) {

  // Calculate subtotal
  const subtotal = await getSubtotal(cart);

  // Calculate shipping
  let shipping = 0;
  if (isCheckout && deliveryMethod === 'ship' && subtotal < FREE_SHIPPING_THRESHOLD || !isCheckout && subtotal < FREE_SHIPPING_THRESHOLD) {
    shipping = SHIPPING_COST;
  }

  // Calculate tax (only if in checkout and billing address is provided)
  let tax = 0;
  if (isCheckout && country && country.length > 0 && zip && zip.length > 0) {
    // Fetch tax rate based on billing address (this is a placeholder)
    const taxRate = await getTaxRate(zip, country);
    tax = subtotal * taxRate;
  }


  // Calculate total
  let total = 0;
  if (isCheckout && tax > 0) {
    total = subtotal + shipping + tax;
  } else if (!isCheckout) {
    total = subtotal + shipping;
  }

  return { subtotal, shipping, tax, total };
}

async function getSubtotal(cart: Cart) {
  if (cart.validatedProducts.length === 0) {
    const prices = await Promise.all(cart.products.map(async (product) => {
      const prod = await prisma.product.findUnique({
        where: { id: product.productId },
        select: { price: true }
      });

      if (!prod) return 0;

      return prod.price * product.quantity;
    }));
    return prices.reduce((a, b) => a + b, 0);
  }
  const prices = await Promise.all(cart.validatedProducts.map(async (product) => {
    const prod = await prisma.product.findUnique({
      where: { id: product.productId },
      select: { price: true }
    });

    if (!prod) return 0;

    return prod.price * product.quantity;
  }));
  return prices.reduce((a, b) => a + b, 0);
}

async function getTaxRate(zip: string, country: string) {
  // This is a placeholder function. In a real application, you would fetch
  // the tax rate from a database or tax service based on the location.
  return 0.13; // 8% tax rate as an example
}