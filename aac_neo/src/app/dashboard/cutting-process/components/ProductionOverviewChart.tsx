import React from 'react';
import {
    PieChart as ReChartsPie,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    TooltipProps
} from 'recharts';
import { ProductionDataItem } from '../types/ProductionDataItem';

interface ProductionOverviewChartProps {
    data: ProductionDataItem[];
    colors: string[];
    title: string;
}

export const ProductionOverviewChart: React.FC<ProductionOverviewChartProps> = ({ data, colors, title }) => {
    // Custom tooltip
    const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="bg-white rounded-md border border-gray-200 p-2 shadow-md">
                    <p className="font-medium">{`${item.name}: ${item.value}`}</p>
                    <p className="text-gray-500 text-sm">{`${item.percentage}% of total`}</p>
                </div>
            );
        }
        return null;
    };

    // Responsive label renderer that adapts to screen size
    const renderCustomizedLabel = ({ percent, cx, cy, midAngle, innerRadius, outerRadius }: { percent: number; cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number }) => {
        // Only show labels if segment is large enough (more than a 5% share)
        if (percent < 0.05) return null;

        // Calculate the position for the label
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // For mobile screens, only show percentage
        if (window.innerWidth < 768) {
            return (
                <text
                    x={x}
                    y={y}
                    fill="#fff"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fontWeight="bold"
                >
                    {`${(percent * 100).toFixed(0)}%`}
                </text>
            );
        }

        // For larger screens, show name and percentage
        return (
            <text
                x={x}
                y={y}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="12"
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
            <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPie margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius="70%"
                            innerRadius="0%"
                            fill="#8884d8"
                            dataKey="value"
                            label={renderCustomizedLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            formatter={(value) => {
                                // Responsive legend text
                                return (
                                    <span className="text-xs md:text-sm">{value}</span>
                                );
                            }}
                        />
                    </ReChartsPie>
                </ResponsiveContainer>
            </div>
        </div>
    );
};