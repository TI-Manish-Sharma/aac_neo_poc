import React, { useState } from 'react';
import { Users, Clock, Filter, ArrowUpRight } from 'lucide-react';
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

interface ShiftOperatorAnalysisProps {
    data: {
        shifts: Array<{
            id: string;
            name: string;
            rejectionRate: number;
            production: number;
            rejects: number;
        }>;
        operators: Array<{
            id: string;
            name: string;
            rejectionRate: number;
            production: number;
            rejects: number;
            shift?: string;
        }>;
        averageRejectionRate: number;
    };
    title?: string;
    height?: number;
    showViewDetails?: boolean;
    onViewDetails?: () => void;
}

const ShiftOperatorAnalysis: React.FC<ShiftOperatorAnalysisProps> = ({
    data,
    title = 'Shift & Operator Analysis',
    height = 64,
    showViewDetails = false,
    onViewDetails
}) => {
    const [viewMode, setViewMode] = useState<'shifts' | 'operators'>('shifts');
    const [selectedShift, setSelectedShift] = useState<string | null>(null);

    // Filter operators by selected shift if any
    const filteredOperators = selectedShift
        ? data.operators.filter(op => op.shift === selectedShift)
        : data.operators;

    // Determine colors for bars based on performance
    const getBarColor = (rate: number) => {
        if (rate <= data.averageRejectionRate * 0.8) return '#10B981'; // Good - significantly below average
        if (rate <= data.averageRejectionRate) return '#60A5FA'; // Average - around average
        if (rate <= data.averageRejectionRate * 1.2) return '#F59E0B'; // Warning - above average
        return '#EF4444'; // Critical - significantly above average
    };

    // Format large numbers
    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-violet-100 rounded-lg mr-3">
                        {viewMode === 'shifts'
                            ? <Clock size={24} className="text-violet-600" />
                            : <Users size={24} className="text-violet-600" />
                        }
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                </div>
                <div className="flex items-center">
                    {showViewDetails && (
                        <button
                            onClick={onViewDetails}
                            className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center mr-4"
                        >
                            View Details <ArrowUpRight size={14} className="ml-1" />
                        </button>
                    )}
                    <div className="flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'shifts'
                                    ? 'bg-violet-100 text-violet-800'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border border-gray-200`}
                            onClick={() => setViewMode('shifts')}
                        >
                            <Clock size={14} className="inline mr-1" />
                            Shifts
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'operators'
                                    ? 'bg-violet-100 text-violet-800'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border border-gray-200`}
                            onClick={() => setViewMode('operators')}
                        >
                            <Users size={14} className="inline mr-1" />
                            Operators
                        </button>
                    </div>
                </div>
            </div>

            {/* Shift filter for operators view */}
            {viewMode === 'operators' && (
                <div className="mb-4">
                    <div className="flex items-center">
                        <Filter size={14} className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500 mr-2">Filter by shift:</span>
                        <select
                            className="text-sm border border-gray-300 rounded-md p-1"
                            value={selectedShift || ''}
                            onChange={(e) => setSelectedShift(e.target.value || null)}
                        >
                            <option value="">All Shifts</option>
                            {data.shifts.map(shift => (
                                <option key={shift.id} value={shift.id}>{shift.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Average Rejection Rate Indicator */}
            <div className="mb-4 flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                <span className="text-xs text-gray-500">
                    Average Rejection Rate: {data.averageRejectionRate.toFixed(1)}%
                </span>
            </div>

            {/* Chart */}
            <div className={`h-${height}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={viewMode === 'shifts' ? data.shifts : filteredOperators}
                        margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            label={{ value: 'Rejection Rate (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            label={{ value: 'Production Units', angle: 90, position: 'insideRight' }}
                            tickFormatter={formatNumber}
                        />
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === 'Production') return [formatNumber(value as number), 'Production Units'];
                                if (name === 'Rejection Rate') return [`${value}%`, name];
                                return [value, name];
                            }}
                        />
                        <Legend />
                        <Bar
                            yAxisId="left"
                            dataKey="rejectionRate"
                            name="Rejection Rate"
                            fill="#8884d8"
                        >
                            {(viewMode === 'shifts' ? data.shifts : filteredOperators).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.rejectionRate)} />
                            ))}
                        </Bar>
                        <Bar
                            yAxisId="right"
                            dataKey="production"
                            name="Production"
                            fill="#82ca9d"
                            opacity={0.7}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Key Insights */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                    {viewMode === 'shifts' ? (
                        <>
                            <li>• {data.shifts.sort((a, b) => a.rejectionRate - b.rejectionRate)[0]?.name} has the lowest rejection rate at {data.shifts.sort((a, b) => a.rejectionRate - b.rejectionRate)[0]?.rejectionRate.toFixed(1)}%</li>
                            <li>• {data.shifts.sort((a, b) => b.rejectionRate - a.rejectionRate)[0]?.name} has the highest rejection rate at {data.shifts.sort((a, b) => b.rejectionRate - a.rejectionRate)[0]?.rejectionRate.toFixed(1)}%</li>
                            <li>• {data.shifts.sort((a, b) => b.production - a.production)[0]?.name} has highest production volume with {formatNumber(data.shifts.sort((a, b) => b.production - a.production)[0]?.production)} units</li>
                        </>
                    ) : (
                        <>
                            <li>• {filteredOperators.sort((a, b) => a.rejectionRate - b.rejectionRate)[0]?.name} has the lowest rejection rate at {filteredOperators.sort((a, b) => a.rejectionRate - b.rejectionRate)[0]?.rejectionRate.toFixed(1)}%</li>
                            <li>• {filteredOperators.sort((a, b) => b.rejectionRate - a.rejectionRate)[0]?.name} has the highest rejection rate at {filteredOperators.sort((a, b) => b.rejectionRate - a.rejectionRate)[0]?.rejectionRate.toFixed(1)}%</li>
                            <li>• {filteredOperators.length} operators {selectedShift ? `in ${data.shifts.find(s => s.id === selectedShift)?.name}` : 'across all shifts'}</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ShiftOperatorAnalysis;