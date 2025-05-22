// components/BatchTable.tsx
import React from 'react';
import { BatchData, TemperatureStatus } from '../types/batch';

interface BatchTableProps {
    batchData: BatchData[];
    displayCount?: number;
}

interface TableHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, className = "" }) => (
    <th className={`px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
        {children}
    </th>
);

const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => (
    <td className={`px-3 py-2 text-sm text-gray-600 ${className}`}>
        {children}
    </td>
);

const BatchTable: React.FC<BatchTableProps> = ({ batchData, displayCount = 8 }) => {
    // Get the most recent batches
    const recentBatches = batchData.slice(-displayCount);

    // Function to determine temperature status
    const getTemperatureStatus = (temp: number): TemperatureStatus => {
        if (temp <= 47) {
            return {
                label: 'Optimal',
                class: 'bg-green-100 text-green-800 border-green-200'
            };
        }
        if (temp <= 48) {
            return {
                label: 'Good',
                class: 'bg-yellow-100 text-yellow-800 border-yellow-200'
            };
        }
        return {
            label: 'Monitor',
            class: 'bg-red-100 text-red-800 border-red-200'
        };
    };

    // Function to get parameter status (for highlighting out-of-range values)
    const getParameterStatus = (value: number, min: number, max: number) => {
        if (value < min || value > max) {
            return 'text-red-600 font-medium';
        }
        return '';
    };

    // Function to format numbers with proper units
    const formatValue = (value: number, unit: string) => {
        if (unit === 'gm' && value >= 1000) {
            return `${(value / 1000).toFixed(1)}k`;
        }
        return value.toLocaleString();
    };

    // Column definitions
    const columns = [
        { key: 'batchNo', label: 'Batch No', width: 'w-20' },
        { key: 'mouldNo', label: 'Mould', width: 'w-16' },
        { key: 'freshSlurryKg', label: 'Fresh Slurry (kg)', width: 'w-24' },
        { key: 'wasteSlurryKg', label: 'Waste Slurry (kg)', width: 'w-24' },
        { key: 'cementKg', label: 'Cement (kg)', width: 'w-20' },
        { key: 'limeKg', label: 'Lime (kg)', width: 'w-20' },
        { key: 'gypsumKg', label: 'Gypsum (kg)', width: 'w-20' },
        { key: 'aluminumPowderGm', label: 'Al Powder (gm)', width: 'w-24' },
        { key: 'dcPowderGm', label: 'DC Powder (gm)', width: 'w-24' },
        { key: 'waterKg', label: 'Water (kg)', width: 'w-20' },
        { key: 'soluOilLitre', label: 'Solu Oil (L)', width: 'w-20' },
        { key: 'mixingTime', label: 'Mix Time', width: 'w-20' },
        { key: 'dischargeTime', label: 'Discharge Time', width: 'w-24' },
        { key: 'dischargeTemp', label: 'Discharge Temp', width: 'w-24' },
        { key: 'status', label: 'Status', width: 'w-24' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Recent Batch Details (Last {recentBatches.length})
                </h3>
                <div className="text-sm text-gray-500">
                    Total Batches: {batchData.length}
                </div>
            </div>

            {/* Legend for parameter ranges */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">
                    <div className="font-medium mb-1">Parameter Ranges:</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <span>• Water: 70-125 kg</span>
                        <span>• Mixing Time: 2.5-3.2 min</span>
                        <span>• Discharge Temp: ≤48°C</span>
                    </div>
                    <div className="mt-1 text-red-600">
                        * Values outside ranges are highlighted in red
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {columns.map((column) => (
                                <TableHeader key={column.key} className={column.width}>
                                    {column.label}
                                </TableHeader>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {recentBatches.map((batch) => {
                            const tempStatus = getTemperatureStatus(batch.dischargeTemp);

                            return (
                                <tr
                                    key={batch.batchNo}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* Batch Number */}
                                    <TableCell className="font-medium text-gray-900">
                                        {batch.batchNo}
                                    </TableCell>

                                    {/* Mould Number */}
                                    <TableCell>{batch.mouldNo}</TableCell>

                                    {/* Fresh Slurry */}
                                    <TableCell>
                                        {formatValue(batch.freshSlurryKg, 'kg')}
                                    </TableCell>

                                    {/* Waste Slurry */}
                                    <TableCell>{batch.wasteSlurryKg}</TableCell>

                                    {/* Cement */}
                                    <TableCell>{batch.cementKg}</TableCell>

                                    {/* Lime */}
                                    <TableCell>{batch.limeKg}</TableCell>

                                    {/* Gypsum */}
                                    <TableCell>{batch.gypsumKg}</TableCell>

                                    {/* Aluminum Powder */}
                                    <TableCell>
                                        {formatValue(batch.aluminumPowderGm, 'gm')}
                                    </TableCell>

                                    {/* DC Powder */}
                                    <TableCell>{batch.dcPowderGm}</TableCell>

                                    {/* Water - with range checking */}
                                    <TableCell className={getParameterStatus(batch.waterKg, 70, 125)}>
                                        {batch.waterKg}
                                    </TableCell>

                                    {/* Soluble Oil */}
                                    <TableCell>{batch.soluOilLitre}</TableCell>

                                    {/* Mixing Time - with range checking */}
                                    <TableCell className={getParameterStatus(batch.mixingTime, 2.5, 3.2)}>
                                        {batch.mixingTime}m
                                    </TableCell>

                                    {/* Discharge Time */}
                                    <TableCell>{batch.dischargeTime}</TableCell>

                                    {/* Discharge Temperature - with range checking */}
                                    <TableCell className={getParameterStatus(batch.dischargeTemp, 0, 48)}>
                                        {batch.dischargeTemp}°C
                                    </TableCell>

                                    {/* Status Badge */}
                                    <TableCell>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${tempStatus.class}`}>
                                            {tempStatus.label}
                                        </span>
                                    </TableCell>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Summary Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-gray-600">
                        <span className="font-medium">Avg Mixing Time:</span> {' '}
                        {(recentBatches.reduce((sum, batch) => sum + batch.mixingTime, 0) / recentBatches.length).toFixed(2)}m
                    </div>
                    <div className="text-gray-600">
                        <span className="font-medium">Avg Discharge Temp:</span> {' '}
                        {(recentBatches.reduce((sum, batch) => sum + batch.dischargeTemp, 0) / recentBatches.length).toFixed(1)}°C
                    </div>
                    <div className="text-gray-600">
                        <span className="font-medium">Avg Water Usage:</span> {' '}
                        {(recentBatches.reduce((sum, batch) => sum + batch.waterKg, 0) / recentBatches.length).toFixed(1)}kg
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BatchTable;