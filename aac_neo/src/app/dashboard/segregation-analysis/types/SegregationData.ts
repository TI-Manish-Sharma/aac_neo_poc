import { BatchDefect } from "./BatchDefect";
import { DefectByPosition } from "./DefectByPosition";
import { DefectByType } from "./DefectByType";
import { MouldPerformance } from "./MouldPerformance";

export interface SegregationData {
    summary: {
        totalBatches: number;
        batchesWithDefects: number;
        totalDefects: number;
        defectRate: number;
    };
    defectsByType: DefectByType[];
    defectsByPosition: DefectByPosition[];
    mouldPerformance: MouldPerformance[];
    worstBatches: BatchDefect[];
}