import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';
import { GroupByOption, RejectionFilters } from '../types';
import LoadingIndicator from '../../shared/components/LoadingIndicator';

interface RejectionTrendsFiltersProps {
    filters: RejectionFilters;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    onGroupByChange: (groupBy: GroupByOption) => void;
    onApplyFilters: () => void;
    isLoading: boolean;
}

const RejectionTrendsFilters: React.FC<RejectionTrendsFiltersProps> = ({
    filters,
    onStartDateChange,
    onEndDateChange,
    onGroupByChange,
    onApplyFilters,
    isLoading
}) => {
    // Custom styles for DatePicker
    const datePickerStyles = "w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

    return (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Calendar size={14} className="mr-1" /> Start Date
                    </label>
                    <DatePicker
                        selected={filters.startDate}
                        onChange={onStartDateChange}
                        className={datePickerStyles}
                        dateFormat="yyyy-MM-dd"
                        maxDate={filters.endDate || new Date()}
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Calendar size={14} className="mr-1" /> End Date
                    </label>
                    <DatePicker
                        selected={filters.endDate}
                        onChange={onEndDateChange}
                        className={datePickerStyles}
                        dateFormat="yyyy-MM-dd"
                        minDate={filters.startDate || undefined}
                        maxDate={new Date()}
                    />
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Group By</label>
                    <select
                        className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={filters.groupBy}
                        onChange={(e) => onGroupByChange(e.target.value as GroupByOption)}
                    >
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        className={`w-full p-2 rounded font-medium transition duration-200 ${isLoading
                                ? "bg-blue-300 text-blue-800 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                        onClick={onApplyFilters}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <LoadingIndicator size="small" message="" />
                                <span className="ml-2">Applying...</span>
                            </div>
                        ) : 'Apply Filters'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectionTrendsFilters;