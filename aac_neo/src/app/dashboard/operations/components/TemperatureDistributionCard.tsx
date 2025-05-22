// components/TemperatureDistributionCard.tsx
import React from 'react';
import { Thermometer, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { TemperatureCategories } from '../types/batch';

interface TemperatureDistributionCardProps {
    tempCategories: TemperatureCategories;
    totalBatches: number;
}

interface TemperatureStatProps {
    label: string;
    count: number;
    percentage: number;
    color: string;
    textColor: string;
    icon: React.ReactNode;
    description: string;
}

const TemperatureStat: React.FC<TemperatureStatProps> = ({
    label,
    count,
    percentage,
    color,
    textColor,
    icon,
    description
}) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${color}`}>
                    {icon}
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${textColor}`}>
                            {label}
                        </span>
                        <span className="text-xs text-gray-500">
                            ({description})
                        </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                        {percentage.toFixed(1)}% of total batches
                    </div>
                </div>
            </div>
            <div className="text-right">
                <span className={`text-2xl font-bold ${textColor}`}>
                    {count}
                </span>
                <div className="text-xs text-gray-500">
                    batches
                </div>
            </div>
        </div>
    );
};

const TemperatureDistributionCard: React.FC<TemperatureDistributionCardProps> = ({
    tempCategories,
    totalBatches
}) => {
    // Calculate percentages
    const optimalPercentage = totalBatches > 0 ? (tempCategories.optimal / totalBatches) * 100 : 0;
    const acceptablePercentage = totalBatches > 0 ? (tempCategories.acceptable / totalBatches) * 100 : 0;
    const highPercentage = totalBatches > 0 ? (tempCategories.high / totalBatches) * 100 : 0;

    // Temperature stats configuration
    const temperatureStats = [
        {
            label: "Optimal",
            count: tempCategories.optimal,
            percentage: optimalPercentage,
            color: "bg-green-100",
            textColor: "text-green-700",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            description: "≤47°C"
        },
        {
            label: "Acceptable",
            count: tempCategories.acceptable,
            percentage: acceptablePercentage,
            color: "bg-yellow-100",
            textColor: "text-yellow-700",
            icon: <TrendingUp className="h-4 w-4 text-yellow-600" />,
            description: "48°C"
        },
        {
            label: "High",
            count: tempCategories.high,
            percentage: highPercentage,
            color: "bg-red-100",
            textColor: "text-red-700",
            icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
            description: ">48°C"
        }
    ];

    // Calculate overall status
    const getOverallStatus = () => {
        if (optimalPercentage >= 80) {
            return {
                status: "Excellent",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200"
            };
        } else if (optimalPercentage >= 60) {
            return {
                status: "Good",
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200"
            };
        } else {
            return {
                status: "Needs Attention",
                color: "text-red-600",
                bgColor: "bg-red-50",
                borderColor: "border-red-200"
            };
        }
    };

    const overallStatus = getOverallStatus();

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Temperature Distribution
                </h3>
                <Thermometer className="h-5 w-5 text-gray-500" />
            </div>

            {/* Overall Status */}
            <div className={`mb-4 p-3 rounded-lg ${overallStatus.bgColor} ${overallStatus.borderColor} border`}>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                        Overall Status:
                    </span>
                    <span className={`text-sm font-semibold ${overallStatus.color}`}>
                        {overallStatus.status}
                    </span>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                    {optimalPercentage.toFixed(1)}% of batches in optimal temperature range
                </div>
            </div>

            {/* Temperature Categories */}
            <div className="space-y-3 mb-4">
                {temperatureStats.map((stat, index) => (
                    <TemperatureStat
                        key={index}
                        label={stat.label}
                        count={stat.count}
                        percentage={stat.percentage}
                        color={stat.color}
                        textColor={stat.textColor}
                        icon={stat.icon}
                        description={stat.description}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        Temperature Distribution
                    </span>
                    <span className="text-xs text-gray-500">
                        {totalBatches} total batches
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="h-full flex">
                        {/* Optimal portion */}
                        <div
                            className="bg-green-500 transition-all duration-500 ease-in-out"
                            style={{ width: `${optimalPercentage}%` }}
                        />
                        {/* Acceptable portion */}
                        <div
                            className="bg-yellow-500 transition-all duration-500 ease-in-out"
                            style={{ width: `${acceptablePercentage}%` }}
                        />
                        {/* High portion */}
                        <div
                            className="bg-red-500 transition-all duration-500 ease-in-out"
                            style={{ width: `${highPercentage}%` }}
                        />
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Optimal</span>
                    <span>Acceptable</span>
                    <span>High</span>
                </div>
            </div>

            {/* Insights */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">
                    <div className="font-medium mb-1">Key Insights:</div>
                    <ul className="space-y-1">
                        <li>• Target: Keep 80%+ batches in optimal range (≤47°C)</li>
                        <li>• Monitor batches above 48°C for quality impact</li>
                        <li>• Current performance: {overallStatus.status.toLowerCase()}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TemperatureDistributionCard;