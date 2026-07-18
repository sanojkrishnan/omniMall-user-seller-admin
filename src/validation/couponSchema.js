import * as Yup from "yup";

export const userSchema = Yup.object({
  couponName: Yup.string().required("Provide the coupon name"),  // coupon name for admin to see
  couponCode: Yup.string().required("Provide the coupon code"),  //Unique code entered by customers.
  description: Yup.string().required("Provide a description"),   //description user/admin 
  discountType: Yup.string().required("Which type of description"), // discount type "percentage amount"  
  discountValue: Yup.number().required("Discount value is a must"),  // discount value eg: 10% / 1000rs
  maxDiscount: Yup.number().required("Put maximum discount value"),  //Caps percentage discounts.
  minOrderAmount: Yup.number().required("Add a minimum order limit"),//Order must exceed this value.
  startDate: Yup.date().required("When the coupon active"), //Coupon activation date.
  endDate: Yup.date().required("When it ends"),  //Coupon deactivation date.
  status: Yup.string()
    .oneOf(["active", "inactive", "pending"], "Invalid status")
    .required("which status is the coupon"),
  usageLimit: Yup.number().required("Add a minimum order limit"),
  usagePerUser: Yup.number().required("Add a minimum order limit"),
  applicableProducts: Yup.number().required("Add a minimum order limit"),
  excludedProducts: Yup.number().required("Add a minimum order limit"),
  applicableCategories: Yup.number().required("Add a minimum order limit"),
  sellerIds: Yup.number().required("Add a minimum order limit"),
  eligibleUsers: Yup.number().required("Add a minimum order limit"),
  paymentMethods: Yup.number().required("Add a minimum order limit"),
  stackable: Yup.number().required("Add a minimum order limit"),
  autoApply: Yup.number().required("Add a minimum order limit"),
  createdBy: Yup.number().required("Add a minimum order limit"),
});
