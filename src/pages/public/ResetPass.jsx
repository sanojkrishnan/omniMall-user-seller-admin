import { FormCard } from "../../components/ui/FormCard";
import OmniMall from "../../components/ui/OmniMall";
import { useFormik } from "formik";
import { Button } from "../../components/ui/Button";
import { TriangleAlert } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/slice/authSlice";
import { toast } from "react-toastify";
import Loading from "../../components/ui/Loading";

function ResetPass() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { message, isLoading } = useSelector((state) => state.auth);

  // If no token in URL, show error early
  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-500 font-semibold">
          Invalid or missing reset link. Please request a new one.
        </p>
      </div>
    );
  }

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.newPassword) {
        errors.newPassword = "New password is required";
      } else if (values.newPassword.length < 8) {
        errors.newPassword = "Password must be at least 8 characters";
      } else if (!values.newPassword.match(/[A-Z]/)) {
        errors.newPassword =
          "Password must contain at least one uppercase letter";
      } else if (!values.newPassword.match(/[0-9]/)) {
        errors.newPassword = "Password must contain at least one number";
      } else if (!values.newPassword.match(/[!@#$%^&*]/)) {
        errors.newPassword =
          "Password must contain at least one special character";
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      return errors;
    },
    onSubmit: async (values) => {
      const result = await dispatch(
        resetPassword({
          token,
          password: values.newPassword,
        }),
      );

      if (resetPassword.fulfilled.match(result)) {
        toast.success(message || "Password reset successful!");
      } else {
        toast.error(message || "Reset failed. Link may have expired.");
      }
    },
  });

  return (
    <div className="bg-[url('/logo%20and%20other%20utilities/forgot-pass.jpg')] bg-cover bg-center w-full bg-blue-300 h-screen flex justify-center items-center">
      <FormCard>
        <div className=" w-full flex justify-center items-center my-4">
          <div className="text-center">
            <OmniMall />
            <h3 className="text-center pt-2 font-bold text-blue-800">
              Reset Password
            </h3>
          </div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <label className="font-semibold" htmlFor="password">
            New Password :
          </label>
          <input
            className="p-2 cursor-pointer placeholder:text-gray-900 rounded-lg bg-transparent border-[0.5px] border-black/50 w-full"
            type="password"
            name="newPassword"
            placeholder="Enter New Password"
            id="newPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
          />
          <div className="w-full h-5 text-sm flex justify-between">
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-500 w-full">
                <TriangleAlert className="size-3 inline-block" />{" "}
                {formik.errors.newPassword}
              </p>
            )}
          </div>
          <label className="font-semibold" htmlFor="confirmPassword">
            Confirm Password :
          </label>
          <input
            className="p-2 cursor-pointer placeholder:text-gray-900 rounded-lg bg-transparent border-[0.5px] border-black/50 w-full"
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            id="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
          />
          <div className="w-full h-5 text-sm flex justify-between">
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 w-full">
                  <TriangleAlert className="size-3 inline-block" />{" "}
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loading variant="secondary" /> : "Confirm"}
            Confirm
          </Button>
        </form>
      </FormCard>
    </div>
  );
}

export default ResetPass;
