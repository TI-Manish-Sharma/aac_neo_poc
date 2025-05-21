import React from 'react';
import { DollarSign, TrendingDown, TrendingUp, BarChart2 } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

interface CostImpactProps {
    data: {
        summary: {
            totalCost: number;
            previousPeriodCost?: number;
            percentChange?: number;
            currency?: string;
            costPerRejection: number;
        };
        breakdown: Array<{
            category: string;
            cost: number;
            percentage: number;
        }>;
        trend?: Array<{
            period: string;
            cost: number;
            target?: number;
        }>;
    };
    title?: string;
    height?: number;
}

const CostImpactAnalysis: React.FC<CostImpactProps> = ({
    data,
    title = 'Cost Impact Analysis',
    height = 64
}) => {
    const { summary, breakdown, trend } = data;
    const currency = summary.currency || '₹';

    // Format currency
    const formatCurrency = (value: number): string => {
        if (value >= 10000000) {
            return `${currency}${(value / 10000000).toFixed(2)} Cr`;
        } else if (value >= 100000) {
            return `${currency}${(value / 100000).toFixed(2)} L`;
        } else if (value >= 1000) {
            return `${currency}${(value / 1000).toFixed(1)}K`;
        }
        return `${currency}${value.toFixed(0)}`;
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                        <DollarSign size={24} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm text-gray-500 mb-1">Total Rejection Cost</h4>
                    <div className="flex items-end">
                        <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary.totalCost)}</p>
                        {summary.percentChange !== undefined && (
                            <div className={`ml-2 flex items-center ${summary.percentChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {summary.percentChange < 0 ? (
                                    <TrendingDown size={16} className="mr-1" />
                                ) : (
                                    <TrendingUp size={16} className="mr-1" />
                                )}
                                <span className="text-sm">{Math.abs(summary.percentChange)}%</span>
                            </div>
                        )}
                    </div>
                    {summary.previousPeriodCost !== undefined && (
                        <p className="text-xs text-gray-400 mt-1">Previous: {formatCurrency(summary.previousPeriodCost)}</p>
                    )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm text-gray-500 mb-1">Cost Per Rejected Item</h4>
                    <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary.costPerRejection)}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm text-gray-500 mb-1">Top Rejection Cost</h4>
                    {breakdown.length > 0 && (
                        <>
                            <p className="text-2xl font-bold text-gray-800">{breakdown[0].category}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {formatCurrency(breakdown[0].cost)} ({breakdown[0].percentage.toFixed(1)}% of total)
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Cost Breakdown Chart */}
            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 mb-3">Cost Breakdown by Type</h4>
                <div className={`h-${height}`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={breakdown}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis
                                tickFormatter={(value) => formatCurrency(value)}
                            />
                            <Tooltip
                                formatter={(value: number) => [formatCurrency(value), 'Cost']}
                            />
                            <Legend />
                            <Bar dataKey="cost" name="Cost" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Cost Trend Chart */}
            {trend && trend.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                        <BarChart2 size={16} className="mr-2 text-gray-400" />
                        Cost Trend
                    </h4>
                    <div className={`h-${height}`}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={trend}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis
                                    tickFormatter={(value) => formatCurrency(value)}
                                />
                                <Tooltip
                                    formatter={(value: number) => [formatCurrency(value), 'Cost']}
                                />
                                <Legend />
                                <Bar dataKey="cost" name="Rejection Cost" fill="#F97316" />
                                {trend[0].target !== undefined && (
                                    <ReferenceLine
                                        y={trend[0].target}
                                        label="Target"
                                        stroke="#EF4444"
                                        strokeDasharray="3 3"
                                    />
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CostImpactAnalysis;