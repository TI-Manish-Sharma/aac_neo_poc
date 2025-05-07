import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { DefectByPosition } from '../types';

interface DefectsByPositionChartProps {
    data: DefectByPosition[];
    detailed?: boolean;
}

const DefectsByPositionChart: React.FC<DefectsByPositionChartProps> = ({ data, detailed = false }) => {
    // Colors for the charts
    const defectTypeColors = {
        rainCracksCuts: '#0088FE',
        cornerCracksCuts: '#00C49F',
        cornerDamage: '#FFBB28',
        chippedBlocks: '#FF8042'
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {detailed ? 'Defect Types by Position' : 'Defects by Position'}
            </h2>
            <div className={`h-64 ${detailed ? 'md:h-96' : 'md:h-80'}`}>
                <ResponsiveContainer width="100%" height="100%">
                    {!detailed ? (
                        // Simple bar chart for overview
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="position" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" name="Total Defects" fill="#0088FE" />
                        </BarChart>
                    ) : (
                        // Stacked bar chart for detailed view
                        <>
                            {/* First chart: Stacked bar */}
                            <div className="h-1/2 mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="position" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="rainCracksCuts"
                                            name="Rain Cracks/Cuts"
                                            stackId="a"
                                            fill={defectTypeColors.rainCracksCuts}
                                        />
                                        <Bar
                                            dataKey="cornerCracksCuts"
                                            name="Corner Cracks/Cuts"
                                            stackId="a"
                                            fill={defectTypeColors.cornerCracksCuts}
                                        />
                                        <Bar
                                            dataKey="cornerDamage"
                                            name="Corner Damage"
                                            stackId="a"
                                            fill={defectTypeColors.cornerDamage}
                                        />
                                        <Bar
                                            dataKey="chippedBlocks"
                                            name="Chipped Blocks"
                                            stackId="a"
                                            fill={defectTypeColors.chippedBlocks}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            {/* Second chart: Radar */}
                            {/* <div className="h-1/2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="position" />
                                        <PolarRadiusAxis />
                                        <Radar
                                            name="Rain Cracks/Cuts"
                                            dataKey="rainCracksCuts"
                                            stroke={defectTypeColors.rainCracksCuts}
                                            fill={defectTypeColors.rainCracksCuts}
                                            fillOpacity={0.6}
                                        />
                                        <Radar
                                            name="Corner Cracks/Cuts"
                                            dataKey="cornerCracksCuts"
                                            stroke={defectTypeColors.cornerCracksCuts}
                                            fill={defectTypeColors.cornerCracksCuts}
                                            fillOpacity={0.6}
                                        />
                                        <Radar
                                            name="Corner Damage"
                                            dataKey="cornerDamage"
                                            stroke={defectTypeColors.cornerDamage}
                                            fill={defectTypeColors.cornerDamage}
                                            fillOpacity={0.6}
                                        />
                                        <Radar
                                            name="Chipped Blocks"
                                            dataKey="chippedBlocks"
                                            stroke={defectTypeColors.chippedBlocks}
                                            fill={defectTypeColors.chippedBlocks}
                                            fillOpacity={0.6}
                                        />
                                        <Legend />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div> */}
                        </>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DefectsByPositionChart;