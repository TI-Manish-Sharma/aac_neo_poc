import React from 'react';
import { BatchQualityMetrics } from '../types/BatchQualityMetrics';

interface RejectionAlertProps {
    metrics: BatchQualityMetrics;
}

export const RejectionAlert: React.FC<RejectionAlertProps> = ({ metrics }) => {
    const hasTiedRejections = metrics.hasTiedMostCommonRejections();
    const rejectionPercentage = metrics.getMostCommonRejectionPercentage();

    return (
        <div className="mt-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <h3 className="font-semibold text-gray-800">
                    {hasTiedRejections ? 'Most Common Rejection Types' : 'Most Common Rejection Type'}
                </h3>
                <div className="mt-2">
                    <p className="text-lg font-bold text-red-600 mb-1">
                        {hasTiedRejections
                            ? metrics.getMostCommonRejectionsFormatted()
                            : metrics.mostCommonRejection
                        }
                    </p>
                    <p className="text-sm text-gray-600">
                        {hasTiedRejections
                            ? `These rejection types each account for ${rejectionPercentage}% of total batches`
                            : `This rejection type accounts for ${rejectionPercentage}% of total batches`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};