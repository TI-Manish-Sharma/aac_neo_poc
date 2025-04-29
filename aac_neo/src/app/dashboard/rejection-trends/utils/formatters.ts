import { RejectionTrend, RejectionTypesData, TrendLineData } from "../types";


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
 * Transform rejection trends data for line chart
 */
export const prepareTrendLineData = (trendsData: RejectionTrend[]): TrendLineData[] => {
    return trendsData.map(trend => ({
        period: trend.Period,
        rejectionRate: trend.RejectionRate,
        totalBatches: trend.TotalBatches
    }));
};

/**
 * Transform rejection trends data for rejection types chart
 */
export const prepareRejectionTypesData = (trendsData: RejectionTrend[]): RejectionTypesData[] => {
    return trendsData.map(trend => ({
        period: trend.Period,
        TiltingCrane: trend.TiltingCraneRate,
        Chipping: trend.ChippingRate,
        SideCutter: trend.SideCutterRate,
        Joined: trend.JoinedRate,
        Trimming: trend.TrimmingRate,
        HC: trend.HCRate,
        VC: trend.VCRate
    }));
};