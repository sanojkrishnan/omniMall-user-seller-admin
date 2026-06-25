import { Field, Form, Formik } from "formik";
import { FormCard } from "../../components/ui/FormCard";
import { TriangleAlert } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import OmniMall from "../../components/ui/OmniMall";
import { Button } from "../../components/ui/Button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { googleProfileCompletion } from "../../redux/slice/authSlice";
import { toast } from "react-toastify";

//google profile completion schema
const googleProfileSchema = Yup.object({
  dateOfBirth: Yup.date().required("Give us your date of birth"),

  gender: Yup.string().oneOf(["male", "female"]).required("Select your gender"),

  conditionCheck: Yup.boolean().oneOf(
    [true],
    "You must agree to the terms and conditions",
  ),
});

function ProfileComplete() {
  const dispatch = useDispatch();
  const { user, message } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User from Redux:", user);

    if (user.status !== "incomplete" || user.provider === "local") {
      navigate("/user", { replace: true }); // if user already has dateOfBirth or is local provider, redirect to home
    }
    if (user.status === "active" && user.provider === "google") {
      toast.success(message || "Profile completed successfully");
    }
  }, [user, navigate, message]);

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
            dateOfBirth: "",
            gender: "",
            profileId: "",
            conditionCheck: false,
          }}
          validationSchema={googleProfileSchema}
          onSubmit={(values) => {
            console.log("Submitting:", values);
            dispatch(
              googleProfileCompletion({
                dateOfBirth: values.dateOfBirth,
                gender: values.gender,
                profileId: user._id,
              }),
            );
          }}
        >
          {({ errors, submitCount }) => (
            <Form>
              <div className=" overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent w-full max-h-100 p-2 border-[0.5px] border-black/40 rounded-xl">
                {/* date of birth */}
                <label className="font-semibold" htmlFor="date">
                  Date Of Birth :
                </label>
                <Field
                  className="p-2 cursor-pointer mb-4 rounded-lg bg-transparent border-[0.5px] border-black/50 w-full placeholder:text-gray-900"
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
                <div className="flex justify-start items-center gap-2 mb-4">
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
                  className={`cursor-pointer font-semibold text-black `}
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
