import React, { useState } from 'react';
import {
    ClipboardCheck,
    AlertCircle,
    Clock,
    CheckCircle2,
    XCircle,
    User,
    CalendarClock,
    ArrowUpRight,
    Filter,
    Search
} from 'lucide-react';

interface ActionItemTrackingProps {
    data: {
        actions: Array<{
            id: string;
            title: string;
            description: string;
            status: 'open' | 'in_progress' | 'completed' | 'cancelled';
            priority: 'low' | 'medium' | 'high' | 'critical';
            assignee: string;
            dueDate: string;
            createdDate: string;
            completedDate?: string;
            relatedMouldId?: string;
            relatedMouldName?: string;
            category: string;
        }>;
        moulds: Array<{
            id: string;
            name: string;
            defectRate: number;
        }>;
        stats: {
            total: number;
            completed: number;
            open: number;
            inProgress: number;
            overdue: number;
        };
    };
    title?: string;
    showViewDetails?: boolean;
    onViewDetails?: () => void;
}

const ActionItemTracking: React.FC<ActionItemTrackingProps> = ({
    data,
    title = 'Action Item Tracking',
    showViewDetails = false,
    onViewDetails
}) => {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [mouldFilter, setMouldFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Filter actions based on selected filters
    const filteredActions = data.actions.filter(action => {
        const statusMatch = statusFilter === 'all' || action.status === statusFilter;
        const mouldMatch = mouldFilter === 'all' || action.relatedMouldId === mouldFilter;
        const priorityMatch = priorityFilter === 'all' || action.priority === priorityFilter;
        const searchMatch = searchTerm === '' ||
            action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            action.assignee.toLowerCase().includes(searchTerm.toLowerCase());

        return statusMatch && mouldMatch && priorityMatch && searchMatch;
    });

    // Get status badge style
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return (
                    <span className="flex items-center text-blue-700 bg-blue-100 text-xs px-2 py-0.5 rounded">
                        <AlertCircle size={12} className="mr-1" />
                        Open
                    </span>
                );
            case 'in_progress':
                return (
                    <span className="flex items-center text-amber-700 bg-amber-100 text-xs px-2 py-0.5 rounded">
                        <Clock size={12} className="mr-1" />
                        In Progress
                    </span>
                );
            case 'completed':
                return (
                    <span className="flex items-center text-green-700 bg-green-100 text-xs px-2 py-0.5 rounded">
                        <CheckCircle2 size={12} className="mr-1" />
                        Completed
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="flex items-center text-gray-700 bg-gray-100 text-xs px-2 py-0.5 rounded">
                        <XCircle size={12} className="mr-1" />
                        Cancelled
                    </span>
                );
            default:
                return <span className="text-gray-500 text-xs">Unknown</span>;
        }
    };

    // Get priority badge style
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'low':
                return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Low</span>;
            case 'medium':
                return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">Medium</span>;
            case 'high':
                return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded">High</span>;
            case 'critical':
                return <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">Critical</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">Unknown</span>;
        }
    };

    // Check if an action is overdue
    const isOverdue = (dueDate: string, status: string) => {
        return status !== 'completed' && status !== 'cancelled' &&
            new Date(dueDate) < new Date();
    };

    return (
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <ClipboardCheck size={24} className="text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{title}</h3>
                </div>
                {showViewDetails && (
                    <button
                        onClick={onViewDetails}
                        className="text-cyan-500 hover:text-cyan-600 text-sm flex items-center"
                    >
                        View All Actions <ArrowUpRight size={14} className="ml-1" />
                    </button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-bold text-gray-700">{data.stats.total}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600">Open</p>
                    <p className="text-xl font-bold text-blue-700">{data.stats.open}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-600">In Progress</p>
                    <p className="text-xl font-bold text-amber-700">{data.stats.inProgress}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-600">Completed</p>
                    <p className="text-xl font-bold text-green-700">{data.stats.completed}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-red-600">Overdue</p>
                    <p className="text-xl font-bold text-red-700">{data.stats.overdue}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center mb-2">
                    <Filter size={14} className="text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Filters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Status</label>
                        <select
                            className="w-full text-sm border border-gray-300 rounded-md p-1"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Mould</label>
                        <select
                            className="w-full text-sm border border-gray-300 rounded-md p-1"
                            value={mouldFilter}
                            onChange={(e) => setMouldFilter(e.target.value)}
                        >
                            <option value="all">All Moulds</option>
                            {data.moulds.map(mould => (
                                <option key={mould.id} value={mould.id}>{mould.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Priority</label>
                        <select
                            className="w-full text-sm border border-gray-300 rounded-md p-1"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="all">All Priorities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <Search size={14} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="w-full text-sm border border-gray-300 rounded-md pl-8 p-1"
                                placeholder="Search actions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Items List */}
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                {filteredActions.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                        <p>No action items found matching your filters.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredActions.map(action => (
                            <div
                                key={action.id}
                                className={`border ${isOverdue(action.dueDate, action.status) ? 'border-red-200 bg-red-50' : 'border-gray-200'} rounded-lg p-3`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800 mb-1">{action.title}</h4>
                                        <p className="text-xs text-gray-600 mb-2">{action.description}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        {getStatusBadge(action.status)}
                                        {getPriorityBadge(action.priority)}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center text-xs text-gray-500 space-x-4 mt-2">
                                    {action.relatedMouldId && (
                                        <span className="flex items-center">
                                            <AlertCircle size={12} className="mr-1 text-gray-400" />
                                            Mould: {action.relatedMouldName || action.relatedMouldId}
                                        </span>
                                    )}

                                    <span className="flex items-center">
                                        <User size={12} className="mr-1 text-gray-400" />
                                        {action.assignee}
                                    </span>

                                    <span className={`flex items-center ${isOverdue(action.dueDate, action.status) ? 'text-red-500 font-medium' : ''}`}>
                                        <CalendarClock size={12} className="mr-1 text-gray-400" />
                                        Due: {new Date(action.dueDate).toLocaleDateString()}
                                        {isOverdue(action.dueDate, action.status) && ' (Overdue)'}
                                    </span>

                                    <span className="flex items-center">
                                        <Clock size={12} className="mr-1 text-gray-400" />
                                        Created: {new Date(action.createdDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionItemTracking;