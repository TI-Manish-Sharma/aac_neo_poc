import React from 'react';
import { AlertCircle, ArrowUpRight } from 'lucide-react';

interface AlertsPanelProps {
    alerts: Array<{
        id: string;
        type: 'warning' | 'critical' | 'info';
        message: string;
        timestamp: string;
    }>;
    title?: string;
    maxHeight?: number;
    showViewAll?: boolean;
    onViewAll?: () => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({
    alerts,
    title = 'Recent Alerts',
    maxHeight = 64,
    showViewAll = false,
    onViewAll
}) => {
    // Get alert icon based on type
    const getAlertIcon = (type: 'warning' | 'critical' | 'info') => {
        switch (type) {
            case 'critical':
                return <AlertCircle size={16} className="text-red-500" />;
            case 'warning':
                return <AlertCircle size={16} className="text-amber-500" />;
            case 'info':
                return <AlertCircle size={16} className="text-blue-500" />;
            default:
                return <AlertCircle size={16} className="text-gray-500" />;
        }
    };

    const getAlertStyle = (type: 'warning' | 'critical' | 'info') => {
        switch (type) {
            case 'critical':
                return 'bg-red-50 border-l-4 border-red-500';
            case 'warning':
                return 'bg-amber-50 border-l-4 border-amber-500';
            case 'info':
                return 'bg-blue-50 border-l-4 border-blue-500';
            default:
                return 'bg-gray-50 border-l-4 border-gray-500';
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                {showViewAll && (
                    <button
                        onClick={onViewAll}
                        className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center"
                    >
                        View All <ArrowUpRight size={14} className="ml-1" />
                    </button>
                )}
            </div>
            <div className={`space-y-4 overflow-auto max-h-${maxHeight}`}>
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`p-3 rounded-lg flex items-start ${getAlertStyle(alert.type)}`}
                    >
                        <div className="mr-3 mt-0.5">{getAlertIcon(alert.type)}</div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(alert.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlertsPanel;