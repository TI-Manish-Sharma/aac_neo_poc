import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { DefectByType } from '../types';

interface DefectsByTypeChartProps {
    data: DefectByType[];
    detailed?: boolean;
}

const DefectsByTypeChart: React.FC<DefectsByTypeChartProps> = ({ data, detailed = false }) => {
    // Colors for the chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#F56B5F'];

    return (
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Defects by Type</h2>
            <div className={`h-64 ${detailed ? 'md:h-96' : 'md:h-80'}`}>
                <ResponsiveContainer width="100%" height="100%">
                    {!detailed ? (
                        // Pie chart for overview
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="type"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name, props) => [value, 'Count']}
                                labelFormatter={(label) => data[label].type}
                            />
                            <Legend />
                        </PieChart>
                    ) : (
                        // Bar chart for detailed view
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="type" width={100} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Count" fill="#0088FE" />
                            <Bar dataKey="percentage" name="Percentage (%)" fill="#00C49F" />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DefectsByTypeChart;