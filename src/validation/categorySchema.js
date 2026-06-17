import * as Yup from "yup";

export const categoryValidation = Yup.object({
  name: Yup.string()
    .trim()
    .oneOf([
      "Electronics",
      "Home Appliances",
      "Beauty",
      "Fashion",
      "Accessories",
      "Beverages",
    ])
    .required("Category name is required"),

  subCategories: Yup.array()
    .of(Yup.string().trim())
    .min(1, "At least one sub category is required")
    .required("Sub category is required"),

  availableColors: Yup.array()
    .of(Yup.string().trim())
    .min(1, "At least one color is required")
    .required("Available colors are required"),

  status: Yup.string()
    .oneOf(["active", "inactive"], "Status must be active or inactive")
    .default("active"),

  displaySection: Yup.string()
    .oneOf(
      ["featured", "trending", "new arrivals", "sale"],
      "Invalid display section",
    )
    .default("featured"),

  gender: Yup.string()
    .oneOf(
      ["men", "women", "unisex", "kids"],
      "Gender must be men, women, unisex or kids",
    )
    .required("Gender is required"),
});
