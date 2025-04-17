import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    XAxis,
    YAxis,
    CartesianGrid,
    Line,
    LineChart,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { RefreshCw, AlertTriangle, Calendar, Search, Download } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RecommendationsComponent from './RecommendationsComponent';

// Define TypeScript interfaces
interface DefectByType {
    type: string;
    count: number;
    percentage: number;
}

interface DefectByPosition {
    position: string;
    rainCracksCuts: number;
    cornerCracksCuts: number;
    cornerDamage: number;
    chippedBlocks: number;
    total: number;
    percentage: number;
}

interface MouldPerformance {
    mouldId: string;
    totalBatches: number;
    totalDefects: number;
    averageDefectsPerBatch: number;
    defectTypes: Array<{
        type: string;
        count: number;
    }>;
}

interface BatchDefect {
    batchId: string;
    mouldId: string;
    date: string;
    totalBlocks: number;
    totalDefects: number;
    defectRate: number;
}

interface SegregationData {
    summary: {
        totalBatches: number;
        batchesWithDefects: number;
        totalDefects: number;
        defectRate: number;
    };
    defectsByType: DefectByType[];
    defectsByPosition: DefectByPosition[];
    mouldPerformance: MouldPerformance[];
    worstBatches: BatchDefect[];
}

interface SegregationAnalysisProps {
    apiUrl?: string;
    refreshInterval?: number;
    title?: string;
}

