import { Field, Form, Formik } from "formik";
import { userSchema } from "../../validation/userSchema";
import OmniMall from "../../components/ui/OmniMall";
import { Eye, EyeOff, Trash, TriangleAlert, UserPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleImage } from "../../utils/imageCompressor";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slice/authSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Loading from "../../components/ui/Loading";
import { Button } from "../../components/ui/Button";
import { FormCard } from "../../components/ui/FormCard";
import GoogleSignInButton from "../../components/ui/GoogleSiginButton";

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [stepErrors, setStepErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); //for password showing
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); //for confirm password showing

  // getting the auth state from the redux store
  const { message, isLoading, error, otpSent } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
    } else if (otpSent?.status) {
      navigate(`/otp`);
      toast.success(message);
      console.log(message);
    }
  }, [error, otpSent, navigate, message]);

  const dispatch = useDispatch();
  return (
    <>
      <div className="bg-[url('/logo%20and%20other%20utilities/register.jpg')] bg-cover bg-center h-[100vh] w-[100vw] flex items-center justify-center">
        <FormCard>
          <div className=" w-full flex justify-center items-center mb-2 mt-2">
            <div className="text-center">
              <OmniMall />
              <h3 className="text-center pt-2 font-bold text-blue-800">
                Sign Up
              </h3>
            </div>
          </div>
          {/* Step indicator */}
          <div className="relative mb-2">
            <div className="flex  items-center justify-center w-full">
              {[0, 1, 2, 3].map((i) => (
                <div className="w-fit h-10 flex justify-center items-center">
                  <div
                    key={i}
                    className={` rounded-full flex items-center justify-center transition-all duration-500
          ${i < step ? "w-5 h-5 border-black bg-black" : i === step ? "w-5 h-5 border-4 animate-pulse border-black" : "w-0"}`}
                  >
                    {i < step && (
                      <svg
                        className="w-3 h-4 text-white animate-[drawTick_0.3s_ease-in-out]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {i < 3 && (
                    <div
                      className={` h-1 rounded-xl transition-all duration-500 ${
                        step > i ? "bg-black w-12 sm:w-24" : "w-0"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
              dateOfBirth: "",
              gender: "",
              role: "user",
              conditionCheck: false,
              profileImage: null,
              status: "active",
            }}
            validationSchema={userSchema}
            onSubmit={(values) => {
              // build FormData for multer
              const formData = new FormData();
              formData.append("firstName", values.firstName);
              formData.append("lastName", values.lastName);
              formData.append("email", values.email);
              formData.append("password", values.password);
              formData.append("dateOfBirth", values.dateOfBirth);
              formData.append("gender", values.gender);
              formData.append("role", values.role);
              formData.append("status", values.status);
              if (values.profileImage) {
                formData.append("profileImage", values.profileImage);
              }

              dispatch(registerUser({ formData, email: values.email }));
            }}
          >
            {({ values, setFieldValue, validateForm, submitForm }) => (
              <Form>
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${step * 100}%)` }}
                  >
                    {/* first set */}
                    <div className="min-w-full p-2 border-[0.5px] border-black/40 rounded-xl">
                      <div className="sm:flex justify-between">
                        <div>
                          {/* First Name : */}
                          <label
                            className="font-semibold block"
                            htmlFor="firstName"
                          >
                            First Name :
                          </label>
                          <Field
                            className="p-2 cursor-pointer w-full rounded-lg bg-transparent border-[0.5px] border-black/50 placeholder:text-gray-900"
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Your First Name"
                          />

                          <div className="h-5">
                            {stepErrors.firstName && (
                              <p className="text-red-500 text-sm">
                                <TriangleAlert className="size-3 inline-block" />{" "}
                                {stepErrors.firstName}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          {/* last Name  */}
                          <label
                            className="block font-semibold"
                            htmlFor="lastName"
                          >
                            Last Name :
                          </label>
                          <Field
                            className="p-2 cursor-pointer w-full rounded-lg bg-transparent border-[0.5px] border-black/50 placeholder:text-gray-900"
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Your last Name"
                          />
                          <div className="h-5">
                            {stepErrors.lastName && (
                              <p className="text-red-500 text-sm">
                                <TriangleAlert className="size-3 inline-block" />{" "}
                                {stepErrors.lastName}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* email */}
                      <label className="font-semibold" htmlFor="email">
                        Email :
                      </label>

                      <Field
                        className="p-2 cursor-pointer rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-900"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Your Email"
                      />
                      <div className="h-5">
                        {stepErrors.email && (
                          <p className="text-red-500 text-sm">
                            <TriangleAlert className="size-3 inline-block" />{" "}
                            {stepErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* second set */}

                    <div className="min-w-full p-2 border-[0.5px] border-black/40 rounded-xl">
                      {/* date of birth */}
                      <label className="font-semibold" htmlFor="date">
                        Date Of Birth :
                      </label>
                      <Field
                        className="p-2 cursor-pointer rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-900"
                        type="date"
                        name="dateOfBirth"
                        id="date"
                        placeholder="Your DAte Of Birth"
                      />
                      <div className="h-5">
                        {stepErrors.dateOfBirth && (
                          <p className="text-red-500 text-sm">
                            <TriangleAlert className="size-3 inline-block" />{" "}
                            {stepErrors.dateOfBirth}
                          </p>
                        )}
                      </div>
                      {/* gender */}

                      <label className="font-semibold">Gender :</label>
                      {/* male */}
                      <div className="flex justify-start items-center gap-2 mt-2">
                        <Field
                          className="cursor-pointer size-5"
                          type="radio"
                          name="gender"
                          id="male"
                          value="male"
                          placeholder="Date Of Birth"
                        />
                        <label className="cursor-pointer" htmlFor="male">
                          Male
                        </label>
                      </div>
                      {/* female */}
                      <div className="flex justify-start items-center gap-2">
                        <Field
                          className="cursor-pointer size-5"
                          type="radio"
                          name="gender"
                          id="female"
                          value="female"
                          placeholder="Date Of Birth"
                        />
                        <label className="cursor-pointer" htmlFor="female">
                          Female
                        </label>
                      </div>
                      <div className="h-5">
                        {stepErrors.gender && (
                          <p className="text-red-500 text-sm">
                            <TriangleAlert className="size-3 inline-block" />{" "}
                            {stepErrors.gender}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* third set */}
                    <div className="min-w-full p-2 border-[0.5px] border-black/40 rounded-xl">
                      {/* Profile picture */}
                      <div className="w-full flex justify-center items-center">
                        <div>
                          <div className="relative flex w-[80px] h-[80px] justify-center items-center">
                            <label className="flex  items-center justify-center w-[50px] h-[50px] border-2 border-black/60  rounded-full cursor-pointer hover:border-black/30 transition">
                              <span className="text-gray-600">
                                {values.profileImage ? (
                                  <img
                                    src={URL.createObjectURL(
                                      values.profileImage,
                                    )}
                                    alt="preview"
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <UserPen />
                                )}
                              </span>
                              <input
                                className="hidden"
                                accept="image/*"
                                type="file"
                                name="profileImage"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;

                                  const compressed = await handleImage(file);
                                  setFieldValue("profileImage", compressed);
                                  e.target.value = null; //resetting the input value so i can select same picture more than one time
                                }}
                              />
                            </label>
                            <div
                              onClick={() =>
                                setFieldValue("profileImage", null)
                              }
                              className={`absolute right-1 cursor-pointer bottom-3 z-50 ${values.profileImage ? "block" : "hidden"} rounded-full w-fit h-fit bg-black text-white p-1 `}
                            >
                              <Trash className="size-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <h2 className="font-semibold mb-6">Profile picture</h2>
                        <p>
                          Add your profile picture here. The profile picture is
                          not mandatory, click next to skip
                        </p>
                      </div>
                    </div>
                    {/* fourth set */}
                    <div className="min-w-full p-2 border-[0.5px] border-black/40 rounded-xl">
                      {/* password */}
                      <label className="font-semibold" htmlFor="password">
                        Password :
                      </label>
                      <div className="relative">
                        <Field
                          className="p-2 cursor-pointer rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-900"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-6 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <div className="h-5">
                        {stepErrors.password && (
                          <p className="text-red-500 text-sm">
                            <TriangleAlert className="size-3 inline-block" />{" "}
                            {stepErrors.password}
                          </p>
                        )}
                      </div>
                      {/* confirm password */}
                      <label
                        className="font-semibold"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password :
                      </label>
                      <div className="relative">
                        <Field
                          className="p-2 cursor-pointer rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-900"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          id="confirmPassword"
                          placeholder="Confirm Password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-6 top-1/2 -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <div className="h-5">
                        {stepErrors.confirmPassword && (
                          <p className="text-red-500 text-sm">
                            <TriangleAlert className="size-3 inline-block" />{" "}
                            {stepErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                      {/* terms and conditions */}
                      <Field
                        className="cursor-pointer"
                        id="condition"
                        type="checkbox"
                        name="conditionCheck"
                      />
                      <label
                        className={`cursor-pointer font-semibold  text-black `}
                        htmlFor="condition"
                      >
                        &nbsp; I agree to the terms and conditions
                      </label>
                      <div className="h-5">
                        {stepErrors.conditionCheck && (
                          <p className="text-red-500 text-sm">
                            <TriangleAlert className="size-3 inline-block" />{" "}
                            {stepErrors.conditionCheck}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  type={"button"}
                  disabled={(step === 3 && !values.conditionCheck) || isLoading}
                  onClick={async () => {
                    const stepFields = [
                      ["firstName", "lastName", "email"],
                      ["dateOfBirth", "gender"],
                      [],
                      ["password", "confirmPassword", "conditionCheck"],
                    ][step];

                    const errors = await validateForm();

                    const currentErrors = {};
                    stepFields.forEach((f) => {
                      if (errors[f]) currentErrors[f] = errors[f];
                    });

                    if (Object.keys(currentErrors).length > 0) {
                      setStepErrors(currentErrors);
                      return;
                    }

                    setStepErrors({});

                    if (step === 3) {
                      submitForm();
                      return;
                    }

                    setStep((prev) => prev + 1);
                  }}
                >
                  {isLoading ? (
                    <Loading variant="secondary" />
                  ) : step === 3 ? (
                    "Send OTP"
                  ) : (
                    "Next"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setStepErrors({});
                    step === 0
                      ? navigate("/login")
                      : setStep((prev) => prev - 1);
                  }}
                  variant="secondary"
                >
                  {step === 0 ? "Go To Login" : "Go Back"}
                </Button>
                <div className="rounded-xl mt-2 overflow-hidden">
                  <GoogleSignInButton text={"signup_with"} />
                </div>
              </Form>
            )}
          </Formik>
        </FormCard>
      </div>
    </>
  );
}

export default Register;
