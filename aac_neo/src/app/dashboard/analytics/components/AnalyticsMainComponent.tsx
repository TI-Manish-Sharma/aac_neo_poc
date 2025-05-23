'use client';

import {
    Box,
    ChartBar,
    ChartPie,
    Scissors
} from 'lucide-react';
import React, { useState } from 'react';

import CombinedCuttingDashboard from '../cutting-process/components/CombinedCuttingDashboard';
import MouldPerformance from '../mould-performance/components/MouldPerformance';
import DashboardOverview from '../overview/components/DashboardOverview';
import SegregationAnalysis from '../segregation-analysis/components/SegregationAnalysis';

interface DashboardComponentProps {
    baseApiUrl?: string;
    refreshInterval?: number;
}

const AnalyticsMainComponent: React.FC<DashboardComponentProps> = ({
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
        { id: 'cutting-process-quality', label: 'Cutting', icon: Scissors },
        { id: 'moulds', label: 'Mould Box', icon: Box },
        { id: 'segregation', label: 'Segregation', icon: ChartPie }
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
        <div className="flex flex-col h-screen overflow-hidden bg-100 px-4 py-4 md:py-4">

            {/* Fixed Header and Alert Section */}
            <div className="flex-none">
                <div className="mb-2 md:mb-2">
                    <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-2 break-words">
                        <span className="text-cyan-500">AAC Plant</span> Data-Driven Quality Insights
                    </h1>
                    <p className="text-sm md:text-lg text-gray-600">
                        Monitor rejection rates, trends, mould box performance, and segregation analysis
                    </p>
                </div>


                {/* Desktop Navigation Tabs */}
                <div className="hidden md:block mb-2 border-b border-gray-200">
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
            </div>

            {/* Scrollable Content Section */}
            <div className="flex-grow overflow-y-auto scrollbar-hide ">
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
                        // <CuttingProcess
                        //     refreshInterval={refreshInterval}
                        //     title="Cutting Process Rejection Analysis"
                        // />
                        <CombinedCuttingDashboard
                            refreshInterval={refreshInterval}
                            title="Cutting Process Analysis"
                        />
                    )}

                    {/* Mould Performance Tab */}
                    {activeTab === 'moulds' && (
                        <MouldPerformance
                            refreshInterval={refreshInterval}
                            title="Mould Box Performance Analysis"
                        />
                    )}

                    {/* Segregation Analysis Tab */}
                    {activeTab === 'segregation' && (
                        <SegregationAnalysis
                            // apiUrl={`${baseApiUrl}/api/segregation-analysis`}
                            refreshInterval={refreshInterval}
                            title="Segregation Analysis"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsMainComponent;