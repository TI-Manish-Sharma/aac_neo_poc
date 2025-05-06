import React, { useMemo } from 'react';
import { ApiBatchQualityService } from '../services/BatchQualityApi';
import { RejectionTypesChart } from './RejectionTypesChart';
import { RejectionAlert } from './RejectionAlert';
import { ProductionOverviewChart } from './ProductionOverviewChart';
import { KPISummary } from './KPISummary';
import { ErrorBanner } from '../../shared/components/ErrorBanner';
import { ErrorState } from '../../shared/components/ErrorState';
import { Header } from '../../shared/components/Header';
import { NoDataState } from '../../shared/components/NoDataState';
import { useBatchQuality } from '../hooks/useBatchQuality';
import LoadingIndicator from '../../shared/components/LoadingIndicator';

interface CuttingProcessProps {
  apiUrl?: string;
  refreshInterval?: number;
  title?: string;
}

const CuttingProcess: React.FC<CuttingProcessProps> = ({
  apiUrl = '/dashboard/cutting-process/api/batch-stats',
  refreshInterval = 0,
  title = 'Cutting Process Quality Dashboard'
}) => {
  // Create repository and use application hook
  const service = useMemo(() => new ApiBatchQualityService(apiUrl), [apiUrl]);
  const { data, isLoading, error, lastUpdated, refresh } = useBatchQuality(service, {
    refreshInterval
  });

  // Colors for charts
  const COLORS: string[] = ['#10B981', '#F97316', '#FBBF24', '#3B82F6'];

  // Show loading state
  if (isLoading && !data) {
    return <LoadingIndicator />;
  }

  // Show error state
  if (error && !data) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  // If we have no data but no error either
  if (!data) {
    return <NoDataState onRefresh={refresh} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <Header
        title={title}
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        onRefresh={refresh}
      />

      {/* Show error banner if we've encountered an error but have previous data */}
      {error && <ErrorBanner message={error} />}

      {/* KPI Summary */}
      <KPISummary metrics={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Overview Pie Chart */}
        <ProductionOverviewChart
          data={data.productionOverview}
          colors={COLORS}
          title="Production Overview"
        />

        {/* Rejection Types Bar Chart */}
        <RejectionTypesChart
          data={data.rejectionByType}
          title="Rejection by Type"
          primaryColor="#F97316"
          secondaryColor="#3B82F6"
        />
      </div>

      {/* Most Common Rejection Alert */}
      <RejectionAlert metrics={data} />
    </div>
  );
};

export default CuttingProcess;