import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { set } from "zod";

export interface CheckoutState {
  deliveryMethod: 'ship' | 'pickup';
  paymentMethod: 'stripe' | 'paypal';
  country: string;
  state: string;
}

const initialCheckout: CheckoutState = {
  deliveryMethod: "ship",
  paymentMethod: "stripe",
  country: "",
  state: ""
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState: initialCheckout,
  reducers: {
    setDeliveryMethod: (state, action: PayloadAction<{ deliveryMethod: 'ship' | 'pickup' }>) => {
      state.deliveryMethod = action.payload.deliveryMethod;
    },
    setPaymentMethod: (state, action: PayloadAction<{ paymentMethod: 'stripe' | 'paypal' }>) => {
      state.paymentMethod = action.payload.paymentMethod;
    },
    setCountry: (state, action: PayloadAction<{ country: string }>) => {
      state.country = action.payload.country;
    },
    setState: (state, action: PayloadAction<{ state: string }>) => {
      state.state = action.payload.state;
    },
  },
});
