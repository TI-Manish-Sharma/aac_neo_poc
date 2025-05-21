import React, { useState } from 'react';
import {
    Activity,
    BarChart2,
    TrendingDown,
    TrendingUp,
    Clock,
    AlertTriangle,
    ArrowUpRight,
    Info
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

interface PredictiveAlertsProps {
    data: {
        alerts: Array<{
            id: string;
            mouldId?: string;
            mouldName?: string;
            metricName: string;
            currentValue: number;
            predictedValue: number;
            threshold: number;
            unit: string;
            timeToThreshold: number; // in hours
            confidence: number; // 0-100
            trend: 'up' | 'down';
            category: 'defect_rate' | 'machine_wear' | 'material_quality' | 'tool_wear' | 'other';
            severity: 'low' | 'medium' | 'high' | 'critical';
            timestamp: string;
            historicalData: Array<{
                time: string;
                value: number;
            }>;
        }>;
        stats: {
            totalAlerts: number;
            criticalAlerts: number;
            highAlerts: number;
            mediumAlerts: number;
            lowAlerts: number;
        };
    };
    title?: string;
    height?: number;
    showViewDetails?: boolean;
    onViewDetails?: () => void;
}

const PredictiveAlerts: React.FC<PredictiveAlertsProps> = ({
    data,
    title = 'Predictive Alerts',
    height = 100,
    showViewDetails = false,
    onViewDetails
}) => {
    const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [severityFilter, setSeverityFilter] = useState<string>('all');

    // Filter alerts based on selected filters
    const filteredAlerts = data.alerts.filter(alert => {
        const categoryMatch = categoryFilter === 'all' || alert.category === categoryFilter;
        const severityMatch = severityFilter === 'all' || alert.severity === severityFilter;
        return categoryMatch && severityMatch;
    });

    // Get selected alert
    const selectedAlert = selectedAlertId
        ? data.alerts.find(alert => alert.id === selectedAlertId)
        : filteredAlerts[0];

    // Format time remaining
    const formatTimeRemaining = (hours: number): string => {
        if (hours < 1) {
            return `${Math.round(hours * 60)} minutes`;
        } else if (hours < 24) {
            return `${Math.round(hours)} hours`;
        } else {
            const days = Math.floor(hours / 24);
            const remainingHours = Math.round(hours % 24);
            return `${days} day${days !== 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours} hr${remainingHours !== 1 ? 's' : ''}` : ''}`;
        }
    };

    // Get category icon
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'defect_rate':
                return <BarChart2 size={16} className="text-blue-500" />;
            case 'machine_wear':
                return <Activity size={16} className="text-purple-500" />;
            case 'material_quality':
                return <AlertTriangle size={16} className="text-amber-500" />;
            case 'tool_wear':
                return <AlertTriangle size={16} className="text-orange-500" />;
            default:
                return <Info size={16} className="text-gray-500" />;
        }
    };

    // Get severity style
    const getSeverityStyle = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-50 border-red-200 text-red-700';
            case 'high':
                return 'bg-orange-50 border-orange-200 text-orange-700';
            case 'medium':
                return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'low':
                return 'bg-blue-50 border-blue-200 text-blue-700';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    // Format category name
    const formatCategoryName = (category: string): string => {
        return category.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Prepare chart data with forecast
    const prepareChartData = (alert: typeof data.alerts[0]) => {
        if (!alert) return [];

        const historicalData = [...alert.historicalData];

        // Sort by time
        historicalData.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

        // Format data for chart
        const chartData: Array<{ time: string; value: number | null; forecast: number | null }> = historicalData.map(item => ({
            time: new Date(item.time).toLocaleDateString(),
            value: item.value,
            forecast: null
        }));

        // Add current and forecast points
        // const lastPoint = chartData[chartData.length - 1];
        const currentDate = new Date();

        chartData.push({
            time: currentDate.toLocaleDateString(),
            value: alert.currentValue,
            forecast: alert.currentValue
        });

        // Add predicted point
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + alert.timeToThreshold);

        chartData.push({
            time: futureDate.toLocaleDateString(),
            value: null,
            forecast: alert.predictedValue
        });

        return chartData;
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <Activity size={24} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                </div>
                {showViewDetails && (
                    <button
                        onClick={onViewDetails}
                        className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center"
                    >
                        View All Alerts <ArrowUpRight size={14} className="ml-1" />
                    </button>
                )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-gray-700">{data.stats.totalAlerts}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-red-600">Critical</p>
                    <p className="text-lg font-bold text-red-700">{data.stats.criticalAlerts}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-orange-600">High</p>
                    <p className="text-lg font-bold text-orange-700">{data.stats.highAlerts}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-amber-600">Medium</p>
                    <p className="text-lg font-bold text-amber-700">{data.stats.mediumAlerts}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-blue-600">Low</p>
                    <p className="text-lg font-bold text-blue-700">{data.stats.lowAlerts}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap space-x-2 mb-4">
                <div>
                    <select
                        className="text-sm border border-gray-300 rounded-md p-1"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="defect_rate">Defect Rate</option>
                        <option value="machine_wear">Machine Wear</option>
                        <option value="material_quality">Material Quality</option>
                        <option value="tool_wear">Tool Wear</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <select
                        className="text-sm border border-gray-300 rounded-md p-1"
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                    >
                        <option value="all">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Alerts List - 4 columns */}
                <div className="lg:col-span-5 border border-gray-200 rounded-lg p-2 overflow-y-auto" style={{ maxHeight: '400px' }}>
                    {filteredAlerts.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                            <p>No alerts found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredAlerts.map(alert => (
                                <div
                                    key={alert.id}
                                    className={`border p-3 rounded-lg cursor-pointer transition-colors ${selectedAlertId === alert.id
                                            ? 'border-cyan-500 bg-cyan-50'
                                            : `${getSeverityStyle(alert.severity)} hover:bg-gray-50`
                                        }`}
                                    onClick={() => setSelectedAlertId(alert.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start">
                                            {getCategoryIcon(alert.category)}
                                            <div className="ml-2">
                                                <h4 className="text-sm font-medium text-gray-800">
                                                    {alert.mouldName ? `${alert.mouldName}: ` : ''}{alert.metricName}
                                                </h4>
                                                <p className="text-xs text-gray-500">
                                                    {formatCategoryName(alert.category)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center ml-2">
                                            {alert.trend === 'up' ? (
                                                <TrendingUp size={14} className="text-red-500" />
                                            ) : (
                                                <TrendingDown size={14} className="text-green-500" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-2 flex justify-between items-center">
                                        <div className="flex items-center text-xs">
                                            <Clock size={12} className="mr-1 text-gray-400" />
                                            <span className={alert.timeToThreshold < 24 ? 'text-red-600 font-semibold' : ''}>
                                                {formatTimeRemaining(alert.timeToThreshold)}
                                            </span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-gray-500">Confidence: </span>
                                            <span className={alert.confidence > 75 ? 'font-semibold' : ''}>
                                                {alert.confidence}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Alert Details and Chart - 8 columns */}
                <div className="lg:col-span-7">
                    {selectedAlert ? (
                        <>
                            {/* Alert Details */}
                            <div className={`border p-4 rounded-lg mb-4 ${getSeverityStyle(selectedAlert.severity)}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="flex items-center">
                                            {getCategoryIcon(selectedAlert.category)}
                                            <h3 className="text-base font-semibold ml-2">
                                                {selectedAlert.mouldName ? `${selectedAlert.mouldName}: ` : ''}
                                                {selectedAlert.metricName}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {formatCategoryName(selectedAlert.category)}
                                        </p>
                                    </div>
                                    <div className="px-2 py-1 rounded text-xs font-medium uppercase">
                                        {selectedAlert.severity}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Current Value</p>
                                        <p className="text-base font-bold">
                                            {selectedAlert.currentValue}{selectedAlert.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Predicted Value</p>
                                        <div className="flex items-center">
                                            <p className="text-base font-bold">
                                                {selectedAlert.predictedValue}{selectedAlert.unit}
                                            </p>
                                            <span className="ml-1">
                                                {selectedAlert.trend === 'up' ? (
                                                    <TrendingUp size={16} className="text-red-500" />
                                                ) : (
                                                    <TrendingDown size={16} className="text-green-500" />
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Threshold</p>
                                        <p className="text-base font-bold">
                                            {selectedAlert.threshold}{selectedAlert.unit}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Time to Threshold</p>
                                        <p className={`text-base font-bold ${selectedAlert.timeToThreshold < 24 ? 'text-red-600' : ''}`}>
                                            {formatTimeRemaining(selectedAlert.timeToThreshold)}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <div className="flex items-center mb-1">
                                        <AlertTriangle size={14} className="text-amber-500 mr-1" />
                                        <span className="font-medium">Predictive Analysis</span>
                                    </div>
                                    <p className="text-gray-600 text-xs">
                                        {selectedAlert.trend === 'up'
                                            ? `${selectedAlert.metricName} is predicted to reach the critical threshold of ${selectedAlert.threshold}${selectedAlert.unit} in ${formatTimeRemaining(selectedAlert.timeToThreshold)} if the current trend continues.`
                                            : `${selectedAlert.metricName} is predicted to fall below the critical threshold of ${selectedAlert.threshold}${selectedAlert.unit} in ${formatTimeRemaining(selectedAlert.timeToThreshold)} if the current trend continues.`
                                        } This prediction has a confidence level of {selectedAlert.confidence}%.
                                    </p>
                                </div>
                            </div>

                            {/* Trend Chart */}
                            <div className="border border-gray-200 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Trend Analysis</h4>
                                <div className={`h-${height}`}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={prepareChartData(selectedAlert)}
                                            margin={{ top: 5, right: 20, left: 20, bottom: 20 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="time"
                                                angle={-45}
                                                textAnchor="end"
                                                height={50}
                                                tick={{ fontSize: 10 }}
                                            />
                                            <YAxis />
                                            <Tooltip />
                                            <ReferenceLine
                                                y={selectedAlert.threshold}
                                                label={{
                                                    value: `Threshold: ${selectedAlert.threshold}${selectedAlert.unit}`,
                                                    position: 'insideTopRight'
                                                }}
                                                stroke="red"
                                                strokeDasharray="3 3"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                name={selectedAlert.metricName}
                                                stroke="#3B82F6"
                                                dot={{ r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="forecast"
                                                name="Forecast"
                                                stroke="#F59E0B"
                                                strokeDasharray="5 5"
                                                dot={{ r: 4, strokeWidth: 2, stroke: '#F59E0B', fill: 'white' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full border border-gray-200 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Select an alert to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredictiveAlerts;