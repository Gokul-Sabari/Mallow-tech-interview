// src/components/Toaster.tsx
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  warning: (msg: string) => toast.warning(msg),
  info: (msg: string) => toast.info(msg),
};

const Toaster = () => {
  return <ToastContainer position="top-right" autoClose={3000} />;
};

export default Toaster;
