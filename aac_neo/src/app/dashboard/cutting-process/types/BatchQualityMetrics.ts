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
    most_common_rejections: string[];
    most_common_rejection: string;
}

export class BatchQualityMetrics {
    constructor(
        readonly totalBatches: number,
        readonly batchesWithRejection: number,
        readonly rejectionRate: number,
        readonly rejectionByType: RejectionType[],
        readonly mostCommonRejection: string,
        readonly mostCommonRejections: string[] = []
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

        // Process most common rejections (handle both the array and legacy string)
        const mostCommonRejection = BatchQualityMetrics.humanizeKey(data.most_common_rejection);

        // Process the array of most common rejections if it exists
        const mostCommonRejections = data.most_common_rejections
            ? data.most_common_rejections.map(r => BatchQualityMetrics.humanizeKey(r))
            : [mostCommonRejection]; // Fallback to single value if array not provided

        return new BatchQualityMetrics(
            data.total_batches,
            data.rejected_batches,
            data.rejection_rate,
            byType,
            mostCommonRejection,
            mostCommonRejections
        );
    }

    get acceptedBatches(): number {
        return this.totalBatches - this.batchesWithRejection;
    }

    get productionOverview(): ProductionDataItem[] {
        return [
            {
                name: 'Batches without Rejection',
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

    // Get percentage for a specific rejection type
    getMostCommonRejectionPercentage(): number | undefined {
        const mostCommon = this.rejectionByType.find(
            item => item.type === this.mostCommonRejection
        );
        return mostCommon?.percentage;
    }

    // Check if there are tied most common rejections
    hasTiedMostCommonRejections(): boolean {
        return this.mostCommonRejections.length > 1;
    }

    // Get all most common rejections formatted as a readable string
    getMostCommonRejectionsFormatted(): string {
        if (this.mostCommonRejections.length <= 1) {
            return this.mostCommonRejection;
        }

        // Format list with commas and "and" for the last item
        if (this.mostCommonRejections.length === 2) {
            return `${this.mostCommonRejections[0]} and ${this.mostCommonRejections[1]}`;
        }

        const lastItem = this.mostCommonRejections[this.mostCommonRejections.length - 1];
        const allButLast = this.mostCommonRejections.slice(0, -1);
        return `${allButLast.join(', ')}, and ${lastItem}`;
    }
}