export interface Review {
  rating: number;
  text: string;
}

export interface Product {
  id: number;
  image: string;
  additionalImages?: string[];
  name: string;
  price: number;
  category: string;
  subcategory: string;
  description: string;
  reviews: Review[];
  sizes?: string[];
  availableSizes?: string[];
  colors?: string[];
  availableColors?: string[];
  isOutOfStock: boolean;
}

export interface SelectedProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  products: SelectedProduct[];
}

export interface Category {
  name: string;
  image: string;
}
