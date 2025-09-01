import toast from "react-hot-toast";

export const useToast = () => {
    const showSuccess = (message) => {
        toast.success(message);
    };

    const showError = (message) => {
        toast.error(message);
    };

    const showInfo = (message) => {
        toast(message);
    };

    const showWarning = (message) => {
        toast(message, {
            icon: "⚠️",
            style: {
                background: "#f59e0b",
                color: "#fff",
            },
        });
    };

    return {
        showSuccess,
        showError,
        showInfo,
        showWarning,
    };
};
