import React from 'react';
import {
    PieChart, Pie, BarChart, Bar, Cell, ResponsiveContainer,
    Tooltip, Legend, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { DefectByType } from '../types';
import { CHART_COLORS } from '../utils/chartHelpers';

interface DefectTypeAnalysisProps {
    data: DefectByType[];
}

const DefectTypeAnalysis: React.FC<DefectTypeAnalysisProps> = ({ data }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Defect Types Distribution */}
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Defect Type Distribution</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="type"
                                    label={({ name, value, percent }) =>
                                        `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                                    }
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Defect Types Bar Chart */}
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Defect Types Comparison</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="type" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="count"
                                    name="Number of Defects"
                                    fill="#FF8042"
                                />
                                <Bar
                                    dataKey="percentage"
                                    name="Percentage (%)"
                                    fill="#0088FE"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Defect Types Details Table */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Defect Types Details</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Defect Type</th>
                                <th className="px-4 py-2 text-left">Count</th>
                                <th className="px-4 py-2 text-left">Percentage</th>
                                <th className="px-4 py-2 text-left">Visualization</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((defect, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2">{defect.type}</td>
                                    <td className="px-4 py-2">{defect.count}</td>
                                    <td className="px-4 py-2">{defect.percentage.toFixed(2)}%</td>
                                    <td className="px-4 py-2">
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className="h-4 rounded-full"
                                                style={{
                                                    width: `${defect.percentage}%`,
                                                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                                                }}
                                            ></div>
                                        </div>
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

export default DefectTypeAnalysis;