import * as Yup from "yup";
export const productSchema = Yup.object({
  productName: Yup.string().required("Add the product name here"),
  brand: Yup.string().required("Give the brand name"),
  productDesc: Yup.string()
    .min(10, "Description must contain at least 10 characters")
    .max(200, "Description cannot exceed 200 characters")
    .required("Description is must"),
  categoryId: Yup.string().required("product category required"),
  sellerId: Yup.string().required("seller id required"),
  couponId: Yup.string(),
  stock: Yup.number().required("How many stocks are there"),
  mrp: Yup.number().required("MRP is required"),
  offerPrice: Yup.number()
    .required("Offer price is required")
    .max(Yup.ref("mrp"), "Offer price must be less than or equal to MRP"),
  productImage: Yup.array()
    .of(
      Yup.mixed()
        .test("fileSize", "Each file must be 2MB or less", (value) => {
          if (!value) return true;
          return value.size <= 2 * 1024 * 1024;
        })
        .test(
          "fileType",
          "Unsupported format (use JPEG, PNG, or WebP)",
          (value) => {
            if (!value) return true;
            return ["image/jpeg", "image/png", "image/webp"].includes(
              value.type,
            );
          },
        ),
    )
    .min(1, "At least one product image is required")
    .max(10, "You can upload a maximum of 10 images")
    .required("Product images are required"),
});
