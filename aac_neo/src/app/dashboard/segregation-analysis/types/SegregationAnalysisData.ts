import { DefectByType } from './DefectByType';
import { DefectByPosition } from './DefectByPosition';
import { MouldPerformance } from './MouldPerformance';
import { BatchDefect } from './BatchDefect';
import { SegregationSummary } from './SegregationSummary';

export interface SegregationAnalysisData {
    summary: SegregationSummary;
    defectsByType: DefectByType[];
    defectsByPosition: DefectByPosition[];
    mouldPerformance: MouldPerformance[];
    worstBatches: BatchDefect[];
}