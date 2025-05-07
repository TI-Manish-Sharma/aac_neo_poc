import React from 'react';
import {
    BarChart, Bar, ResponsiveContainer, Tooltip, Legend,
    XAxis, YAxis, CartesianGrid, Cell
} from 'recharts';
import { BatchDefect } from '../types';
import { getTopBatches } from '../utils/chartHelpers';
import { getDefectRateColor, getDefectRateClass } from '../utils/formatters';

interface BatchAnalysisProps {
    data: BatchDefect[];
}

const BatchAnalysis: React.FC<BatchAnalysisProps> = ({ data }) => {
    // Get top 10 batches for chart
    const topBatches = getTopBatches(data, 10);

    return (
        <div className="space-y-6">
            {/* Worst Batches Bar Chart */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 10 Batches by Defect Rate</h2>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topBatches}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="batchId" />
                            <YAxis yAxisId="left" orientation="left" stroke="#FF8042" />
                            <YAxis yAxisId="right" orientation="right" stroke="#0088FE" />
                            <Tooltip />
                            <Legend />
                            <Bar
                                yAxisId="left"
                                dataKey="defectRate"
                                name="Defect Rate (%)"
                                fill="#FF8042"
                            >
                                {topBatches.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getDefectRateColor(entry.defectRate)}
                                    />
                                ))}
                            </Bar>
                            <Bar
                                yAxisId="right"
                                dataKey="totalDefects"
                                name="Total Defects"
                                fill="#0088FE"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Worst Batches Table */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Worst Batches Details</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Batch ID</th>
                                <th className="px-4 py-2 text-left">Mould ID</th>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Total Blocks</th>
                                <th className="px-4 py-2 text-left">Total Defects</th>
                                <th className="px-4 py-2 text-left">Defect Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((batch, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2">{batch.batchId}</td>
                                    <td className="px-4 py-2">{batch.mouldId}</td>
                                    <td className="px-4 py-2">{batch.date}</td>
                                    <td className="px-4 py-2">{batch.totalBlocks}</td>
                                    <td className="px-4 py-2">{batch.totalDefects}</td>
                                    <td className="px-4 py-2">
                                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${batch.defectRate > 15
                                                ? 'bg-red-500 text-white'
                                                : batch.defectRate > 10
                                                    ? 'bg-amber-500 text-white'
                                                    : batch.defectRate > 5
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-green-500 text-white'
                                            }`}
                                        >
                                            {batch.defectRate.toFixed(2)}%
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

export default BatchAnalysis;