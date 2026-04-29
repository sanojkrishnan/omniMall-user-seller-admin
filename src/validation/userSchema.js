import * as Yup from "yup";
export const userSchema = Yup.object({
  firstName: Yup.string().required("Write your first name"),
  lastName: Yup.string().required("Write your last name"),
  email: Yup.string().email("Invalid email").required("Write your email"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Write your password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
  dateOfBirth: Yup.date().required("Give us your date of birth"),
  gender: Yup.string()
    .oneOf(["male", "female"], "Invalid gender")
    .required("Select your gender"),
  position: Yup.string()
    .oneOf(["user", "seller"], "Invalid position")
    .optional()
    .default("user"),
  conditionCheck: Yup.boolean()
    .required("I agree to the terms and conditions")
    .default(false),
  profile: Yup.mixed()
    .test("fileSize", "File too large", (value) => {
      return value && value.size <= 2 * 1024 * 1024;
    })
    .test("fileType", "Unsupported format", (value) => {
      return (
        value && ["image/jpeg", "image/png", "image/webp"].includes(value.type)
      );
    }),
});
