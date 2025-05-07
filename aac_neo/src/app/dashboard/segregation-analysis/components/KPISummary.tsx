import React from 'react';
import { SegregationSummary } from '../types';

interface KPISummaryProps {
    metrics: SegregationSummary;
}

export const KPISummary: React.FC<KPISummaryProps> = ({ metrics }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-blue-600 mb-1">Total Batches</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{metrics.totalBatches}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-yellow-600 mb-1">Batches With Defects</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{metrics.batchesWithDefects}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-red-600 mb-1">Total Defects</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{metrics.totalDefects}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm font-medium text-green-600 mb-1">Defect Rate</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-800">{metrics.defectRate.toFixed(2)}%</p>
            </div>
        </div>
    );
};