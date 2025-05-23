// TempHardnessChart.tsx
import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Label, ReferenceLine } from 'recharts';

// Define the prop types for the temperature-hardness data
interface BatchHardnessData {
    batchNo: number;
    mouldNo: number;
    rising: 'Ok' | 'OVER' | 'UNDER';
    temp: number;
    hardness: number;
    time: string;
}

interface TempHardnessChartProps {
    data: BatchHardnessData[];
}

const TempHardnessChart: React.FC<TempHardnessChartProps> = ({ data }) => {
    // Color mapping for Rising status
    const getColor = (rising: string) => {
        switch (rising) {
            case 'OVER': return '#ff5252';
            case 'UNDER': return '#2196f3';
            case 'Ok': return '#4caf50';
            default: return '#9e9e9e';
        }
    };

    // Modified data for scatter plot with colors
    const scatterData = data.map(item => ({
        ...item,
        fill: getColor(item.rising)
    }));

    // Custom integer formatter for X-axis ticks
    const formatTick = (value: number) => {
        return Math.round(value).toString();
    };

    // Custom Tooltip component
    const CustomTooltip = ({ active, payload }: { 
        active?: boolean; 
        payload?: Array<{
            payload: BatchHardnessData & { fill: string }
        }> 
    }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow-md">
                    <p className="font-bold">{`Batch: ${data.batchNo}`}</p>
                    <p>{`Temperature: ${data.temp}°C`}</p>
                    <p>{`Hardness: ${data.hardness}mm`}</p>
                    <p>{`Rising: ${data.rising}`}</p>
                    <p>{`Mould: ${data.mouldNo}`}</p>
                    <p>{`Time: ${data.time}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Temperature vs Hardness Monitoring</h2>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 30, bottom: 40, left: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="temp"
                            name="Temperature"
                            domain={[65, 73]}
                            tickFormatter={formatTick}
                            ticks={[65, 66, 67, 68, 69, 70, 71, 72, 73]}
                        >
                            <Label value="Temperature (°C)" position="bottom" offset={10} />
                        </XAxis>
                        <YAxis
                            type="number"
                            dataKey="hardness"
                            name="Hardness"
                            domain={[115, 180]}
                        >
                            <Label value="Hardness (mm)" angle={-90} position="left" offset={0} />
                        </YAxis>
                        <Tooltip content={<CustomTooltip />} />
                        <Scatter
                            name="Batches"
                            data={scatterData}
                            fill="#8884d8"
                        />
                        {/* Reference line for target hardness */}
                        <ReferenceLine
                            y={150}
                            stroke="#ff7300"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            label={{
                                value: "Target: 150mm",
                                position: "insideBottomRight",
                                fill: "#ff7300",
                                fontSize: 12
                            }}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-2">
                <div className="flex items-center mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span className="text-xs">OVER</span>
                </div>
                <div className="flex items-center mr-4">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                    <span className="text-xs">UNDER</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-xs">OK</span>
                </div>
            </div>
            <div className="text-center mt-1 text-xs text-gray-700">
                <p>Target hardness: 150mm (orange line) | Optimal temp: 69.8 ± 0.5°C</p>
            </div>
        </div>
    );
};

export default TempHardnessChart;