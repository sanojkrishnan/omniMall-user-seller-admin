import { useFormik } from "formik";
import OmniMall from "../../components/ui/OmniMall";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OTP() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.email) {
        errors.email = "Email is required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }

      if (!values.otp) {
        errors.otp = "OTP is required";
      }


      return errors;
    },
  });
  return (
    <div className="bg-[url('/logo%20and%20other%20utilities/login%20bg.jpg')] bg-cover bg-center h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="w-[400px] shadow-black/50 shadow-lg bg-gradient-to-br from-white/0 via-white/40 to-white/0 backdrop-blur-md rounded-xl p-8">
        <div className=" w-full flex justify-center items-center my-4">
          <div className="text-center">
            <OmniMall />
            <h3 className="text-center pt-2 font-bold text-blue-800">Confirm OTP</h3>
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

          <button
            className="bg-black text-white w-full hover:shadow-lg shadow-black p-2 mt-4 rounded-lg"
            type="submit"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="border-[0.5px] border-black/40 shadow-lg hover:bg-white/20 w-full p-2 mt-2 rounded-lg"
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default OTP;
