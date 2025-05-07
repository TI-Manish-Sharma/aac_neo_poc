import React from 'react';
import { SegregationAnalysisData } from '../types';
import { PieChart, Pie, BarChart, Bar, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CHART_COLORS, getTopMoulds } from '../utils/chartHelpers';
import RecommendationsPanel from './RecommendationsPanel';

interface AnalysisOverviewProps {
    data: SegregationAnalysisData;
}

const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({ data }) => {
    // Get top 5 worst performing moulds
    const topMoulds = getTopMoulds(data.mouldPerformance, 5);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <p className="text-blue-500 mb-1 text-sm font-medium">Total Batches</p>
                    <p className="text-3xl font-bold">{data.summary.totalBatches}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <p className="text-red-500 mb-1 text-sm font-medium">Batches With Defects</p>
                    <p className="text-3xl font-bold">{data.summary.batchesWithDefects}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <p className="text-amber-500 mb-1 text-sm font-medium">Total Defects</p>
                    <p className="text-3xl font-bold">{data.summary.totalDefects}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <p className="text-green-500 mb-1 text-sm font-medium">Defect Rate</p>
                    <p className="text-3xl font-bold">{data.summary.defectRate.toFixed(2)}%</p>
                </div>
            </div>

            {/* Recommendations */}
            <RecommendationsPanel data={data} />

            {/* Overview Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Defects by Type Pie Chart */}
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Defects by Type</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.defectsByType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="type"
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {data.defectsByType.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Defects by Position Bar Chart */}
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Defects by Position</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data.defectsByPosition}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="position" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="total"
                                    name="Total Defects"
                                    fill="#FF8042"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top 5 Worst Moulds */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Worst Performing Moulds</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Mould ID</th>
                                <th className="px-4 py-2 text-left">Total Batches</th>
                                <th className="px-4 py-2 text-left">Total Defects</th>
                                <th className="px-4 py-2 text-left">Avg. Defects/Batch</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topMoulds.map((mould, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2">{mould.mouldId}</td>
                                    <td className="px-4 py-2">{mould.totalBatches}</td>
                                    <td className="px-4 py-2">{mould.totalDefects}</td>
                                    <td className="px-4 py-2">
                                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${mould.averageDefectsPerBatch > 20 ? 'bg-red-500 text-white' :
                                                mould.averageDefectsPerBatch > 10 ? 'bg-amber-500 text-white' :
                                                    'bg-green-500 text-white'
                                            }`}>
                                            {mould.averageDefectsPerBatch}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalysisOverview;