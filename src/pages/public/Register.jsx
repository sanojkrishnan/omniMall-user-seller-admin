import { ErrorMessage, Field, Form, Formik } from "formik";
import { userSchema } from "../../validation/userSchema";
import OmniMall from "../../components/ui/OmniMall";
import { Trash, TriangleAlert, UserPen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleImage } from "../../utils/imageCompressor";

function Register() {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-[url('/logo%20and%20other%20utilities/register.jpg')] bg-cover bg-center h-[100vh] w-[100vw] flex items-center justify-center">
        <div
          className="w-[500px] h-[550px] overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-transparent
 shadow-black/50 shadow-lg bg-gradient-to-br from-white/0 via-white/40 to-white/0 backdrop-blur-md rounded-xl p-8"
        >
          <div className=" w-full flex justify-center items-center my-4">
            <div>
              <OmniMall />
              <h3 className="text-center pt-2 font-bold text-blue-800">
                Sign Up
              </h3>
            </div>
          </div>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
              dateOfBirth: "",
              gender: "",
              position: "user",
              conditionCheck: false,
              profile: null,
            }}
            validationSchema={userSchema}
            onSubmit={(values) => {
              console.log("Register data:", values);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                {/* Profile picture */}
                <div className="w-full flex justify-center items-center py-2">
                  <div>
                    <div className="relative flex w-[80px] h-[80px] justify-center items-center">
                      <label className="flex ml-6 items-center justify-center w-[50px] h-[50px] border-2 border-black/60  rounded-full cursor-pointer hover:border-black/30 transition">
                        <span className="text-gray-600">
                          {values.profile ? (
                            <img
                              src={URL.createObjectURL(values.profile)}
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
                          name="profile"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            const compressed = await handleImage(file);
                            setFieldValue("profile", compressed);
                            e.target.value = null; //resetting the input value so i can select same picture more than one time
                          }}
                        />
                      </label>
                      <div
                        onClick={() => setFieldValue("profile", null)}
                        className={`absolute right-1 cursor-pointer bottom-3 z-50 ${values.profile ? "block" : "hidden"} rounded-full w-fit h-fit bg-black text-white p-1 `}
                      >
                        <Trash className="size-4" />
                      </div>
                    </div>
                    <h2 className="font-semibold">Profile picture</h2>
                  </div>
                </div>
                <div className="sm:flex justify-between">
                  <div>
                    {/* First Name : */}
                    <label className="font-semibold block" htmlFor="firstName">
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
                      <ErrorMessage
                        name="firstName"
                        render={(msg) => (
                          <p className="text-red-500 text-sm">
                            <TriangleAlert className="inline-block" /> {msg}
                          </p>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    {/* last Name  */}
                    <label className="block font-semibold" htmlFor="lastName">
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
                      <ErrorMessage
                        name="lastName"
                        render={(msg) => (
                          <p className="text-red-500 text-sm">
                            <TriangleAlert className="inline-block" /> {msg}
                          </p>
                        )}
                      />
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
                  <ErrorMessage
                    name="email"
                    render={(msg) => (
                      <p className="text-red-500 text-sm">
                        <TriangleAlert className="inline-block" /> {msg}
                      </p>
                    )}
                  />
                </div>
                {/* password */}
                <label className="font-semibold" htmlFor="password">
                  Password :
                </label>
                <Field
                  className="p-2 cursor-pointer rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-900"
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                />
                <div className="h-5">
                  <ErrorMessage
                    name="password"
                    render={(msg) => (
                      <p className="text-red-500 text-sm">
                        <TriangleAlert className="inline-block" /> {msg}
                      </p>
                    )}
                  />
                </div>
                {/* confirm password */}
                <label className="font-semibold" htmlFor="confirmPassword">
                  Confirm Password :
                </label>
                <Field
                  className="p-2 cursor-pointer rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-900"
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                />
                <div className="h-5">
                  <ErrorMessage
                    name="confirmPassword"
                    render={(msg) => (
                      <p className="text-red-500 text-sm">
                        <TriangleAlert className="inline-block" /> {msg}
                      </p>
                    )}
                  />
                </div>
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
                  <ErrorMessage
                    name="dateOfBirth"
                    render={(msg) => (
                      <p className="text-red-500 text-sm">
                        <TriangleAlert className="inline-block" /> {msg}
                      </p>
                    )}
                  />
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
                  <ErrorMessage
                    name="gender"
                    render={(msg) => (
                      <p className="text-red-500 text-sm">
                        <TriangleAlert className="inline-block" /> {msg}
                      </p>
                    )}
                  />
                </div>
                {/* position */}
                <label className="font-semibold">
                  Are You Here For Selling Products ?
                </label>
                {/* yes */}
                <div className="flex justify-start gap-2 items-center mt-2">
                  <div className="flex justify-start items-center gap-2">
                    <Field
                      className="cursor-pointer size-5"
                      type="radio"
                      name="position"
                      id="positionYes"
                      value="seller"
                    />
                    <label className="cursor-pointer" htmlFor="positionYes">
                      Yes
                    </label>
                  </div>
                  {/* no */}
                  <div className="flex justify-start items-center gap-2">
                    <Field
                      className="cursor-pointer size-5"
                      type="radio"
                      name="position"
                      id="positionNo"
                      value="user"
                    />
                    <label className="cursor-pointer" htmlFor="positionNo">
                      No
                    </label>
                  </div>
                </div>
                <div className="h-5">
                  <ErrorMessage
                    name="position"
                    render={(msg) => (
                      <p className="text-red-500 text-sm">
                        <TriangleAlert className="inline-block" /> {msg}
                      </p>
                    )}
                  />
                </div>
                {/* terms and conditions */}
                <Field
                  className="cursor-pointer"
                  id="condition"
                  type="checkbox"
                  name="conditionCheck"
                />
                <label
                  className={`cursor-pointer font-semibold ${values.conditionCheck ? "text-black" : "text-red-500"}`}
                  htmlFor="condition"
                >
                  &nbsp; I agree to the terms and conditions
                </label>

                <button
                  className="bg-black disabled:bg-gray-700 text-white w-full hover:shadow-lg shadow-black p-2 mt-4 rounded-lg"
                  type="submit"
                  disabled={!values.conditionCheck}
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="border-[0.5px] border-black/40 shadow-lg hover:bg-white/20 w-full p-2 mt-2 rounded-lg"
                >
                  Log In
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Register;
