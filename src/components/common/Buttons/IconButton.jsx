import { Button } from "@/components/common/Buttons/Button";

export function IconButton({
    icon,
    title,
    size = "medium",
    variant = "ghost",
    className = "",
    ...props
}) {
    return (
        <Button
            variant={variant}
            className={`${className}`}
            title={title}
            size={size}
            aria-label={title}
            {...props}
        >
            {icon}
        </Button>
    );
}
