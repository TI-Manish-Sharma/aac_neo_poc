import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
    title: string;
    lastUpdated: Date | null;
    isLoading: boolean;
    onRefresh: () => void;
    children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    lastUpdated,
    isLoading,
    onRefresh,
    children
}) => {
    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleString();
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="mb-4 md:mb-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h1>
            </div>

            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-3">
                {lastUpdated && (
                    <span className="text-xs md:text-sm text-gray-500 mr-3 self-center hidden md:block">
                        Last updated: {formatDate(lastUpdated)}
                    </span>
                )}

                {children && children}

                {isLoading ? (
                    <button className="flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-700 rounded cursor-not-allowed" disabled>
                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full mr-2"></div>
                        Updating...
                    </button>
                ) : (
                    <button
                        onClick={onRefresh}
                        className="flex items-center justify-center px-3 py-2 bg-cyan-400 text-white rounded hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition"
                    >
                        <>
                            <RefreshCw size={16} className="mr-2" />
                            <span>Refresh</span>
                        </>
                    </button>
                )}
            </div>
        </div>
    );
};