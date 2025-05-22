import { useState } from 'react';
import { RejectionFilters, GroupByOption } from '../types';

/**
 * Custom hook for managing rejection trend filters
 */
export const useFilters = () => {
    // Create a date one month ago for the default start date
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);

    // Filter states
    const [filters, setFilters] = useState<RejectionFilters>({
        startDate: defaultStartDate,
        endDate: new Date(),
        groupBy: 'week' as GroupByOption,
    });

    // Visibility state for filter panel
    const [showFilters, setShowFilters] = useState<boolean>(false);

    // Update individual filter fields
    const updateStartDate = (date: Date | null) => {
        setFilters(prev => ({ ...prev, startDate: date }));
    };

    const updateEndDate = (date: Date | null) => {
        setFilters(prev => ({ ...prev, endDate: date }));
    };

    const updateGroupBy = (groupBy: GroupByOption) => {
        setFilters(prev => ({ ...prev, groupBy }));
    };

    // Toggle filters visibility
    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    // Reset filters to defaults
    const resetFilters = () => {
        setFilters({
            startDate: defaultStartDate,
            endDate: new Date(),
            groupBy: 'week',
        });
    };

    return {
        filters,
        setFilters,
        showFilters,
        setShowFilters,
        toggleFilters,
        updateStartDate,
        updateEndDate,
        updateGroupBy,
        resetFilters
    };
};

export default useFilters;