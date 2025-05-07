// app/segregation-analysis/api/segregation/route.ts

import { NextResponse } from 'next/server';
import { SegregationAnalysisData } from '../../types/SegregationAnalysisData';

interface RequestParams {
    start_date?: string;
    end_date?: string;
    mould_id?: string;
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const params: RequestParams = {
        start_date: url.searchParams.get('start_date') || undefined,
        end_date: url.searchParams.get('end_date') || undefined,
        mould_id: url.searchParams.get('mould_id') || undefined,
    };

    const mockData = generateMockData(params);
    return NextResponse.json(mockData);
}

function generateMockData(params: RequestParams): SegregationAnalysisData {
    const base = generateBaseData();

    if (params.mould_id) {
        const mouldId = params.mould_id;
        const mouldPerformance = base.mouldPerformance.filter(m => m.mouldId === mouldId);
        const worstBatches = base.worstBatches.filter(b => b.mouldId === mouldId);

        // Recalculate summary for this single mould
        const totalBatches = mouldPerformance.reduce((sum, m) => sum + m.totalBatches, 0);
        const batchesWithDefects = worstBatches.length;
        const totalDefects = worstBatches.reduce((sum, b) => sum + b.totalDefects, 0);
        const defectRate = totalBatches > 0
            ? (batchesWithDefects / totalBatches) * 100
            : 0;

        return {
            summary: {
                totalBatches,
                batchesWithDefects,
                totalDefects,
                defectRate: parseFloat(defectRate.toFixed(2)),
            },
            defectsByType: base.defectsByType,
            defectsByPosition: base.defectsByPosition,
            mouldPerformance,
            worstBatches,
        };
    }

    return base;
}

function generateBaseData(): SegregationAnalysisData {
    // 1️⃣ Defect types
    const defectTypes = [
        { type: "Rain Cracks/Cuts", min: 80, max: 120 },
        { type: "Corner Cracks/Cuts", min: 40, max: 70 },
        { type: "Corner Damage", min: 15, max: 35 },
        { type: "Chipped Blocks", min: 60, max: 90 },
    ].map(d => ({
        type: d.type,
        count: generateRandomInt(d.min, d.max),
        percentage: 0,
    }));
    const totalDefects = defectTypes.reduce((sum, d) => sum + d.count, 0);
    defectTypes.forEach(d => {
        d.percentage = parseFloat(((d.count / totalDefects) * 100).toFixed(2));
    });

    // 2️⃣ Defects by position
    const positions = ["1", "2", "3", "4", "5", "6"];
    const defectsByPosition = positions.map(pos => {
        const rain = generateRandomInt(2, 35);
        const corner = generateRandomInt(0, 20);
        const damage = generateRandomInt(0, 10);
        const chip = generateRandomInt(0, 20);
        const total = rain + corner + damage + chip;
        return {
            position: pos,
            rainCracksCuts: rain,
            cornerCracksCuts: corner,
            cornerDamage: damage,
            chippedBlocks: chip,
            total,
            percentage: parseFloat(((total / totalDefects) * 100).toFixed(2)),
        };
    });

    // 3️⃣ Mould performance (15 moulds, each with 5–20 batches)
    const mouldIds = Array.from({ length: 15 }, (_, i) => (i + 1).toString());
    const mouldPerformance = mouldIds.map(mouldId => {
        const totalBatches = generateRandomInt(5, 20);
        const avgDefects = generateRandomInt(5, 45);
        const totalDefects = avgDefects * totalBatches;

        // split one batch's defects for type breakdown
        const rainCount = generateRandomInt(0, avgDefects);
        const cornerCount = generateRandomInt(0, avgDefects - rainCount);
        const damageCount = generateRandomInt(0, avgDefects - rainCount - cornerCount);
        const chipCount = avgDefects - rainCount - cornerCount - damageCount;

        return {
            mouldId,
            totalBatches,
            totalDefects,
            averageDefectsPerBatch: avgDefects,
            defectTypes: [
                { type: "Rain Cracks/Cuts", count: rainCount },
                { type: "Corner Cracks/Cuts", count: cornerCount },
                { type: "Corner Damage", count: damageCount },
                { type: "Chipped Blocks", count: chipCount },
            ],
        };
    }).sort((a, b) => b.averageDefectsPerBatch - a.averageDefectsPerBatch);

    // 4️⃣ Worst 10 batches (one sample per mould, defects capped ≤ totalBlocks)
    const worstBatches = mouldPerformance.map((m, idx) => {
        const totalBlocks = 252;
        // generate a realistic defects‐in‐one‐batch count ≤ totalBlocks
        const defectsInBatch = generateRandomInt(
            m.averageDefectsPerBatch,
            Math.min(totalBlocks, m.averageDefectsPerBatch * 2)
        );
        return {
            batchId: (1520 + idx).toString(),
            mouldId: m.mouldId,
            date: getCurrentDate(),
            totalBlocks,
            totalDefects: defectsInBatch,
            defectRate: parseFloat(((defectsInBatch / totalBlocks) * 100).toFixed(2)),
        };
    })
        .sort((a, b) => b.defectRate - a.defectRate)
        .slice(0, 10);

    // 5️⃣ Summary across all moulds
    const summaryTotalBatches = mouldPerformance.reduce((sum, m) => sum + m.totalBatches, 0);
    const summaryBatchesWithDefects = worstBatches.length;
    const summaryTotalDefects = worstBatches.reduce((sum, b) => sum + b.totalDefects, 0);
    const summaryDefectRate = (summaryBatchesWithDefects / summaryTotalBatches) * 100;

    return {
        summary: {
            totalBatches: summaryTotalBatches,
            batchesWithDefects: summaryBatchesWithDefects,
            totalDefects: summaryTotalDefects,
            defectRate: parseFloat(summaryDefectRate.toFixed(2)),
        },
        defectsByType: defectTypes,
        defectsByPosition,
        mouldPerformance,
        worstBatches,
    };
}

// Helpers
function generateRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
}
