import * as Yup from "yup";

const luhn = (num) => {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = Number(num[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const isExpired = (expiry) => {
  const [mm, yy] = expiry.split("/").map(Number);
  const now = new Date();
  const year = 2000 + yy;
  return (
    year < now.getFullYear() ||
    (year === now.getFullYear() && mm < now.getMonth() + 1)
  );
};

export const cardNumberSchema = Yup.string()
  .required("Enter the card number")
  .test("card-number", "Enter a valid card number", (v) => {
    const d = (v || "").replace(/\s/g, "");
    return /^\d{13,19}$/.test(d) && luhn(d);
  });

export const expirySchema = Yup.string()
  .required("Enter the expiry date")
  .test("expiry", "Enter a valid future date (MM/YY)", (v) => {
    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v || "");
    return !!m && !isExpired(v);
  });

export const upiSchema = Yup.object({
  upiId: Yup.string()
    .matches(
      /^[\w.-]{2,}@[a-zA-Z]{2,}$/,
      "Enter a valid UPI ID, e.g. name@bank",
    )
    .required("Enter the UPI ID"),
  nickname: Yup.string().max(24, "Keep it under 24 characters"),
  isDefault: Yup.boolean(),
});

export const phoneSchema = Yup.string()
  .matches(/^\+?[\d\s-]{10,15}$/, "Enter a valid mobile number")
  .required("Enter the mobile number");
