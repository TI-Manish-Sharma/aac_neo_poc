import React from 'react';
import { RejectionTrend } from '../types';

interface RejectionTrendsTableProps {
    data: RejectionTrend[];
}

const RejectionTrendsTable: React.FC<RejectionTrendsTableProps> = ({ data }) => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Rejection Trends</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Period</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total Batches</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Rejected</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Rejection Rate</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">TiltingCrane</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Chipping</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">SideCutter</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trimming</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((trend, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{trend.Period}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{trend.TotalBatches}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{trend.RejectedBatches}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{trend.RejectionRate}%</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{trend.TiltingCraneRate}%</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{trend.ChippingRate}%</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{trend.SideCutterRate}%</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{trend.TrimmingRate}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RejectionTrendsTable;