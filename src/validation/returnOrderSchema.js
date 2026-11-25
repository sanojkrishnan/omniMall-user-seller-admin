import * as Yup from "yup";

export const returnOrderSchema = Yup.object({
  item: Yup.string().required("Select the item you want to return"),
  reason: Yup.string().required("Select a reason"),
  resolution: Yup.string().required("Choose refund or exchange"),
  comments: Yup.string().max(300, "Keep it under 300 characters"),
});
