import * as Yup from "yup";
export const categorySchema = Yup.object({
  category: Yup.string()
    .oneOf(
      [
        "Electronics",
        "Fashion",
        "Home Appliance",
        "Beverages",
        "Beauty",
        "Accessories",
      ],
      "Invalid category name",
    )
    .required("Add the product name here"),
  subCategory: Yup.object().required(
    "Give additional information and specifications here",
  ),
  availableColor: Yup.array().required(
    "Add color options according to your product's available color",
  ),
});
