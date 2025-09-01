export function ButtonGroup({
    children,
    orientation = "horizontal",
    spacing = "normal",
    className = "",
}) {
    const orientationClasses = {
        horizontal: "flex flex-row",
        vertical: "flex flex-col",
    };

    const spacingClasses = {
        none: "gap-0",
        tight: "gap-1",
        normal: "gap-2",
        loose: "gap-4",
    };

    return (
        <div
            className={`${orientationClasses[orientation]} ${spacingClasses[spacing]} ${className}`}
        >
            {children}
        </div>
    );
}
