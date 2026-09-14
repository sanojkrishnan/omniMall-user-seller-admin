import * as Yup from "yup";

export const categorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must be under 50 characters")
    .required("Category name is required"),

  categoryImage: Yup.mixed()
    .nullable()
    .required("Upload a category image")
    .test("fileSize", "File too large", (value) => {
      console.log(value.size, "value.size");
      if (!value) return true; // ← no file selected = ok
      return value.size <= 2 * 1024 * 1024;
    })
    .test("fileType", "Unsupported format", (value) => {
      if (!value) return true; // ← no file selected = ok
      return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
    }),
  isActive: Yup.boolean().default(true),
});
