import { ProductionDataItem } from "./ProductionDataItem";
import { RejectionType } from "./RejectionType";

export class BatchQualityMetrics {
    constructor(
        readonly totalBatches: number,
        readonly rejectedBatches: number,
        readonly rejectionRate: number,
        readonly rejectionByType: RejectionType[],
        readonly mostCommonRejection: string
    ) { }

    static fromApiResponse(data: any): BatchQualityMetrics {
        return new BatchQualityMetrics(
            data.total_batches,
            data.rejected_batches,
            data.rejection_rate,
            data.rejection_by_type.map((item: any) =>
                new RejectionType(item.rejection_type, item.count, item.percentage)
            ),
            data.most_common_rejection
        );
    }

    get acceptedBatches(): number {
        return this.totalBatches - this.rejectedBatches;
    }

    get productionOverview(): ProductionDataItem[] {
        return [
            {
                name: 'Accepted Batches',
                value: this.acceptedBatches,
                percentage: Number(((this.acceptedBatches / this.totalBatches) * 100).toFixed(2))
            },
            {
                name: 'Rejected Batches',
                value: this.rejectedBatches,
                percentage: Number(((this.rejectedBatches / this.totalBatches) * 100).toFixed(2))
            }
        ];
    }

    getMostCommonRejectionPercentage(): number | undefined {
        const mostCommon = this.rejectionByType.find(
            item => item.type === this.mostCommonRejection
        );
        return mostCommon?.percentage;
    }
}