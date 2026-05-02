import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Home from "./pages/public/Home";
import Loading from "./components/ui/Loading";
import OTP from "./pages/public/OTP";
import { Toastify } from "./utils/toastify";
import CartLoading from "./components/ui/CartLoading";

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
        </Routes>
      </BrowserRouter>
      <Toastify />
    </>
  );
}

export default App;
