import { useEffect } from "react";
import { Button } from "@/components/common/Buttons/Button";
import { useUIStore } from "@/stores/uiStore";

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "medium",
    closeOnOverlayClick = true,
    showCloseButton = true,
    className = "",
}) {
    const sizeClasses = {
        small: "max-w-md",
        medium: "max-w-lg",
        large: "max-w-2xl",
        xlarge: "max-w-4xl",
        fullscreen: "max-w-full h-full",
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape" && isOpen && onClose) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (event) => {
        if (
            event.target === event.currentTarget &&
            closeOnOverlayClick &&
            onClose
        ) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50 p-4"
            onClick={handleOverlayClick}
            onKeyUp={(e) => {
                if (e.key === "Escape" && isOpen && onClose) {
                    onClose();
                }
            }}
        >
            <div
                className={`bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} ${className}`}
            >
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        {title && (
                            <h2 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <Button
                                onClick={onClose}
                                className="ml-4"
                                variant="ghost"
                                size="small"
                                aria-label="Cerrar modal"
                            >
                                ✕
                            </Button>
                        )}
                    </div>
                )}

                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar acción",
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "default",
}) {
    const confirmButtonVariant = type === "danger" ? "danger" : "primary";

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
            <div className="space-y-4">
                <p className="text-gray-700">{message}</p>

                <div className="flex justify-end gap-3">
                    <Button onClick={onClose} variant="secondary" size="medium">
                        {cancelText}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant={confirmButtonVariant}
                        size="medium"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export function useModal() {
    const { modals, openModal, closeModal } = useUIStore();

    return {
        modals,
        openModal,
        closeModal,
        isModalOpen: (modalName) => modals[modalName]?.isOpen || false,
        getModalData: (modalName) => modals[modalName]?.data || null,
    };
}

export function StoreModal({ modalName, title, children, ...props }) {
    const { isModalOpen, closeModal, getModalData } = useModal();
    const isOpen = isModalOpen(modalName);
    const data = getModalData(modalName);

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => closeModal(modalName)}
            title={title}
            {...props}
        >
            {typeof children === "function" ? children(data) : children}
        </Modal>
    );
}
