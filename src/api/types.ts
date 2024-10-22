export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isAdmin: boolean;
  isVerified: boolean;
  orders: Order[];
  reviews: Review[];
  cart: Cart;
  wishlist: Product[];
}

export interface Order {
  id: string;
  userId: string;
  products: SelectedProduct[];
  total: number;
  createdAt: string;
  status: string;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  shippingMethod: string;
  trackingNumber: string;
}


export interface Review {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  userId: string;
  productId: string;
}

export interface Product {
  id: string;
  sku: string;
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
  stock: number;
  isOutOfStock: boolean;
  createdAt: Date | string;
}

export interface SelectedProduct {
  productId: string;
  productImage: string;
  productName: string;
  productPrice: number;
  productCategory: string;
  productSubcategory: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  id: string;
  userId: string;
  products: SelectedProduct[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface SubCategory {
  id: string;
  name: string;
  image: string;
}

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterGroup {
  name: string;
  options: FilterOption[];
}