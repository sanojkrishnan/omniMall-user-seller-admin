import * as Yup from "yup";

export const categoryValidation = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be under 50 characters")
    .required("Category name is required"),

  categoryImage: Yup.object({
    url: Yup.string().url("Must be a valid URL").required(),
  }).required("Category image is required"),

  isActive: Yup.boolean().default(true),
});
