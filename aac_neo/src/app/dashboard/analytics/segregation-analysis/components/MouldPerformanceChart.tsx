import React from 'react';
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
import { MouldPerformance } from '../types';

interface MouldPerformanceChartProps {
    data: MouldPerformance[];
}

const MouldPerformanceChart: React.FC<MouldPerformanceChartProps> = ({ data }) => {
    // Get the top 10 moulds by average defects per batch
    const top10Moulds = [...data]
        .sort((a, b) => b.averageDefectsPerBatch - a.averageDefectsPerBatch)
        .slice(0, 10);

    // Function to get color based on defect rate
    const getBarColor = (defectsPerBatch: number) => {
        if (defectsPerBatch > 20) return '#ef4444'; // Red
        if (defectsPerBatch > 10) return '#f97316'; // Orange
        if (defectsPerBatch > 5) return '#eab308'; // Yellow
        return '#22c55e'; // Green
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Top 10 Moulds by Average Defects per Batch</h2>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={top10Moulds}
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
                            barSize={20}
                        >
                            {top10Moulds.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.averageDefectsPerBatch)} />
                            ))}
                        </Bar>
                        <Bar
                            dataKey="totalDefects"
                            name="Total Defects"
                            fill="#3b82f6"
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MouldPerformanceChart;