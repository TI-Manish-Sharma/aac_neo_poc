'use client';

import React, { useState } from 'react';
import {
    ChartBar,
    ChartLine,
    Box,
    ChartPie,
    Scissors
} from 'lucide-react';

import CuttingProcess from '../cutting-process/components/CuttingProcess';
import RejectionTrends from '../rejection-trends/components/RejectionTrends';
import MouldPerformance from '../mould-performance/components/MouldPerformance';
import SegregationAnalysis from '../segregation-analysis/components/SegregationAnalysis';
import DashboardOverview from '../overview/components/DashboardOverview';

interface DashboardComponentProps {
    baseApiUrl?: string;
    refreshInterval?: number;
}

const DashboardComponent: React.FC<DashboardComponentProps> = ({
    // baseApiUrl = process.env.NEXT_PUBLIC_ANALYTICS_API_BASE_URL,
    refreshInterval = 0
}) => {
    // State for active tab
    const [activeTab, setActiveTab] = useState<string>('overview');
    // State for mobile menu visibility
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    // Tab configuration with Lucide-react icons
    const tabs = [
        { id: 'overview', label: 'Overview', icon: ChartBar },
        { id: 'cutting-process-quality', label: 'Cutting Quality', icon: Scissors },
        { id: 'trends', label: 'Rejection Trends', icon: ChartLine },
        { id: 'moulds', label: 'Mould Performance', icon: Box },
        { id: 'segregation', label: 'Segregation Analysis', icon: ChartPie }
    ];

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Handle tab selection and close mobile menu
    const handleTabSelect = (tabId: string) => {
        setActiveTab(tabId);
        setMobileMenuOpen(false);
    };

    return (
        <div className="container mx-auto px-4 py-4 md:py-8 overflow-hidden">
            <div className="mb-4 md:mb-8">
                <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-2 break-words">
                    <span className="text-cyan-500">AAC Plant</span> Quality Dashboard
                </h1>
                <p className="text-sm md:text-lg text-gray-600">
                    Monitor rejection rates, trends, mould performance, and segregation analysis
                </p>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden mb-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <span className="font-medium text-lg text-gray-800">
                        {tabs.find(tab => tab.id === activeTab)?.label}
                    </span>
                    <button
                        onClick={toggleMobileMenu}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-200 bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="bg-white shadow-lg rounded-md mt-2 py-2 absolute z-10 left-4 right-4 max-h-64 overflow-y-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabSelect(tab.id)}
                                className={`w-full text-left px-4 py-3 flex items-center ${activeTab === tab.id ? 'bg-cyan-50 text-cyan-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <tab.icon className="h-5 w-5 mr-3" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden md:block mb-6 border-b border-gray-200">
                <nav className="flex flex-wrap -mb-px">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`mr-4 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ease-out ${activeTab === tab.id
                                ? 'border-cyan-500 text-cyan-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                            <div className="flex items-center">
                                <tab.icon className="h-5 w-5 mr-2" />
                                {tab.label}
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    // <div>
                    //     <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    //         {/* Total Batches Card */}
                    //         <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                    //             <p className="text-sm text-gray-500">Total Batches</p>
                    //             <p className="text-3xl font-bold">—</p>
                    //         </div>
                    //         {/* Rejected Batches Card */}
                    //         <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                    //             <p className="text-sm text-gray-500">Rejected Batches</p>
                    //             <p className="text-3xl font-bold">—</p>
                    //         </div>
                    //         {/* Rejection Rate Card */}
                    //         <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                    //             <p className="text-sm text-gray-500">Rejection Rate</p>
                    //             <p className="text-3xl font-bold">—</p>
                    //         </div>
                    //     </div>
                    // </div>
                    <DashboardOverview
                        refreshInterval={refreshInterval}
                    />
                )}

                {/* Cutting Process Quality Tab */}
                {activeTab === 'cutting-process-quality' && (
                    <CuttingProcess
                        refreshInterval={refreshInterval}
                        title="Cutting Process - Quality Dashboard"
                    />
                )}

                {/* Rejection Trends Tab */}
                {activeTab === 'trends' && (
                    <RejectionTrends
                        refreshInterval={refreshInterval}
                        title="Cutting Process - Rejection Trends Analysis"
                    />
                )}

                {/* Mould Performance Tab */}
                {activeTab === 'moulds' && (
                    <MouldPerformance
                        refreshInterval={refreshInterval}
                        title="Mould Performance Analysis"
                    />
                )}

                {/* Segregation Analysis Tab */}
                {activeTab === 'segregation' && (
                    <SegregationAnalysis
                        // apiUrl={`${baseApiUrl}/api/segregation-analysis`}
                        refreshInterval={refreshInterval}
                        title="Segregation Analysis Dashboard"
                    />
                )}
            </div>
        </div>
    );
};

export default DashboardComponent;