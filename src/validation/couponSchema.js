import * as Yup from "yup";

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

export const couponSchema = Yup.object({
  couponName: Yup.string().required("Provide the coupon name"),
  couponCode: Yup.string().required("Provide the coupon code"),
  description: Yup.string().required("Provide a description"),

  discountType: Yup.string()
    .oneOf(["percentage", "flat"], "Invalid discount type")
    .required("Select a discount type"),

  discountValue: Yup.number()
    .positive("Discount value must be positive")
    .required("Discount value is a must"),

  maxDiscount: Yup.number()
    .positive("Max discount must be positive")
    .when("discountType", {
      is: "percentage",
      then: (schema) =>
        schema.required("Max discount is required for percentage coupons"),
      otherwise: (schema) => schema.optional(),
    }),

  minOrderAmount: Yup.number()
    .min(0, "Minimum order amount cannot be negative")
    .required("Add a minimum order limit"),

  startDate: Yup.date().required("When the coupon starts"),

  endDate: Yup.date()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("When it ends"),

  status: Yup.string()
    .oneOf(["active", "inactive", "pending"], "Invalid status")
    .required("Select the coupon status"),

  usageLimit: Yup.number()
    .integer()
    .min(1, "Usage limit must be at least 1")
    .required("Add a usage limit"),

  usagePerUser: Yup.number()
    .integer()
    .min(1, "Usage per user must be at least 1")
    .required("Add a usage-per-user limit"),

  applicableProducts: Yup.array()
    .of(Yup.string().matches(OBJECT_ID_REGEX, "Invalid product id"))
    .optional(),

  excludedProducts: Yup.array()
    .of(Yup.string().matches(OBJECT_ID_REGEX, "Invalid product id"))
    .optional(),

  applicableCategories: Yup.array()
    .of(Yup.string().matches(OBJECT_ID_REGEX, "Invalid category id"))
    .optional(),

  sellerIds: Yup.array()
    .of(Yup.string().matches(OBJECT_ID_REGEX, "Invalid seller id"))
    .optional(),

  eligibleUsers: Yup.string()
    .oneOf(["all", "new", "existing"], "Invalid eligible users value")
    .required("Select eligible users"),

  paymentMethods: Yup.array()
    .of(Yup.string().oneOf(["COD", "CARD", "UPI"], "Invalid payment method"))
    .min(1, "Select at least one payment method")
    .required("Select payment methods"),

  stackable: Yup.boolean().default(false),
  autoApply: Yup.boolean().default(false),
});
