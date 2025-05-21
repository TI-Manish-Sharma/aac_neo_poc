import React from 'react';
import { Filter } from 'lucide-react';
import { ErrorBanner } from '../../shared/components/ErrorBanner';
import LoadingIndicator from '../../shared/components/LoadingIndicator';
import useFilters from '../hooks/useFilters';
import useRejectionTrends from '../hooks/useRejectionTrends';
import { GroupByOption } from '../types';
import { prepareTrendLineData, prepareRejectionTypesData, formatDateForDisplay } from '../utils/formatters';
import InfoMessage from './InfoMessage';
import RejectionRateChart from './RejectionRateChart';
import RejectionTrendsFilters from './RejectionTrendsFilters';
import RejectionTrendsTable from './RejectionTrendsTable';
import RejectionTypesTrendsChart from './RejectionTypesTrendsChart';
import { Header } from '../../shared/components/Header';

export interface RejectionTrendsProps {
    apiUrl?: string;
    refreshInterval?: number;
    title?: string;
}

const RejectionTrends: React.FC<RejectionTrendsProps> = ({
    apiUrl = '/dashboard/cutting-process/api/trends',
    refreshInterval = 0, // 0 means no auto-refresh
    title = 'Rejection Trends Analysis'
}) => {
    // Use the filters hook to manage filter state
    const {
        filters,
        showFilters,
        toggleFilters,
        updateStartDate,
        updateEndDate,
        updateGroupBy,
    } = useFilters();

    // Use the rejection trends hook to fetch and manage data
    const {
        trendsData,
        isLoading,
        error,
        lastUpdated,
        applyFilters,
        refresh
    } = useRejectionTrends({
        apiUrl,
        refreshInterval,
        initialFilters: filters
    });

    // Prepare chart data using transformation services
    const trendLineData = prepareTrendLineData(trendsData);
    const rejectionTypesData = prepareRejectionTypesData(trendsData);

    // Handle filter apply
    const handleApplyFilters = () => {
        applyFilters(filters);
        toggleFilters();
    };

    // Handle group by change
    const handleGroupByChange = (groupBy: GroupByOption) => {
        updateGroupBy(groupBy);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <Header title={title}
                lastUpdated={lastUpdated}
                isLoading={isLoading}
                onRefresh={refresh}>

                <button
                    onClick={toggleFilters}
                    className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200">
                    <Filter size={16} className="mr-2" />
                    <span>Filters</span>
                </button>
            </Header>

            {/* Mobile-only last updated info */}
            {lastUpdated && (
                <div className="text-xs text-gray-500 mb-4 md:hidden">
                    Last updated: {formatDateForDisplay(lastUpdated)}
                </div>
            )}

            {/* Filters */}
            {showFilters && (
                <RejectionTrendsFilters
                    filters={filters}
                    onStartDateChange={updateStartDate}
                    onEndDateChange={updateEndDate}
                    onGroupByChange={handleGroupByChange}
                    onApplyFilters={handleApplyFilters}
                    isLoading={isLoading}
                />
            )}

            {/* Show error banner if encountered an error */}
            {error && <ErrorBanner message={error} />}

            {/* Show loading indicator */}
            {isLoading && <LoadingIndicator message="Loading trends data..." />}

            {/* Show message if no data available */}
            {!isLoading && trendsData.length === 0 && (
                <InfoMessage
                    message="No rejection trend data available for the selected period."
                    color="blue"
                />
            )}

            {/* Display charts if data is available */}
            {!isLoading && trendsData.length > 0 && (
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
    );
};

export default RejectionTrends;