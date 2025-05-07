/* eslint-disable */

import React from 'react';

interface Column {
    key: string;
    header: string;
}

interface SegregationTableProps {
    data: any[];
    columns: Column[];
    title: string;
    rowClassNameFn?: (row: any) => string;
}

const SegregationTable: React.FC<SegregationTableProps> = ({
    data,
    columns,
    title,
    rowClassNameFn
}) => {
    // Function to format cell value depending on data type
    const formatCellValue = (value: any) => {
        if (typeof value === 'number') {
            // Check if it's a percentage (if column key contains 'percentage' or 'rate')
            if (String(value).includes('.')) {
                return value.toFixed(2);
            }
            return value;
        }
        return value;
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 shadow-sm overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${rowClassNameFn ? rowClassNameFn(row) : ''}`}
                            >
                                {columns.map((column) => (
                                    <td key={`${rowIndex}-${column.key}`} className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                        {formatCellValue(row[column.key])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SegregationTable;