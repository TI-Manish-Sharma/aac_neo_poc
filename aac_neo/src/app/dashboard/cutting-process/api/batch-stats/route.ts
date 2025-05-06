// app/cutting-process/api/batch-stats/route.ts
import { NextResponse } from 'next/server';
import { BatchQualityMetricsApi } from '../../types/BatchQualityMetrics';

export async function GET() {
    const totalBatches = 144;

    // pick a random overall rejection rate (e.g. 5–30%)
    const rejectionRate = Math.random() * (30 - 5) + 5;
    const rejectedBatches = Math.floor((rejectionRate / 100) * totalBatches);

    // your exact field-names:
    const rejectionKeys = [
        'tiltingCraneRejection',
        'chippingRejection',
        'sideCutterRejection',
        'joinedRejection',
        'trimmingRejection',
        'wireBrokenHC',
        'wireBrokenVC',
        'rejectedDueToHC',
        'rejectedDueToVC',
    ] as const;

    // generate random “weights” and scale them to sum = rejectedBatches
    const weights = rejectionKeys.map(() => Math.random());
    const weightSum = weights.reduce((a, b) => a + b, 0);
    const counts = weights.map(w => Math.floor((w / weightSum) * rejectedBatches));

    // fix any rounding drift
    let drift = rejectedBatches - counts.reduce((a, b) => a + b, 0);
    for (let i = 0; drift > 0; i = (i + 1) % counts.length, drift--) {
        counts[i]++;
    }

    // build an object mapping your keys → counts
    const dynamicRejections = rejectionKeys.reduce<Record<string, number>>(
        (obj, key, i) => {
            obj[key] = counts[i];
            return obj;
        },
        {}
    );

    // Find the maximum rejection count
    const maxRejectionCount = Math.max(...Object.values(dynamicRejections));
    
    // Find all rejection types that have the maximum count (handles ties)
    const mostCommonRejections = Object.entries(dynamicRejections)
        .filter(([_, count]) => count === maxRejectionCount)
        .map(([type]) => type);

    const mockData: BatchQualityMetricsApi = {
        total_batches: totalBatches,
        rejected_batches: rejectedBatches,
        rejection_rate: parseFloat(((rejectedBatches / totalBatches) * 100).toFixed(2)),
        // spread in your nine fields:
        ...dynamicRejections,
        rejection_by_type: Object.entries(dynamicRejections).map(([type, count]) => ({
            rejection_type: type,
            count,
            percentage: parseFloat(((count / rejectedBatches) * 100).toFixed(2)),
        })),
        // Now returns an array of the most common rejection(s)
        most_common_rejections: mostCommonRejections,
        most_common_rejection: mostCommonRejections[0], // or any other logic to pick one
    };

    return NextResponse.json<BatchQualityMetricsApi>(mockData);
}
