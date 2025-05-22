/* eslint-disable */

import React, { useState } from 'react';
import { Package, ArrowUpRight, FileBarChart, Factory } from 'lucide-react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
    Cell
} from 'recharts';

interface MaterialSupplierCorrelationProps {
    data: {
        suppliers: Array<{
            id: string;
            name: string;
            rejectionRate: number;
            totalBatches: number;
            materialTypes: string[];
        }>;
        materials: Array<{
            id: string;
            batchNumber: string;
            materialType: string;
            supplier: string;
            supplierName: string;
            rejectionRate: number;
            quantity: number;
            date: string;
        }>;
        averageRejectionRate: number;
    };
    title?: string;
    height?: number;
    showViewDetails?: boolean;
    onViewDetails?: () => void;
}

const MaterialSupplierCorrelation: React.FC<MaterialSupplierCorrelationProps> = ({
    data,
    title = 'Material & Supplier Analysis',
    height = 64,
    showViewDetails = false,
    onViewDetails
}) => {
    const [viewMode, setViewMode] = useState<'supplier' | 'batch'>('supplier');
    const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
    const [selectedMaterialType, setSelectedMaterialType] = useState<string | null>(null);

    // Get unique material types
    const materialTypes = Array.from(
        new Set(data.materials.map(m => m.materialType))
    );

    // Filter materials by selected supplier and material type
    const filteredMaterials = data.materials.filter(material => {
        const supplierMatch = selectedSupplier ? material.supplier === selectedSupplier : true;
        const typeMatch = selectedMaterialType ? material.materialType === selectedMaterialType : true;
        return supplierMatch && typeMatch;
    });

    // Format scatter plot data for suppliers
    const supplierScatterData = data.suppliers.map(supplier => ({
        x: supplier.totalBatches,
        y: supplier.rejectionRate,
        z: Math.max(10, supplier.totalBatches / 5), // Size based on batches, with minimum size
        name: supplier.name,
        id: supplier.id,
        materialTypes: supplier.materialTypes.join(', ')
    }));

    // Format scatter plot data for materials
    const materialScatterData = filteredMaterials.map(material => ({
        x: new Date(material.date).getTime(),
        y: material.rejectionRate,
        z: Math.max(10, material.quantity / 10), // Size based on quantity, with minimum size
        name: material.batchNumber,
        supplier: material.supplierName,
        materialType: material.materialType,
        quantity: material.quantity,
        date: material.date
    }));

    // Get color based on rejection rate
    const getColor = (rate: number) => {
        if (rate <= data.averageRejectionRate * 0.7) return '#10B981'; // Good
        if (rate <= data.averageRejectionRate) return '#60A5FA'; // Average
        if (rate <= data.averageRejectionRate * 1.5) return '#F59E0B'; // Warning
        return '#EF4444'; // Critical
    };

    // Custom tooltip for scatter chart
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            if (viewMode === 'supplier') {
                return (
                    <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md text-xs">
                        <p className="font-bold mb-1">{data.name}</p>
                        <p className="text-gray-700">Rejection Rate: <span className="font-semibold">{data.y}%</span></p>
                        <p className="text-gray-700">Total Batches: <span className="font-semibold">{data.x}</span></p>
                        <p className="text-gray-700">Material Types: <span className="font-semibold">{data.materialTypes}</span></p>
                    </div>
                );
            } else {
                return (
                    <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md text-xs">
                        <p className="font-bold mb-1">Batch: {data.name}</p>
                        <p className="text-gray-700">Rejection Rate: <span className="font-semibold">{data.y}%</span></p>
                        <p className="text-gray-700">Date: <span className="font-semibold">{new Date(data.x).toLocaleDateString()}</span></p>
                        <p className="text-gray-700">Supplier: <span className="font-semibold">{data.supplier}</span></p>
                        <p className="text-gray-700">Material: <span className="font-semibold">{data.materialType}</span></p>
                        <p className="text-gray-700">Quantity: <span className="font-semibold">{data.quantity}</span></p>
                    </div>
                );
            }
        }
        return null;
    };

    // Component for key stats
    const KeyStats = () => {
        if (viewMode === 'supplier') {
            // Sort suppliers by rejection rate
            const sortedSuppliers = [...data.suppliers].sort((a, b) => a.rejectionRate - b.rejectionRate);
            const bestSupplier = sortedSuppliers[0];
            const worstSupplier = sortedSuppliers[sortedSuppliers.length - 1];

            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center text-green-800 mb-1">
                            <Factory size={16} className="mr-1" />
                            <span className="text-sm font-medium">Best Supplier</span>
                        </div>
                        <p className="text-lg font-bold text-green-900">{bestSupplier.name}</p>
                        <p className="text-xs text-green-700">Rejection Rate: {bestSupplier.rejectionRate.toFixed(1)}%</p>
                    </div>

                    <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center text-red-800 mb-1">
                            <Factory size={16} className="mr-1" />
                            <span className="text-sm font-medium">Worst Supplier</span>
                        </div>
                        <p className="text-lg font-bold text-red-900">{worstSupplier.name}</p>
                        <p className="text-xs text-red-700">Rejection Rate: {worstSupplier.rejectionRate.toFixed(1)}%</p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center text-blue-800 mb-1">
                            <FileBarChart size={16} className="mr-1" />
                            <span className="text-sm font-medium">Average Rate</span>
                        </div>
                        <p className="text-lg font-bold text-blue-900">{data.averageRejectionRate.toFixed(1)}%</p>
                        <p className="text-xs text-blue-700">Across all suppliers</p>
                    </div>
                </div>
            );
        } else {
            // Filter and sort materials
            const sortedMaterials = [...filteredMaterials].sort((a, b) => a.rejectionRate - b.rejectionRate);
            const bestBatch = sortedMaterials[0];
            const worstBatch = sortedMaterials[sortedMaterials.length - 1];

            if (!bestBatch || !worstBatch) {
                return <p className="text-sm text-gray-500 mb-4">No material data available for the selected filters.</p>;
            }

            return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center text-green-800 mb-1">
                            <Package size={16} className="mr-1" />
                            <span className="text-sm font-medium">Best Batch</span>
                        </div>
                        <p className="text-lg font-bold text-green-900">{bestBatch.batchNumber}</p>
                        <p className="text-xs text-green-700">{bestBatch.materialType} - {bestBatch.rejectionRate.toFixed(1)}%</p>
                    </div>

                    <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center text-red-800 mb-1">
                            <Package size={16} className="mr-1" />
                            <span className="text-sm font-medium">Worst Batch</span>
                        </div>
                        <p className="text-lg font-bold text-red-900">{worstBatch.batchNumber}</p>
                        <p className="text-xs text-red-700">{worstBatch.materialType} - {worstBatch.rejectionRate.toFixed(1)}%</p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center text-blue-800 mb-1">
                            <FileBarChart size={16} className="mr-1" />
                            <span className="text-sm font-medium">Average Rate</span>
                        </div>
                        <p className="text-lg font-bold text-blue-900">
                            {(filteredMaterials.reduce((sum, m) => sum + m.rejectionRate, 0) / filteredMaterials.length).toFixed(1)}%
                        </p>
                        <p className="text-xs text-blue-700">For selected materials</p>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-amber-100 rounded-lg mr-3">
                        <Package size={24} className="text-amber-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                </div>
                <div className="flex items-center">
                    {showViewDetails && (
                        <button
                            onClick={onViewDetails}
                            className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center mr-4"
                        >
                            View Details <ArrowUpRight size={14} className="ml-1" />
                        </button>
                    )}
                    <div className="flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'supplier'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border border-gray-200`}
                            onClick={() => setViewMode('supplier')}
                        >
                            <Factory size={14} className="inline mr-1" />
                            Suppliers
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'batch'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border border-gray-200`}
                            onClick={() => setViewMode('batch')}
                        >
                            <Package size={14} className="inline mr-1" />
                            Material Batches
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters for material batches */}
            {viewMode === 'batch' && (
                <div className="mb-4 flex flex-wrap gap-3">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Supplier</label>
                        <select
                            className="text-sm border border-gray-300 rounded-md p-1 w-40"
                            value={selectedSupplier || ''}
                            onChange={(e) => setSelectedSupplier(e.target.value || null)}
                        >
                            <option value="">All Suppliers</option>
                            {data.suppliers.map(supplier => (
                                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Material Type</label>
                        <select
                            className="text-sm border border-gray-300 rounded-md p-1 w-40"
                            value={selectedMaterialType || ''}
                            onChange={(e) => setSelectedMaterialType(e.target.value || null)}
                        >
                            <option value="">All Materials</option>
                            {materialTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Key Stats */}
            <KeyStats />

            {/* Chart */}
            <div className={`h-${height}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 30, left: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type={viewMode === 'supplier' ? 'number' : 'number'}
                            dataKey="x"
                            name={viewMode === 'supplier' ? 'Total Batches' : 'Date'}
                            domain={viewMode === 'supplier' ? ['auto', 'auto'] : ['auto', 'auto']}
                            tickFormatter={viewMode === 'supplier'
                                ? undefined
                                : (tick) => new Date(tick).toLocaleDateString()}
                        >
                            <Label
                                value={viewMode === 'supplier' ? 'Total Batches' : 'Date'}
                                offset={-10}
                                position="insideBottom"
                            />
                        </XAxis>
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Rejection Rate"
                        >
                            <Label
                                value="Rejection Rate (%)"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>
                        <ZAxis
                            type="number"
                            dataKey="z"
                            range={[60, 400]}
                            name={viewMode === 'supplier' ? 'Total Batches' : 'Quantity'}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Scatter
                            name={viewMode === 'supplier' ? 'Suppliers' : 'Material Batches'}
                            data={viewMode === 'supplier' ? supplierScatterData : materialScatterData}
                            fill="#8884d8"
                        >
                            {(viewMode === 'supplier' ? supplierScatterData : materialScatterData).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.y)} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Correlation Insights */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                    {viewMode === 'supplier' ? (
                        <>
                            <li>• {data.suppliers.length} suppliers analyzed</li>
                            <li>• Suppliers with higher rejection rates show strong correlation with specific material types</li>
                            <li>• Bubble size represents the total number of batches from each supplier</li>
                        </>
                    ) : (
                        <>
                            <li>• {filteredMaterials.length} material batches analyzed</li>
                            <li>• Bubble size represents the quantity of each material batch</li>
                            <li>• Material batches are plotted by date to show trends over time</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default MaterialSupplierCorrelation;