import { useFormik } from "formik";
import OmniMall from "../../components/ui/OmniMall";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { FormCard } from "../../components/ui/FormCard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/ui/Loading";
import { forgotPassword, loginUser } from "../../redux/slice/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, message, isLoading } = useSelector((state) => state.auth);

  const [forgotPassClick, setForgotPassClick] = useState(false);

  useEffect(() => {
    if (user) {
      toast.success(message);
      navigate("/");
    }
  }, [user, message, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
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

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 8) {
        errors.password = "at least 8 characters";
      }

      return errors;
    },
    onSubmit: async (values) => {
      dispatch(loginUser(values));
    },
  });

  // forgot password formik
  const forgotFormik = useFormik({
    initialValues: { email: "" },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "Email is required";
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
        errors.email = "Invalid email address";
      return errors;
    },
    onSubmit: async (values) => {
      const result = await dispatch(forgotPassword(values.email));
      if (forgotPassword.fulfilled.match(result)) {
        toast.success("Reset link sent! Check your email.", {
          toastId: "forgot-success",
        });
      }
      if (forgotPassword.rejected.match(result)) {
        toast.error(result.payload, { toastId: "forgot-error" });
      }
    },
  });

  return (
    <div
      className={`${!forgotPassClick ? "bg-[url('/logo%20and%20other%20utilities/login%20bg.jpg')]" : "bg-[url('/logo%20and%20other%20utilities/forgot-pass.jpg')]"} bg-cover bg-center h-[100vh] w-[100vw] flex items-center justify-center`}
    >
      <FormCard>
        <div className=" w-full flex justify-center items-center my-4">
          <div className="text-center">
            <OmniMall />
            <h3 className="text-center pt-2 font-bold text-blue-800">
              {!forgotPassClick ? "Log In" : "Forgot Password"}
            </h3>
          </div>
        </div>
        <form
          onSubmit={
            forgotPassClick ? forgotFormik.handleSubmit : formik.handleSubmit
          }
        >
          {forgotPassClick ? (
            <>
              <label className="font-semibold" htmlFor="forgotEmail">
                Email :
              </label>
              <input
                className="p-2 cursor-pointer rounded-lg placeholder:text-gray-900 bg-transparent border-[0.5px] border-black/50 w-full"
                type="email"
                name="email"
                id="forgotEmail"
                placeholder="Add Your Email"
                onChange={forgotFormik.handleChange}
                onBlur={forgotFormik.handleBlur}
                value={forgotFormik.values.email}
              />
              <div className="w-full h-5 text-sm">
                {forgotFormik.touched.email && forgotFormik.errors.email && (
                  <p className="text-red-500">
                    <TriangleAlert className="size-3 inline-block" />{" "}
                    {forgotFormik.errors.email}
                  </p>
                )}
              </div>
              <Button variant="primary" type="submit">
                {isLoading ? (
                  <Loading variant="secondary" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <Button
                onClick={() => {
                  setForgotPassClick(false);
                  forgotFormik.resetForm();
                }}
                variant="secondary"
                type="button"
              >
                Go Back
              </Button>
            </>
          ) : (
            <>
              <label className="font-semibold" htmlFor="email">
                Email :
              </label>
              <input
                className="p-2 cursor-pointer rounded-lg placeholder:text-gray-900 bg-transparent border-[0.5px] border-black/50 w-full"
                type="email"
                name="email"
                id="email"
                placeholder="Add Your Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              <div className="w-full h-5 text-sm">
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500">
                    <TriangleAlert className="size-3 inline-block" />{" "}
                    {formik.errors.email}
                  </p>
                )}
              </div>
              <label className="font-semibold" htmlFor="password">
                Password :
              </label>
              <input
                className="p-2 cursor-pointer placeholder:text-gray-900 rounded-lg bg-transparent border-[0.5px] border-black/50 w-full"
                type="password"
                name="password"
                placeholder="Add Your Password"
                id="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <div className="w-full h-5 text-sm ">
                {formik.touched.password && formik.errors.password && (
                  <p className="text-red-500 w-full">
                    <TriangleAlert className="size-3 inline-block" />{" "}
                    {formik.errors.password}
                  </p>
                )}
              </div>
              <div className="w-full cursor-pointer flex justify-end">
                <p
                  className="text-blue-600"
                  onClick={() => setForgotPassClick(true)}
                >
                  Forgot Password
                </p>
              </div>

              <Button variant="primary" disabled={isLoading} type="submit">
                {isLoading ? <Loading variant="secondary" /> : "Log In"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </>
          )}
        </form>
      </FormCard>
    </div>
  );
}

export default Login;
