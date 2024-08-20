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
}

export interface SelectedProduct {
  id: number;
  name: string;
  // price: number;
  // category: string;
  // subcategory: string;
  // reviews: Review[];
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
  }[];
}

export interface Category {
  name: string;
  image: string;
}
