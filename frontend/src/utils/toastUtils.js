import toast from "react-hot-toast";

export const showWarningToast = (message) => {
  toast(message, {
    icon: "⚠️",
    duration: 4000,
    position: "bottom-center",
    style: {
      background: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fcd34d",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
    },
  });
};

export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

export const showLoadingToast = (message) => {
  return toast.loading(message);
};
