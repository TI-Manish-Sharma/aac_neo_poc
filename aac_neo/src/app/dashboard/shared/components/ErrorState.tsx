import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
    error: string;
    apiUrl?: string;
    onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center mb-3">
                <AlertTriangle className="text-red-500 mr-2" size={24} />
                <h2 className="text-lg font-semibold text-red-700">Error Loading Data</h2>
            </div>
            <p className="text-red-600 mb-3">{error}</p>
            <p className="mt-2 font-medium">Please check if:</p>
            <ul className="list-disc pl-5 mb-3 text-gray-700">
                <li>The API server is running</li>
                <li>The endpoint is accessible</li>
                <li>CORS is properly configured on the server</li>
            </ul>
            <button
                onClick={onRetry}
                className="flex items-center px-4 py-2 bg-cyan-400 text-white rounded hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 transition"
            >
                <RefreshCw size={16} className="mr-2" /> Try Again
            </button>
        </div>
    );
};