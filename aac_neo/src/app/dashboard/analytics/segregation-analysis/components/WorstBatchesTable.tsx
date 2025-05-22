import React from 'react';
import { BatchDefect } from '../types';

interface WorstBatchesTableProps {
    data: BatchDefect[];
}

const WorstBatchesTable: React.FC<WorstBatchesTableProps> = ({ data }) => {
    // Function to get background color class based on defect rate
    const getBgColorClass = (defectRate: number) => {
        if (defectRate > 15) return 'bg-red-50';
        if (defectRate > 10) return 'bg-yellow-50';
        if (defectRate > 5) return 'bg-blue-50';
        return '';
    };

    // Function to get badge color class based on defect rate
    const getBadgeColorClass = (defectRate: number) => {
        if (defectRate > 15) return 'bg-red-500 text-white';
        if (defectRate > 10) return 'bg-yellow-500 text-black';
        if (defectRate > 5) return 'bg-blue-500 text-white';
        return 'bg-green-500 text-white';
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Worst Batches (&gt;5%) by Defect Rate</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Batch ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Mould ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total Blocks</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total Defects</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Defect Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data
                        .sort((a, b) => b.defectRate - a.defectRate)
                        .slice(0, 5) // Limit to top 5 batches
                        .map((batch, index) => (
                            <tr key={index} className={getBgColorClass(batch.defectRate)}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{batch.batchId}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{batch.mouldId}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{batch.date}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{batch.totalBlocks}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{batch.totalDefects}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getBadgeColorClass(batch.defectRate)}`}>
                                        {batch.defectRate.toFixed(2)}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorstBatchesTable;