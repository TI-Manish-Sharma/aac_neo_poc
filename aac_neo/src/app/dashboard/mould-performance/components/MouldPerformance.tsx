import React, { useState, useEffect, useCallback } from 'react';
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
import { AlertTriangle, Calendar, Search, ArrowDownUp, Filter } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MouldPerformanceData } from '../types/MouldPerformanceData';
import { Header } from '../../shared/components/Header';

interface MouldPerformanceProps {
  apiUrl?: string;
  refreshInterval?: number;
  title?: string;
}

const MouldPerformance: React.FC<MouldPerformanceProps> = ({
  apiUrl = '/dashboard/mould-performance/api/mould',
  refreshInterval = 0, // 0 means no auto-refresh
  title = 'Mould Box Performance Analysis'
}) => {
  // State for mould performance data
  const [mouldData, setMouldData] = useState<MouldPerformanceData[]>([]);
  const [filteredData, setFilteredData] = useState<MouldPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Filter states
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  // eslint-disable-next-line
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof MouldPerformanceData; direction: 'ascending' | 'descending' }>({
    key: 'RejectionRate',
    direction: 'descending'
  });

  // Color scheme for charts
  const getBarColor = (rejectionRate: number) => {
    if (rejectionRate > 10) return '#ef4444'; // Red (red-500)
    if (rejectionRate > 5) return '#f97316'; // Orange (orange-500)
    return '#22c55e'; // Green (green-500)
  };

  // Function to format date for API
  const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Function to fetch data from API
  const fetchData = useCallback(async () => {
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
  }, [apiUrl, startDate, endDate]);

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

  // Function to get background color class based on rejection rate
  const getBgColorClass = (rejectionRate: number) => {
    if (rejectionRate > 50) return 'bg-red-100';
    if (rejectionRate > 30) return 'bg-yellow-100';
    if (rejectionRate < 10) return 'bg-green-100';
    return '';
  };

  // Function to get badge color class based on rejection rate
  const getBadgeColorClass = (rejectionRate: number) => {
    if (rejectionRate > 50) return 'bg-red-500 text-white';
    if (rejectionRate > 30) return 'bg-yellow-500 text-black';
    if (rejectionRate > 10) return 'bg-blue-500 text-white';
    return 'bg-green-500 text-white';
  };

  const [showFilters, setShowFilters] = useState<boolean>(false);

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <Header title={title}
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        onRefresh={handleRefresh}>

        <button
          onClick={toggleFilters}
          className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200">
          <Filter size={16} className="mr-2" />
          <span>Filters</span>
        </button>
      </Header>

      {/* Filters */}
      {showFilters && (<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Calendar size={16} className="mr-2" /> Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            dateFormat="yyyy-MM-dd"
            minDate={startDate || undefined}
            maxDate={new Date()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Search size={16} className="mr-2" /> Search Mould Box ID
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search moulds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            className={`w-full h-10 p-2 rounded font-medium transition duration-200 ${isLoading
              ? "bg-blue-300 text-blue-800 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            onClick={handleApplyFilters}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Applying...
              </>
            ) : 'Apply Filters'}
          </button>
        </div>
      </div>)}

      {/* Show error banner if encountered an error */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <AlertTriangle className="text-red-500 mr-2" size={20} />
            <p className="m-0">{error}</p>
          </div>
        </div>
      )}

      {/* Show loading indicator */}
      {isLoading && (
        <div className="text-center my-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-3 text-gray-500">Loading mould box performance data...</p>
        </div>
      )}

      {/* Show message if no data available */}
      {!isLoading && filteredData.length === 0 && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          <div className="flex items-center">
            <AlertTriangle className="text-blue-500 mr-2" size={20} />
            <p className="m-0">
              {searchTerm.trim() !== ''
                ? `No mould boxs matching "${searchTerm}" found.`
                : 'No mould box performance data available for the selected period.'}
            </p>
          </div>
        </div>
      )}

      {/* Display charts and table if data is available */}
      {!isLoading && filteredData.length > 0 && (
        <>
          {/* Top 10 Moulds Chart */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Top 10 Mould Box(s) by Rejection Rate</h2>
            <div className="h-96">
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
                  <Bar dataKey="RejectionRate" name="Rejection Rate (%)" fill="#ef4444">
                    {top10Moulds.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.RejectionRate)} />
                    ))}
                  </Bar>
                  <Bar dataKey="TotalBatches" name="Total Batches" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-blue-500 mb-1 text-sm font-medium">Total Mould Box(s)</p>
              <p className="text-3xl font-bold">{filteredData.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-red-500 mb-1 text-sm font-medium">Avg. Rejection Rate</p>
              <p className="text-3xl font-bold">
                {(filteredData.reduce((sum, mould) => sum + mould.RejectionRate, 0) / filteredData.length).toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-yellow-500 mb-1 text-sm font-medium">High-Risk Mould Box(s)</p>
              <p className="text-3xl font-bold">
                {filteredData.filter(mould => mould.RejectionRate > 50).length}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-green-500 mb-1 text-sm font-medium">Good Performance</p>
              <p className="text-3xl font-bold">
                {filteredData.filter(mould => mould.RejectionRate < 10).length}
              </p>
            </div>
          </div>

          {/* Mould Performance Table */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Mould Box Performance Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th onClick={() => handleSort('MouldId')} className="px-4 py-2 cursor-pointer text-left">
                      <div className="flex items-center">
                        Mould Box ID
                        {sortConfig.key === 'MouldId' && (
                          <ArrowDownUp size={14} className={`ml-1 ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => handleSort('TotalBatches')} className="px-4 py-2 cursor-pointer text-left">
                      <div className="flex items-center">
                        Total Batches
                        {sortConfig.key === 'TotalBatches' && (
                          <ArrowDownUp size={14} className={`ml-1 ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => handleSort('RejectedBatches')} className="px-4 py-2 cursor-pointer text-left">
                      <div className="flex items-center">
                        Batches with Rejection
                        {sortConfig.key === 'RejectedBatches' && (
                          <ArrowDownUp size={14} className={`ml-1 ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                    <th onClick={() => handleSort('RejectionRate')} className="px-4 py-2 cursor-pointer text-left">
                      <div className="flex items-center">
                        Rejection Rate
                        {sortConfig.key === 'RejectionRate' && (
                          <ArrowDownUp size={14} className={`ml-1 ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((mould, index) => (
                    <tr key={index} className={`border-t ${getBgColorClass(mould.RejectionRate)}`}>
                      <td className="px-4 py-2">{mould.MouldId}</td>
                      <td className="px-4 py-2">{mould.TotalBatches}</td>
                      <td className="px-4 py-2">{mould.RejectedBatches}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getBadgeColorClass(mould.RejectionRate)}`}>
                          {mould.RejectionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Mould Box Risk Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                <h5 className="font-bold text-red-800">High Risk Moulds ({'>'}50%)</h5>
                <p className="mb-1">Count: {filteredData.filter(mould => mould.RejectionRate > 50).length}</p>
                <p className="text-sm text-red-700">These mould box(s) have critical failure rates and should be inspected immediately.</p>
              </div>
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                <h5 className="font-bold text-yellow-800">Medium Risk Mould Box(s) (30-50%)</h5>
                <p className="mb-1">Count: {filteredData.filter(mould => mould.RejectionRate > 30 && mould.RejectionRate <= 50).length}</p>
                <p className="text-sm text-yellow-700">These mould box(s) have significant failure rates and should be scheduled for maintenance.</p>
              </div>
              <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
                <h5 className="font-bold text-blue-800">Low Risk Mould Box(s) (10-30%)</h5>
                <p className="mb-1">Count: {filteredData.filter(mould => mould.RejectionRate > 10 && mould.RejectionRate <= 30).length}</p>
                <p className="text-sm text-blue-700">These mould box(s) have acceptable failure rates but should be monitored regularly.</p>
              </div>
              <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded">
                <h5 className="font-bold text-green-800">Optimal Mould Box(s) (&lt;10%)</h5>
                <p className="mb-1">Count: {filteredData.filter(mould => mould.RejectionRate <= 10).length}</p>
                <p className="text-sm text-green-700">These mould box(s) are performing well with minimal rejections.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MouldPerformance;