import { useState, useEffect, useCallback } from "react";
import { BatchQualityMetrics } from "../types/BatchQualityMetrics";
import { BatchQualityService } from "../types/BatchQualityService";

interface UseBatchQualityOptions {
    refreshInterval?: number;
}

interface UseBatchQualityResult {
    data: BatchQualityMetrics | null;
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    refresh: () => Promise<void>;
}

export function useBatchQuality(
    service: BatchQualityService,
    options: UseBatchQualityOptions = {}
): UseBatchQualityResult {
    const { refreshInterval = 0 } = options;
    const [data, setData] = useState<BatchQualityMetrics | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const batchQualityMetrics = await service.fetchBatchQualityMetrics();
            setData(batchQualityMetrics);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [service]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (refreshInterval <= 0) return;

        const intervalId = setInterval(() => {
            fetchData();
        }, refreshInterval * 1000);

        return () => clearInterval(intervalId);
    }, [refreshInterval, fetchData]);

    return {
        data,
        isLoading,
        error,
        lastUpdated,
        refresh: fetchData
    };
}