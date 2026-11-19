// validation/orderSchema.js
import * as Yup from "yup";
import { PAYMENT_METHODS } from "../config/app";

export const placeOrderSchema = Yup.object({
  items: Yup.array()
    .of(
      Yup.object({
        productId: Yup.string().required(),
        quantity: Yup.number()
          .integer("Quantity must be a whole number")
          .min(1, "Minimum quantity is 1")
          .max(10, "Maximum quantity is 10")
          .required(),
        variant: Yup.object({
          size: Yup.string(),
          color: Yup.string(),
        }).optional(),
      }),
    )
    .min(1, "Your cart is empty")
    .required(),

  addressId: Yup.string().required("Select a delivery address"),

  paymentMethod: Yup.string()
    .oneOf(PAYMENT_METHODS, "Select a payment method")
    .required("Select a payment method"),

  couponCode: Yup.string()
    .trim()
    .uppercase()
    .min(3, "Minimum 3 letter is needed")
    .max(6, "maximum 6 letter is allowed")
    .nullable()
    .transform((v) => (v === "" ? null : v)),

  notes: Yup.string().trim().max(300, "Maximum 300 characters"),
});

export const placeOrderInitialValues = {
  items: [],
  addressId: "",
  paymentMethod: "",
  couponCode: "",
  notes: "",
};
