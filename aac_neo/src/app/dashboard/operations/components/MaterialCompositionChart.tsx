/*eslint-disable*/
// components/MaterialCompositionChart.tsx
import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { MaterialCompositionData } from '../types/batch';

interface MaterialCompositionChartProps {
    data: MaterialCompositionData[];
}

const MaterialCompositionChart: React.FC<MaterialCompositionChartProps> = ({ data }) => {
    // Custom label function for pie slices
    const renderCustomLabel = ({ name, percent }: { name: string; percent: number }) => {
        return `${name} ${(percent * 100).toFixed(1)}%`;
    };

    // Custom tooltip formatter
    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                    <p className="font-medium text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-600">
                        Total: <span className="font-semibold">{Number(data.value).toLocaleString()} kg</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Percentage: <span className="font-semibold">{((data.value / data.total) * 100).toFixed(1)}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Calculate total for percentage calculations
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const dataWithTotal = data.map(item => ({ ...item, total }));

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Total Material Composition
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={dataWithTotal}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={0}
                        fill="#8884d8"
                        dataKey="value"
                        label={renderCustomLabel}
                        labelLine={false}
                        stroke="#ffffff"
                        strokeWidth={2}
                    >
                        {dataWithTotal.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                style={{
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                }}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-700 truncate">
                            {item.name}: {Number(item.value).toLocaleString()} kg
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MaterialCompositionChart;