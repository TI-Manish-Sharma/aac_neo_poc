import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    ResponsiveContainer,
    Tooltip,
    Legend,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { RefreshCw, AlertTriangle, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define TypeScript interfaces
interface RejectionTrend {
    Period: string;
    TotalBatches: number;
    RejectedBatches: number;
    RejectionRate: number;
    TiltingCraneRejections: number;
    ChippingRejections: number;
    SideCutterRejections: number;
    JoinedRejections: number;
    TrimmingRejections: number;
    RejectedDueToHC: number;
    RejectedDueToVC: number;
    TiltingCraneRate: number;
    ChippingRate: number;
    SideCutterRate: number;
    JoinedRate: number;
    TrimmingRate: number;
    HCRate: number;
    VCRate: number;
}

interface RejectionTrendsProps {
    apiUrl?: string;
    refreshInterval?: number;
    title?: string;
}

const RejectionTrends: React.FC<RejectionTrendsProps> = ({
    apiUrl = 'http://localhost:8000/api/rejection-trends',
    refreshInterval = 0, // 0 means no auto-refresh
    title = 'Rejection Trends Analysis'
}) => {
    // State for rejection trends data
    const [trendsData, setTrendsData] = useState<RejectionTrend[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Filter states
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [groupBy, setGroupBy] = useState<string>('week');

    // Colors for charts
    const COLORS: { [key: string]: string } = {
        TiltingCrane: '#FF8042',
        Chipping: '#0088FE',
        SideCutter: '#00C49F',
        Joined: '#FFBB28',
        Trimming: '#FF6384',
        HC: '#9966FF',
        VC: '#4BC0C0'
    };

    // Function to format date for API
    const formatDateForApi = (date: Date): string => {
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    // Function to fetch data from API
    const fetchData = async () => {
        try {
            setIsLoading(true);

            let url = `${apiUrl}?group_by=${groupBy}`;
            if (startDate) {
                url += `&start_date=${formatDateForApi(startDate)}`;
            }
            if (endDate) {
                url += `&end_date=${formatDateForApi(endDate)}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    setTrendsData([]);
                    setError(null);
                    setIsLoading(false);
                    setLastUpdated(new Date());
                    return;
                }
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data: RejectionTrend[] = await response.json();
            setTrendsData(data);
            setLastUpdated(new Date());
            setError(null);
            setIsLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setIsLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, []);

    // Set up auto-refresh if interval is provided
    useEffect(() => {
        if (refreshInterval <= 0) return;

        const intervalId = setInterval(() => {
            fetchData();
        }, refreshInterval * 1000);

        return () => clearInterval(intervalId);
    }, [refreshInterval, startDate, endDate, groupBy]);

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleString();
    };

    // Handle manual refresh
    const handleRefresh = () => {
        fetchData();
    };

    // Handle filter apply
    const handleApplyFilters = () => {
        fetchData();
    };

    // Prepare trend line chart data
    const trendLineData = trendsData.map(trend => ({
        period: trend.Period,
        rejectionRate: trend.RejectionRate,
        totalBatches: trend.TotalBatches
    }));

    // Prepare rejection types chart data
    const rejectionTypesData = trendsData.map(trend => ({
        period: trend.Period,
        TiltingCrane: trend.TiltingCraneRate,
        Chipping: trend.ChippingRate,
        SideCutter: trend.SideCutterRate,
        Joined: trend.JoinedRate,
        Trimming: trend.TrimmingRate,
        HC: trend.HCRate,
        VC: trend.VCRate
    }));

    // Line chart options
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div className="card p-4 shadow">
            <div className="row mb-4 align-items-center">
                <div className="col-md-6">
                    <h1 className="h3 fw-bold">{title}</h1>
                </div>

                <div className="col-md-6 d-flex justify-content-md-end mt-3 mt-md-0">
                    {lastUpdated && (
                        <span className="small text-secondary me-3 mt-1">
                            Last updated: {formatDate(lastUpdated)}
                        </span>
                    )}

                    {isLoading ? (
                        <button className="btn btn-secondary d-flex align-items-center" disabled>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            Updating...
                        </button>
                    ) : (
                        <button
                            onClick={handleRefresh}
                            className="btn btn-primary d-flex align-items-center"
                        >
                            <RefreshCw size={16} className="me-2" /> Refresh
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="row mb-4 g-3">
                <div className="col-md-3">
                    <label className="form-label d-flex align-items-center">
                        <Calendar size={16} className="me-2" /> Start Date
                    </label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date: any) => setStartDate(date)}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        maxDate={endDate || new Date()}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label d-flex align-items-center">
                        <Calendar size={16} className="me-2" /> End Date
                    </label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date: any) => setEndDate(date)}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        minDate={startDate || undefined}
                        maxDate={new Date()}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Group By</label>
                    <select
                        className="form-select"
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                    >
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button
                        className="btn btn-primary w-100"
                        onClick={handleApplyFilters}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Applying...
                            </>
                        ) : 'Apply Filters'}
                    </button>
                </div>
            </div>

            {/* Show error banner if encountered an error */}
            {error && (
                <div className="alert alert-danger mb-4">
                    <div className="d-flex align-items-center">
                        <AlertTriangle className="text-danger me-2" size={20} />
                        <p className="mb-0">{error}</p>
                    </div>
                </div>
            )}

            {/* Show loading indicator */}
            {isLoading && (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-secondary">Loading trends data...</p>
                </div>
            )}

            {/* Show message if no data available */}
            {!isLoading && trendsData.length === 0 && (
                <div className="alert alert-info">
                    <div className="d-flex align-items-center">
                        <AlertTriangle className="text-info me-2" size={20} />
                        <p className="mb-0">No rejection trend data available for the selected period.</p>
                    </div>
                </div>
            )}

            {/* Display charts if data is available */}
            {!isLoading && trendsData.length > 0 && (
                <>
                    {/* Rejection Rate Trend Chart */}
                    <div className="card mb-4 bg-light">
                        <div className="card-body">
                            <h2 className="h5 fw-semibold mb-3">Rejection Rate Trend</h2>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={trendLineData}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis yAxisId="left" label={{ value: 'Rejection Rate (%)', angle: -90, position: 'insideLeft' }} />
                                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Total Batches', angle: 90, position: 'insideRight' }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="rejectionRate"
                                            name="Rejection Rate (%)"
                                            stroke="#FF8042"
                                            activeDot={{ r: 8 }}
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="totalBatches"
                                            name="Total Batches"
                                            stroke="#0088FE"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Types Chart */}
                    <div className="card bg-light">
                        <div className="card-body">
                            <h2 className="h5 fw-semibold mb-3">Rejection Types Over Time (%)</h2>
                            <div style={{ height: '400px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={rejectionTypesData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                                        <Tooltip />
                                        <Legend />
                                        {Object.keys(COLORS).map((key) => (
                                            <Bar key={key} dataKey={key} name={`${key} Rate (%)`} fill={COLORS[key]} />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Rejection Trends Table */}
                    <div className="card mt-4 bg-light">
                        <div className="card-body">
                            <h2 className="h5 fw-semibold mb-3">Detailed Rejection Trends</h2>
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Period</th>
                                            <th>Total Batches</th>
                                            <th>Rejected</th>
                                            <th>Rejection Rate</th>
                                            <th>TiltingCrane</th>
                                            <th>Chipping</th>
                                            <th>SideCutter</th>
                                            <th>Trimming</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trendsData.map((trend, index) => (
                                            <tr key={index}>
                                                <td>{trend.Period}</td>
                                                <td>{trend.TotalBatches}</td>
                                                <td>{trend.RejectedBatches}</td>
                                                <td>{trend.RejectionRate}%</td>
                                                <td>{trend.TiltingCraneRate}%</td>
                                                <td>{trend.ChippingRate}%</td>
                                                <td>{trend.SideCutterRate}%</td>
                                                <td>{trend.TrimmingRate}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RejectionTrends;