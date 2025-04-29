import React from 'react';
import {
    BarChart as ReChartsBar,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { RejectionType } from '../types/RejectionType';

interface RejectionTypesChartProps {
    data: RejectionType[];
    title: string;
    primaryColor: string;
    secondaryColor: string;
}

export const RejectionTypesChart: React.FC<RejectionTypesChartProps> = ({
    data,
    title,
    primaryColor,
    secondaryColor
}) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
            <div className="w-full h-80 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <ReChartsBar
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        barGap={8}
                        barSize={40}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="type"
                            scale="band"
                            tick={{ fontSize: 12 }}
                            padding={{ left: 20, right: 20 }}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            tick={{ fontSize: 12 }}
                            label={{ value: 'Count', angle: -90, position: 'insideLeft', dx: -15 }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 12 }}
                            domain={[0, 25]}
                            label={{ value: 'Percentage (%)', angle: 90, position: 'insideRight', dx: 15 }}
                        />
                        <Tooltip formatter={(value, name) => {
                            if (name === "Number of Batches") return [value, "Count"];
                            return [`${value}%`, "Percentage"];
                        }} />
                        <Legend
                            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                            verticalAlign="bottom"
                            height={36}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="count"
                            name="Number of Batches"
                            fill={primaryColor}
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="percentage"
                            name="Percentage (%)"
                            fill={secondaryColor}
                            radius={[4, 4, 0, 0]}
                        />
                    </ReChartsBar>
                </ResponsiveContainer>
            </div>
        </div>
    );
};