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
  TooltipProps
} from 'recharts';
import { RefreshCw, AlertTriangle } from 'lucide-react';

// Define TypeScript interfaces for our data structure
interface RejectionType {
  rejection_type: string;
  count: number;
  percentage: number;
}

interface PlantData {
  total_batches: number;
  rejected_batches: number;
  rejection_rate: number;
  rejection_by_type: RejectionType[];
  most_common_rejection: string;
}

interface ProductionDataItem {
  name: string;
  value: number;
}

interface AACPlantVisualizationProps {
  apiUrl?: string;
  refreshInterval?: number;
  title?: string;
}

const AACPlantVisualization: React.FC<AACPlantVisualizationProps> = ({ 
  apiUrl = 'http://localhost:8000/api/batch-quality',
  refreshInterval = 0, // 0 means no auto-refresh
  title = 'AAC Plant Production Dashboard'
}) => {
  // State to store API data
  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Colors for charts
  const COLORS: string[] = ['#00C49F', '#FF8042', '#FFBB28', '#0088FE'];
  
  // Function to fetch data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data: PlantData = await response.json();
      setPlantData(data);
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
  }, [apiUrl]);

  // Set up auto-refresh if interval is provided
  useEffect(() => {
    if (refreshInterval <= 0) return;
    
    const intervalId = setInterval(() => {
      fetchData();
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval, apiUrl]);

  // Custom tooltip for the pie chart with TypeScript types
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length && plantData) {
      return (
        <div className="card border p-2 shadow-sm">
          <p className="fw-medium">{`${payload[0].name}: ${payload[0].value} batches`}</p>
          <p className="text-secondary">{`${(Number(payload[0].value) / plantData.total_batches * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchData();
  };

  // Show loading state
  if (isLoading && !plantData) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-secondary">Loading data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !plantData) {
    return (
      <div className="alert alert-danger p-4">
        <div className="d-flex align-items-center mb-3">
          <AlertTriangle className="text-danger me-2" size={24} />
          <h2 className="h4 mb-0 text-danger">Error Loading Data</h2>
        </div>
        <p className="text-danger mb-3">{error}</p>
        <p className="mt-2">Please check if:</p>
        <ul className="mb-3">
          <li>The API server is running at {apiUrl}</li>
          <li>The endpoint is accessible</li>
          <li>CORS is properly configured on the server</li>
        </ul>
        <button 
          onClick={handleRefresh}
          className="btn btn-primary d-flex align-items-center"
        >
          <RefreshCw size={16} className="me-2" /> Try Again
        </button>
      </div>
    );
  }

  // If we have no data but no error either
  if (!plantData) {
    return (
      <div className="alert alert-warning p-4">
        <h2 className="h4 text-warning mb-2">No Data Available</h2>
        <p className="text-warning">No production data could be retrieved from the API.</p>
        <button 
          onClick={handleRefresh}
          className="btn btn-primary d-flex align-items-center mt-3"
        >
          <RefreshCw size={16} className="me-2" /> Refresh
        </button>
      </div>
    );
  }

  // Prepare data for Production Overview Pie Chart
  const productionData: ProductionDataItem[] = [
    { name: 'Accepted Batches', value: plantData.total_batches - plantData.rejected_batches },
    { name: 'Rejected Batches', value: plantData.rejected_batches }
  ];

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
      
      {/* Show error banner if we've encountered an error but have previous data */}
      {error && (
        <div className="alert alert-danger mb-4">
          <div className="d-flex align-items-center">
            <AlertTriangle className="text-danger me-2" size={20} />
            <p className="mb-0">{error}</p>
          </div>
          <p className="small text-secondary mt-2 mb-0">Showing previously loaded data.</p>
        </div>
      )}
      
      {/* KPI Summary */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body">
              <p className="text-primary mb-1 small fw-medium">Total Batches</p>
              <p className="h2 fw-bold mb-0">{plantData.total_batches}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body">
              <p className="text-danger mb-1 small fw-medium">Rejected Batches</p>
              <p className="h2 fw-bold mb-0">{plantData.rejected_batches}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-body">
              <p className="text-warning mb-1 small fw-medium">Rejection Rate</p>
              <p className="h2 fw-bold mb-0">{plantData.rejection_rate}%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row g-4">
        {/* Production Overview Pie Chart */}
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-3">Production Overview</h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                    >
                      {productionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rejection Types Bar Chart */}
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-3">Rejection by Type</h2>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={plantData.rejection_by_type}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rejection_type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Batches" fill="#FF8042" />
                    <Bar dataKey="percentage" name="Percentage (%)" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Most Common Rejection Alert */}
      <div className="mt-4">
        <div className="alert alert-danger border-start border-danger border-5">
          <h3 className="h6 fw-semibold">Most Common Rejection Type</h3>
          <div className="mt-2">
            <p className="h5 fw-bold mb-1">{plantData.most_common_rejection}</p>
            <p className="small">
              This rejection type accounts for {plantData.rejection_by_type.find(item => 
                item.rejection_type === plantData.most_common_rejection)?.percentage}% of total batches
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AACPlantVisualization;