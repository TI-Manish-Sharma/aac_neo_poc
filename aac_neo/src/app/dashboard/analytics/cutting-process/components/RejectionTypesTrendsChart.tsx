import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { RejectionTypesData } from '../types';
import { REJECTION_COLORS } from '../types/RejectionColors';

interface RejectionTypesChartProps {
    data: RejectionTypesData[];
}

const RejectionTypesTrendsChart: React.FC<RejectionTypesChartProps> = ({ data }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Rejection Types Over Time (%)</h2>
            <div className="h-80 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                            dataKey="period"
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#e0e0e0' }}
                            axisLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#e0e0e0' }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            label={{
                                value: 'Percentage (%)',
                                angle: -90,
                                position: 'insideLeft',
                                style: { textAnchor: 'middle', fontSize: '12px' }
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        {Object.keys(REJECTION_COLORS).map((key) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                name={`${key} Rate (%)`}
                                fill={REJECTION_COLORS[key]}
                                radius={[2, 2, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RejectionTypesTrendsChart;