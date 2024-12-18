export interface User {
  id: string;
  name?: string; // Made optional as per NextAuth schema
  email: string;
  password?: string; // Optional if you're supporting OAuth/magic links only
  emailVerified?: string; // Date in string format
  image?: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  isAdmin?: boolean;
  isVerified?: boolean;

  // Relations
  orders?: Order[];
  reviews?: Review[];
  cart?: Cart;
  wishlist?: Product[];
  accounts?: Account[]; // For OAuth providers
  sessions?: Session[]; // For active sessions

  // Optional WebAuthn support
  authenticators?: Authenticator[];
}

// New interfaces for NextAuth-related models
export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  sessionToken: string;
  userId: string;
  expires: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: string;
}

// Optional for WebAuthn support
export interface Authenticator {
  credentialID: string;
  userId: string;
  providerAccountId: string;
  credentialPublicKey: string;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: string;
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
  validatedProducts: { productId: string, isAvailable: boolean }[];
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