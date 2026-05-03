import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Home from "./pages/public/Home";
import Loading from "./components/ui/Loading";
import OTP from "./pages/public/OTP";
import { Toastify } from "./utils/toastify";
import CartLoading from "./components/ui/CartLoading";
import NotFound from "./components/NotFound";
import ResetPass from "./pages/public/ResetPass";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/cartloading" element={<CartLoading />} />
          <Route path="/reset-password" element={<ResetPass />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toastify />
    </>
  );
}

export default App;
