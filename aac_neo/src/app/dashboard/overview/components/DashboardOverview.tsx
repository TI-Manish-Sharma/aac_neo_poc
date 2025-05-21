import React, { useState, useEffect, useCallback } from 'react';
import { BarChart2, PieChart, AlertCircle } from 'lucide-react';
import { ErrorBanner } from '../../shared/components/ErrorBanner';
import LoadingIndicator from '../../shared/components/LoadingIndicator';

// Import our new components
import SummaryCard from './SummaryCard';
import MouldPerformanceChart from './MouldPerformanceChart';
import AlertsPanel from './AlertsPanel';
import RejectionTrendChart from './RejectionTrendChart';
import DefectTypeBreakdown from './DefectTypeBreakdown';
import ProductionEfficiencyMetrics from './ProductionEfficiencyMetrics';
import CostImpactAnalysis from './CostImpactAnalysis';
import PerformanceComparison from './PerformanceComparison';
import ShiftOperatorAnalysis from './ShiftOperatorAnalysis';
import MaterialSupplierCorrelation from './MaterialSupplierCorrelation';
import ActionItemTracking from './ActionItemTracking';
import PredictiveAlerts from './PredictiveAlerts';
import TopPerformingMoulds from './TopPerformingMoulds';

// Define types for our dashboard data
interface OverviewData {
    summary: {
        totalBatches: number;
        rejectedBatches: number;
        rejectionRate: number;
        trend: 'up' | 'down' | 'stable';
        trendValue: number;
    };
    rejectionTrends: Array<{
        period: string;
        totalBatches: number;
        rejectionRate: number;
    }>;
    rejectionTypes: Array<{
        type: string;
        count: number;
        percentage: number;
    }>;
    mouldPerformance: Array<{
        mouldId: string;
        defectRate: number;
        totalBatches: number;
    }>;
    alerts: Array<{
        id: string;
        type: 'warning' | 'critical' | 'info';
        message: string;
        timestamp: string;
    }>;
    // Additional data structures will be here for new components
    // They're omitted for brevity
}

interface DashboardOverviewProps {
    apiUrl?: string;
    refreshInterval?: number;
    title?: string;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
    // apiUrl = '/dashboard/overview/api/',
    refreshInterval = 0,
}) => {
    // State management
    const [data, setData] = useState<OverviewData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [, setLastUpdated] = useState<Date | null>(null);
    const [startDate,] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate,] = useState<Date | null>(new Date());
    const [activeComponents, setActiveComponents] = useState<{ [key: string]: boolean }>({
        trends: false,
        defectTypes: false,
        efficiency: false,
        costImpact: false,
        comparison: false,
        shiftAnalysis: false,
        supplierAnalysis: false,
        actionItems: false,
        predictiveAlerts: false,
        topPerformers: false,
        mouldPerformance: false, // Added for MouldPerformanceChart
        alerts: false            // Added for AlertsPanel
    });

    // Function to format date for API
    const formatDateForApi = (date: Date): string => {
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    // Fetch data function
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            const params = new URLSearchParams();

            if (startDate) {
                params.append('start_date', formatDateForApi(startDate));
            }
            if (endDate) {
                params.append('end_date', formatDateForApi(endDate));
            }

            // Mock data structure would need to be extended to include data for all new components
            // This is just the original data for reference
            const mockData: OverviewData = {
                summary: {
                    totalBatches: 1248,
                    rejectedBatches: 2,
                    rejectionRate: 12.98,
                    trend: 'down',
                    trendValue: 2.3
                },
                rejectionTrends: [
                    { period: 'Week 1', totalBatches: 320, rejectionRate: 15.3 },
                    { period: 'Week 2', totalBatches: 298, rejectionRate: 13.8 },
                    { period: 'Week 3', totalBatches: 342, rejectionRate: 12.4 },
                    { period: 'Week 4', totalBatches: 288, rejectionRate: 11.2 }
                ],
                rejectionTypes: [
                    { type: 'TiltingCrane', count: 42, percentage: 25.9 },
                    { type: 'Chipping', count: 38, percentage: 23.5 },
                    { type: 'SideCutter', count: 33, percentage: 20.4 },
                    { type: 'Joined', count: 21, percentage: 13.0 },
                    { type: 'Trimming', count: 16, percentage: 9.9 },
                    { type: 'HC', count: 7, percentage: 4.3 },
                    { type: 'VC', count: 5, percentage: 3.1 }
                ],
                mouldPerformance: [
                    { mouldId: 'M-01', defectRate: 21.7, totalBatches: 83 },
                    { mouldId: 'M-08', defectRate: 18.4, totalBatches: 76 },
                    { mouldId: 'M-10', defectRate: 14.2, totalBatches: 92 },
                    { mouldId: 'M-12', defectRate: 11.7, totalBatches: 86 },
                    { mouldId: 'M-17', defectRate: 9.3, totalBatches: 79 }
                ],
                alerts: [
                    {
                        id: 'a1',
                        type: 'critical',
                        message: 'Mould Box M-01 showing critical rejection rate (21.7%)',
                        timestamp: '2025-05-08T08:25:43Z'
                    },
                    {
                        id: 'a2',
                        type: 'warning',
                        message: 'TiltingCrane rejections above threshold (25.9%)',
                        timestamp: '2025-05-08T07:18:22Z'
                    },
                    {
                        id: 'a3',
                        type: 'info',
                        message: 'Rejection rate trending down by 2.3% over the last week',
                        timestamp: '2025-05-08T06:45:12Z'
                    }
                ]
            };

            setData(mockData);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [endDate, startDate]);

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Set up auto-refresh if interval is provided
    useEffect(() => {
        if (refreshInterval <= 0) return;

        const intervalId = setInterval(() => {
            fetchData();
        }, refreshInterval * 1000);

        return () => clearInterval(intervalId);
    }, [refreshInterval, fetchData]);

    // Toggle component visibility
    const toggleComponent = (key: string) => {
        setActiveComponents(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Render loading state
    if (isLoading && !data) {
        return <LoadingIndicator message="Loading dashboard data..." />;
    }

    return (
        <>
            {/* Error banner */}
            {error && <ErrorBanner message={error} />}

            {data && (
                <>
                    {/* Configuration Menu */}
                    <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h3 className="text-base font-medium text-gray-700 mb-3">Dashboard Configuration</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <button
                                onClick={() => toggleComponent('trends')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.trends ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Rejection Trends
                            </button>
                            <button
                                onClick={() => toggleComponent('defectTypes')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.defectTypes ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Defect Types
                            </button>
                            <button
                                onClick={() => toggleComponent('mouldPerformance')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.mouldPerformance ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Mould Performance
                            </button>
                            <button
                                onClick={() => toggleComponent('alerts')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.alerts ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Alerts
                            </button>
                            <button
                                onClick={() => toggleComponent('topPerformers')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.topPerformers ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Top Performers
                            </button>
                            <button
                                onClick={() => toggleComponent('efficiency')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.efficiency ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Efficiency Metrics
                            </button>
                            <button
                                onClick={() => toggleComponent('costImpact')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.costImpact ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Cost Analysis
                            </button>
                            <button
                                onClick={() => toggleComponent('comparison')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.comparison ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Performance Comparison
                            </button>
                            <button
                                onClick={() => toggleComponent('shiftAnalysis')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.shiftAnalysis ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Shift Analysis
                            </button>
                            <button
                                onClick={() => toggleComponent('supplierAnalysis')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.supplierAnalysis ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Supplier Analysis
                            </button>
                            <button
                                onClick={() => toggleComponent('actionItems')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.actionItems ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Action Items
                            </button>
                            <button
                                onClick={() => toggleComponent('predictiveAlerts')}
                                className={`px-2 py-1 text-xs rounded border ${activeComponents.predictiveAlerts ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-700'}`}
                            >
                                Predictive Alerts
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
                        <SummaryCard
                            icon={<BarChart2 size={24} />}
                            title="Total Batches"
                            value={data.summary.totalBatches}
                            bgColor="bg-blue-100"
                            iconColor="text-blue-600"
                        />

                        <SummaryCard
                            icon={<PieChart size={24} />}
                            title="Batches with Rejection (>5%)"
                            value={data.summary.rejectedBatches}
                            bgColor="bg-red-100"
                            iconColor="text-red-600"
                        />

                        <SummaryCard
                            icon={<AlertCircle size={24} />}
                            title="Rejection Rate"
                            value={data.summary.rejectionRate}
                            unit="%"
                            trend={data.summary.trend}
                            trendValue={data.summary.trendValue}
                            bgColor="bg-amber-100"
                            iconColor="text-amber-600"
                        />
                    </div>

                    {/* Time-based Rejection Trend Chart - New Component */}
                    {activeComponents.trends && (
                        <div className="mb-6">
                            <RejectionTrendChart
                                data={data.rejectionTrends}
                                title="Rejection Rate Trend"
                                height={60}
                                chartType="line"
                                showBatchCount={true}
                            />
                        </div>
                    )}

                    {/* Defect Type Breakdown - New Component */}
                    {activeComponents.defectTypes && (
                        <div className="mb-6">
                            <DefectTypeBreakdown
                                data={data.rejectionTypes}
                                title="Defect Type Breakdown"
                                height={60}
                            />
                        </div>
                    )}

                    {/* Grid layout for Mould Performance and Alerts (now conditional) */}
                    {(activeComponents.mouldPerformance || activeComponents.alerts) && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Mould Performance Chart */}
                            {activeComponents.mouldPerformance && (
                                <div className={activeComponents.alerts ? '' : 'lg:col-span-2'}>
                                    <MouldPerformanceChart
                                        data={data.mouldPerformance}
                                        title="Top 5 Mould Boxes by Defect Rate"
                                        height={64}
                                        showViewAll={false}
                                    />
                                </div>
                            )}

                            {/* Alerts Panel */}
                            {activeComponents.alerts && (
                                <div className={activeComponents.mouldPerformance ? '' : 'lg:col-span-2'}>
                                    <AlertsPanel
                                        alerts={data.alerts}
                                        title="Recent Alerts"
                                        maxHeight={64}
                                        showViewAll={false}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Efficiency Metrics Component */}
                    {activeComponents.efficiency && (
                        <div className="mb-6">
                            <ProductionEfficiencyMetrics
                                data={{
                                    oee: 78.2,
                                    availability: 92.5,
                                    performance: 85.7,
                                    quality: 87.1,
                                    targetOee: 85
                                }}
                                title="Production Efficiency (OEE)"
                                showDetails={false}
                            />
                        </div>
                    )}

                    {/* Cost Impact Analysis Component */}
                    {activeComponents.costImpact && (
                        <div className="mb-6">
                            <CostImpactAnalysis
                                data={{
                                    summary: {
                                        totalCost: 1250000,
                                        previousPeriodCost: 1320000,
                                        percentChange: -5.3,
                                        currency: '₹',
                                        costPerRejection: 48000
                                    },
                                    breakdown: [
                                        { category: 'TiltingCrane', cost: 380000, percentage: 30.4 },
                                        { category: 'Chipping', cost: 325000, percentage: 26.0 },
                                        { category: 'SideCutter', cost: 290000, percentage: 23.2 },
                                        { category: 'Joined', cost: 180000, percentage: 14.4 },
                                        { category: 'Others', cost: 75000, percentage: 6.0 }
                                    ],
                                    trend: [
                                        { period: 'Week 1', cost: 350000, target: 300000 },
                                        { period: 'Week 2', cost: 320000, target: 300000 },
                                        { period: 'Week 3', cost: 305000, target: 300000 },
                                        { period: 'Week 4', cost: 275000, target: 300000 }
                                    ]
                                }}
                                title="Cost Impact Analysis"
                                height={50}
                            />
                        </div>
                    )}

                    {/* Performance Comparison Component */}
                    {activeComponents.comparison && (
                        <div className="mb-6">
                            <PerformanceComparison
                                data={{
                                    metrics: [
                                        { name: 'Defect Rate', current: 12.98, target: 10.0, historical: 15.3, unit: '%', isHigherBetter: false },
                                        { name: 'Productivity', current: 142, target: 150, historical: 135, unit: 'Units/Hr' },
                                        { name: 'Quality Score', current: 87, target: 90, historical: 82, unit: '/100' },
                                        { name: 'OEE', current: 78.2, target: 85, historical: 75.6, unit: '%' },
                                        { name: 'Uptime', current: 92.5, target: 95, historical: 90.8, unit: '%' }
                                    ],
                                    radarData: [
                                        { metric: 'Defect Rate', current: 78, target: 85, historical: 70 },
                                        { metric: 'Productivity', current: 95, target: 100, historical: 90 },
                                        { metric: 'Quality', current: 87, target: 90, historical: 82 },
                                        { metric: 'OEE', current: 78, target: 85, historical: 75 },
                                        { metric: 'Uptime', current: 92, target: 95, historical: 90 }
                                    ]
                                }}
                                title="Performance Comparison"
                                height={60}
                            />
                        </div>
                    )}

                    {/* Shift & Operator Analysis Component */}
                    {activeComponents.shiftAnalysis && (
                        <div className="mb-6">
                            <ShiftOperatorAnalysis
                                data={{
                                    shifts: [
                                        { id: 'shift1', name: 'Morning Shift', rejectionRate: 11.2, production: 42500, rejects: 4760 },
                                        { id: 'shift2', name: 'Afternoon Shift', rejectionRate: 13.5, production: 38600, rejects: 5211 },
                                        { id: 'shift3', name: 'Night Shift', rejectionRate: 14.8, production: 35200, rejects: 5210 }
                                    ],
                                    operators: [
                                        { id: 'op1', name: 'Operator A', rejectionRate: 10.3, production: 16300, rejects: 1679, shift: 'shift1' },
                                        { id: 'op2', name: 'Operator B', rejectionRate: 12.1, production: 14500, rejects: 1755, shift: 'shift1' },
                                        { id: 'op3', name: 'Operator C', rejectionRate: 15.2, production: 12800, rejects: 1946, shift: 'shift2' },
                                        { id: 'op4', name: 'Operator D', rejectionRate: 11.8, production: 13200, rejects: 1558, shift: 'shift2' },
                                        { id: 'op5', name: 'Operator E', rejectionRate: 14.3, production: 11700, rejects: 1673, shift: 'shift3' },
                                        { id: 'op6', name: 'Operator F', rejectionRate: 15.6, production: 10500, rejects: 1638, shift: 'shift3' }
                                    ],
                                    averageRejectionRate: 12.98
                                }}
                                title="Shift & Operator Analysis"
                                height={60}
                            />
                        </div>
                    )}

                    {/* Material & Supplier Correlation Component */}
                    {activeComponents.supplierAnalysis && (
                        <div className="mb-6">
                            <MaterialSupplierCorrelation
                                data={{
                                    suppliers: [
                                        { id: 'sup1', name: 'Supplier A', rejectionRate: 9.8, totalBatches: 352, materialTypes: ['Type X', 'Type Y'] },
                                        { id: 'sup2', name: 'Supplier B', rejectionRate: 14.2, totalBatches: 298, materialTypes: ['Type X', 'Type Z'] },
                                        { id: 'sup3', name: 'Supplier C', rejectionRate: 11.5, totalBatches: 326, materialTypes: ['Type Y', 'Type Z'] }
                                    ],
                                    materials: [
                                        { id: 'mat1', batchNumber: 'BT-001', materialType: 'Type X', supplier: 'sup1', supplierName: 'Supplier A', rejectionRate: 8.9, quantity: 15000, date: '2025-04-05' },
                                        { id: 'mat2', batchNumber: 'BT-002', materialType: 'Type Y', supplier: 'sup1', supplierName: 'Supplier A', rejectionRate: 10.2, quantity: 12000, date: '2025-04-12' },
                                        { id: 'mat3', batchNumber: 'BT-003', materialType: 'Type X', supplier: 'sup2', supplierName: 'Supplier B', rejectionRate: 15.1, quantity: 13500, date: '2025-04-08' },
                                        { id: 'mat4', batchNumber: 'BT-004', materialType: 'Type Z', supplier: 'sup2', supplierName: 'Supplier B', rejectionRate: 13.7, quantity: 14200, date: '2025-04-15' },
                                        { id: 'mat5', batchNumber: 'BT-005', materialType: 'Type Y', supplier: 'sup3', supplierName: 'Supplier C', rejectionRate: 11.2, quantity: 15800, date: '2025-04-10' },
                                        { id: 'mat6', batchNumber: 'BT-006', materialType: 'Type Z', supplier: 'sup3', supplierName: 'Supplier C', rejectionRate: 11.9, quantity: 13700, date: '2025-04-18' }
                                    ],
                                    averageRejectionRate: 12.98
                                }}
                                title="Material & Supplier Analysis"
                                height={60}
                            />
                        </div>
                    )}

                    {/* Action Item Tracking Component */}
                    {activeComponents.actionItems && (
                        <div className="mb-6">
                            <ActionItemTracking
                                data={{
                                    actions: [
                                        { id: 'act1', title: 'Adjust TiltingCrane settings', description: 'Recalibrate TiltingCrane to reduce rejections', status: 'in_progress', priority: 'high', assignee: 'John Smith', dueDate: '2025-05-20', createdDate: '2025-05-10', relatedMouldId: 'M-01', relatedMouldName: 'M-01', category: 'mechanical' },
                                        { id: 'act2', title: 'Replace worn components', description: 'Replace worn parts in M-08 mould box', status: 'open', priority: 'critical', assignee: 'Jane Doe', dueDate: '2025-05-15', createdDate: '2025-05-09', relatedMouldId: 'M-08', relatedMouldName: 'M-08', category: 'maintenance' },
                                        { id: 'act3', title: 'Operator training', description: 'Conduct refresher training on defect identification', status: 'completed', priority: 'medium', assignee: 'Robert Lee', dueDate: '2025-05-12', createdDate: '2025-05-05', completedDate: '2025-05-12', category: 'training' }
                                    ],
                                    moulds: [
                                        { id: 'M-01', name: 'M-01', defectRate: 21.7 },
                                        { id: 'M-08', name: 'M-08', defectRate: 18.4 },
                                        { id: 'M-10', name: 'M-10', defectRate: 14.2 },
                                        { id: 'M-12', name: 'M-12', defectRate: 11.7 },
                                        { id: 'M-17', name: 'M-17', defectRate: 9.3 }
                                    ],
                                    stats: {
                                        total: 15,
                                        completed: 6,
                                        open: 4,
                                        inProgress: 5,
                                        overdue: 2
                                    }
                                }}
                                title="Action Item Tracking"
                            />
                        </div>
                    )}

                    {/* Predictive Alerts Component */}
                    {activeComponents.predictiveAlerts && (
                        <div className="mb-6">
                            <PredictiveAlerts
                                data={{
                                    alerts: [
                                        { id: 'pa1', mouldId: 'M-01', mouldName: 'M-01', metricName: 'Defect Rate', currentValue: 21.7, predictedValue: 24.5, threshold: 25.0, unit: '%', timeToThreshold: 36, confidence: 85, trend: 'up', category: 'defect_rate', severity: 'critical', timestamp: '2025-05-08T08:25:43Z', historicalData: [
                                            { time: '2025-04-01', value: 15.8 },
                                            { time: '2025-04-15', value: 17.2 },
                                            { time: '2025-05-01', value: 19.5 },
                                            { time: '2025-05-08', value: 21.7 }
                                        ] },
                                        { id: 'pa2', metricName: 'TiltingCrane Wear', currentValue: 68, predictedValue: 82, threshold: 85, unit: '%', timeToThreshold: 72, confidence: 78, trend: 'up', category: 'machine_wear', severity: 'high', timestamp: '2025-05-08T07:42:18Z', historicalData: [
                                            { time: '2025-03-15', value: 45 },
                                            { time: '2025-04-01', value: 52 },
                                            { time: '2025-04-15', value: 60 },
                                            { time: '2025-05-01', value: 65 },
                                            { time: '2025-05-08', value: 68 }
                                        ] },
                                        { id: 'pa3', mouldId: 'M-08', mouldName: 'M-08', metricName: 'Tool Life', currentValue: 72, predictedValue: 85, threshold: 90, unit: '%', timeToThreshold: 120, confidence: 65, trend: 'up', category: 'tool_wear', severity: 'medium', timestamp: '2025-05-08T06:35:52Z', historicalData: [
                                            { time: '2025-04-01', value: 45 },
                                            { time: '2025-04-15', value: 58 },
                                            { time: '2025-05-01', value: 65 },
                                            { time: '2025-05-08', value: 72 }
                                        ] }
                                    ],
                                    stats: {
                                        totalAlerts: 8,
                                        criticalAlerts: 2,
                                        highAlerts: 3,
                                        mediumAlerts: 2,
                                        lowAlerts: 1
                                    }
                                }}
                                title="Predictive Alerts"
                                height={100}
                            />
                        </div>
                    )}

                    {/* Top Performing Moulds - New Component */}
                    {activeComponents.topPerformers && (
                        <div className="mb-6">
                            <TopPerformingMoulds
                                data={{
                                    topMoulds: [
                                        // Sample data - replace with actual API data
                                        { id: 'M-22', name: 'M-22', defectRate: 1.2, totalBatches: 87, totalProduction: 4350, consistency: 95, efficiency: 98.2 },
                                        { id: 'M-15', name: 'M-15', defectRate: 1.5, totalBatches: 92, totalProduction: 4600, consistency: 92, efficiency: 97.8 },
                                        { id: 'M-03', name: 'M-03', defectRate: 1.8, totalBatches: 76, totalProduction: 3800, consistency: 88, efficiency: 96.9 },
                                        { id: 'M-19', name: 'M-19', defectRate: 2.1, totalBatches: 84, totalProduction: 4200, consistency: 86, efficiency: 96.0 },
                                        { id: 'M-07', name: 'M-07', defectRate: 2.3, totalBatches: 80, totalProduction: 4000, consistency: 84, efficiency: 95.8 }
                                    ],
                                    stats: {
                                        averageDefectRate: 4.2,
                                        lowestDefectRate: 1.2,
                                        highestEfficiency: 98.2,
                                        totalTopPerformers: 8
                                    },
                                    timeFrame: 'Last 30 days'
                                }}
                                title="Top Performing Mould Boxes"
                                height={60}
                                showViewDetails={false}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default DashboardOverview;