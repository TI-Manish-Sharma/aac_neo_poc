import React, { useState } from 'react';
import {
    Activity,
    BarChart2,
    TrendingDown,
    TrendingUp,
    Clock,
    AlertTriangle,
    ArrowUpRight,
    Info,
    Database,
    Zap
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

const COLORS = {
    CRITICAL: {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-800',
        strokeLight: '#fee2e2', // lighter red bg
        stroke: '#dc2626', // red-600
        strokeDark: '#b91c1c', // red-700
    },
    HIGH: {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-800',
        strokeLight: '#ffedd5',
        stroke: '#ea580c', // orange-600
        strokeDark: '#c2410c', // orange-700
    },
    MEDIUM: {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-800',
        strokeLight: '#fef3c7',
        stroke: '#d97706', // amber-600
        strokeDark: '#b45309', // amber-700
    },
    LOW: {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-800',
        strokeLight: '#dbeafe',
        stroke: '#2563eb', // blue-600
        strokeDark: '#1d4ed8', // blue-700
    }
};

// Define type for TrendAnalysisChart props using the alert type from PredictiveAlertsProps
type TrendAnalysisChartProps = {
    alert: PredictiveAlertsProps['data']['alerts'][0] | undefined;
    height?: number;
};

// Trend Analysis Chart Component
const TrendAnalysisChart = ({ alert, height = 120 }: TrendAnalysisChartProps) => {
    if (!alert) return null;
    
    // Get color scheme based on severity
    //  const getColorScheme = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    //     switch (severity) {
    //         case 'critical': return COLORS.CRITICAL;
    //         case 'high': return COLORS.HIGH;
    //         case 'medium': return COLORS.MEDIUM;
    //         case 'low': 
    //         default: return COLORS.LOW;
    //     }
    // };
    
    // const colorScheme = getColorScheme(alert.severity);
    // Format dates consistently with shortened month names and day number
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        // Format like "Apr 01", "May 08", etc.
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: '2-digit'
        });
    };

    // Prepare chart data with smooth forecast line
    const prepareChartData = () => {
        if (!alert) return [];

        const historicalData = [...alert.historicalData];
        
        // Sort by time
        historicalData.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        
        // Format historical data points
        const chartData = historicalData.map(item => ({
            time: formatDate(item.time),
            value: item.value as number | null,
            forecast: null as number | null
        }));
        
        // Get the last historical data point
        const lastHistoricalDate = new Date(historicalData[historicalData.length - 1].time);
        const lastHistoricalValue = historicalData[historicalData.length - 1].value;
        
        // Current date (if needed)
        const currentDate = new Date();
        const currentValue = alert.currentValue;
        
        // Only add current point if it's different from last historical point
        if (currentDate.getTime() - lastHistoricalDate.getTime() > 24 * 60 * 60 * 1000 ||
            currentValue !== lastHistoricalValue) {
            chartData.push({
                time: formatDate(currentDate.toString()),
                value: currentValue,
                forecast: currentValue // Start the forecast line from current value
            });
        } else {
            // Update the last point to include forecast
            chartData[chartData.length - 1].forecast = lastHistoricalValue;
        }
        
        // Future date for prediction
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + alert.timeToThreshold);
        
        // Add intermediary points for a smoother curve if the time gap is large
        if (alert.timeToThreshold > 48) { // If more than 2 days
            const midDate = new Date();
            midDate.setHours(midDate.getHours() + alert.timeToThreshold / 2);
            
            // Calculate mid-point value (linear interpolation)
            const midValue = currentValue + (alert.predictedValue - currentValue) / 2;
            
            chartData.push({
                time: formatDate(midDate.toString()),
                value: null,
                forecast: midValue
            });
        }
        
        // Add the prediction point
        chartData.push({
            time: formatDate(futureDate.toString()),
            value: null,
            forecast: alert.predictedValue
        });
        
        return chartData;
    };

    // Disable next line linter
    // Custom tooltip component
    /* eslint-disable-next-line */
    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 shadow-sm rounded text-xs">
                    <p className="font-semibold">{label}</p>
                    {payload.map((entry, index) => {
                        if (entry.value !== null) {
                            return (
                                <p key={`tooltip-${index}`} style={{ color: entry.color }}>
                                    {entry.name}: {entry.value.toFixed(1)}{alert.unit}
                                </p>
                            );
                        }
                        return null;
                    })}
                </div>
            );
        }
        return null;
    };

    // Chart data
    const chartData = prepareChartData();

    // Calculate Y-axis domain with padding
    const allValues = chartData
        .flatMap(item => [item.value, item.forecast])
        .filter(value => value !== null);
    
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(Math.max(...allValues), alert.threshold);
    
    // Add some padding to y-axis
    const yPadding = (maxValue - minValue) * 0.1;
    const yDomain = [
        Math.max(0, minValue - yPadding), // Don't go below 0 for metrics like defect rate
        maxValue + yPadding
    ];

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
                <AlertTriangle size={16} className="text-amber-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Trend Analysis</h4>
            </div>
            
            <div style={{ height: `${height}px`, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="time"
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                            domain={yDomain}
                            tick={{ fontSize: 11, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={{ stroke: '#e5e7eb' }}
                            tickFormatter={(value) => `${value}${alert.unit}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine 
                            y={alert.threshold} 
                            label={{ 
                                value: `Threshold: ${alert.threshold}${alert.unit}`,
                                position: 'right',
                                fill: '#dc2626',
                                fontSize: 11
                            }} 
                            stroke="#dc2626" 
                            strokeDasharray="3 3" 
                        />
                        <Line 
                            type="monotone" 
                            dataKey="value" 
                            name="Actual" 
                            stroke="#3B82F6" 
                            strokeWidth={2.5}
                            dot={{ 
                                r: 5, 
                                strokeWidth: 1,
                                fill: '#fff',
                                stroke: '#3B82F6'
                            }}
                            activeDot={{ 
                                r: 7, 
                                strokeWidth: 1,
                                stroke: '#3B82F6'
                            }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="forecast" 
                            name="Forecast" 
                            stroke="#F59E0B" 
                            strokeWidth={2.5}
                            strokeDasharray="5 5" 
                            dot={{ 
                                r: 5, 
                                strokeWidth: 1,
                                fill: '#fff',
                                stroke: '#F59E0B'
                            }}
                            activeDot={{ 
                                r: 7, 
                                strokeWidth: 1,
                                stroke: '#F59E0B'
                            }}
                            connectNulls={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const PredictiveAlerts: React.FC<PredictiveAlertsProps> = ({
    data,
    title = 'Predictive Alerts',
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
                return <BarChart2 size={16} className="text-blue-600" />;
            case 'machine_wear':
                return <Activity size={16} className="text-purple-600" />;
            case 'material_quality':
                return <Database size={16} className="text-amber-600" />;
            case 'tool_wear':
                return <Info size={16} className="text-orange-600" />;
            default:
                return <Zap size={16} className="text-gray-600" />;
        }
    };

    // Get severity style
   const getSeverityStyle = (severity: string) => {
        switch (severity) {
            case 'critical':
                return `${COLORS.CRITICAL.bg} border ${COLORS.CRITICAL.border} ${COLORS.CRITICAL.text}`;
            case 'high':
                return `${COLORS.HIGH.bg} border ${COLORS.HIGH.border} ${COLORS.HIGH.text}`;
            case 'medium':
                return `${COLORS.MEDIUM.bg} border ${COLORS.MEDIUM.border} ${COLORS.MEDIUM.text}`;
            case 'low':
                return `${COLORS.LOW.bg} border ${COLORS.LOW.border} ${COLORS.LOW.text}`;
            default:
                return 'bg-gray-50 border border-gray-200 text-gray-700';
        }
    };

    // Format category name
    const formatCategoryName = (category: string): string => {
        return category.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
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
                {/* Alerts List - 5 columns */}
                <div className="lg:col-span-5 border border-gray-200 rounded-lg p-2 overflow-y-auto" style={{ maxHeight: '515px' }}>
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

                {/* Alert Details and Chart - 7 columns */}
                <div className="lg:col-span-7">
                    {selectedAlert ? (
                        <>
                            {/* Alert Details - Enhanced version matching the design */}
                            <div className={`border rounded-lg mb-4 overflow-hidden ${
                                selectedAlert.severity === 'critical' ? 'border-red-200' : 
                                selectedAlert.severity === 'high' ? 'border-orange-200' :
                                selectedAlert.severity === 'medium' ? 'border-amber-200' : 'border-blue-200'
                            }`}>
                                <div className={`p-3 flex justify-between items-center ${
                                    selectedAlert.severity === 'critical' ? 'bg-red-50' : 
                                    selectedAlert.severity === 'high' ? 'bg-orange-50' :
                                    selectedAlert.severity === 'medium' ? 'bg-amber-50' : 'bg-blue-50'
                                }`}>
                                    <div className="flex items-center">
                                        {getCategoryIcon(selectedAlert.category)}
                                        <h3 className="text-base font-semibold ml-2">
                                            {selectedAlert.mouldName ? `${selectedAlert.mouldName}: ` : ''}
                                            {selectedAlert.metricName}
                                        </h3>
                                    </div>
                                    <div className={`px-2 py-1 text-xs font-semibold uppercase ${
                                        selectedAlert.severity === 'critical' ? 'text-red-700' : 
                                        selectedAlert.severity === 'high' ? 'text-orange-700' :
                                        selectedAlert.severity === 'medium' ? 'text-amber-700' : 'text-blue-700'
                                    }`}>
                                        {selectedAlert.severity}
                                    </div>
                                </div>
                                
                                <div className="p-4">
                                    <div className="grid grid-cols-2 gap-6 mb-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Current Value</p>
                                            <p className={`text-lg font-bold ${
                                                selectedAlert.trend === 'up' ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                                {selectedAlert.currentValue}{selectedAlert.unit}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Predicted Value</p>
                                            <div className="flex items-center">
                                                <p className={`text-lg font-bold ${
                                                    selectedAlert.trend === 'up' ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                    {selectedAlert.predictedValue}{selectedAlert.unit}
                                                </p>
                                                <span className="ml-1">
                                                    {selectedAlert.trend === 'up' ? (
                                                        <TrendingUp size={18} className="text-red-500" />
                                                    ) : (
                                                        <TrendingDown size={18} className="text-green-500" />
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Threshold</p>
                                            <p className="text-lg font-bold text-gray-800">
                                                {selectedAlert.threshold}{selectedAlert.unit}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Time to Threshold</p>
                                            <p className={`text-lg font-bold ${selectedAlert.timeToThreshold < 24 ? 'text-red-600' : 'text-gray-800'}`}>
                                                {formatTimeRemaining(selectedAlert.timeToThreshold)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex items-center mb-1">
                                            <AlertTriangle size={16} className="text-amber-500 mr-1" />
                                            <span className="font-medium text-sm">Predictive Analysis</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">
                                            {selectedAlert.trend === 'up'
                                                ? `${selectedAlert.metricName} is predicted to reach the critical threshold of ${selectedAlert.threshold}${selectedAlert.unit} in ${formatTimeRemaining(selectedAlert.timeToThreshold)} if the current trend continues.`
                                                : `${selectedAlert.metricName} is predicted to fall below the critical threshold of ${selectedAlert.threshold}${selectedAlert.unit} in ${formatTimeRemaining(selectedAlert.timeToThreshold)} if the current trend continues.`
                                            } This prediction has a confidence level of {selectedAlert.confidence}%.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Trend Analysis Chart */}
                            <TrendAnalysisChart alert={selectedAlert} height={150} />
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