// app/rejection-trends/api/trends/route.ts
import { NextResponse } from 'next/server';
import { RejectionTrend } from '../../types/RejectionTrend';

interface RequestParams {
    start_date?: string;
    end_date?: string;
    group_by?: string;
}

export async function GET(request: Request) {
    // Parse query parameters
    const url = new URL(request.url);
    const params: RequestParams = {
        start_date: url.searchParams.get('start_date') || undefined,
        end_date: url.searchParams.get('end_date') || undefined,
        group_by: url.searchParams.get('group_by') || 'day'
    };

    // Generate mock data based on parameters
    const mockData = generateMockData(params);

    return NextResponse.json(mockData);
}

function generateMockData(params: RequestParams): RejectionTrend[] {
    const { start_date, end_date, group_by } = params;

    // Parse dates or use defaults
    const startDate = start_date ? new Date(start_date) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const endDate = end_date ? new Date(end_date) : new Date(); // today

    // Generate periods based on group_by
    const periods = generatePeriods(startDate, endDate, group_by || 'day');

    // Create trend data for each period
    return periods.map(period => {
        // Generate a base rejection rate between 5% and 35%
        const baseRejectionRate = Math.random() * 30 + 5;

        // Generate total batches (higher for longer periods)
        let totalBatches = 0;
        if (group_by === 'day') totalBatches = Math.floor(Math.random() * 20) + 10; // 10-30 batches per day
        else if (group_by === 'week') totalBatches = Math.floor(Math.random() * 100) + 50; // 50-150 batches per week
        else totalBatches = Math.floor(Math.random() * 300) + 200; // 200-500 batches per month

        // Calculate rejected batches
        const rejectedBatches = Math.round((baseRejectionRate / 100) * totalBatches);

        // Generate rates for different rejection types
        const tiltingCraneRate = generateRate(0, baseRejectionRate * 0.7);
        const chippingRate = generateRate(0, baseRejectionRate * 0.6);
        const sideCutterRate = generateRate(0, baseRejectionRate * 0.4);
        const joinedRate = generateRate(0, baseRejectionRate * 0.3);
        const trimmingRate = generateRate(0, baseRejectionRate * 0.4);
        const hcRate = generateRate(0, baseRejectionRate * 0.2);
        const vcRate = generateRate(0, baseRejectionRate * 0.2);

        // Adjust rates to ensure they sum to the total rejection rate
        const totalType = tiltingCraneRate + chippingRate + sideCutterRate + joinedRate + trimmingRate + hcRate + vcRate;
        const adjustmentFactor = baseRejectionRate / totalType;

        // Calculate rejection counts based on adjusted rates
        const tiltingCraneRejections = Math.round((tiltingCraneRate * adjustmentFactor / 100) * totalBatches);
        const chippingRejections = Math.round((chippingRate * adjustmentFactor / 100) * totalBatches);
        const sideCutterRejections = Math.round((sideCutterRate * adjustmentFactor / 100) * totalBatches);
        const joinedRejections = Math.round((joinedRate * adjustmentFactor / 100) * totalBatches);
        const trimmingRejections = Math.round((trimmingRate * adjustmentFactor / 100) * totalBatches);
        const rejectedDueToHC = Math.round((hcRate * adjustmentFactor / 100) * totalBatches);
        const rejectedDueToVC = Math.round((vcRate * adjustmentFactor / 100) * totalBatches);

        // Adjust rejections to ensure they sum to total rejected batches
        const calculatedTotal = tiltingCraneRejections + chippingRejections + sideCutterRejections +
            joinedRejections + trimmingRejections + rejectedDueToHC + rejectedDueToVC;

        const difference = rejectedBatches - calculatedTotal;

        // Adjust the first non-zero category to account for rounding differences
        let adjustedTiltingCraneRejections = tiltingCraneRejections;
        if (tiltingCraneRejections > 0) {
            adjustedTiltingCraneRejections += difference;
        }

        // Calculate final rates
        const rejectionRate = parseFloat(((rejectedBatches / totalBatches) * 100).toFixed(2));
        const tiltingCraneRateAdjusted = parseFloat(((adjustedTiltingCraneRejections / totalBatches) * 100).toFixed(2));
        const chippingRateAdjusted = parseFloat(((chippingRejections / totalBatches) * 100).toFixed(2));
        const sideCutterRateAdjusted = parseFloat(((sideCutterRejections / totalBatches) * 100).toFixed(2));
        const joinedRateAdjusted = parseFloat(((joinedRejections / totalBatches) * 100).toFixed(2));
        const trimmingRateAdjusted = parseFloat(((trimmingRejections / totalBatches) * 100).toFixed(2));
        const hcRateAdjusted = parseFloat(((rejectedDueToHC / totalBatches) * 100).toFixed(2));
        const vcRateAdjusted = parseFloat(((rejectedDueToVC / totalBatches) * 100).toFixed(2));

        return {
            Period: period,
            TotalBatches: totalBatches,
            RejectedBatches: rejectedBatches,
            RejectionRate: rejectionRate,
            TiltingCraneRejections: adjustedTiltingCraneRejections,
            ChippingRejections: chippingRejections,
            SideCutterRejections: sideCutterRejections,
            JoinedRejections: joinedRejections,
            TrimmingRejections: trimmingRejections,
            RejectedDueToHC: rejectedDueToHC,
            RejectedDueToVC: rejectedDueToVC,
            TiltingCraneRate: tiltingCraneRateAdjusted,
            ChippingRate: chippingRateAdjusted,
            SideCutterRate: sideCutterRateAdjusted,
            JoinedRate: joinedRateAdjusted,
            TrimmingRate: trimmingRateAdjusted,
            HCRate: hcRateAdjusted,
            VCRate: vcRateAdjusted
        };
    });
}

function generatePeriods(startDate: Date, endDate: Date, groupBy: string): string[] {
    const periods: string[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        if (groupBy === 'day') {
            periods.push(formatDate(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (groupBy === 'week') {
            // Format as YYYY-WW (year and week number)
            const year = currentDate.getFullYear();
            const weekNumber = getWeekNumber(currentDate);
            periods.push(`${year}-W${weekNumber.toString().padStart(2, '0')}`);
            currentDate.setDate(currentDate.getDate() + 7);
        } else { // month
            // Format as YYYY-MM (year and month)
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            periods.push(`${year}-${month.toString().padStart(2, '0')}`);
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
    }

    // Remove duplicates (especially for week and month grouping)
    return [...new Set(periods)];
}

function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function generateRate(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}