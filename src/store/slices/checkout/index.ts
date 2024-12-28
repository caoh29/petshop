import { BillingInfo, ShippingInfo } from "@/api/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface CheckoutState {
  deliveryMethod: 'ship' | 'pickup',
  email: string,
  proceedToPayment: boolean,

  timestamp: string;

  shippingInfo: ShippingInfo,
  billingInfo: BillingInfo,
}

const initialState: CheckoutState = {
  deliveryMethod: "ship",
  email: "",
  proceedToPayment: false,

  timestamp: "",

  shippingInfo: {
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  },

  billingInfo: {
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  },
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setDeliveryMethod: (state, action: PayloadAction<'ship' | 'pickup'>) => {
      state.deliveryMethod = action.payload;
    },

    setShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },

    setBillingInfo: (state, action: PayloadAction<BillingInfo>) => {
      state.billingInfo = action.payload;
    },

    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },

    checkIfProceedToPayment: (state) => {
      if (!state.proceedToPayment && state.deliveryMethod && state.email.length > 0 && state.billingInfo.firstName.length > 0 && state.billingInfo.lastName.length > 0 && state.billingInfo.address.length > 0 && state.billingInfo.city.length > 0 && state.billingInfo.country.length > 0 && state.billingInfo.state.length > 0 && state.billingInfo.zip.length > 0) {
        state.proceedToPayment = true;
      }

      if (state.proceedToPayment && (state.deliveryMethod && state.email.length === 0 || state.billingInfo.firstName.length === 0 || state.billingInfo.lastName.length === 0 || state.billingInfo.address.length === 0 || state.billingInfo.city.length === 0 || state.billingInfo.country.length === 0 || state.billingInfo.state.length === 0 || state.billingInfo.zip.length === 0)) {
        state.proceedToPayment = false;
      }
    },

    setTimestamp: (state, action: PayloadAction<string>) => {
      state.timestamp = action.payload;
    },

    // Reset the checkout state (useful on order completion or cancellation)
    resetCheckout: () => initialState
  }
});

