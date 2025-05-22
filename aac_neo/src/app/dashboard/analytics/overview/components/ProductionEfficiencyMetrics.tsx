import React from 'react';
import { Gauge } from 'lucide-react';

interface ProductionEfficiencyMetricsProps {
    data: {
        oee: number;
        availability: number;
        performance: number;
        quality: number;
        targetOee: number;
    };
    title: string;
    showDetails: boolean;
}

const ProductionEfficiencyMetrics: React.FC<ProductionEfficiencyMetricsProps> = ({ data, title }) => {
    // Helper function to determine color based on metric value
    const getColorClass = (value: number): string => {
        if (value >= 85) return 'text-green-500';
        if (value >= 65) return 'text-amber-500';
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
                        className={`h-2.5 rounded-full ${value >= 85 ? 'bg-green-500' : value >= 65 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${value}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    // Get color based on OEE value
    const getOeeColor = (value: number): string => {
        if (value >= 85) return "#10B981"; // green
        if (value >= 65) return "#F59E0B"; // amber
        return "#EF4444"; // red
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <Gauge size={24} className="text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{title || "Production Efficiency (OEE)"}</h3>
                </div>
            </div>

            {/* Simplified OEE Gauge Visualization */}
            <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                    {/* Background circle */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Gray background semicircle */}
                        <path
                            d="M 10,50 A 40,40 0 1,1 90,50"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />

                        {/* Colored arc representing the OEE value */}
                        <path
                            d="M 10,50 A 40,40 0 0,1 90,50"
                            fill="none"
                            stroke={getOeeColor(data.oee)}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${data.oee * 1.26} 126`}
                        />

                        {/* Target marker */}
                        {data.targetOee && (
                            <g transform={`rotate(${180 - data.targetOee * 1.8} 50 50)`}>
                                <line
                                    x1="50"
                                    y1="15"
                                    x2="50"
                                    y2="5"
                                    stroke="#6366F1"
                                    strokeWidth="2"
                                    strokeDasharray="2,1"
                                />
                            </g>
                        )}

                        {/* OEE Value */}
                        <text
                            x="50"
                            y="55"
                            textAnchor="middle"
                            className={getColorClass(data.oee)}
                            fontSize="18"
                            fontWeight="bold"
                        >
                            {data.oee}%
                        </text>

                        <text
                            x="50"
                            y="70"
                            textAnchor="middle"
                            fill="#6B7280"
                            fontSize="8"
                        >
                            Overall OEE
                        </text>

                        {data.targetOee && (
                            <text
                                x="50"
                                y="80"
                                textAnchor="middle"
                                fill="#9CA3AF"
                                fontSize="6"
                            >
                                Target: {data.targetOee}%
                            </text>
                        )}
                    </svg>
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