import React from 'react';
import {
    BarChart, Bar, ResponsiveContainer, Tooltip, Legend,
    XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { DefectByPosition } from '../types';
import { CHART_COLORS, getMostCommonDefectForPosition } from '../utils/chartHelpers';

interface PositionAnalysisProps {
    data: DefectByPosition[];
}

const PositionAnalysis: React.FC<PositionAnalysisProps> = ({ data }) => {
    return (
        <div className="space-y-6">
            {/* Stacked Bar Chart for Positions */}
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Defect Types by Position</h2>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="position" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="rainCracksCuts" name="Rain Cracks/Cuts" stackId="a" fill={CHART_COLORS[0]} />
                            <Bar dataKey="cornerCracksCuts" name="Corner Cracks/Cuts" stackId="a" fill={CHART_COLORS[1]} />
                            <Bar dataKey="cornerDamage" name="Corner Damage" stackId="a" fill={CHART_COLORS[2]} />
                            <Bar dataKey="chippedBlocks" name="Chipped Blocks" stackId="a" fill={CHART_COLORS[3]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Radar Chart for Position Distribution */}
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Position Defect Distribution</h2>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="position" />
                                <PolarRadiusAxis />
                                <Radar
                                    name="Rain Cracks/Cuts"
                                    dataKey="rainCracksCuts"
                                    stroke={CHART_COLORS[0]}
                                    fill={CHART_COLORS[0]}
                                    fillOpacity={0.6}
                                />
                                <Radar
                                    name="Corner Cracks/Cuts"
                                    dataKey="cornerCracksCuts"
                                    stroke={CHART_COLORS[1]}
                                    fill={CHART_COLORS[1]}
                                    fillOpacity={0.6}
                                />
                                <Radar
                                    name="Corner Damage"
                                    dataKey="cornerDamage"
                                    stroke={CHART_COLORS[2]}
                                    fill={CHART_COLORS[2]}
                                    fillOpacity={0.6}
                                />
                                <Radar
                                    name="Chipped Blocks"
                                    dataKey="chippedBlocks"
                                    stroke={CHART_COLORS[3]}
                                    fill={CHART_COLORS[3]}
                                    fillOpacity={0.6}
                                />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Position Summary Table */}
                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Position Summary</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">Position</th>
                                    <th className="px-4 py-2 text-left">Total Defects</th>
                                    <th className="px-4 py-2 text-left">Percentage</th>
                                    <th className="px-4 py-2 text-left">Most Common Defect</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((position, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-4 py-2">{position.position}</td>
                                        <td className="px-4 py-2">{position.total}</td>
                                        <td className="px-4 py-2">{position.percentage.toFixed(2)}%</td>
                                        <td className="px-4 py-2">{getMostCommonDefectForPosition(position)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PositionAnalysis;