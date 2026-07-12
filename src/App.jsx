import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toastify } from "./utils/toastify";
import NotFound from "./components/NotFound";
import { Suspense } from "react";
import CartLoading from "./components/ui/CartLoading";
import adminRoutes from "./AdminRoutes";
import publicRoutes from "./PublicRoutes";
import userRoutes from "./UserRoutes";
import useScrollToTop from "./hooks/useScrollToTop";

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function App() {

  
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<CartLoading />}>
          <Routes>
            {adminRoutes}
            {publicRoutes}
            {userRoutes}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <Toastify />
    </>
  );
}

export default App;
