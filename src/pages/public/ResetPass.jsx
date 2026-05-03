import React from "react";
import { FormCard } from "../../components/ui/FormCard";
import OmniMall from "../../components/ui/OmniMall";
import { useFormik } from "formik";
import { Button } from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/slice/authSlice";
import { toast } from "react-toastify";

function ResetPass() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors = {};
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

          <Button type="submit">
            {/* {isLoading ? <Loading variant="secondary" /> : "Confirm"} */}{" "}
            Confirm
          </Button>
        </form>
      </FormCard>
    </div>
  );
}

export default ResetPass;
