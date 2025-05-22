import React from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp, Minus } from 'lucide-react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface PerformanceComparisonProps {
    data: {
        metrics: Array<{
            name: string;
            current: number;
            target: number;
            historical?: number;
            unit?: string;
            isHigherBetter?: boolean;
        }>;
        radarData?: Array<{
            metric: string;
            current: number;
            target: number;
            historical?: number;
        }>;
    };
    title?: string;
    height?: number;
    showViewDetails?: boolean;
    onViewDetails?: () => void;
}

const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({
    data,
    title = 'Performance Benchmarks',
    height = 64,
    showViewDetails = false,
    onViewDetails
}) => {
    // Helper to render trending indicator
    const renderTrend = (current: number, benchmark: number, isHigherBetter = true) => {
        if (current === benchmark) {
            return <Minus size={16} className="text-gray-400" />;
        }

        const isPositiveTrend = isHigherBetter ? current > benchmark : current < benchmark;
        const percentChange = ((current - benchmark) / benchmark * 100).toFixed(1);

        return (
            <div className={`flex items-center ${isPositiveTrend ? 'text-green-500' : 'text-red-500'}`}>
                {isPositiveTrend ? (
                    <ChevronUp size={16} />
                ) : (
                    <ChevronDown size={16} />
                )}
                <span className="ml-1">{Math.abs(parseFloat(percentChange))}%</span>
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                {showViewDetails && (
                    <button
                        onClick={onViewDetails}
                        className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center"
                    >
                        View Details <ArrowUpRight size={14} className="ml-1" />
                    </button>
                )}
            </div>

            {/* Metrics Comparison Table */}
            <div className="overflow-x-auto mb-6">
                <table className="min-w-full text-sm text-left text-gray-600">
                    <thead className="text-xs uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Metric</th>
                            <th className="px-6 py-3">Current</th>
                            <th className="px-6 py-3">Target</th>
                            {data.metrics.some(m => m.historical !== undefined) && (
                                <th className="px-6 py-3">Historical</th>
                            )}
                            <th className="px-6 py-3">VS Target</th>
                            {data.metrics.some(m => m.historical !== undefined) && (
                                <th className="px-6 py-3">VS Historical</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.metrics.map((metric, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 font-medium text-gray-700">{metric.name}</td>
                                <td className="px-6 py-4">
                                    {metric.current}{metric.unit || '%'}
                                </td>
                                <td className="px-6 py-4">
                                    {metric.target}{metric.unit || '%'}
                                </td>
                                {data.metrics.some(m => m.historical !== undefined) && (
                                    <td className="px-6 py-4">
                                        {metric.historical !== undefined ? `${metric.historical}${metric.unit || '%'}` : '-'}
                                    </td>
                                )}
                                <td className="px-6 py-4">
                                    {renderTrend(metric.current, metric.target, metric.isHigherBetter)}
                                </td>
                                {data.metrics.some(m => m.historical !== undefined) && (
                                    <td className="px-6 py-4">
                                        {metric.historical !== undefined
                                            ? renderTrend(metric.current, metric.historical, metric.isHigherBetter)
                                            : '-'}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Radar Chart - Visual Comparison */}
            {data.radarData && (
                <div className={`h-${height}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart outerRadius={90} data={data.radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="metric" />
                            <PolarRadiusAxis />
                            <Radar
                                name="Current"
                                dataKey="current"
                                stroke="#0ea5e9"
                                fill="#0ea5e9"
                                fillOpacity={0.6}
                            />
                            <Radar
                                name="Target"
                                dataKey="target"
                                stroke="#6366f1"
                                fill="#6366f1"
                                fillOpacity={0.3}
                            />
                            {data.radarData.some(item => item.historical !== undefined) && (
                                <Radar
                                    name="Historical"
                                    dataKey="historical"
                                    stroke="#f97316"
                                    fill="#f97316"
                                    fillOpacity={0.2}
                                />
                            )}
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default PerformanceComparison;