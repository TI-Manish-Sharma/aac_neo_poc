// components/KPICards.tsx
import React from 'react';
import { Activity, Clock, Thermometer, Droplets } from 'lucide-react';
import { Metrics } from '../types/batch';

interface KPICardsProps {
    metrics: Metrics;
}

interface KPICardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: React.ReactNode;
    color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, unit, icon, color }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className={`text-3xl font-bold ${color}`}>
                        {value}{unit}
                    </p>
                </div>
                {icon}
            </div>
        </div>
    );
};

const KPICards: React.FC<KPICardsProps> = ({ metrics }) => {
    const kpiData = [
        {
            title: "Total Batches",
            value: metrics.totalBatches,
            icon: <Activity className="h-8 w-8 text-blue-500" />,
            color: "text-blue-600"
        },
        {
            title: "Avg Mixing Time",
            value: metrics.avgMixingTime.toFixed(2),
            unit: "m",
            icon: <Clock className="h-8 w-8 text-green-500" />,
            color: "text-green-600"
        },
        {
            title: "Avg Discharge Time",
            value: metrics.avgDischargeTime,
            icon: <Clock className="h-8 w-8 text-purple-500" />,
            color: "text-purple-600"
        },
        {
            title: "Avg Discharge Temp",
            value: metrics.avgDischargeTemp.toFixed(1),
            unit: "°C",
            icon: <Thermometer className="h-8 w-8 text-orange-500" />,
            color: "text-orange-600"
        },
        {
            title: "Avg Water Usage",
            value: metrics.avgWaterUsage.toFixed(1),
            unit: "kg",
            icon: <Droplets className="h-8 w-8 text-cyan-500" />,
            color: "text-cyan-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {kpiData.map((kpi, index) => (
                <KPICard
                    key={index}
                    title={kpi.title}
                    value={kpi.value}
                    unit={kpi.unit}
                    icon={kpi.icon}
                    color={kpi.color}
                />
            ))}
        </div>
    );
};

export default KPICards;