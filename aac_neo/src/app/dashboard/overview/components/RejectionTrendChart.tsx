import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface RejectionTrendProps {
  data: Array<{
    period: string;
    totalBatches?: number;
    rejectionRate: number;
  }>;
  title?: string;
  height?: number | string;
  chartType?: 'line' | 'area';
  showBatchCount?: boolean;
}

const RejectionTrendChart: React.FC<RejectionTrendProps> = ({
  data,
  title = 'Rejection Rate Trend',
  height = 300,
  chartType = 'line',
  showBatchCount = true
}) => {
  // Ensure height is a proper value
  const chartHeight = typeof height === 'number' ? height : parseInt(height);
  
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      </div>
      <div style={{ height: chartHeight > 0 ? `${chartHeight}px` : '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" orientation="left" domain={[0, 'auto']} />
              {showBatchCount && (
                <YAxis yAxisId="right" orientation="right" domain={[0, 'auto']} />
              )}
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="rejectionRate"
                name="Rejection Rate (%)"
                stroke="#EF4444"
                activeDot={{ r: 8 }}
              />
              {showBatchCount && data[0]?.totalBatches !== undefined && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalBatches"
                  name="Total Batches"
                  stroke="#3B82F6"
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          ) : (
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[0, 'auto']} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="rejectionRate"
                name="Rejection Rate (%)"
                stroke="#EF4444"
                fill="#FEE2E2"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RejectionTrendChart;