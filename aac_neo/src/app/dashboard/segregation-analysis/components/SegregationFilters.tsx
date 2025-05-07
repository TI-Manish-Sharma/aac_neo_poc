import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Search } from 'lucide-react';
import LoadingIndicator from '../../shared/components/LoadingIndicator';

interface SegregationFiltersProps {
    filters: {
        startDate: Date | null;
        endDate: Date | null;
        mouldId: string;
    };
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    onMouldIdChange: (id: string) => void;
    onApplyFilters: () => void;
    isLoading: boolean;
}

const SegregationFilters: React.FC<SegregationFiltersProps> = ({
    filters,
    onStartDateChange,
    onEndDateChange,
    onMouldIdChange,
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
                    <label className="block text-sm font-medium text-gray-700 flex items-center">
                        <Search size={14} className="mr-1" /> Mould ID (Optional)
                    </label>
                    <input
                        type="text"
                        className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Enter mould ID..."
                        value={filters.mouldId}
                        onChange={(e) => onMouldIdChange(e.target.value)}
                    />
                </div>
                <div className="flex items-end">
                    <button
                        className={`w-full h-10 p-2 rounded font-medium transition duration-200 ${isLoading
                            ? "bg-blue-300 text-blue-800 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                        onClick={onApplyFilters}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Applying...
                            </>
                        ) : 'Apply Filters'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SegregationFilters;