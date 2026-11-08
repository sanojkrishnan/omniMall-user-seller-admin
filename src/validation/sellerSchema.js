import * as Yup from "yup";

export const sellerSchema = Yup.object({
  storeName: Yup.string().required("Write your store name"),
  productCategories: Yup.array().required("invalid product category"),
  description: Yup.string().required("Write your store description"),
  businessEmail: Yup.string()
    .email("Invalid email")
    .required("Write your business email"),
  businessPhone: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Write your business phone number"),
  businessAddress: Yup.string().required("Give us your business address"),
  pickupLocation: Yup.string().required("Give us your pickup location"),
  conditionCheck: Yup.boolean()
    .oneOf([true], "You must agree to the terms and conditions")
    .required(),
  status: Yup.string().default("active"),
  businessLogo: Yup.mixed()
    .nullable()
    .required("Logo is required")
    .test("fileSize", "File too large", (value) => {
      if (!value) return true; // ← no file selected = ok
      return value.size <= 2 * 1024 * 1024;
    })
    .test("fileType", "Unsupported format", (value) => {
      if (!value) return true; // ← no file selected = ok
      return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
    }),
});
