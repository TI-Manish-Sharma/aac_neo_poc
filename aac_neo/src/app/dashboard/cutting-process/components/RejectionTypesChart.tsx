'use client';
import React, { useState, useEffect } from 'react';
import {
    BarChart as ReChartsBar,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
    TooltipProps
} from 'recharts';
import { RejectionType } from '../types/RejectionType';

interface Props {
    data: RejectionType[];
    title: string;
    primaryColor: string;
    secondaryColor: string;
}

export function RejectionTypesChart({
    data,
    title,
    primaryColor,
    secondaryColor
}: Props) {
    // Force mobile layout for small screens and debug
    const [screenSize, setScreenSize] = useState({
        isMobile: true,
        isTablet: false
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize({
                isMobile: width < 640,  // Increased mobile breakpoint
                isTablet: width >= 640 && width <= 1024 // Wider tablet range
            });
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { isMobile, isTablet } = screenSize;

    // Simpler mobile layout with fixed dimensions
    if (isMobile) {
        // Process data to ensure it has the needed properties
        const processedData = data.map(item => ({
            ...item,
            count: typeof item.count === 'number' ? item.count : 0,
            percentage: typeof item.percentage === 'number' ? item.percentage : 0,
            type: item.type || 'Unknown'
        }));

        // Custom tooltip for better mobile display
        const CustomTooltip = ({
            active,
            payload,
        }: TooltipProps<number, string>) => {
            if (active && payload && payload.length) {
                return (
                    <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
                        <p className="font-medium text-sm mb-1">{payload[0].payload.type}</p>
                        <p className="text-sm" style={{ color: primaryColor }}>
                            Number of Batches: <strong>{payload[0].value}</strong>
                        </p>
                    </div>
                );
            }
            return null;
        };

        return (
            <div className="w-full">
                <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>

                    {/* Simplified horizontal bar chart for mobile */}
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ReChartsBar
                                layout="vertical"
                                data={processedData}
                                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                                barSize={20}
                            >
                                <XAxis
                                    type="number"
                                    hide={true}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="type"
                                    width={150}
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="count"
                                    name="Number of Batches"
                                    fill={primaryColor}
                                    radius={[0, 4, 4, 0]}
                                    background={{ fill: '#eee' }}
                                >
                                    <LabelList
                                        dataKey="count"
                                        position="insideRight"
                                        fill="#ffffff"
                                        fontSize={12}
                                        formatter={(value: string | number) => value}
                                    />
                                </Bar>
                            </ReChartsBar>
                        </ResponsiveContainer>
                    </div>

                    {/* Simple legend for mobile */}
                    <div className="mt-4 flex items-center justify-center">
                        <div className="flex items-center">
                            <div className="w-4 h-4 mr-2" style={{ backgroundColor: primaryColor }}></div>
                            <span className="text-sm">Number of Batches</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Original desktop implementation with improvements
    const config = {
        barSize: isTablet ? 24 : 40,
        bottomMargin: isTablet ? 120 : 80,
        tickFontSize: isTablet ? 10 : 12,
        xAxisAngle: isTablet ? -60 : -45,
        aspectRatio: isTablet ? 1.5 : 2,
    };

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[500px] bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>

                <ResponsiveContainer
                    width="100%"
                    aspect={config.aspectRatio}
                    debounce={50}
                >
                    <ReChartsBar
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: config.bottomMargin
                        }}
                        barGap={8}
                        barSize={config.barSize}
                    >
                        <XAxis
                            dataKey="type"
                            interval={0}
                            angle={config.xAxisAngle}
                            tick={{
                                fontSize: config.tickFontSize,
                                textAnchor: 'end'
                            }}
                            padding={{ left: 20, right: 20 }}
                            height={config.bottomMargin - 20}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            tick={{ fontSize: config.tickFontSize }}
                            label={{
                                value: 'Count',
                                angle: -90,
                                dx: -10,
                                fontSize: config.tickFontSize
                            }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 'dataMax']}
                            tick={{ fontSize: config.tickFontSize }}
                            label={{
                                value: 'Percentage (%)',
                                angle: 90,
                                dx: 10,
                                fontSize: config.tickFontSize
                            }}
                        />

                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                        <Tooltip
                            formatter={(value, name) =>
                                name === 'Number of Batches'
                                    ? [value, 'Count']
                                    : [`${value}%`, 'Percentage']
                            }
                        />

                        <Legend
                            verticalAlign="top"
                            height={36}
                            wrapperStyle={{ fontSize: config.tickFontSize }}
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
}