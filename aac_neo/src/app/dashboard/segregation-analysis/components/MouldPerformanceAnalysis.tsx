import React from 'react';
import {
    BarChart, Bar, ResponsiveContainer, Tooltip, Legend,
    XAxis, YAxis, CartesianGrid, Cell
} from 'recharts';
import { MouldPerformance } from '../types';
import { CHART_COLORS, getTopMoulds } from '../utils/chartHelpers';
import { getDefectRateColor } from '../utils/formatters';

interface MouldPerformanceAnalysisProps {
    data: MouldPerformance[];
}

const MouldPerformanceAnalysis: React.FC<MouldPerformanceAnalysisProps> = ({ data }) => {
    // Get top 10 moulds for chart
    const topMoulds = getTopMoulds(data, 10);

    return (
        <div className="space-y-6">
            {/* Top 10 Moulds Bar Chart */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 10 Moulds by Average Defects per Batch</h2>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topMoulds}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="mouldId" width={60} />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="averageDefectsPerBatch"
                                name="Avg. Defects Per Batch"
                                fill="#FF8042"
                            >
                                {topMoulds.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getDefectRateColor(entry.averageDefectsPerBatch)}
                                    />
                                ))}
                            </Bar>
                            <Bar dataKey="totalDefects" name="Total Defects" fill="#0088FE" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Mould Performance Table */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Mould Performance</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Mould ID</th>
                                <th className="px-4 py-2 text-left">Total Batches</th>
                                <th className="px-4 py-2 text-left">Total Defects</th>
                                <th className="px-4 py-2 text-left">Avg. Defects/Batch</th>
                                <th className="px-4 py-2 text-left">Defect Types</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((mould, index) => (
                                <tr
                                    key={index}
                                    className={
                                        mould.averageDefectsPerBatch > 20
                                            ? 'bg-red-50'
                                            : mould.averageDefectsPerBatch > 10
                                                ? 'bg-amber-50'
                                                : 'bg-white'
                                    }
                                >
                                    <td className="px-4 py-2">{mould.mouldId}</td>
                                    <td className="px-4 py-2">{mould.totalBatches}</td>
                                    <td className="px-4 py-2">{mould.totalDefects}</td>
                                    <td className="px-4 py-2">
                                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded 
                                            ${mould.averageDefectsPerBatch > 20
                                                ? 'bg-red-500 text-white'
                                                : mould.averageDefectsPerBatch > 10
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-green-500 text-white'
                                            }`}
                                        >
                                            {mould.averageDefectsPerBatch}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">
                                        {mould.defectTypes.map((defect, i) => (
                                            <div key={i} className="flex items-center mb-1">
                                                <div
                                                    className="mr-2"
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                                                        borderRadius: '50%'
                                                    }}
                                                ></div>
                                                <span className="text-xs">{defect.type}: {defect.count}</span>
                                            </div>
                                        ))}
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

export default MouldPerformanceAnalysis;