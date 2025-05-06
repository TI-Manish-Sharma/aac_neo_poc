import { ProductionDataItem } from "./ProductionDataItem";
import { RejectionType } from "./RejectionType";

interface ApiRejectionType {
    rejection_type: string;
    count: number;
    percentage: number;
}

export interface BatchQualityMetricsApi {
    total_batches: number;
    rejected_batches: number;
    rejection_rate: number;
    rejection_by_type: ApiRejectionType[];
    most_common_rejection: string;
}

export class BatchQualityMetrics {
    constructor(
        readonly totalBatches: number,
        readonly batchesWithRejection: number,
        readonly rejectionRate: number,
        readonly rejectionByType: RejectionType[],
        readonly mostCommonRejection: string
    ) { }

    static humanizeKey(key: string) {
        // 1) remove the suffix
        const withoutSuffix = key.replace(/Rejection$/, '');
        // 2) insert spaces before capital letters, uppercase first char, trim
        return withoutSuffix
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (s) => s.toUpperCase())
            .trim();
    }

    static fromApiResponse(data: BatchQualityMetricsApi): BatchQualityMetrics {
        const byType = data.rejection_by_type.map(
            (item) => {
                const label = BatchQualityMetrics.humanizeKey(item.rejection_type);
                return new RejectionType(label, item.count, item.percentage);
            });

        return new BatchQualityMetrics(
            data.total_batches,
            data.rejected_batches,
            data.rejection_rate,
            byType,
            BatchQualityMetrics.humanizeKey(data.most_common_rejection)
        );
    }

    get acceptedBatches(): number {
        return this.totalBatches - this.batchesWithRejection;
    }

    get productionOverview(): ProductionDataItem[] {
        return [
            {
                name: 'Accepted Batches',
                value: this.acceptedBatches,
                percentage: Number(((this.acceptedBatches / this.totalBatches) * 100).toFixed(2))
            },
            {
                name: 'Batches with Rejection',
                value: this.batchesWithRejection,
                percentage: Number(((this.batchesWithRejection / this.totalBatches) * 100).toFixed(2))
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