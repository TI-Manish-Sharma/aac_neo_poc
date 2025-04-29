import React from 'react';
import { RefreshCw } from 'lucide-react';

interface NoDataStateProps {
    onRefresh: () => void;
}

export const NoDataState: React.FC<NoDataStateProps> = ({ onRefresh }) => {
    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-yellow-700 mb-2">No Data Available</h2>
            <p className="text-yellow-600">No production data could be retrieved from the API.</p>
            <button
                onClick={onRefresh}
                className="mt-3 flex items-center px-4 py-2 bg-cyan-400 text-white rounded hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition"
            >
                <RefreshCw size={16} className="mr-2" /> Refresh
            </button>
        </div>
    );
};