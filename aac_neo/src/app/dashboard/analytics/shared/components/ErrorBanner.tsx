import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBannerProps {
    message: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message: error }) => {
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md mb-6">
            <div className="flex items-center">
                <AlertTriangle className="text-red-500 mr-2" size={20} />
                <p className="text-red-600">{error}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">Showing previously loaded data.</p>
        </div>
    );
};
