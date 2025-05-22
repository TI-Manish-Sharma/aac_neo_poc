
/* eslint-disable */

import React, { useState } from 'react';
import { Award, ThumbsUp, BarChart2, ArrowUpRight, Star, BadgeCheck, ChevronUp, ChevronDown, Zap } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface TopPerformingMouldsProps {
    data: {
        topMoulds: Array<{
            id: string;
            name: string;
            defectRate: number;
            totalBatches: number;
            totalProduction: number;
            consistency: number; // 0-100
            previousDefectRate?: number;
            uptime?: number; // percentage
            efficiency?: number; // percentage
            bestPerformanceDate?: string;
        }>;
        stats: {
            averageDefectRate: number;
            lowestDefectRate: number;
            highestEfficiency: number;
            totalTopPerformers: number;
        };
        timeFrame: string; // e.g., "Last 30 days", "Current month", etc.
    };
    title?: string;
    height?: number;
    showViewDetails?: boolean;
    maxMoulds?: number;
    onViewDetails?: () => void;
}

const TopPerformingMoulds: React.FC<TopPerformingMouldsProps> = ({
    data,
    title = 'Top Performing Mould Boxes',
    height = 400, // Changed default to a pixel value
    showViewDetails = false,
    maxMoulds = 5,
    onViewDetails
}) => {
    const [sortBy, setSortBy] = useState<'defectRate' | 'efficiency' | 'consistency'>('defectRate');
    const [viewMode, setViewMode] = useState<'chart' | 'cards'>('chart');

    // Sort moulds based on selection
    const sortedMoulds = [...data.topMoulds].sort((a, b) => {
        if (sortBy === 'defectRate') {
            return a.defectRate - b.defectRate;
        } else if (sortBy === 'efficiency' && a.efficiency !== undefined && b.efficiency !== undefined) {
            return b.efficiency - a.efficiency;
        } else {
            return b.consistency - a.consistency;
        }
    }).slice(0, maxMoulds);

    // Format percentage for display
    const formatPercentage = (value: number, decimals = 1) => {
        return `${value.toFixed(decimals)}%`;
    };

    // Calculate improvement/decline percentage
    const calculateChange = (current: number, previous?: number) => {
        if (previous === undefined || previous === 0) return null;
        return ((current - previous) / previous) * 100;
    };

    // Get appropriate color for defect rate bars
    const getDefectRateColor = (rate: number) => {
        if (rate <= data.stats.averageDefectRate * 0.5) return '#10B981'; // Excellent
        if (rate <= data.stats.averageDefectRate * 0.75) return '#60A5FA'; // Good
        if (rate <= data.stats.averageDefectRate) return '#F59E0B'; // Average
        return '#EF4444'; // Poor
    };

    // Display change indicator
    const ChangeIndicator = ({ current, previous }: { current: number, previous?: number }) => {
        if (previous === undefined) return null;

        const change = calculateChange(current, previous);
        if (change === null) return null;

        const isImprovement = sortBy === 'defectRate'
            ? change < 0  // For defect rate, lower is better
            : change > 0; // For other metrics, higher is better

        return (
            <div className={`flex items-center ${isImprovement ? 'text-green-500' : 'text-red-500'}`}>
                {isImprovement ? (
                    <ChevronUp size={16} className="mr-1" />
                ) : (
                    <ChevronDown size={16} className="mr-1" />
                )}
                <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="flex items-center mb-2 md:mb-0">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <Award size={24} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                    <div className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {data.timeFrame}
                    </div>
                </div>

                <div className="flex items-center">
                    {/* View Mode Toggle */}
                    <div className="mr-3 flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            className={`px-3 py-1 text-xs font-medium rounded-l-md ${viewMode === 'chart'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                } border border-gray-200`}
                            onClick={() => setViewMode('chart')}
                        >
                            <BarChart2 size={14} className="inline mr-1" />
                            Chart
                        </button>
                        <button
                            type="button"
                            className={`px-3 py-1 text-xs font-medium rounded-r-md ${viewMode === 'cards'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                } border border-gray-200`}
                            onClick={() => setViewMode('cards')}
                        >
                            <ThumbsUp size={14} className="inline mr-1" />
                            Cards
                        </button>
                    </div>

                    {/* Sort By Selector */}
                    <div className="mr-3">
                        <select
                            className="text-xs border border-gray-200 rounded-md p-1"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                        >
                            <option value="defectRate">Lowest Defect Rate</option>
                            <option value="efficiency">Highest Efficiency</option>
                            <option value="consistency">Best Consistency</option>
                        </select>
                    </div>

                    {showViewDetails && (
                        <button
                            onClick={onViewDetails}
                            className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center"
                        >
                            View All <ArrowUpRight size={14} className="ml-1" />
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-600">Top Performers</p>
                    <p className="text-xl font-bold text-green-700">{data.stats.totalTopPerformers}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600">Lowest Defect Rate</p>
                    <p className="text-xl font-bold text-blue-700">{formatPercentage(data.stats.lowestDefectRate)}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-purple-600">Average Defect Rate</p>
                    <p className="text-xl font-bold text-purple-700">{formatPercentage(data.stats.averageDefectRate)}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-indigo-600">Highest Efficiency</p>
                    <p className="text-xl font-bold text-indigo-700">{formatPercentage(data.stats.highestEfficiency)}</p>
                </div>
            </div>

            {/* Chart View */}
            {viewMode === 'chart' && (
                <div style={{ height: `${height}px` }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={sortedMoulds}
                            margin={{ top: 20, right: 30, left: 80, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval={0}
                            />
                            <YAxis
                                domain={sortBy === 'defectRate' ? [0, 'dataMax + 1'] : [0, 100]}
                                label={{
                                    value: sortBy === 'defectRate' ? 'Defect Rate (%)' : 
                                           sortBy === 'efficiency' ? 'Efficiency (%)' : 'Consistency Score',
                                    angle: -90,
                                    position: 'insideLeft'
                                }}
                            />
                            <Tooltip 
                                formatter={(value, name) => [
                                    sortBy === 'defectRate' ? `${value}%` : 
                                    sortBy === 'efficiency' ? `${value}%` : `${value}/100`,
                                    name
                                ]}
                            />
                            <Legend verticalAlign='top' height={32} />
                            {sortBy === 'defectRate' && (
                                <Bar
                                    dataKey="defectRate"
                                    name="Defect Rate (%)"
                                    fill="#10B981"
                                >
                                    {sortedMoulds.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getDefectRateColor(entry.defectRate)} />
                                    ))}
                                </Bar>
                            )}
                            {sortBy === 'efficiency' && (
                                <Bar
                                    dataKey="efficiency"
                                    name="Efficiency (%)"
                                    fill="#6366F1"
                                />
                            )}
                            {sortBy === 'consistency' && (
                                <Bar
                                    dataKey="consistency"
                                    name="Consistency Score"
                                    fill="#8B5CF6"
                                />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Cards View */}
            {viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedMoulds.map((mould, index) => (
                        <div
                            key={mould.id}
                            className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            {/* Rank Indicator */}
                            <div className="absolute top-3 right-3 bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                                {index + 1}
                            </div>

                            {/* Mould Title */}
                            <div className="flex items-center mb-3">
                                {index === 0 && <Star size={16} className="text-amber-400 mr-1" />}
                                <h4 className="text-sm font-semibold text-gray-800">{mould.name}</h4>
                            </div>

                            {/* Performance Metrics */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <BadgeCheck size={14} className="text-green-500 mr-1" />
                                        <span className="text-xs text-gray-600">Defect Rate:</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-800 mr-2">
                                            {formatPercentage(mould.defectRate)}
                                        </span>
                                        {mould.previousDefectRate !== undefined && (
                                            <ChangeIndicator
                                                current={mould.defectRate}
                                                previous={mould.previousDefectRate}
                                            />
                                        )}
                                    </div>
                                </div>

                                {mould.efficiency !== undefined && (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <Zap size={14} className="text-blue-500 mr-1" />
                                            <span className="text-xs text-gray-600">Efficiency:</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">
                                            {formatPercentage(mould.efficiency)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <BarChart2 size={14} className="text-purple-500 mr-1" />
                                        <span className="text-xs text-gray-600">Consistency:</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800">
                                        {mould.consistency}/100
                                    </span>
                                </div>

                                {mould.uptime !== undefined && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Uptime:</span>
                                        <span className="text-sm font-medium text-gray-800">
                                            {formatPercentage(mould.uptime)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Production Stats */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                                <span>Batches: {mould.totalBatches}</span>
                                <span>Units: {mould.totalProduction.toLocaleString()}</span>
                            </div>

                            {/* Best Performance */}
                            {mould.bestPerformanceDate && (
                                <div className="mt-2 text-xs text-gray-500 italic">
                                    Best: {new Date(mould.bestPerformanceDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopPerformingMoulds;