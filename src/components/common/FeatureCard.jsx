import { memo } from "react";

const FeatureCard = memo(
    ({
        title,
        description,
        icon,
        iconBgColor = "bg-primary-100",
        iconColor = "text-primary-600",
    }) => {
        return (
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200">
                <div
                    className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-6`}
                >
                    <div className={`w-6 h-6 ${iconColor}`}>{icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
        );
    },
);

FeatureCard.displayName = "FeatureCard";

export { FeatureCard };
