import React from 'react';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    bgColor: string;
    isMainFeature?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
    bgColor,
    isMainFeature = false
}) => (
    <div className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${isMainFeature ? 'col-span-2 row-span-2' : ''}`}>
        <div className="h-full flex flex-col p-6 bg-white rounded-xl border border-gray-100">
            <div className={`${bgColor} rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 flex-grow">{description}</p>
        </div>
    </div>
);

export default FeatureCard;