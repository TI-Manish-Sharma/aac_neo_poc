import { ProductionDataItem } from "./ProductionDataItem";
import { RejectionType } from "./RejectionType";

interface ApiRejectionType {
    rejection_type: string;
    count: number;
    percentage: number;
}

interface BatchQualityMetricsApi {
    total_batches: number;
    rejected_batches: number;
    rejection_rate: number;
    rejection_by_type: ApiRejectionType[];
    most_common_rejection: string;
}

export class BatchQualityMetrics {
    constructor(
        readonly totalBatches: number,
        readonly rejectedBatches: number,
        readonly rejectionRate: number,
        readonly rejectionByType: RejectionType[],
        readonly mostCommonRejection: string
    ) { }

    static fromApiResponse(data: BatchQualityMetricsApi): BatchQualityMetrics {
        const byType = data.rejection_by_type.map(
            (item) =>
                new RejectionType(item.rejection_type, item.count, item.percentage)
        );

        return new BatchQualityMetrics(
            data.total_batches,
            data.rejected_batches,
            data.rejection_rate,
            byType,
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