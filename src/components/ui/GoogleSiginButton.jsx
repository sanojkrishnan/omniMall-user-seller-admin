import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleRegister } from "../../redux/slice/authSlice";

function GoogleSignInButton({ text }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    try {
      const result = await dispatch(
        googleRegister(credentialResponse.credential),
      ).unwrap();

      toast.success(result.message);
      if (
        result.data.user.provider === "google" &&
        !result.data.user.dateOfBirth
      ) {
        navigate("/profile_complete");
      }
    } catch (error) {
      toast.error(error || "Google authentication failed");
    }
  };

  return (
    <GoogleLogin
      theme="outline"
      size="large"
      shape="rectangular"
      text={text}
      onSuccess={handleSuccess}
      onError={() => {
        toast.error("Google login failed");
      }}
    />
  );
}

export default GoogleSignInButton;
