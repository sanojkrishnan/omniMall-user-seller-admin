import { GoogleLogin } from "@react-oauth/google";
import { saveUser, setAuthToken } from "../../utils/apiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../services/authService";

function GoogleSignInButton({ text }) {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await AuthAPI.googleRegister({
        credential: credentialResponse.credential,
      });

      if (response.success) {
        setAuthToken(response.data.token);
        saveUser(response.data.user);

        toast.success("Login successful");
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error?.response?.message || "Google authentication failed",
      );
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
