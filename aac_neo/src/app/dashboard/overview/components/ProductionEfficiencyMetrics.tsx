import React from 'react';
import { Gauge, ArrowUpRight } from 'lucide-react';

interface ProductionEfficiencyProps {
    data: {
        oee: number;
        availability: number;
        performance: number;
        quality: number;
        targetOee?: number;
    };
    title?: string;
    showDetails?: boolean;
    onViewDetails?: () => void;
}

const ProductionEfficiencyMetrics: React.FC<ProductionEfficiencyProps> = ({
    data,
    title = 'Production Efficiency (OEE)',
    showDetails = false,
    onViewDetails
}) => {
    // Helper function to determine color based on metric value
    const getColorClass = (value: number, threshold1 = 65, threshold2 = 85) => {
        if (value >= threshold2) return 'text-green-500';
        if (value >= threshold1) return 'text-amber-500';
        return 'text-red-500';
    };

    // Helper function to render progress bar
    const renderProgressBar = (value: number, label: string) => {
        const colorClass = getColorClass(value);

        return (
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className={`text-sm font-medium ${colorClass}`}>{value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${value >= 85 ? 'bg-green-500' : value >= 65 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${value}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <Gauge size={24} className="text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                </div>
                {showDetails && (
                    <button
                        onClick={onViewDetails}
                        className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center"
                    >
                        View Details <ArrowUpRight size={14} className="ml-1" />
                    </button>
                )}
            </div>

            {/* OEE Gauge Visualization */}
            <div className="flex justify-center mb-6">
                <div className="relative w-48 h-24 flex items-center justify-center">
                    <div className="absolute w-48 h-48 top-0 flex items-center justify-center">
                        <svg viewBox="0 0 100 50" className="w-full">
                            {/* Background arc */}
                            <path
                                d="M 10,50 A 40,40 0 0,1 90,50"
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="8"
                            />

                            {/* Target indicator if provided */}
                            {data.targetOee && (
                                <line
                                    x1={50 - 40 * Math.cos((data.targetOee / 100) * Math.PI)}
                                    y1={50 - 40 * Math.sin((data.targetOee / 100) * Math.PI)}
                                    x2={50 - 30 * Math.cos((data.targetOee / 100) * Math.PI)}
                                    y2={50 - 30 * Math.sin((data.targetOee / 100) * Math.PI)}
                                    stroke="#6366F1"
                                    strokeWidth="2"
                                    strokeDasharray="2,1"
                                />
                            )}

                            {/* Value arc */}
                            <path
                                d={`M 10,50 A 40,40 0 ${data.oee > 50 ? 1 : 0},1 ${10 + 80 * (data.oee / 100)},${50 - Math.sqrt(1600 * (data.oee / 100) * (1 - data.oee / 100))}`}
                                fill="none"
                                stroke={data.oee >= 85 ? "#10B981" : data.oee >= 65 ? "#F59E0B" : "#EF4444"}
                                strokeWidth="8"
                            />
                        </svg>
                    </div>

                    {/* OEE Value */}
                    <div className="text-center mt-8">
                        <span className={`text-3xl font-bold ${getColorClass(data.oee)}`}>{data.oee}%</span>
                        <p className="text-sm text-gray-500">Overall OEE</p>
                        {data.targetOee && (
                            <p className="text-xs text-gray-400 mt-1">Target: {data.targetOee}%</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Individual OEE Components */}
            <div className="pt-4 border-t border-gray-100">
                {renderProgressBar(data.availability, 'Availability')}
                {renderProgressBar(data.performance, 'Performance')}
                {renderProgressBar(data.quality, 'Quality')}
            </div>
        </div>
    );
};

export default ProductionEfficiencyMetrics;