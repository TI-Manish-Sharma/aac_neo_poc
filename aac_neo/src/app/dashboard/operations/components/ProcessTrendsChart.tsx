// components/ProcessTrendsChart.tsx
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { TrendDataPoint } from '../types/batch';

interface ProcessTrendsChartProps {
    data: TrendDataPoint[];
}

const ProcessTrendsChart: React.FC<ProcessTrendsChartProps> = ({ data }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Process Parameter Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="sequence"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                        formatter={(value, name) => [
                            typeof value === 'number' ? value.toFixed(2) : value,
                            name
                        ]}
                        labelFormatter={(label) => `Batch Sequence: ${label}`}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="mixingTime"
                        stroke="#8884d8"
                        name="Mixing Time (min)"
                        strokeWidth={2}
                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: '#8884d8', strokeWidth: 2 }}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="dischargeTemp"
                        stroke="#82ca9d"
                        name="Discharge Temp (°C)"
                        strokeWidth={2}
                        dot={{ fill: '#82ca9d', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: '#82ca9d', strokeWidth: 2 }}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="waterKg"
                        stroke="#ffc658"
                        name="Water (kg)"
                        strokeWidth={2}
                        dot={{ fill: '#ffc658', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, stroke: '#ffc658', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProcessTrendsChart;