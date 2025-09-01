import { useCallback, useState } from "react";

export const useConfirmModal = () => {
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        message: "",
        onConfirm: null,
        onCancel: null,
        title: "Confirmar acción",
        type: "default",
        confirmText: "Confirmar",
        cancelText: "Cancelar",
    });

    const showConfirmation = useCallback(
        (message, onConfirm, onCancel, options = {}) => {
            setConfirmModal({
                isOpen: true,
                message,
                onConfirm,
                onCancel,
                title: options.title || "Confirmar acción",
                type: options.type || "default",
                confirmText: options.confirmText || "Confirmar",
                cancelText: options.cancelText || "Cancelar",
            });
        },
        [],
    );

    const closeConfirmModal = useCallback(() => {
        setConfirmModal((prev) => ({
            ...prev,
            isOpen: false,
        }));
    }, []);

    const handleConfirm = () => {
        if (confirmModal.onConfirm) {
            confirmModal.onConfirm();
        }
        closeConfirmModal();
    };

    const handleCancel = () => {
        if (confirmModal.onCancel) {
            confirmModal.onCancel();
        }
        closeConfirmModal();
    };

    return {
        showConfirmation,
        confirmModal: {
            ...confirmModal,
            onConfirm: handleConfirm,
            onClose: handleCancel,
        },
    };
};
