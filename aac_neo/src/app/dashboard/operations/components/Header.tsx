// components/Header.tsx
import React from 'react';
import { Play, Pause } from 'lucide-react';

interface HeaderProps {
    isRealTimeActive: boolean;
    onToggleRealTime: () => void;
}

const Header: React.FC<HeaderProps> = ({ isRealTimeActive, onToggleRealTime }) => {
    return (
        <div className="mb-4 md:mb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-2 break-words">
                    <span className="text-cyan-500">AAC Plant</span> Real Time Quality Insights
                </h1>
                <p className="text-sm md:text-lg text-gray-600">
                    Real-time monitoring of production batches and quality metrics
                </p>
            </div>
            <button
                onClick={onToggleRealTime}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${isRealTimeActive
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    }`}
            >
                {isRealTimeActive ? (
                    <>
                        <Pause className="w-4 h-4 mr-2" />
                        Stop Real-time
                    </>
                ) : (
                    <>
                        <Play className="w-4 h-4 mr-2" />
                        Real-time
                    </>
                )}
            </button>
        </div>
    );
};

export default Header;