import { getProductByIdAction } from "@/app/actions";
import { Cart } from "./types";

const cart: Cart = {
  id: "",
  userId: "",
  products: [
    // {
    //   id: 1,
    //   name: "Castle T-Shirt",
    //   image: "/castle-t-shirt.jpg",
    //   price: 25,
    // },
    // {
    //   id: 2,
    //   name: "Dragon T-Shirt",
    //   image: "/dragon-t-shirt.jpg",
    //   price: 25,
    // },
  ],
};

export const getCart = async (): Promise<Cart> => {
  return cart;
};

export const addToCart = async (
  productId: string,
  {
    quantity,
    options,
  }: {
    quantity: number;
    options: { size?: string; color?: string };
  }
): Promise<Cart> => {
  const product = await getProductByIdAction({ id: productId });
  const cart = await getCart();
  if (product) {
    const existingItemIndex = cart.products.findIndex(
      item =>
        item.id === productId &&
        item.size === (options.size ?? '') &&
        item.color === (options.color ?? ''),
    );

    if (existingItemIndex !== -1) {
      // Item with the same id, size, and color already exists, update its quantity
      cart.products[existingItemIndex].quantity += quantity;
    } else {
      // Item doesn't exist, add it to the cart
      cart.products.push({
        name: product.name,
        id: product.id,
        image: product.image,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        reviews: product.reviews,
        stock: product.stock,
        isOutOfStock: product.isOutOfStock,
        sku: product.sku,
        createdAt: product.createdAt,
        quantity,
        size: options.size ?? '',
        color: options.color ?? '',
      });
    }
  }
  return cart;
};

export const updateCartItem = async (
  productId: string,
  {
    quantity,
    options,
  }: {
    quantity: number;
    options: { size?: string; color?: string };
  }
): Promise<Cart> => {
  const cart = await getCart();

  const existingItemIndex = cart.products.findIndex(
    item =>
      item.id === productId &&
      item.size === (options.size ?? '') &&
      item.color === (options.color ?? ''),
  );
  if (existingItemIndex !== -1) {
    cart.products[existingItemIndex].quantity = quantity;
  }
  return cart;
}

export const deleteCartItem = async (
  productId: string,
  {
    options,
  }: {
    options: { size?: string; color?: string };
  }
): Promise<Cart> => {
  const cart = await getCart();

  const existingItemIndex = cart.products.findIndex(
    item =>
      item.id === productId &&
      item.size === (options.size ?? '') &&
      item.color === (options.color ?? ''),
  );
  if (existingItemIndex !== -1) {
    cart.products.splice(existingItemIndex, 1);
  }
  // const res = await fetch(`XXXXXXXXXXXXXXXXXXXXXXXXXXX${productId}`, {
  //   method: 'DELETE',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({ size, color })
  // });
  // const data = await res.json();
  // return data.body.cart;
  return cart;
}

export const clearCart = async (): Promise<Cart> => {
  const cart = await getCart();
  cart.products = [];
  return cart;
};
