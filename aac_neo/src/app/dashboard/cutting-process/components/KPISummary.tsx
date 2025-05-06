import React from 'react';
import { BatchQualityMetrics } from '../types/BatchQualityMetrics';

interface KPISummaryProps {
    metrics: BatchQualityMetrics;
}

export const KPISummary: React.FC<KPISummaryProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-cyan-600 mb-1">Total Batches</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{metrics.totalBatches}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-red-600 mb-1">Batches with Rejection</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{metrics.batchesWithRejection}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-amber-600 mb-1">Rejection Rate</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{metrics.rejectionRate}%</p>
            </div>
        </div>
    );
};