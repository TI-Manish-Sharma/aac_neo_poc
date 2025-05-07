export interface MouldPerformance {
    mouldId: string;
    totalBatches: number;
    totalDefects: number;
    averageDefectsPerBatch: number;
    defectTypes: Array<{
        type: string;
        count: number;
    }>;
}