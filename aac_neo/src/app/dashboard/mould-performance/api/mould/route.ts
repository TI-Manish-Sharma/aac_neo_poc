import { NextResponse } from 'next/server';
import { MouldPerformanceData } from '../../types/MouldPerformanceData';

interface RequestParams {
    start_date?: string;
    end_date?: string;
    mould_id?: string;
}

export async function GET(request: Request) {
    // Parse query parameters
    const url = new URL(request.url);
    const params: RequestParams = {
        start_date: url.searchParams.get('start_date') || undefined,
        end_date: url.searchParams.get('end_date') || undefined,
        mould_id: url.searchParams.get('mould_id') || undefined
    };

    // Generate mock data based on parameters
    const mockData = generateMockData(params);

    return NextResponse.json(mockData);
}

function generateMockData(params: RequestParams): MouldPerformanceData[] {
    const { mould_id } = params;

    // Parse dates or use defaults
    // const startDate = start_date ? new Date(start_date) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    // const endDate = end_date ? new Date(end_date) : new Date(); // today

    // Define ranges for random data generation
    const totalMoulds = 32; // Total number of moulds to generate
    const batchesPerMouldMin = 10; // Minimum batches per mould
    const batchesPerMouldMax = 150; // Maximum batches per mould

    // Different performance profiles for moulds
    const performanceProfiles = [
        { name: 'excellent', rejectionRateRange: [0, 5], probability: 0.3 },
        { name: 'good', rejectionRateRange: [5, 15], probability: 0.4 },
        { name: 'average', rejectionRateRange: [15, 30], probability: 0.2 },
        { name: 'poor', rejectionRateRange: [30, 50], probability: 0.08 },
        { name: 'critical', rejectionRateRange: [50, 100], probability: 0.02 }
    ];

    // Generate data for all moulds
    const mouldData: MouldPerformanceData[] = [];

    for (let i = 1; i <= totalMoulds; i++) {
        // Skip if mould_id is specified and doesn't match
        if (mould_id && mould_id !== i.toString()) {
            continue;
        }

        // Determine performance profile for this mould
        const profile = selectRandomProfile(performanceProfiles);

        // Generate total batches
        const totalBatches = Math.floor(
            Math.random() * (batchesPerMouldMax - batchesPerMouldMin) + batchesPerMouldMin
        );

        // Generate rejection rate based on performance profile
        const rejectionRate = generateRejectionRate(
            profile.rejectionRateRange[0],
            profile.rejectionRateRange[1]
        );

        // Calculate rejected batches
        const rejectedBatches = Math.round((rejectionRate / 100) * totalBatches);

        mouldData.push({
            MouldId: i.toString(),
            TotalBatches: totalBatches,
            RejectedBatches: rejectedBatches,
            RejectionRate: parseFloat(rejectionRate.toFixed(2))
        });
    }

    // Sort by rejection rate (highest first) as most visualizations would show this order
    mouldData.sort((a, b) => b.RejectionRate - a.RejectionRate);

    return mouldData;
}

function selectRandomProfile(profiles: Array<{ name: string, rejectionRateRange: number[], probability: number }>) {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const profile of profiles) {
        cumulativeProbability += profile.probability;
        if (random < cumulativeProbability) {
            return profile;
        }
    }

    // Fallback to the last profile if something goes wrong
    return profiles[profiles.length - 1];
}

function generateRejectionRate(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}