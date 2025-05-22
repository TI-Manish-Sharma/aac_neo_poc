/*eslint-disable*/
// components/MaterialConsumptionChart.tsx
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
import { TrendDataPoint } from '../types/batch';

interface MaterialConsumptionChartProps {
    data: TrendDataPoint[];
}

const MaterialConsumptionChart: React.FC<MaterialConsumptionChartProps> = ({ data }) => {
    // Custom tooltip formatter
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs">
                    <p className="font-medium text-gray-900 mb-2">
                        Batch Sequence: {label}
                    </p>
                    <div className="space-y-1">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div 
                                        className="w-3 h-3 rounded"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-xs text-gray-600">
                                        {entry.name}:
                                    </span>
                                </div>
                                <span className="text-xs font-semibold text-gray-900">
                                    {typeof entry.value === 'number' ? 
                                        entry.value.toLocaleString() : entry.value}
                                    {entry.name.includes('Powder') ? ' gm' : 
                                     entry.name.includes('Oil') ? ' L' : ' kg'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom legend formatter
    const formatLegendValue = (value: string) => {
        const legendMap: { [key: string]: string } = {
            'freshSlurryKg': 'Fresh Slurry',
            'wasteSlurryKg': 'Waste Slurry',
            'cementKg': 'Cement',
            'limeKg': 'Lime',
            'gypsumKg': 'Gypsum',
            'aluminumPowderGm': 'Aluminum Powder',
            'dcPowderGm': 'DC Powder',
            'waterKg': 'Water',
            'soluOilLitre': 'Soluble Oil'
        };
        return legendMap[value] || value;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Material Consumption by Batch (Last {data.length})
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#f3f4f6"
                        vertical={false}
                    />
                    <XAxis 
                        dataKey="sequence" 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                        interval={0}
                    />
                    <YAxis 
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                        tickFormatter={(value) => value.toLocaleString()}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        wrapperStyle={{ fontSize: '11px' }}
                        formatter={formatLegendValue}
                    />
                    
                    {/* Main Materials */}
                    <Bar 
                        dataKey="freshSlurryKg" 
                        fill="#8884d8" 
                        name="freshSlurryKg"
                        radius={[1, 1, 0, 0]}
                    />
                    <Bar 
                        dataKey="wasteSlurryKg" 
                        fill="#82ca9d" 
                        name="wasteSlurryKg"
                        radius={[1, 1, 0, 0]}
                    />
                    <Bar 
                        dataKey="cementKg" 
                        fill="#ffc658" 
                        name="cementKg"
                        radius={[1, 1, 0, 0]}
                    />
                    <Bar 
                        dataKey="limeKg" 
                        fill="#ff7c7c" 
                        name="limeKg"
                        radius={[1, 1, 0, 0]}
                    />
                    <Bar 
                        dataKey="gypsumKg" 
                        fill="#8dd1e1" 
                        name="gypsumKg"
                        radius={[1, 1, 0, 0]}
                    />
                    
                    {/* Powder Materials (scaled down visually) */}
                    <Bar 
                        dataKey="aluminumPowderGm" 
                        fill="#ffb347" 
                        name="aluminumPowderGm"
                        radius={[1, 1, 0, 0]}
                    />
                    <Bar 
                        dataKey="dcPowderGm" 
                        fill="#dda0dd" 
                        name="dcPowderGm"
                        radius={[1, 1, 0, 0]}
                    />
                    
                    {/* Other Materials */}
                    <Bar 
                        dataKey="waterKg" 
                        fill="#87ceeb" 
                        name="waterKg"
                        radius={[1, 1, 0, 0]}
                    />
                    <Bar 
                        dataKey="soluOilLitre" 
                        fill="#f0e68c" 
                        name="soluOilLitre"
                        radius={[1, 1, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
            
            {/* Info Note */}
            <div className="mt-3 text-xs text-gray-500">
                <p>* Powder materials (Aluminum, DC) are shown in grams, others in kg/liters</p>
            </div>
        </div>
    );
};

export default MaterialConsumptionChart;