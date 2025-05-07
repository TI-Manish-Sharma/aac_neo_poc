import { useState, useEffect, useCallback } from 'react';
import { SegregationAnalysisData, SegregationFilters, SegregationAnalysisParams } from '../types';
import { ApiSegregationAnalysisService } from '../services/SegregationAnalysisApi';
import { formatDateForApi } from '../utils/formatters';

interface UseSegregationAnalysisProps {
    apiUrl: string;
    refreshInterval?: number;
    initialFilters: SegregationFilters;
}

interface UseSegregationAnalysisResult {
    data: SegregationAnalysisData | null;
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    filters: SegregationFilters;
    applyFilters: (newFilters: SegregationFilters) => void;
    refresh: () => Promise<void>;
    setActiveTab: (tab: string) => void;
    activeTab: string;
}

/**
 * Custom hook for fetching and managing segregation analysis data
 */
export const useSegregationAnalysis = ({
    apiUrl,
    refreshInterval = 0,
    initialFilters
}: UseSegregationAnalysisProps): UseSegregationAnalysisResult => {
    // State for segregation analysis data
    const [data, setData] = useState<SegregationAnalysisData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [filters, setFilters] = useState<SegregationFilters>(initialFilters);
    const [activeTab, setActiveTab] = useState<string>('overview');

    const service = new ApiSegregationAnalysisService(apiUrl);

    // Function to fetch data from API
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            // Build API params
            const params: SegregationAnalysisParams = {};

            if (filters.startDate) {
                params.start_date = formatDateForApi(filters.startDate);
            }

            if (filters.endDate) {
                params.end_date = formatDateForApi(filters.endDate);
            }

            if (filters.mouldId.trim()) {
                params.mould_id = filters.mouldId.trim();
            }

            const response = await service.fetchSegregationAnalysisData(params);
            setData(response);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl, filters, service]);

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
    const applyFilters = useCallback((newFilters: SegregationFilters) => {
        setFilters(newFilters);
    }, []);

    // Handle manual refresh
    const refresh = useCallback(() => {
        return fetchData();
    }, [fetchData]);

    return {
        data,
        isLoading,
        error,
        lastUpdated,
        filters,
        applyFilters,
        refresh,
        activeTab,
        setActiveTab
    };
};