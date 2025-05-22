import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface SummaryCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: number;
    bgColor?: string;
    iconColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
    icon,
    title,
    value,
    unit = '',
    trend,
    trendValue,
    bgColor = 'bg-blue-100',
    iconColor = 'text-blue-600'
}) => {
    // Get trend indicator component
    const getTrendIndicator = (trend?: 'up' | 'down' | 'stable', value?: number) => {
        if (!trend || trend === 'stable') {
            return <span className="text-gray-500 text-xs">Stable</span>;
        }

        return (
            <div className="flex items-center">
                {trend === 'down' ? (
                    <span className="flex items-center text-green-500 text-xs">
                        <ArrowDown size={12} className="mr-1" /> {value}%
                    </span>
                ) : (
                    <span className="flex items-center text-red-500 text-xs">
                        <ArrowUp size={12} className="mr-1" /> {value}%
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 ${bgColor} rounded-lg`}>
                    <div className={iconColor}>{icon}</div>
                </div>
                {trend && trendValue && getTrendIndicator(trend, trendValue)}
            </div>
            <h3 className="text-lg font-medium text-gray-600">{title}</h3>
            <p className="text-3xl font-bold text-gray-800">
                {value}{unit}
            </p>
        </div>
    );
};

export default SummaryCard;