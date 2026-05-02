import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Toastify() {
  return (
    <div>
      <ToastContainer
        position="top-right" // options: top-right, top-left, bottom-right, etc.
        autoClose={5000} // time in milliseconds (5 seconds)
        hideProgressBar={false} // show or hide the countdown bar
        newestOnTop={true} // new toasts appear above old ones
        closeOnClick={true} // close when clicked
        rtl={false} // right-to-left support
        pauseOnFocusLoss // pause timer when tab is inactive
        draggable // allow swiping/dragging to close
        pauseOnHover // pause timer when mouse is over toast
        theme="dark" // options: light, dark, colored
      />
    </div>
  );
}
