import * as Yup from "yup";

export const addressSchema = Yup.object({
  label: Yup.string()
    .oneOf(["Home", "Work", "Other"], "Select an address type")
    .required("Select an address type"),
  name: Yup.string().trim().required("Enter the full name"),
  phone: Yup.string()
    .matches(/^\+?[\d\s-]{10,15}$/, "Enter a valid phone number")
    .required("Enter a phone number"),
  line1: Yup.string().trim().required("Enter the address"),
  line2: Yup.string(),
  city: Yup.string().trim().required("Enter the city"),
  state: Yup.string().trim().required("Enter the state"),
  pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be 6 digits")
    .required("Enter the pincode"),
  isDefault: Yup.boolean(),
});
