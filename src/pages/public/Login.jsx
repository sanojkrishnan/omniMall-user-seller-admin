import { useFormik } from "formik";
import OmniMall from "../../components/ui/OmniMall";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

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
  });
  return (
    <div className="bg-[url('/logo%20and%20other%20utilities/login%20bg.jpg')] bg-cover bg-center h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="w-[400px] shadow-black/50 shadow-lg bg-gradient-to-br from-white/0 via-white/40 to-white/0 backdrop-blur-md rounded-xl p-8">
        <div className=" w-full flex justify-center items-center my-4">
          <div>
            <OmniMall />
            <h3 className="text-center pt-2 font-bold text-blue-800">Log In</h3>
          </div>
        </div>
        <form onSubmit={formik.handleSubmit}>
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
                <TriangleAlert className="size-3 inline-block" /> {formik.errors.email}
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
            placeholder="Add You Password"
            id="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          <div className="w-full h-5 text-sm flex justify-between">
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 w-full">
                <TriangleAlert className="size-3 inline-block" />{" "}
                {formik.errors.password}
              </p>
            )}
            <div className="w-full cursor-pointer flex justify-end">
              <p className="text-blue-600">Forgot Password</p>
            </div>
          </div>

          <button
            className="bg-black text-white w-full hover:shadow-lg shadow-black p-2 mt-4 rounded-lg"
            type="submit"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="border-[0.5px] border-black/40 shadow-lg hover:bg-white/20 w-full p-2 mt-2 rounded-lg"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
