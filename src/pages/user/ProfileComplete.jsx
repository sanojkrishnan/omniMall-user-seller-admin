import { Field, Form, Formik } from "formik";
import { FormCard } from "../../components/ui/FormCard";
import { Trash, TriangleAlert, UserPen } from "lucide-react";
import { userSchema } from "../../validation/userSchema";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slice/authSlice";
import OmniMall from "../../components/ui/OmniMall";
import { Button } from "../../components/ui/Button";
import { handleImage } from "../../utils/imageCompressor";
import { useEffect } from "react";

function ProfileComplete() {
  const dispatch = useDispatch();
  useEffect(() => {
    
  })
  return (
    <div className="bg-[url('/logo%20and%20other%20utilities/lipstick_profile.jpg')] bg-cover bg-center h-[100vh] w-[100vw] flex items-center justify-center">
      <FormCard>
        <div className=" w-full flex justify-center items-center mb-2 mt-2">
          <div className="text-center">
            <OmniMall />
            <h3 className="text-center pt-2 font-bold text-blue-800">
              Complete Your Profile
            </h3>
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
          {({ values, errors, setFieldValue, submitCount }) => (
            <Form>
              <div className=" overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent w-full max-h-100 p-2 border-[0.5px] border-black/40 rounded-xl">
                {/* profile picture  */}
                <div className="w-full flex justify-center items-center">
                  <div>
                    <div className="relative flex w-[80px] h-[80px] justify-center items-center">
                      <label className="flex  items-center justify-center w-[50px] h-[50px] border-2 border-black/60  rounded-full cursor-pointer hover:border-black/30 transition">
                        <span className="text-gray-600">
                          {values.profileImage ? (
                            <img
                              src={URL.createObjectURL(values.profileImage)}
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
                        onClick={() => setFieldValue("profileImage", null)}
                        className={`absolute right-1 cursor-pointer bottom-3 z-50 ${values.profileImage ? "block" : "hidden"} rounded-full w-fit h-fit bg-black text-white p-1 `}
                      >
                        <Trash className="size-4" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="font-semibold mb-2">Profile picture</h2>
                  <p className="text-sm">
                    Add your profile picture here. The profile picture is not
                    mandatory, click next to skip
                  </p>
                </div>
                <hr className=" m-2 border-black" />
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
              </div>
              <div
                className={`my-4 text-red-800 text-sm ${(submitCount !== 0 && errors.gender) || errors.dateOfBirth || errors.conditionCheck ? "border border-yellow-500 rounded-lg bg-yellow-500/10" : "border-0 bg-transparent "}`}
              >
                {submitCount !== 0 && errors.gender ? (
                  <p className=" p-1">
                    <TriangleAlert className="size-3 inline-block" /> &nbsp;
                    {errors.gender}
                  </p>
                ) : null}
                {submitCount !== 0 && errors.dateOfBirth ? (
                  <p className=" p-1">
                    <TriangleAlert className="size-3 inline-block" /> &nbsp;
                    {errors.dateOfBirth}
                  </p>
                ) : null}
                {submitCount !== 0 && errors.conditionCheck ? (
                  <p className="p-1">
                    <TriangleAlert className="size-3 inline-block" /> &nbsp;
                    {errors.conditionCheck}
                  </p>
                ) : null}
              </div>
              <Button variant="primary" type="submit">
                {/* {isLoading ? <Loading variant="secondary" /> : "Submit"} */}{" "}
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </FormCard>
    </div>
  );
}

export default ProfileComplete;
