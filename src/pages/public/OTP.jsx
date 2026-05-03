import { useFormik } from "formik";
import OmniMall from "../../components/ui/OmniMall";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { FormCard } from "../../components/ui/FormCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { verifyOTP } from "../../redux/slice/authSlice";
import Loading from "../../components/ui/Loading";

function OTP() {
  const navigate = useNavigate();

  const { user, message, isLoading, error, otpSent } = useSelector(
    (state) => state.auth,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!otpSent.status) {
      navigate("/register");
    }
    if (error) {
      toast.error(error.message);
    }
    if (user) {
      toast.success(message);
      console.log(message);
      navigate("/");
    }
  }, [error, user, message]);

  const formik = useFormik({
    initialValues: {
      email: otpSent.sentToMail || "",
      otp: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.otp) {
        errors.otp = "OTP is required";
      } else if (values.otp.length !== 6) {
        errors.otp = "OTP must be 6 digits";
      } else if (!/^\d+$/.test(values.otp)) {
        errors.otp = "OTP must contain only digits";
      }

      return errors;
    },
    onSubmit: (values) => {
      console.log("Submitting OTP:", values);
      console.log("Submitting OTP:", otpSent);
      if (error) {
        toast.error("Invalid email address");
        return;
      }
      dispatch(verifyOTP(values));
    },
  });
  return (
    <div className="bg-[url('/logo%20and%20other%20utilities/login%20bg.jpg')] bg-cover bg-center h-[100vh] w-[100vw] flex items-center justify-center">
      <FormCard>
        <div className=" w-full flex justify-center items-center my-4">
          <div className="text-center">
            <OmniMall />
            <h3 className="text-center pt-2 font-bold text-blue-800">
              Confirm OTP
            </h3>
          </div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <label className="font-semibold" htmlFor="otp">
            OTP :
          </label>
          <input
            className="p-2 cursor-pointer placeholder:text-gray-900 rounded-lg bg-transparent border-[0.5px] border-black/50 w-full"
            type="password"
            name="otp"
            placeholder="Confirm Your OTP"
            id="otp"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.otp}
          />
          <div className="w-full h-5 text-sm flex justify-between">
            {formik.touched.otp && formik.errors.otp && (
              <p className="text-red-500 w-full">
                <TriangleAlert className="size-3 inline-block" />{" "}
                {formik.errors.otp}
              </p>
            )}
            <div className="w-full cursor-pointer flex justify-end">
              <p className="text-blue-600">Resend OTP</p>
            </div>
          </div>

          <Button type="submit">
            {isLoading ? <Loading variant="secondary" /> : "Confirm"}
          </Button>
        </form>
      </FormCard>
    </div>
  );
}

export default OTP;
