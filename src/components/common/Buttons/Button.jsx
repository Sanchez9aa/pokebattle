import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function Button({
    children,
    variant = "primary",
    size = "medium",
    disabled = false,
    loading = false,
    type = "button",
    onClick,
    className = "",
    icon,
    iconPosition = "left",
    fullWidth = false,
    ...props
}) {
    const baseClasses =
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variantClasses = {
        primary:
            "bg-white hover:bg-gray-50 focus:ring-primary-500 active:bg-gray-100 text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300",
        secondary:
            "bg-white hover:bg-gray-50 focus:ring-primary-500 text-gray-700 border border-gray-300 hover:border-gray-400",
        danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white active:bg-red-800",
        success:
            "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 active:bg-green-700",
        warning:
            "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 text-white active:bg-yellow-800",
        ghost: "bg-transparent hover:bg-gray-50 focus:ring-primary-500 text-gray-600 hover:text-gray-900",
        link: "bg-transparent hover:text-primary-700 focus:ring-primary-500 text-primary-600 underline-offset-4 hover:underline",
    };

    const sizeClasses = {
        small: "px-3 py-2 text-sm",
        medium: "px-4 py-2.5 text-sm",
        large: "px-6 py-3 text-base",
    };

    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const handleClick = (event) => {
        if (!disabled && !loading && onClick) {
            onClick(event);
        }
    };

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={handleClick}
            {...props}
        >
            {loading && (
                <LoadingSpinner
                    size="small"
                    showText={false}
                    className="mr-2"
                />
            )}

            {!loading && icon && iconPosition === "left" && (
                <span className="mr-2 -ml-1">{icon}</span>
            )}

            {children}

            {!loading && icon && iconPosition === "right" && (
                <span className="ml-2 -mr-1">{icon}</span>
            )}
        </button>
    );
}
