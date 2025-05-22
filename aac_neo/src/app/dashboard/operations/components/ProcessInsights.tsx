// components/ProcessInsights.tsx
import React from 'react';
import { AlertTriangle, TrendingUp, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { BatchData, Metrics, TemperatureCategories } from '../types/batch';

interface ProcessInsightsProps {
    batchData: BatchData[];
    metrics: Metrics;
    tempCategories: TemperatureCategories;
}

interface InsightItemProps {
    type: 'info' | 'warning' | 'success' | 'recommendation';
    title: string;
    description: string;
    value?: string | number | undefined;
    trend?: 'up' | 'down' | 'stable';
}

const InsightItem: React.FC<InsightItemProps> = ({ type, title, description, value, trend }) => {
    const getInsightConfig = () => {
        switch (type) {
            case 'warning':
                return {
                    icon: <AlertTriangle className="h-4 w-4" />,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    iconColor: 'text-yellow-600',
                    titleColor: 'text-yellow-800'
                };
            case 'success':
                return {
                    icon: <CheckCircle className="h-4 w-4" />,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    iconColor: 'text-green-600',
                    titleColor: 'text-green-800'
                };
            case 'recommendation':
                return {
                    icon: <Lightbulb className="h-4 w-4" />,
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    iconColor: 'text-blue-600',
                    titleColor: 'text-blue-800'
                };
            default: // info
                return {
                    icon: <Info className="h-4 w-4" />,
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    iconColor: 'text-gray-600',
                    titleColor: 'text-gray-800'
                };
        }
    };

    const config = getInsightConfig();

    return (
        <div className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
            <div className="flex items-start space-x-3">
                <div className={`${config.iconColor} mt-0.5`}>
                    {config.icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${config.titleColor}`}>
                            {title}
                        </h4>
                        {value && (
                            <div className="flex items-center space-x-1">
                                {trend && (
                                    <TrendingUp
                                        className={`h-3 w-3 ${trend === 'up' ? 'text-red-500' :
                                                trend === 'down' ? 'text-green-500' :
                                                    'text-gray-500'
                                            }`}
                                        style={{
                                            transform: trend === 'down' ? 'rotate(180deg)' : 'none'
                                        }}
                                    />
                                )}
                                <span className={`text-sm font-semibold ${config.titleColor}`}>
                                    {value}
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

interface Insight {
    type: 'info' | 'warning' | 'success' | 'recommendation';
    title: string;
    description: string;
    value: string;
    trend?: 'up' | 'down' | 'stable';
}

const ProcessInsights: React.FC<ProcessInsightsProps> = ({ batchData, metrics, tempCategories }) => {
    // Calculate various metrics for insights
    const calculateInsights = (): Insight[] => {
        if (batchData.length === 0) return [];

        const insights = [];

        // Water usage analysis
        const waterUsages = batchData.map(batch => batch.waterKg);
        const minWater = Math.min(...waterUsages);
        const maxWater = Math.max(...waterUsages);
        const waterVariation = maxWater - minWater;

        if (waterVariation > 50) {
            insights.push({
                type: 'warning' as const,
                title: 'High Water Usage Variation',
                description: `Water usage varies from ${minWater}kg to ${maxWater}kg (${waterVariation}kg range). Consider standardizing water dosing for consistency.`,
                value: `${waterVariation}kg`,
                trend: 'up' as const
            });
        } else if (waterVariation < 20) {
            insights.push({
                type: 'success' as const,
                title: 'Consistent Water Usage',
                description: `Water usage is well controlled with only ${waterVariation}kg variation. Good process stability.`,
                value: `±${(waterVariation / 2).toFixed(1)}kg`,
                trend: 'stable' as const
            });
        }

        // Mixing time analysis
        const avgMixingTime = metrics.avgMixingTime;
        const outOfRangeMixing = batchData.filter(batch => batch.mixingTime < 2.5 || batch.mixingTime > 3.2).length;

        if (outOfRangeMixing === 0) {
            insights.push({
                type: 'success' as const,
                title: 'Optimal Mixing Time Control',
                description: 'All batches are within the optimal mixing time range of 2.5-3.2 minutes. Excellent process control.',
                value: `${avgMixingTime.toFixed(2)}m avg`
            });
        } else if (outOfRangeMixing > batchData.length * 0.1) {
            insights.push({
                type: 'warning' as const,
                title: 'Mixing Time Deviations',
                description: `${outOfRangeMixing} batches (${((outOfRangeMixing / batchData.length) * 100).toFixed(1)}%) outside optimal range. Check mixing equipment.`,
                value: `${outOfRangeMixing} batches`
            });
        }

        // Temperature analysis
        const optimalPercentage = (tempCategories.optimal / metrics.totalBatches) * 100;

        if (optimalPercentage >= 90) {
            insights.push({
                type: 'success' as const,
                title: 'Excellent Temperature Control',
                description: `${optimalPercentage.toFixed(1)}% of batches in optimal temperature range. Superior quality control.`,
                value: `${optimalPercentage.toFixed(1)}%`
            });
        } else if (optimalPercentage < 70) {
            insights.push({
                type: 'warning' as const,
                title: 'Temperature Control Needs Attention',
                description: `Only ${optimalPercentage.toFixed(1)}% of batches in optimal range. Review cooling/heating processes.`,
                value: `${optimalPercentage.toFixed(1)}%`,
                trend: 'down' as const
            });
        }

        // Production efficiency
        const avgSlurryProduction = batchData.reduce((sum, batch) => sum + batch.freshSlurryKg, 0) / batchData.length;

        if (avgSlurryProduction > 2400) {
            insights.push({
                type: 'success' as const,
                title: 'High Production Efficiency',
                description: `Average fresh slurry production of ${avgSlurryProduction.toFixed(0)}kg per batch exceeds target.`,
                value: `${avgSlurryProduction.toFixed(0)}kg`
            });
        }

        // Material consistency recommendations
        const cementUsages = batchData.map(batch => batch.cementKg);
        const cementVariation = Math.max(...cementUsages) - Math.min(...cementUsages);

        if (cementVariation > 15) {
            insights.push({
                type: 'recommendation' as const,
                title: 'Cement Dosing Optimization',
                description: `Cement usage varies by ${cementVariation}kg. Consider automated dosing systems for better consistency.`,
                value: `${cementVariation}kg range`
            });
        }

        // Recent trend analysis (last 5 vs previous 5 batches)
        if (batchData.length >= 10) {
            const recent5 = batchData.slice(-5);
            const previous5 = batchData.slice(-10, -5);

            const recentAvgTemp = recent5.reduce((sum, batch) => sum + batch.dischargeTemp, 0) / 5;
            const previousAvgTemp = previous5.reduce((sum, batch) => sum + batch.dischargeTemp, 0) / 5;

            if (recentAvgTemp > previousAvgTemp + 0.5) {
                insights.push({
                    type: 'warning' as const,
                    title: 'Rising Temperature Trend',
                    description: `Recent batches show temperature increase of ${(recentAvgTemp - previousAvgTemp).toFixed(1)}°C. Monitor cooling system.`,
                    value: `+${(recentAvgTemp - previousAvgTemp).toFixed(1)}°C`,
                    trend: 'up' as const
                });
            }
        }

        return insights;
    };

    const insights = calculateInsights();

    // Add some general recommendations if no specific issues found
    const generalRecommendations = [
        {
            type: 'recommendation' as const,
            title: 'Process Optimization',
            description: 'Continue monitoring water usage patterns to identify optimal dosing strategies for different environmental conditions.',
            value: 'N/A',
            trend: undefined
        },
        {
            type: 'info' as const,
            title: 'Quality Targets',
            description: 'Maintain discharge temperature ≤47°C for optimal AAC block quality and strength development.',
            value: 'N/A',
            trend: undefined
        },
        {
            type: 'recommendation' as const,
            title: 'Preventive Maintenance',
            description: 'Regular calibration of mixing time controls and temperature sensors ensures consistent quality output.',
            value: 'N/A',
            trend: undefined
        }
    ];

    const allInsights = insights.length > 0 ? insights : [...insights, ...generalRecommendations.slice(0, 2)];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Process Insights & Recommendations
                </h3>
                <div className="text-sm text-gray-500">
                    Based on {batchData.length} batches
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allInsights.map((insight, index) => (
                    <InsightItem
                        key={index}
                        type={insight.type}
                        title={insight.title}
                        description={insight.description}
                        value={insight.value}
                        trend={insight.trend}
                    />
                ))}
            </div>

            {/* Performance Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {metrics.totalBatches}
                        </div>
                        <div className="text-gray-600">Total Batches</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {((tempCategories.optimal / metrics.totalBatches) * 100).toFixed(1)}%
                        </div>
                        <div className="text-gray-600">Optimal Temp</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {metrics.avgMixingTime.toFixed(2)}m
                        </div>
                        <div className="text-gray-600">Avg Mix Time</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">
                            {metrics.avgWaterUsage.toFixed(1)}kg
                        </div>
                        <div className="text-gray-600">Avg Water</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessInsights;