// components/OrderDispatch.tsx
import React, { useState } from 'react';
import { Truck } from 'lucide-react';

interface OrderDispatch {
    id: string;
    dispatchNo: string;
    customerName: string;
    destination: string;
    productType: string;
    quantity: number;
    unit: string;
    dispatchDate: string;
    dispatchTime: string;
    expectedDelivery: string;
    driverName: string;
    vehicleNo: string;
    status: 'dispatched' | 'in-transit' | 'delivered' | 'delayed';
    priority: 'high' | 'medium' | 'low';
    distance: number; // in km
}

interface OrderDispatchProps {
    className?: string;
}

const OrderDispatch: React.FC<OrderDispatchProps> = ({ className = '' }) => {
    // Mock data for order dispatches
    const [dispatches] = useState<OrderDispatch[]>([
        {
            id: '1',
            dispatchNo: 'DISP-2025-001',
            customerName: 'ABC Construction Ltd.',
            destination: 'Mumbai, Maharashtra',
            productType: 'AAC Blocks',
            quantity: 2500,
            unit: 'blocks',
            dispatchDate: '2025-05-22',
            dispatchTime: '06:30',
            expectedDelivery: '2025-05-22 14:30',
            driverName: 'Rajesh Kumar',
            vehicleNo: 'MH-12-AB-1234',
            status: 'delivered',
            priority: 'high',
            distance: 45
        },
        {
            id: '2',
            dispatchNo: 'DISP-2025-002',
            customerName: 'XYZ Builders Pvt. Ltd.',
            destination: 'Nashik, Maharashtra',
            productType: 'AAC Blocks',
            quantity: 1800,
            unit: 'blocks',
            dispatchDate: '2025-05-22',
            dispatchTime: '08:15',
            expectedDelivery: '2025-05-22 16:45',
            driverName: 'Suresh Patil',
            vehicleNo: 'MH-15-CD-5678',
            status: 'in-transit',
            priority: 'medium',
            distance: 120
        },
        {
            id: '3',
            dispatchNo: 'DISP-2025-003',
            customerName: 'Prime Infrastructure',
            destination: 'Aurangabad, Maharashtra',
            productType: 'AAC Blocks',
            quantity: 3200,
            unit: 'blocks',
            dispatchDate: '2025-05-22',
            dispatchTime: '09:45',
            expectedDelivery: '2025-05-22 18:00',
            driverName: 'Mahesh Jadhav',
            vehicleNo: 'MH-09-EF-9012',
            status: 'dispatched',
            priority: 'high',
            distance: 180
        },
        {
            id: '4',
            dispatchNo: 'DISP-2025-004',
            customerName: 'Modern Homes Ltd.',
            destination: 'Solapur, Maharashtra',
            productType: 'AAC Blocks',
            quantity: 1500,
            unit: 'blocks',
            dispatchDate: '2025-05-21',
            dispatchTime: '15:30',
            expectedDelivery: '2025-05-22 08:00',
            driverName: 'Ganesh More',
            vehicleNo: 'MH-11-GH-3456',
            status: 'delayed',
            priority: 'medium',
            distance: 250
        },
        {
            id: '5',
            dispatchNo: 'DISP-2025-005',
            customerName: 'Skyline Projects',
            destination: 'Kolhapur, Maharashtra',
            productType: 'AAC Blocks',
            quantity: 2100,
            unit: 'blocks',
            dispatchDate: '2025-05-22',
            dispatchTime: '11:20',
            expectedDelivery: '2025-05-22 20:30',
            driverName: 'Vikas Shinde',
            vehicleNo: 'MH-16-IJ-7890',
            status: 'in-transit',
            priority: 'low',
            distance: 200
        }
    ]);

    // const statusCounts = useMemo(() => {
    //     return dispatches.reduce((acc, dispatch) => {
    //         acc[dispatch.status]++;
    //         return acc;
    //     }, { dispatched: 0, 'in-transit': 0, delivered: 0, delayed: 0 });
    // }, [dispatches]);

    // const getStatusIcon = (status: string) => {
    //     switch (status) {
    //         case 'delivered':
    //             return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    //         case 'in-transit':
    //             return <Truck className="w-4 h-4 text-blue-500" />;
    //         case 'dispatched':
    //             return <Timer className="w-4 h-4 text-yellow-500" />;
    //         case 'delayed':
    //             return <AlertCircle className="w-4 h-4 text-red-500" />;
    //         default:
    //             return null;
    //     }
    // };

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 flex flex-col h-full ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Truck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Order Dispatch</h2>
                        <p className="text-sm text-gray-600">Outbound shipments Status</p>
                    </div>
                </div>
            </div>

            {/* Dispatch Table */}
            <div className="overflow-x-auto flex-1">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Order No.</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Vehicle</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Dispatch Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dispatches.map((dispatch) => (
                            <tr key={dispatch.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                    <div className="text-sm text-gray-500">{dispatch.dispatchNo}</div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-sm text-gray-500">{dispatch.customerName}</div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-sm text-gray-500">
                                        {dispatch.quantity.toLocaleString()} {dispatch.unit}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="text-sm text-gray-500 flex space-x-1">
                                        <span>{dispatch.vehicleNo}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex space-x-1">
                                        <div className="text-gray-500">
                                            <div className="text-sm">{dispatch.dispatchDate}</div>
                                            <div className="text-xs">{dispatch.dispatchTime}</div>
                                        </div>
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
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Showing {dispatches.length} recent dispatches</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>Total dispatched today: {dispatches.filter(d => d.dispatchDate === '2025-05-22').reduce((sum, d) => sum + d.quantity, 0).toLocaleString()} blocks</span>
                        <span>•</span>
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

export default OrderDispatch;