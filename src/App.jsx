import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toastify } from "./utils/toastify";
import NotFound from "./components/NotFound";
import { Suspense } from "react";
import CartLoading from "./components/ui/CartLoading";
import adminRoutes from "./routes/AdminRoutes";
import publicRoutes from "./routes/PublicRoutes";
import userRoutes from "./routes/UserRoutes";
import useScrollToTop from "./hooks/useScrollToTop";
import sellerRoutes from "./routes/SellerRoutes";
import ServerErrorGate from "./components/ServerErrorGate";

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <ServerErrorGate>
          <ScrollToTop />
          <Suspense fallback={<CartLoading />}>
            <Routes>
              {adminRoutes}
              {publicRoutes}
              {userRoutes}
              {sellerRoutes}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ServerErrorGate>
      </BrowserRouter>

      <Toastify />
    </>
  );
}

export default App;
