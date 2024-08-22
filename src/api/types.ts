export interface Review {
  rating: number;
  text: string;
}

export interface Product {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  description: string;
  reviews: Review[];
  sizes: string[];
  availableSizes: string[];
  colors?: string[];
  availableColors?: string[];
  isOutOfStock: boolean;
}

export interface SelectedProduct {
  size: string;
  color?: string;
  quantity: number;
}

export interface Cart {
  products: {
    id: number;
    name: string;
    image: string;
    price: number;
    size: string;
    quantity: number;
    color?: string;
  }[];
}

export interface Category {
  name: string;
  image: string;
}
