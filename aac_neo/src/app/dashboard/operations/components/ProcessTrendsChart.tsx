// components/ProcessTrendsChart.tsx
import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { TrendDataPoint } from '../types/batch';

interface ProcessTrendsChartProps {
    data: TrendDataPoint[];
}

// Convert time string to minutes for plotting
const timeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
};

// Format minutes back to time string for display
const formatMinutes = (minutes: number): string => {
    if (!minutes && minutes !== 0) return '';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}:${mins.toString().padStart(2, '0')}`;
};

const ProcessTrendsChart: React.FC<ProcessTrendsChartProps> = ({ data }) => {
    // Transform the data to convert discharge time to minutes
    const transformedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            // Add a new property for plotting while keeping the original
            dischargeTimeMinutes: timeToMinutes(item.dischargeTime)
        }));
    }, [data]);

    // Calculate average values for reference lines
    const averages = useMemo(() => {
        if (!transformedData.length) return { dischargeTimeMinutes: 0, dischargeTemp: 0, waterKg: 0 };
        
        return {
            dischargeTimeMinutes: transformedData.reduce((sum, item) => sum + item.dischargeTimeMinutes, 0) / transformedData.length,
            dischargeTemp: transformedData.reduce((sum, item) => sum + item.dischargeTemp, 0) / transformedData.length,
            waterKg: transformedData.reduce((sum, item) => sum + item.waterKg, 0) / transformedData.length
        };
    }, [transformedData]);

    // Custom tooltip formatter
    const customFormatter = (value: number, name: string) => {
        if (name === "Discharge Time (clock time)") {
            return [formatMinutes(value), name];
        }
        return [typeof value === 'number' ? value.toFixed(2) : value, name];
    };

    // Determine Y-axis domains with some padding
    const getYAxisDomain = (dataKey: keyof typeof transformedData[0], marginPercent = 0.1) => {
        if (!transformedData.length) return [0, 10];
        
        const values = transformedData.map(item => item[dataKey]).filter((val): val is number => typeof val === 'number');
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max - min) * marginPercent;
        
        return [Math.floor(min - padding), Math.ceil(max + padding)];
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Process Parameter Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={transformedData} margin={{ top: 0, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                    <XAxis
                        dataKey="sequence"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                        label={{ value: 'Batch Sequence', position: 'insideBottomRight', offset: -5, fontSize: 12 }}
                    />
                    <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                        domain={getYAxisDomain('dischargeTimeMinutes')}
                        tickFormatter={formatMinutes}
                        label={{ 
                            value: 'Discharge Time & Water', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { textAnchor: 'middle', fontSize: 12 }
                        }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                        domain={getYAxisDomain('dischargeTemp')}
                        label={{ 
                            value: 'Temperature (°C)', 
                            angle: 90, 
                            position: 'insideRight',
                            style: { textAnchor: 'middle', fontSize: 12 }
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '12px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                        formatter={customFormatter}
                        labelFormatter={(label) => `Batch Sequence: ${label}`}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '12px' }}
                        verticalAlign="top"
                        height={36}
                    />
                    
                    {/* Reference lines for averages */}
                    <ReferenceLine 
                        yAxisId="right" 
                        y={averages.dischargeTemp} 
                        stroke="#82ca9d" 
                        strokeDasharray="3 3" 
                        label={{ 
                            value: `Avg: ${averages.dischargeTemp.toFixed(1)}°C`,
                            fill: '#82ca9d',
                            fontSize: 10,
                            position: 'insideTopRight'
                        }} 
                    />
                    
                    {/* Plotting the data */}
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="dischargeTimeMinutes"
                        stroke="#8884d8"
                        name="Discharge Time (clock time)"
                        strokeWidth={2.5}
                        dot={{ fill: '#8884d8', strokeWidth: 2, r: 4, strokeDasharray: '' }}
                        activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
                        connectNulls={true}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="dischargeTemp"
                        stroke="#82ca9d"
                        name="Discharge Temp (°C)"
                        strokeWidth={2.5}
                        dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#82ca9d', strokeWidth: 2 }}
                        connectNulls={true}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="waterKg"
                        stroke="#ffc658"
                        name="Water (kg)"
                        strokeWidth={2.5}
                        dot={{ fill: '#ffc658', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#ffc658', strokeWidth: 2 }}
                        connectNulls={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProcessTrendsChart;