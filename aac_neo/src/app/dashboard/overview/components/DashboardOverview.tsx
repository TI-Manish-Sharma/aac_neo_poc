'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, BarChart2, PieChart, AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
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
import { ErrorBanner } from '../../shared/components/ErrorBanner';
import LoadingIndicator from '../../shared/components/LoadingIndicator';


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
}

interface DashboardOverviewProps {
    apiUrl?: string;
    refreshInterval?: number;
    title?: string;
}

const colorSet = {
    rejection: '#F97316', // orange-500 
    accepted: '#10B981', // emerald-500
    warning: '#FBBF24', // amber-400
    critical: '#EF4444', // red-500
    info: '#3B82F6', // blue-500
    success: '#10B981', // emerald-500
    chart: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']
};

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
    // apiUrl = '/dashboard/overview/api/',
    refreshInterval = 0,
}) => {
    // State management
    const [data, setData] = useState<OverviewData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [, setLastUpdated] = useState<Date | null>(null);
    const [startDate, ] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, ] = useState<Date | null>(new Date());

    // Function to format date for API
    const formatDateForApi = (date: Date): string => {
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    // Fetch data function
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            // let url = apiUrl;
            const params = new URLSearchParams();

            if (startDate) {
                params.append('start_date', formatDateForApi(startDate));
            }
            if (endDate) {
                params.append('end_date', formatDateForApi(endDate));
            }

            // if (params.toString()) {
            //     url += `?${params.toString()}`;
            // }

            // In a real implementation, this would be a fetch request to the API
            // For demonstration, we're using mock data
            // const response = await fetch(url);
            // if (!response.ok) {
            //   throw new Error(`API request failed with status ${response.status}`);
            // }
            // const result = await response.json();

            // Mock data for demonstration
            const mockData: OverviewData = {
                summary: {
                    totalBatches: 1248,
                    rejectedBatches: 162,
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
                    { mouldId: 'M-103', defectRate: 21.7, totalBatches: 83 },
                    { mouldId: 'M-108', defectRate: 18.4, totalBatches: 76 },
                    { mouldId: 'M-115', defectRate: 14.2, totalBatches: 92 },
                    { mouldId: 'M-122', defectRate: 11.7, totalBatches: 86 },
                    { mouldId: 'M-127', defectRate: 9.3, totalBatches: 79 }
                ],
                alerts: [
                    {
                        id: 'a1',
                        type: 'critical',
                        message: 'Mould M-103 showing critical rejection rate (21.7%)',
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

    // Handle filter apply
    // const handleApplyFilters = () => {
    //     fetchData();
    // };

    // Get trend indicator component
    const getTrendIndicator = (trend: 'up' | 'down' | 'stable', value: number) => {
        if (trend === 'stable') {
            return <span className="text-gray-500 text-xs">Stable</span>;
        }

        return (
            <div className="flex items-center">
                {trend === 'down' ? (
                    <span className="flex items-center text-green-500 text-xs">
                        <ArrowDown size={12} className="mr-1" /> {value}%
                    </span>
                ) : (
                    <span className="flex items-center text-red-500 text-xs">
                        <ArrowUp size={12} className="mr-1" /> {value}%
                    </span>
                )}
            </div>
        );
    };

    // Get alert icon based on type
    const getAlertIcon = (type: 'warning' | 'critical' | 'info') => {
        switch (type) {
            case 'critical':
                return <AlertCircle size={16} className="text-red-500" />;
            case 'warning':
                return <AlertCircle size={16} className="text-amber-500" />;
            case 'info':
                return <AlertCircle size={16} className="text-blue-500" />;
            default:
                return <AlertCircle size={16} className="text-gray-500" />;
        }
    };

    // Render loading state
    if (isLoading && !data) {
        return <LoadingIndicator message="Loading dashboard data..." />;
    }

    return (
        <>
            {/* Header with title and refresh button */}
            {/* <Header
                title={title}
                lastUpdated={lastUpdated}
                isLoading={isLoading}
                onRefresh={fetchData}
            >
            </Header> */}

            {/* Error banner */}
            {error && <ErrorBanner message={error} />}

            {data && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <BarChart2 size={24} className="text-blue-600" />
                                </div>
                                {getTrendIndicator(data.summary.trend, data.summary.trendValue)}
                            </div>
                            <h3 className="text-lg font-medium text-gray-600">Total Batches</h3>
                            <p className="text-3xl font-bold text-gray-800">{data.summary.totalBatches}</p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <PieChart size={24} className="text-red-600" />
                                </div>
                                {getTrendIndicator(data.summary.trend, data.summary.trendValue)}
                            </div>
                            <h3 className="text-lg font-medium text-gray-600">Rejected Batches</h3>
                            <p className="text-3xl font-bold text-gray-800">{data.summary.rejectedBatches}</p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <AlertCircle size={24} className="text-amber-600" />
                                </div>
                                {getTrendIndicator(data.summary.trend, data.summary.trendValue)}
                            </div>
                            <h3 className="text-lg font-medium text-gray-600">Rejection Rate</h3>
                            <p className="text-3xl font-bold text-gray-800">{data.summary.rejectionRate}%</p>
                        </div>
                    </div>

                    {/* Bottom Row - Mould Performance and Alerts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top 5 Moulds Performance */}
                        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-800">Top 5 Moulds by Defect Rate</h3>
                                <button className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center">
                                    View All <ArrowUpRight size={14} className="ml-1" />
                                </button>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data.mouldPerformance}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="mouldId" width={50} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="defectRate" name="Defect Rate (%)" fill={colorSet.rejection}>
                                            {data.mouldPerformance.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        entry.defectRate > 20
                                                            ? colorSet.critical
                                                            : entry.defectRate > 15
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

                        {/* Recent Alerts */}
                        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-800">Recent Alerts</h3>
                                <button className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center">
                                    View All <ArrowUpRight size={14} className="ml-1" />
                                </button>
                            </div>
                            <div className="space-y-4 overflow-auto max-h-64">
                                {data.alerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`p-3 rounded-lg flex items-start ${alert.type === 'critical'
                                                ? 'bg-red-50 border-l-4 border-red-500'
                                                : alert.type === 'warning'
                                                    ? 'bg-amber-50 border-l-4 border-amber-500'
                                                    : 'bg-blue-50 border-l-4 border-blue-500'
                                            }`}
                                    >
                                        <div className="mr-3 mt-0.5">{getAlertIcon(alert.type)}</div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(alert.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    {/* <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 transition-colors">
                                <BarChart2 size={20} className="text-cyan-500" />
                                <span>View Rejection Trends</span>
                            </button>
                            <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 transition-colors">
                                <PieChart size={20} className="text-cyan-500" />
                                <span>Mould Performance</span>
                            </button>
                            <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 transition-colors">
                                <AlertCircle size={20} className="text-cyan-500" />
                                <span>View All Alerts</span>
                            </button>
                            <button className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center gap-2 transition-colors">
                                <RefreshCw size={20} className="text-cyan-500" />
                                <span>Generate Report</span>
                            </button>
                        </div>
                    </div> */}
                </>
            )}
        </>
    );
};

export default DashboardOverview;