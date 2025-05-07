/**
 * Format a date for API requests
 */
export const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

/**
 * Format a date for display
 */
export const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleString();
};

/**
 * Get color based on defect rate
 */
export const getDefectRateColor = (rate: number): string => {
    if (rate > 15) return '#ef4444'; // Red (red-500)
    if (rate > 10) return '#f97316'; // Orange (orange-500)
    if (rate > 5) return '#eab308';  // Yellow (yellow-500)
    return '#22c55e'; // Green (green-500)
};

/**
 * Get CSS class based on defect rate
 */
export const getDefectRateClass = (rate: number): string => {
    if (rate > 15) return 'bg-red-100 border-red-500 text-red-700';
    if (rate > 10) return 'bg-orange-100 border-orange-500 text-orange-700';
    if (rate > 5) return 'bg-yellow-100 border-yellow-500 text-yellow-700';
    return 'bg-green-100 border-green-500 text-green-700';
};