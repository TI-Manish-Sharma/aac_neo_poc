import { useState, useEffect, useCallback } from 'react';
import { RejectionTrend, RejectionFilters } from '../types';
import { fetchRejectionTrends } from '../services/RejectionTrendApi';
import { formatDateForApi } from '../utils/formatters';

interface UseRejectionTrendsProps {
    apiUrl: string;
    refreshInterval?: number;
    initialFilters: RejectionFilters;
}

/**
 * Custom hook for fetching and managing rejection trends data
 */
export const useRejectionTrends = ({
    apiUrl,
    refreshInterval = 0,
    initialFilters
}: UseRejectionTrendsProps) => {
    // State for rejection trends data
    const [trendsData, setTrendsData] = useState<RejectionTrend[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [filters, setFilters] = useState<RejectionFilters>(initialFilters);

    // Function to fetch data from API
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            // Build API params
            const params = {
                group_by: filters.groupBy,
                start_date: filters.startDate ? formatDateForApi(filters.startDate) : undefined,
                end_date: filters.endDate ? formatDateForApi(filters.endDate) : undefined
            };

            const response = await fetchRejectionTrends(apiUrl, params);

            if (response.error) {
                throw new Error(response.error);
            }

            setTrendsData(response.data);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl, filters]);

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

    // Apply new filters and refresh data
    const applyFilters = useCallback((newFilters: RejectionFilters) => {
        setFilters(newFilters);
    }, []);

    // Handle manual refresh
    const refresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        trendsData,
        isLoading,
        error,
        lastUpdated,
        filters,
        applyFilters,
        refresh
    };
};

export default useRejectionTrends;