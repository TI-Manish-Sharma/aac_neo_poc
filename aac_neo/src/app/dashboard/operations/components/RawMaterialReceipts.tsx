import React, { useState, useMemo } from 'react';
import { Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface QualityCheck {
    testType: string;
    result: string;
    specification: string;
    status: 'pass' | 'fail' | 'pending';
}

interface RawMaterialReceipt {
    id: string;
    receiptNo: string;
    supplierName: string;
    materialType: string;
    receiptDate: string;
    receiptTime: string;
    qualityStatus: 'approved' | 'pending' | 'rejected';
    batchLot: string;
    vehicleNo: string;
    inspectedBy: string;
    qualityChecks: QualityCheck[];
}

interface RawMaterialReceiptsProps {
    className?: string;
}

const RawMaterialReceipts: React.FC<RawMaterialReceiptsProps> = ({ className = '' }) => {
    // Mock data for raw material receipts with quality checks
    const [receipts] = useState<RawMaterialReceipt[]>([
        {
            id: '1',
            receiptNo: 'RMR-2025-001',
            supplierName: 'Portland Co.',
            materialType: 'Fly Ash',
            receiptDate: '2025-05-21',
            receiptTime: '08:30',
            qualityStatus: 'approved',
            batchLot: 'PC-2025-B127',
            vehicleNo: 'MH-12-AB-1234',
            inspectedBy: 'Tukkaram Patil',
            qualityChecks: [
                { testType: 'Carbon & Oil', result: 'No oil/black detected', specification: 'No oil/No black flyash', status: 'pass' },
                { testType: 'ROS Test', result: '28% on 45μ sieve', specification: '<30% on 45 micron sieve', status: 'pass' }
            ]
        },
        {
            id: '2',
            receiptNo: 'RMR-2025-002',
            supplierName: 'Lime Industries Ltd.',
            materialType: 'Lime',
            receiptDate: '2025-05-21',
            receiptTime: '10:15',
            qualityStatus: 'rejected',
            batchLot: 'LI-2025-B089',
            vehicleNo: 'MH-14-CD-5678',
            inspectedBy: 'Jayprakash Rao',
            qualityChecks: [
                { testType: 'Temperature', result: '45°C in 25 mins', specification: '>55°C in 25 mins', status: 'fail' }
            ]
        },
        {
            id: '3',
            receiptNo: 'RMR-2025-003',
            supplierName: 'Gypsum Suppliers',
            materialType: 'Gypsum',
            receiptDate: '2025-05-21',
            receiptTime: '12:45',
            qualityStatus: 'approved',
            batchLot: 'GS-2025-B045',
            vehicleNo: 'MH-09-EF-9012',
            inspectedBy: 'Mohit Pal',
            qualityChecks: [
                { testType: 'ROS Test', result: '12% on 45μ sieve', specification: '<15% on 45 micron sieve', status: 'pass' }
            ]
        },
        {
            id: '4',
            receiptNo: 'RMR-2025-004',
            supplierName: 'Aluminum Powder Corp.',
            materialType: 'Aluminum Powder',
            receiptDate: '2025-05-21',
            receiptTime: '14:20',
            qualityStatus: 'rejected',
            batchLot: 'APC-2025-B156',
            vehicleNo: 'MH-15-GH-3456',
            inspectedBy: 'Ashok Kumar',
            qualityChecks: [
                { testType: 'Grade Test', result: 'C-60 fx on drum', specification: 'C-75 fx on drum', status: 'fail' }
            ]
        },
        {
            id: '5',
            receiptNo: 'RMR-2025-005',
            supplierName: 'Chemical Solutions Inc.',
            materialType: 'Soluble Oil',
            receiptDate: '2025-05-21',
            receiptTime: '16:10',
            qualityStatus: 'approved',
            batchLot: 'CSI-2025-B078',
            vehicleNo: 'MH-11-IJ-7890',
            inspectedBy: 'Ravi Shankar',
            qualityChecks: [
                { testType: 'Density', result: '920 GMS/LIT', specification: '>900 GMS/LIT', status: 'pass' }
            ]
        }
    ]);

    const statusCounts = useMemo(() => {
        return receipts.reduce((acc, receipt) => {
            acc[receipt.qualityStatus]++;
            return acc;
        }, { approved: 0, pending: 0, rejected: 0 });
    }, [receipts]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'pending':
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'rejected':
                return <AlertTriangle className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getQualityCheckColor = (status: string) => {
        switch (status) {
            case 'pass':
                return 'text-green-600';
            case 'fail':
                return 'text-red-600';
            case 'pending':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    const getQualityCheckIcon = (status: string) => {
        switch (status) {
            case 'pass':
                return <CheckCircle className="w-3 h-3 text-green-500" />;
            case 'fail':
                return <AlertTriangle className="w-3 h-3 text-red-500" />;
            case 'pending':
                return <Clock className="w-3 h-3 text-yellow-500" />;
            default:
                return null;
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 flex flex-col h-full ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Raw Material Receipts</h2>
                        <p className="text-sm text-gray-600">Recent material deliveries and quality checks</p>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="flex space-x-4">
                    <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{statusCounts.approved}</div>
                        <div className="text-xs text-gray-500">Approved</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">{statusCounts.pending}</div>
                        <div className="text-xs text-gray-500">Pending</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{statusCounts.rejected}</div>
                        <div className="text-xs text-gray-500">Rejected</div>
                    </div>
                </div>
            </div>

            {/* Receipts Table */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Supplier</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Material</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Quality Checks</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Received Time</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Overall Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Inspector</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receipts.map((receipt) => (
                            <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="text-sm text-gray-500">
                                        {receipt.supplierName}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-sm text-gray-500">
                                        {receipt.materialType}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="space-y-1">
                                        {receipt.qualityChecks.map((check, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                {getQualityCheckIcon(check.status)}
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs font-medium text-gray-700">
                                                        {check.testType}
                                                    </div>
                                                    <div className={`text-xs ${getQualityCheckColor(check.status)}`}>
                                                        {check.result}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-gray-500">
                                        <div className="text-sm">{receipt.receiptDate}</div>
                                        <div className="text-xs">{receipt.receiptTime}</div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center space-x-1">
                                        {getStatusIcon(receipt.qualityStatus)}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.qualityStatus)}`}>
                                            {receipt.qualityStatus.charAt(0).toUpperCase() + receipt.qualityStatus.slice(1)}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-sm text-gray-500">
                                        {receipt.inspectedBy}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Showing {receipts.length} recent receipts with quality checks</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live</span>
                        </div>
                        <span>•</span>
                        <span>Updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RawMaterialReceipts;