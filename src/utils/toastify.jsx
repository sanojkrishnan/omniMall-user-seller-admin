import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Toastify() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
      progressClassName="custom-progress"
      className="custom-toast-container"
      icon={true}
    />
  );
}