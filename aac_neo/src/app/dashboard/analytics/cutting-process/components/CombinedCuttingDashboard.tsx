import React, { useMemo, useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { ApiBatchQualityService } from '../services/BatchQualityApi';
import { ErrorBanner } from '../../shared/components/ErrorBanner';
import { ErrorState } from '../../shared/components/ErrorState';
import { Header } from '../../shared/components/Header';
import { NoDataState } from '../../shared/components/NoDataState';
import LoadingIndicator from '../../shared/components/LoadingIndicator';
import { useBatchQuality } from '../hooks/useBatchQuality';
import useFilters from '../hooks/useFilters';
import useRejectionTrends from '../hooks/useRejectionTrends';
import { GroupByOption } from '../types';
import { prepareTrendLineData, prepareRejectionTypesData } from '../utils/formatters';

// Component imports
import InfoMessage from './InfoMessage';
import RejectionRateChart from './RejectionRateChart';
import RejectionTrendsFilters from './RejectionTrendsFilters';
import RejectionTrendsTable from './RejectionTrendsTable';
import RejectionTypesTrendsChart from './RejectionTypesTrendsChart';
import { RejectionTypesChart } from './RejectionTypesChart';
import { RejectionAlert } from './RejectionAlert';
import { ProductionOverviewChart } from './ProductionOverviewChart';
import { KPISummary } from './KPISummary';

// Define section types for toggling
type SectionType = 'batch' | 'trends' | null;

interface CombinedCuttingDashboardProps {
    batchApiUrl?: string;
    trendsApiUrl?: string;
    refreshInterval?: number;
    title?: string;
    defaultOpenSection?: SectionType;
}

const CombinedCuttingDashboard: React.FC<CombinedCuttingDashboardProps> = ({
    batchApiUrl = '/dashboard/analytics/cutting-process/api/batch-stats',
    trendsApiUrl = '/dashboard/analytics/cutting-process/api/trends',
    refreshInterval = 0, // 0 means no auto-refresh
    title = 'Cutting Process Dashboard',
    defaultOpenSection = 'batch'
}) => {
    // State to track which section is currently open (only one at a time)
    const [activeSection, setActiveSection] = useState<SectionType>(defaultOpenSection);

    // Colors for charts
    const COLORS: string[] = ['#10B981', '#F97316', '#FBBF24', '#3B82F6'];

    // Create repository and use application hook for batch quality data
    const service = useMemo(() => new ApiBatchQualityService(batchApiUrl), [batchApiUrl]);
    const {
        data: batchData,
        isLoading: isBatchLoading,
        error: batchError,
        lastUpdated: batchLastUpdated,
        refresh: refreshBatchData
    } = useBatchQuality(service, {
        refreshInterval
    });

    // Use the filters hook to manage filter state for trends
    const {
        filters,
        showFilters,
        toggleFilters,
        updateStartDate,
        updateEndDate,
        updateGroupBy,
    } = useFilters();

    // Use the rejection trends hook to fetch and manage trends data
    const {
        trendsData,
        isLoading: isTrendsLoading,
        error: trendsError,
        lastUpdated: trendsLastUpdated,
        applyFilters,
        refresh: refreshTrendsData
    } = useRejectionTrends({
        apiUrl: trendsApiUrl,
        refreshInterval,
        initialFilters: filters
    });

    // Prepare chart data using transformation services
    const trendLineData = prepareTrendLineData(trendsData);
    const rejectionTypesData = prepareRejectionTypesData(trendsData);

    // Toggle section handler
    const toggleSection = (section: SectionType) => {
        setActiveSection(activeSection === section ? null : section);
    };

    // Handle filter apply
    const handleApplyFilters = () => {
        applyFilters(filters);
        toggleFilters();
    };

    // Handle group by change
    const handleGroupByChange = (groupBy: GroupByOption) => {
        updateGroupBy(groupBy);
    };

    // Combined refresh function
    const refreshAll = () => {
        refreshBatchData();
        refreshTrendsData();
    };

    // Show loading state if both data sources are initially loading
    if ((isBatchLoading && !batchData) && (isTrendsLoading && !trendsData)) {
        return <LoadingIndicator />;
    }

    // Show error state if both data sources have errors and no data
    if ((batchError && !batchData) && (trendsError && !trendsData)) {
        return <ErrorState error={`${batchError || ''} ${trendsError || ''}`.trim()} onRetry={refreshAll} />;
    }

    // Show no data state if neither data source has data but no errors
    if (!batchData && !trendsData && !batchError && !trendsError) {
        return <NoDataState onRefresh={refreshAll} />;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 space-y-8">
            <Header
                title={title}
                lastUpdated={batchLastUpdated || trendsLastUpdated}
                isLoading={isBatchLoading || isTrendsLoading}
                onRefresh={refreshAll}
            >
                <div className="flex gap-2">
                    {/* Only show filters button if trends section is visible */}
                    {activeSection === 'trends' && (
                        <button
                            onClick={toggleFilters}
                            className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200">
                            <Filter size={16} className="mr-2" />
                            <span>Filters</span>
                        </button>
                    )}
                </div>
            </Header>

            {/* Show any errors as banners */}
            {batchError && <ErrorBanner message={batchError} />}
            {trendsError && <ErrorBanner message={trendsError} />}

            {/* Collapsible Current Batch Quality Section */}
            <div className="border-t pt-4 first:border-t-0">
                <button
                    onClick={() => toggleSection('batch')}
                    className="flex items-center justify-between w-full text-left font-semibold text-xl mb-4"
                >
                    <span>Current Batch Quality</span>
                    {activeSection === 'batch' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {activeSection === 'batch' && (
                    <div className="mt-4 mb-4">
                        {isBatchLoading && !batchData && <LoadingIndicator message="Loading batch data..." />}

                        {batchData && (
                            <>
                                {/* KPI Summary */}
                                <KPISummary metrics={batchData} />

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                    {/* Production Overview Pie Chart */}
                                    <ProductionOverviewChart
                                        data={batchData.productionOverview}
                                        colors={COLORS}
                                        title="Production Overview"
                                    />

                                    {/* Rejection Types Bar Chart */}
                                    <RejectionTypesChart
                                        data={batchData.rejectionByType}
                                        title="Rejection by Type"
                                        primaryColor="#F97316"
                                        secondaryColor="#3B82F6"
                                    />
                                </div>

                                {/* Most Common Rejection Alert */}
                                <RejectionAlert metrics={batchData} />
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Collapsible Trends Section */}
            <div className="border-t pt-4">
                <button
                    onClick={() => toggleSection('trends')}
                    className="flex items-center justify-between w-full text-left font-semibold text-xl mb-4"
                >
                    <span>Rejection Trends Analysis</span>
                    {activeSection === 'trends' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {activeSection === 'trends' && (
                    <div className="mt-4">
                        {/* Filters */}
                        {showFilters && (
                            <RejectionTrendsFilters
                                filters={filters}
                                onStartDateChange={updateStartDate}
                                onEndDateChange={updateEndDate}
                                onGroupByChange={handleGroupByChange}
                                onApplyFilters={handleApplyFilters}
                                isLoading={isTrendsLoading}
                            />
                        )}

                        {/* Show loading indicator */}
                        {isTrendsLoading && <LoadingIndicator message="Loading trends data..." />}

                        {/* Show message if no data available */}
                        {!isTrendsLoading && trendsData.length === 0 && (
                            <InfoMessage
                                message="No rejection trend data available for the selected period."
                                color="blue"
                            />
                        )}

                        {/* Display charts if data is available */}
                        {!isTrendsLoading && trendsData.length > 0 && (
                            <div className="space-y-6">
                                {/* Rejection Rate Trend Chart */}
                                <RejectionRateChart data={trendLineData} />

                                {/* Rejection Types Chart */}
                                <RejectionTypesTrendsChart data={rejectionTypesData} />

                                {/* Rejection Trends Table */}
                                <RejectionTrendsTable data={trendsData} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CombinedCuttingDashboard;