import { useState } from 'react';
import { SegregationFilters } from '../types';

/**
 * Custom hook for managing segregation analysis filters
 */
export const useFilters = () => {
    // Create a date one month ago for the default start date
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 1);

    // Filter states
    const [filters, setFilters] = useState<SegregationFilters>({
        startDate: defaultStartDate,
        endDate: new Date(),
        mouldId: '',
    });

    // Update individual filter fields
    const updateStartDate = (date: Date | null) => {
        setFilters(prev => ({ ...prev, startDate: date }));
    };

    const updateEndDate = (date: Date | null) => {
        setFilters(prev => ({ ...prev, endDate: date }));
    };

    const updateMouldId = (mouldId: string) => {
        setFilters(prev => ({ ...prev, mouldId }));
    };

    // Reset filters to defaults
    const resetFilters = () => {
        setFilters({
            startDate: defaultStartDate,
            endDate: new Date(),
            mouldId: '',
        });
    };

    return {
        filters,
        setFilters,
        updateStartDate,
        updateEndDate,
        updateMouldId,
        resetFilters
    };
};