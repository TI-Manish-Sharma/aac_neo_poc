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
import { TrendLineData } from '../types';

interface RejectionRateChartProps {
    data: TrendLineData[];
}

const RejectionRateChart: React.FC<RejectionRateChartProps> = ({ data }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Rejection Rate Trend</h2>
            <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                            dataKey="period" 
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#e0e0e0' }}
                            axisLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis 
                            yAxisId="left" 
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#e0e0e0' }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            label={{ 
                                value: 'Rejection Rate (%)', 
                                angle: -90, 
                                position: 'insideLeft', 
                                style: { textAnchor: 'middle', fontSize: '12px' } 
                            }} 
                        />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            tick={{ fontSize: 12 }}
                            tickLine={{ stroke: '#e0e0e0' }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            label={{ 
                                value: 'Total Batches', 
                                angle: 90, 
                                position: 'insideRight', 
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
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="rejectionRate"
                            name="Rejection Rate (%)"
                            stroke="#FF8042"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="totalBatches"
                            name="Total Batches"
                            stroke="#0088FE"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RejectionRateChart;