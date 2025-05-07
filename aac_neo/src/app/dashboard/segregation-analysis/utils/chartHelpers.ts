import { DefectByType, DefectByPosition, MouldPerformance, BatchDefect } from '../types';

// Colors for charts
export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

/**
 * Get the top N mould performances by average defects per batch
 */
export const getTopMoulds = (
    mouldPerformance: MouldPerformance[],
    count: number = 10
): MouldPerformance[] => {
    return [...mouldPerformance]
        .sort((a, b) => b.averageDefectsPerBatch - a.averageDefectsPerBatch)
        .slice(0, count);
};

/**
 * Get the top N batches by defect rate
 */
export const getTopBatches = (
    batches: BatchDefect[],
    count: number = 10
): BatchDefect[] => {
    return [...batches]
        .sort((a, b) => b.defectRate - a.defectRate)
        .slice(0, count);
};

/**
 * Find the most common defect type for a position
 */
export const getMostCommonDefectForPosition = (position: DefectByPosition): string => {
    const defectTypes = [
        { type: 'Rain Cracks/Cuts', count: position.rainCracksCuts },
        { type: 'Corner Cracks/Cuts', count: position.cornerCracksCuts },
        { type: 'Corner Damage', count: position.cornerDamage },
        { type: 'Chipped Blocks', count: position.chippedBlocks }
    ];

    const mostCommon = defectTypes.reduce((prev, current) =>
        (prev.count > current.count) ? prev : current
    );

    return mostCommon.count > 0 ? mostCommon.type : 'None';
};