const SegregationAnalysis: React.FC<SegregationAnalysisProps> = ({
    apiUrl = 'http://localhost:8000/api/segregation-analysis',
    refreshInterval = 0, // 0 means no auto-refresh
    title = 'Segregation Analysis Dashboard'
}) => {
    // State for data
    const [data, setData] = useState<SegregationData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Filter states
    const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [mouldId, setMouldId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('overview');

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const DEFECT_COLORS = {
        'rainCracksCuts': '#0088FE',
        'cornerCracksCuts': '#00C49F',
        'cornerDamage': '#FFBB28',
        'chippedBlocks': '#FF8042'
    };

    // Function to format date for API
    const formatDateForApi = (date: Date): string => {
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    // Function to fetch data from API
    const fetchData = async () => {
        try {
            setIsLoading(true);

            let url = apiUrl;
            const params = new URLSearchParams();

            if (startDate) {
                params.append('start_date', formatDateForApi(startDate));
            }
            if (endDate) {
                params.append('end_date', formatDateForApi(endDate));
            }
            if (mouldId.trim()) {
                params.append('mould_id', mouldId);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) {
                    setData(null);
                    setError('No data found for the selected criteria.');
                    setIsLoading(false);
                    return;
                }
                throw new Error(`API request failed with status ${response.status}`);
            }

            const responseData: SegregationData = await response.json();
            setData(responseData);
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
    }, [refreshInterval]);

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

    // Export data to CSV
    const handleExportCSV = () => {
        if (!data) return;

        // Create CSV content based on active tab
        let csvContent = 'data:text/csv;charset=utf-8,';

        if (activeTab === 'overview' || activeTab === 'defectTypes') {
            // Export defects by type
            csvContent += 'Defect Type,Count,Percentage\n';
            data.defectsByType.forEach(item => {
                csvContent += `${item.type},${item.count},${item.percentage.toFixed(2)}\n`;
            });
        } else if (activeTab === 'positions') {
            // Export defects by position
            csvContent += 'Position,Rain Cracks/Cuts,Corner Cracks/Cuts,Corner Damage,Chipped Blocks,Total,Percentage\n';
            data.defectsByPosition.forEach(item => {
                csvContent += `${item.position},${item.rainCracksCuts},${item.cornerCracksCuts},${item.cornerDamage},${item.chippedBlocks},${item.total},${item.percentage.toFixed(2)}\n`;
            });
        } else if (activeTab === 'moulds') {
            // Export mould performance
            csvContent += 'Mould ID,Total Batches,Total Defects,Average Defects Per Batch\n';
            data.mouldPerformance.forEach(item => {
                csvContent += `${item.mouldId},${item.totalBatches},${item.totalDefects},${item.averageDefectsPerBatch}\n`;
            });
        } else if (activeTab === 'batches') {
            // Export worst batches
            csvContent += 'Batch ID,Mould ID,Date,Total Blocks,Total Defects,Defect Rate\n';
            data.worstBatches.forEach(item => {
                csvContent += `${item.batchId},${item.mouldId},${item.date},${item.totalBlocks},${item.totalDefects},${item.defectRate.toFixed(2)}\n`;
            });
        }

        // Create download link and trigger download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `segregation-${activeTab}-${formatDateForApi(new Date())}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        onChange={(date) => setStartDate(date)}
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
                        onChange={(date) => setEndDate(date)}
                        className="form-control"
                        dateFormat="yyyy-MM-dd"
                        minDate={startDate || undefined}
                        maxDate={new Date()}
                    />
                </div>
                <div className="col-md-3">
                    <label className="form-label d-flex align-items-center">
                        <Search size={16} className="me-2" /> Mould ID (Optional)
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter mould ID..."
                        value={mouldId}
                        onChange={(e) => setMouldId(e.target.value)}
                    />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button
                        className="btn btn-primary me-2 w-100"
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

                    {data && (
                        <button
                            className="btn btn-outline-primary d-flex align-items-center"
                            onClick={handleExportCSV}
                        >
                            <Download size={16} />
                        </button>
                    )}
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
            {isLoading && !data && (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-secondary">Loading segregation data...</p>
                </div>
            )}

            {/* Navigation Tabs */}
            {data && (
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'defectTypes' ? 'active' : ''}`}
                            onClick={() => setActiveTab('defectTypes')}
                        >
                            Defect Types
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'positions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('positions')}
                        >
                            Position Analysis
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'moulds' ? 'active' : ''}`}
                            onClick={() => setActiveTab('moulds')}
                        >
                            Mould Performance
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'batches' ? 'active' : ''}`}
                            onClick={() => setActiveTab('batches')}
                        >
                            Worst Batches
                        </button>
                    </li>
                </ul>
            )}

            {/* Tab Content */}
            {data && (
                <div className="tab-content">
                    {/* Overview Tab */}
                    <div className={`tab-pane fade ${activeTab === 'overview' ? 'show active' : ''}`}>
                        {activeTab === 'overview' && (
                            <>
                                {/* Summary Cards */}
                                <div className="row mb-4 g-3">
                                    <div className="col-md-3">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <p className="text-primary mb-1 small fw-medium">Total Batches</p>
                                                <p className="h2 fw-bold mb-0">{data.summary.totalBatches}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <p className="text-danger mb-1 small fw-medium">Batches With Defects</p>
                                                <p className="h2 fw-bold mb-0">{data.summary.batchesWithDefects}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <p className="text-warning mb-1 small fw-medium">Total Defects</p>
                                                <p className="h2 fw-bold mb-0">{data.summary.totalDefects}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <p className="text-success mb-1 small fw-medium">Defect Rate</p>
                                                <p className="h2 fw-bold mb-0">{data.summary.defectRate.toFixed(2)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <RecommendationsComponent data={data} />

                                {/* Overview Charts */}
                                <div className="row g-4">
                                    {/* Defects by Type Pie Chart */}
                                    <div className="col-md-6">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <h2 className="h5 fw-semibold mb-3">Defects by Type</h2>
                                                <div style={{ height: '300px' }}>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={data.defectsByType}
                                                                cx="50%"
                                                                cy="50%"
                                                                labelLine={false}
                                                                outerRadius={100}
                                                                fill="#8884d8"
                                                                dataKey="count"
                                                                nameKey="type"
                                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                            >
                                                                {data.defectsByType.map((entry, index) => (
                                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                ))}
                                                            </Pie>
                                                            <Tooltip />
                                                            <Legend />
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Defects by Position Bar Chart */}
                                    <div className="col-md-6">
                                        <div className="card bg-light">
                                            <div className="card-body">
                                                <h2 className="h5 fw-semibold mb-3">Defects by Position</h2>
                                                <div style={{ height: '300px' }}>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart
                                                            data={data.defectsByPosition}
                                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="position" />
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Legend />
                                                            <Bar dataKey="total" name="Total Defects" fill="#FF8042" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Top 5 Worst Moulds */}
                                <div className="card mt-4 bg-light">
                                    <div className="card-body">
                                        <h2 className="h5 fw-semibold mb-3">Top 5 Worst Performing Moulds</h2>
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Mould ID</th>
                                                        <th>Total Batches</th>
                                                        <th>Total Defects</th>
                                                        <th>Avg. Defects/Batch</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.mouldPerformance.slice(0, 5).map((mould, index) => (
                                                        <tr key={index}>
                                                            <td>{mould.mouldId}</td>
                                                            <td>{mould.totalBatches}</td>
                                                            <td>{mould.totalDefects}</td>
                                                            <td>
                                                                <span className={`badge ${mould.averageDefectsPerBatch > 20 ? 'bg-danger' :
                                                                    mould.averageDefectsPerBatch > 10 ? 'bg-warning text-dark' :
                                                                        'bg-success'
                                                                    }`}>
                                                                    {mould.averageDefectsPerBatch}
                                                                </span>
                                                            </td>
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

                    {/* Defect Types Tab */}
                    <div className={`tab-pane fade ${activeTab === 'defectTypes' ? 'show active' : ''}`}>
                        {activeTab === 'defectTypes' && (
                            <div className="row g-4">
                                {/* Defect Types Distribution */}
                                <div className="col-md-6">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h2 className="h5 fw-semibold mb-3">Defect Type Distribution</h2>
                                            <div style={{ height: '400px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={data.defectsByType}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={true}
                                                            outerRadius={150}
                                                            fill="#8884d8"
                                                            dataKey="count"
                                                            nameKey="type"
                                                            label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                                                        >
                                                            {data.defectsByType.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Defect Types Bar Chart */}
                                <div className="col-md-6">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h2 className="h5 fw-semibold mb-3">Defect Types Comparison</h2>
                                            <div style={{ height: '400px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={data.defectsByType}
                                                        layout="vertical"
                                                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis type="number" />
                                                        <YAxis type="category" dataKey="type" width={150} />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="count" name="Number of Defects" fill="#FF8042" />
                                                        <Bar dataKey="percentage" name="Percentage (%)" fill="#0088FE" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Defect Types Table */}
                                <div className="col-12">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h2 className="h5 fw-semibold mb-3">Defect Types Details</h2>
                                            <div className="table-responsive">
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Defect Type</th>
                                                            <th>Count</th>
                                                            <th>Percentage</th>
                                                            <th>Visualization</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.defectsByType.map((defect, index) => (
                                                            <tr key={index}>
                                                                <td>{defect.type}</td>
                                                                <td>{defect.count}</td>
                                                                <td>{defect.percentage.toFixed(2)}%</td>
                                                                <td>
                                                                    <div className="progress" style={{ height: '20px' }}>
                                                                        <div
                                                                            className="progress-bar"
                                                                            role="progressbar"
                                                                            style={{
                                                                                width: `${defect.percentage}%`,
                                                                                backgroundColor: COLORS[index % COLORS.length]
                                                                            }}
                                                                            aria-valuenow={defect.percentage}
                                                                            aria-valuemin={0}
                                                                            aria-valuemax={100}
                                                                        ></div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Position Analysis Tab */}
                    <div className={`tab-pane fade ${activeTab === 'positions' ? 'show active' : ''}`}>
                        {activeTab === 'positions' && (
                            <div className="row g-4">
                                {/* Stacked Bar Chart for Positions */}
                                <div className="col-md-12">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h2 className="h5 fw-semibold mb-3">Defect Types by Position</h2>
                                            <div style={{ height: '400px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={data.defectsByPosition}
                                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="position" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar dataKey="rainCracksCuts" name="Rain Cracks/Cuts" stackId="a" fill="#0088FE" />
                                                        <Bar dataKey="cornerCracksCuts" name="Corner Cracks/Cuts" stackId="a" fill="#00C49F" />
                                                        <Bar dataKey="cornerDamage" name="Corner Damage" stackId="a" fill="#FFBB28" />
                                                        <Bar dataKey="chippedBlocks" name="Chipped Blocks" stackId="a" fill="#FF8042" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Radar Chart for Position Distribution */}
                                <div className="col-md-6">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h2 className="h5 fw-semibold mb-3">Position Defect Distribution</h2>
                                            <div style={{ height: '400px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.defectsByPosition}>
                                                        <PolarGrid />
                                                        <PolarAngleAxis dataKey="position" />
                                                        <PolarRadiusAxis />
                                                        <Radar name="Rain Cracks/Cuts" dataKey="rainCracksCuts" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                                                        <Radar name="Corner Cracks/Cuts" dataKey="cornerCracksCuts" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                                                        <Radar name="Corner Damage" dataKey="cornerDamage" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.6} />
                                                        <Radar name="Chipped Blocks" dataKey="chippedBlocks" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                                                        <Legend />
                                                        <Tooltip />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Position Summary Table */}
                                <div className="col-md-6">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h2 className="h5 fw-semibold mb-3">Position Summary</h2>
                                            <div className="table-responsive">
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Position</th>
                                                            <th>Total Defects</th>
                                                            <th>Percentage</th>
                                                            <th>Most Common Defect</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.defectsByPosition.map((position, index) => {
                                                            // Find most common defect type for this position
                                                            const defectTypes = [
                                                                { type: 'Rain Cracks/Cuts', count: position.rainCracksCuts },
                                                                { type: 'Corner Cracks/Cuts', count: position.cornerCracksCuts },
                                                                { type: 'Corner Damage', count: position.cornerDamage },
                                                                { type: 'Chipped Blocks', count: position.chippedBlocks }
                                                            ];
                                                            const mostCommon = defectTypes.reduce((prev, current) =>
                                                                (prev.count > current.count) ? prev : current
                                                            );

                                                            return (
                                                                <tr key={index}>
                                                                    <td>{position.position}</td>
                                                                    <td>{position.total}</td>
                                                                    <td>{position.percentage.toFixed(2)}%</td>
                                                                    <td>{mostCommon.count > 0 ? mostCommon.type : 'None'}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mould Performance Tab */}
                    <div className={`tab-pane fade ${activeTab === 'moulds' ? 'show active' : ''}`}>
                        {activeTab === 'moulds' && (
                            <div className="row g-4">
                                {/* Top 10 Moulds Bar Chart */}
                                <div className="col-md-12">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h2 className="h5 fw-semibold mb-3">Top 10 Moulds by Average Defects per Batch</h2>
                                            <div style={{ height: '400px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={data.mouldPerformance}
                                                        layout="vertical"
                                                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis type="number" />
                                                        <YAxis type="category" dataKey="mouldId" width={60} />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar
                                                            dataKey="averageDefectsPerBatch"
                                                            name="Avg. Defects Per Batch"
                                                            fill="#FF8042"
                                                        />
                                                        <Bar dataKey="totalDefects" name="Total Defects" fill="#0088FE" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mould Performance Table */}
                                <div className="col-md-12">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h2 className="h5 fw-semibold mb-3">Detailed Mould Performance</h2>
                                            <div className="table-responsive">
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Mould ID</th>
                                                            <th>Total Batches</th>
                                                            <th>Total Defects</th>
                                                            <th>Avg. Defects/Batch</th>
                                                            <th>Defect Types</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.mouldPerformance.map((mould, index) => (
                                                            <tr key={index} className={
                                                                mould.averageDefectsPerBatch > 20 ? 'table-danger' :
                                                                    mould.averageDefectsPerBatch > 10 ? 'table-warning' :
                                                                        'table-success'
                                                            }>
                                                                <td>{mould.mouldId}</td>
                                                                <td>{mould.totalBatches}</td>
                                                                <td>{mould.totalDefects}</td>
                                                                <td>{mould.averageDefectsPerBatch}</td>
                                                                <td>
                                                                    {mould.defectTypes.map((defect, i) => (
                                                                        <div key={i} className="d-flex align-items-center mb-1">
                                                                            <div
                                                                                className="me-2"
                                                                                style={{
                                                                                    width: '10px',
                                                                                    height: '10px',
                                                                                    backgroundColor: COLORS[i % COLORS.length],
                                                                                    borderRadius: '50%'
                                                                                }}
                                                                            ></div>
                                                                            <small>{defect.type}: {defect.count}</small>
                                                                        </div>
                                                                    ))}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Worst Batches Tab */}
                    <div className={`tab-pane fade ${activeTab === 'batches' ? 'show active' : ''}`}>
                        {activeTab === 'batches' && (
                            <div className="row g-4">
                                {/* Worst Batches Bar Chart */}
                                <div className="col-md-12">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h2 className="h5 fw-semibold mb-3">Top 10 Batches by Defect Rate</h2>
                                            <div style={{ height: '400px' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={data.worstBatches}
                                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="batchId" />
                                                        <YAxis yAxisId="left" orientation="left" stroke="#FF8042" />
                                                        <YAxis yAxisId="right" orientation="right" stroke="#0088FE" />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Bar yAxisId="left" dataKey="defectRate" name="Defect Rate (%)" fill="#FF8042" />
                                                        <Bar yAxisId="right" dataKey="totalDefects" name="Total Defects" fill="#0088FE" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Worst Batches Table */}
                                <div className="col-md-12">
                                    <div className="card bg-light">
                                        <div className="card-body">
                                            <h2 className="h5 fw-semibold mb-3">Worst Batches Details</h2>
                                            <div className="table-responsive">
                                                <table className="table table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th>Batch ID</th>
                                                            <th>Mould ID</th>
                                                            <th>Date</th>
                                                            <th>Total Blocks</th>
                                                            <th>Total Defects</th>
                                                            <th>Defect Rate</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.worstBatches.map((batch, index) => (
                                                            <tr key={index} className={
                                                                batch.defectRate > 15 ? 'table-danger' :
                                                                    batch.defectRate > 10 ? 'table-warning' :
                                                                        batch.defectRate > 5 ? 'table-info' : 'table-success'
                                                            }>
                                                                <td>{batch.batchId}</td>
                                                                <td>{batch.mouldId}</td>
                                                                <td>{batch.date}</td>
                                                                <td>{batch.totalBlocks}</td>
                                                                <td>{batch.totalDefects}</td>
                                                                <td>
                                                                    <span className={`badge ${batch.defectRate > 15 ? 'bg-danger' :
                                                                        batch.defectRate > 10 ? 'bg-warning text-dark' :
                                                                            batch.defectRate > 5 ? 'bg-info text-dark' : 'bg-success'
                                                                        }`}>
                                                                        {batch.defectRate.toFixed(2)}%
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SegregationAnalysis;