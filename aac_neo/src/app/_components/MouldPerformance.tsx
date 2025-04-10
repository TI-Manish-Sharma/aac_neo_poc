import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar,
  ResponsiveContainer,
  Tooltip, 
  Legend, 
  XAxis, 
  YAxis,
  CartesianGrid,
  Cell
} from 'recharts';
import { RefreshCw, AlertTriangle, Calendar, Search, ArrowDownUp } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define TypeScript interfaces
interface MouldPerformanceData {
  MouldId: string;
  TotalBatches: number;
  RejectedBatches: number;
  RejectionRate: number;
}

interface MouldPerformanceProps {
  apiUrl?: string;
  refreshInterval?: number;
  title?: string;
}

const MouldPerformance: React.FC<MouldPerformanceProps> = ({ 
  apiUrl = 'http://localhost:8000/api/mould-performance',
  refreshInterval = 0, // 0 means no auto-refresh
  title = 'Mould Performance Analysis'
}) => {
  // State for mould performance data
  const [mouldData, setMouldData] = useState<MouldPerformanceData[]>([]);
  const [filteredData, setFilteredData] = useState<MouldPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Filter states
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{key: keyof MouldPerformanceData; direction: 'ascending' | 'descending'}>({
    key: 'RejectionRate',
    direction: 'descending'
  });

  // Color scheme for charts
  const getBarColor = (rejectionRate: number) => {
    if (rejectionRate > 50) return '#dc3545'; // Danger red
    if (rejectionRate > 30) return '#fd7e14'; // Warning orange
    if (rejectionRate > 10) return '#ffc107'; // Warning yellow
    return '#28a745'; // Success green
  };

  // Function to format date for API
  const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Function to fetch data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      let url = `${apiUrl}`;
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('start_date', formatDateForApi(startDate));
      }
      if (endDate) {
        params.append('end_date', formatDateForApi(endDate));
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          setMouldData([]);
          setFilteredData([]);
          setError(null);
          setIsLoading(false);
          setLastUpdated(new Date());
          return;
        }
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data: MouldPerformanceData[] = await response.json();
      setMouldData(data);
      setFilteredData(data);
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

  // Filter data when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(mouldData);
    } else {
      const filtered = mouldData.filter(mould => 
        mould.MouldId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, mouldData]);

  // Handle sorting
  const handleSort = (key: keyof MouldPerformanceData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredData(sortedData);
  };

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

  // Get the top 10 moulds by rejection rate for the chart
  const top10Moulds = [...filteredData]
    .sort((a, b) => b.RejectionRate - a.RejectionRate)
    .slice(0, 10);

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
            <Search size={16} className="me-2" /> Search Mould ID
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search moulds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
          <p className="mt-3 text-secondary">Loading mould performance data...</p>
        </div>
      )}
      
      {/* Show message if no data available */}
      {!isLoading && filteredData.length === 0 && (
        <div className="alert alert-info">
          <div className="d-flex align-items-center">
            <AlertTriangle className="text-info me-2" size={20} />
            <p className="mb-0">
              {searchTerm.trim() !== '' 
                ? `No moulds matching "${searchTerm}" found.` 
                : 'No mould performance data available for the selected period.'}
            </p>
          </div>
        </div>
      )}
      
      {/* Display charts and table if data is available */}
      {!isLoading && filteredData.length > 0 && (
        <>
          {/* Top 10 Moulds Chart */}
          <div className="card mb-4 bg-light">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-3">Top 10 Moulds by Rejection Rate</h2>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={top10Moulds}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="MouldId" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="RejectionRate" name="Rejection Rate (%)">
                      {top10Moulds.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.RejectionRate)} />
                      ))}
                    </Bar>
                    <Bar dataKey="TotalBatches" name="Total Batches" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Summary Statistics */}
          <div className="row mb-4 g-3">
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body">
                  <p className="text-primary mb-1 small fw-medium">Total Moulds</p>
                  <p className="h2 fw-bold mb-0">{filteredData.length}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body">
                  <p className="text-danger mb-1 small fw-medium">Avg. Rejection Rate</p>
                  <p className="h2 fw-bold mb-0">
                    {(filteredData.reduce((sum, mould) => sum + mould.RejectionRate, 0) / filteredData.length).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body">
                  <p className="text-warning mb-1 small fw-medium">High-Risk Moulds</p>
                  <p className="h2 fw-bold mb-0">
                    {filteredData.filter(mould => mould.RejectionRate > 50).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body">
                  <p className="text-success mb-1 small fw-medium">Good Performance</p>
                  <p className="h2 fw-bold mb-0">
                    {filteredData.filter(mould => mould.RejectionRate < 10).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mould Performance Table */}
          <div className="card bg-light">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-3">Mould Performance Details</h2>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('MouldId')} style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center">
                          Mould ID
                          {sortConfig.key === 'MouldId' && (
                            <ArrowDownUp size={14} className={`ms-1 ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('TotalBatches')} style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center">
                          Total Batches
                          {sortConfig.key === 'TotalBatches' && (
                            <ArrowDownUp size={14} className={`ms-1 ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('RejectedBatches')} style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center">
                          Rejected Batches
                          {sortConfig.key === 'RejectedBatches' && (
                            <ArrowDownUp size={14} className={`ms-1 ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </th>
                      <th onClick={() => handleSort('RejectionRate')} style={{ cursor: 'pointer' }}>
                        <div className="d-flex align-items-center">
                          Rejection Rate
                          {sortConfig.key === 'RejectionRate' && (
                            <ArrowDownUp size={14} className={`ms-1 ${sortConfig.direction === 'ascending' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((mould, index) => (
                      <tr key={index} className={
                        mould.RejectionRate > 50 ? 'table-danger' : 
                        mould.RejectionRate > 30 ? 'table-warning' : 
                        mould.RejectionRate < 10 ? 'table-success' : ''
                      }>
                        <td>{mould.MouldId}</td>
                        <td>{mould.TotalBatches}</td>
                        <td>{mould.RejectedBatches}</td>
                        <td>
                          <span className={`badge ${
                            mould.RejectionRate > 50 ? 'bg-danger' : 
                            mould.RejectionRate > 30 ? 'bg-warning text-dark' : 
                            mould.RejectionRate > 10 ? 'bg-info text-dark' : 
                            'bg-success'
                          }`}>
                            {mould.RejectionRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Risk Analysis Table */}
          <div className="card mt-4 bg-light">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-3">Mould Risk Analysis</h2>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="alert alert-danger">
                    <h5 className="alert-heading fw-bold">High Risk Moulds ({'>'}50%)</h5>
                    <p className="mb-1">Count: {filteredData.filter(mould => mould.RejectionRate > 50).length}</p>
                    <p className="mb-0 small">These moulds have critical failure rates and should be inspected immediately.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-warning">
                    <h5 className="alert-heading fw-bold">Medium Risk Moulds (30-50%)</h5>
                    <p className="mb-1">Count: {filteredData.filter(mould => mould.RejectionRate > 30 && mould.RejectionRate <= 50).length}</p>
                    <p className="mb-0 small">These moulds have significant failure rates and should be scheduled for maintenance.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-info">
                    <h5 className="alert-heading fw-bold">Low Risk Moulds (10-30%)</h5>
                    <p className="mb-1">Count: {filteredData.filter(mould => mould.RejectionRate > 10 && mould.RejectionRate <= 30).length}</p>
                    <p className="mb-0 small">These moulds have acceptable failure rates but should be monitored regularly.</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-success">
                    <h5 className="alert-heading fw-bold">Optimal Moulds (&lt;10%)</h5>
                    <p className="mb-1">Count: {filteredData.filter(mould => mould.RejectionRate <= 10).length}</p>
                    <p className="mb-0 small">These moulds are performing well with minimal rejections.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MouldPerformance;