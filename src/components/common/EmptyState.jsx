import { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Buttons/Button";

const EmptyState = memo(
    ({
        title,
        description,
        buttonText,
        buttonLink,
        icon,
        showButton = true,
        buttonVariant = "primary",
        buttonIcon,
    }) => {
        const DefaultIcon = (
            <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        );

        return (
            <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        {icon || DefaultIcon}
                    </div>

                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                        {title}
                    </h3>

                    <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        {description}
                    </p>

                    {showButton && buttonText && buttonLink && (
                        <Link to={buttonLink}>
                            <Button variant={buttonVariant} icon={buttonIcon}>
                                {buttonText}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        );
    },
);

EmptyState.displayName = "EmptyState";

export { EmptyState };
