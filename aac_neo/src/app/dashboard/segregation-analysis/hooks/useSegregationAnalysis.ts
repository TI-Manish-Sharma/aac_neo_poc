import { useState, useEffect, useCallback } from 'react';
import { fetchSegregationAnalysis } from '../services/SegregationAnalysisApi';
import { formatDateForApi } from '../../rejection-trends/utils/formatters';

// Define the filters interface
interface SegregationFilters {
    startDate: Date | null;
    endDate: Date | null;
    mouldId: string;
}

// Tab type
type TabType = 'overview' | 'defect-types' | 'positions' | 'moulds' | 'batches';

export const useSegregationAnalysis = (apiUrl: string, refreshInterval = 0) => {
    // Create a date one month ago for the default start date
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);

    // State for data
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // State for filters
    const [filters, setFilters] = useState<SegregationFilters>({
        startDate: defaultStartDate,
        endDate: new Date(),
        mouldId: '',
    });

    // State for active tab
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    // Function to fetch data from API
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            // Build query parameters
            let url = apiUrl;
            const params = new URLSearchParams();

            if (filters.startDate) {
                params.append('start_date', formatDateForApi(filters.startDate));
            }
            if (filters.endDate) {
                params.append('end_date', formatDateForApi(filters.endDate));
            }
            if (filters.mouldId.trim()) {
                params.append('mould_id', filters.mouldId);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetchSegregationAnalysis(url);

            if (response.error) {
                setError(response.error);
                if (!data) {
                    setIsLoading(false);
                }
                return;
            }

            setData(response.data);
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

    // Filter update functions
    const updateStartDate = (date: Date | null) => {
        setFilters(prev => ({ ...prev, startDate: date }));
    };

    const updateEndDate = (date: Date | null) => {
        setFilters(prev => ({ ...prev, endDate: date }));
    };

    const updateMouldId = (id: string) => {
        setFilters(prev => ({ ...prev, mouldId: id }));
    };

    // Handle filter apply
    const handleApplyFilters = () => {
        fetchData();
    };

    // Handle tab change
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
    };

    // Handle refresh
    const handleRefresh = () => {
        fetchData();
    };

    // Export data to CSV
    const exportToCSV = () => {
        if (!data) return;

        // Create CSV content based on active tab
        let csvContent = 'data:text/csv;charset=utf-8,';
        let filename = '';

        if (activeTab === 'overview' || activeTab === 'defect-types') {
            // Export defects by type
            csvContent += 'Defect Type,Count,Percentage\n';
            data.defectsByType.forEach((item: any) => {
                csvContent += `${item.type},${item.count},${item.percentage.toFixed(2)}\n`;
            });
            filename = 'defect-types';
        } else if (activeTab === 'positions') {
            // Export defects by position
            csvContent += 'Position,Rain Cracks/Cuts,Corner Cracks/Cuts,Corner Damage,Chipped Blocks,Total,Percentage\n';
            data.defectsByPosition.forEach((item: any) => {
                csvContent += `${item.position},${item.rainCracksCuts},${item.cornerCracksCuts},${item.cornerDamage},${item.chippedBlocks},${item.total},${item.percentage.toFixed(2)}\n`;
            });
            filename = 'positions';
        } else if (activeTab === 'moulds') {
            // Export mould performance
            csvContent += 'Mould ID,Total Batches,Total Defects,Average Defects Per Batch\n';
            data.mouldPerformance.forEach((item: any) => {
                csvContent += `${item.mouldId},${item.totalBatches},${item.totalDefects},${item.averageDefectsPerBatch}\n`;
            });
            filename = 'mould-performance';
        } else if (activeTab === 'batches') {
            // Export worst batches
            csvContent += 'Batch ID,Mould ID,Date,Total Blocks,Total Defects,Defect Rate\n';
            data.worstBatches.forEach((item: any) => {
                csvContent += `${item.batchId},${item.mouldId},${item.date},${item.totalBlocks},${item.totalDefects},${item.defectRate.toFixed(2)}\n`;
            });
            filename = 'worst-batches';
        }

        // Create download link and trigger download
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `segregation-${filename}-${formatDateForApi(new Date())}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        data,
        isLoading,
        error,
        lastUpdated,
        filters,
        activeTab,
        handleApplyFilters,
        handleTabChange,
        handleRefresh,
        updateStartDate,
        updateEndDate,
        updateMouldId,
        exportToCSV
    };
};

export default useSegregationAnalysis;