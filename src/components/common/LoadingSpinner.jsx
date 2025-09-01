export function LoadingSpinner({
    size = "medium",
    text = "Cargando...",
    showText = true,
    className = "",
}) {
    const sizeClasses = {
        small: "w-4 h-4",
        medium: "w-8 h-8",
        large: "w-12 h-12",
        xlarge: "w-16 h-16",
    };

    return (
        <div className={`loading-spinner ${className}`}>
            <div className={`spinner ${sizeClasses[size]}`}>
                <div className="spinner-circle"></div>
            </div>
            {showText && text && <p className="loading-text">{text}</p>}
        </div>
    );
}
