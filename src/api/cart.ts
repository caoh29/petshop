import { getProductById } from "./products";
import { Cart } from "./types";

const cart: Cart = {
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

export const addToCart = async (productId: number, {
  quantity,
  options, 
}: {
  quantity: number,
  options: { size?: string, color?: string }
}): Promise<Cart> => {
  const product = await getProductById(productId);
  if (product) {
    cart.products.push({
      name: product.name,
      id: product.id,
      image: product.image,
      price: product.price,
      quantity,
      size: options.size ?? '',
      color: options.color ?? '',
    });
  }
  return cart;
};

export const clearCart = async (): Promise<Cart> => {
  cart.products = [];
  return cart;
};
