import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
    BarChart,
    Bar,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';

interface MouldPerformanceProps {
    data: Array<{
        mouldId: string;
        defectRate: number;
        totalBatches: number;
    }>;
    title?: string;
    height?: number;
    showViewAll?: boolean;
    onViewAll?: () => void;
}

const colorSet = {
    rejection: '#F97316', // orange-500 
    warning: '#FBBF24', // amber-400
    critical: '#EF4444', // red-500
};

const MouldPerformanceChart: React.FC<MouldPerformanceProps> = ({
    data,
    title = 'Top 5 Mould Boxes by Defect Rate',
    height = 64,
    showViewAll = false,
    onViewAll
}) => {
    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                {showViewAll && (
                    <button
                        onClick={onViewAll}
                        className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center"
                    >
                        View All <ArrowUpRight size={14} className="ml-1" />
                    </button>
                )}
            </div>
            <div className={`h-${height}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="mouldId" width={50} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="defectRate" name="Defect Rate (%)" fill={colorSet.rejection}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        entry.defectRate > 10
                                            ? colorSet.critical
                                            : entry.defectRate > 5
                                                ? colorSet.warning
                                                : colorSet.rejection
                                    }
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MouldPerformanceChart;