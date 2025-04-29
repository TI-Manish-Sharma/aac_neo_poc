'use client';
import React, { useState } from 'react';
import MouldPerformance from './components/MouldPerformance';
import SegregationAnalysis from './components/SegregationAnalysis';
import CuttingProcess from './cutting-process/components/CuttingProcess';
import RejectionTrends from './rejection-trends/components/RejectionTrends';

type DashboardProps = {
    baseApiUrl?: string;
    refreshInterval?: number;
};

export default function Dashboard({
    baseApiUrl = process.env.NEXT_PUBLIC_ANALYTICS_API_BASE_URL,
    refreshInterval = 0
}: DashboardProps) {
    // State for active tab
    const [activeTab, setActiveTab] = useState<string>('overview');
    // State for mobile menu visibility
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    // Tab configuration
    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'chart-bar' },
        { id: 'trends', label: 'Rejection Trends', icon: 'chart-line' },
        { id: 'moulds', label: 'Mould Performance', icon: 'cube' },
        { id: 'segregation', label: 'Segregation Analysis', icon: 'chart-pie' }
    ];

    // Function to toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    // Function to handle tab selection and close mobile menu
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
                                className={`w-full text-left px-4 py-3 flex items-center ${activeTab === tab.id ? 'bg-cyan-50 text-cyan-600' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {tab.icon === 'chart-bar' && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    )}
                                    {tab.icon === 'chart-line' && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                        />
                                    )}
                                    {tab.icon === 'cube' && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    )}
                                    {tab.icon === 'chart-pie' && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M12.025 4.725a5.975 5.975 0 018.25 8.25L12.025 4.725z"
                                        />
                                    )}
                                </svg>
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    {tab.icon === 'chart-bar' && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    )}
                                    {tab.icon === 'chart-line' && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                        />
                                    )}
                                    {tab.icon === 'cube' && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    )}
                                    {tab.icon === 'chart-pie' && (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M12.025 4.725a5.975 5.975 0 018.25 8.25L12.025 4.725z"
                                        />
                                    )}
                                </svg>
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
                    <CuttingProcess
                        apiUrl={`${baseApiUrl}/api/batch-quality`}
                        refreshInterval={refreshInterval}
                        title="Cutting Process - Quality Dashboard"
                    />
                )}

                {/* Rejection Trends Tab */}
                {activeTab === 'trends' && (
                    <RejectionTrends
                        apiUrl={`${baseApiUrl}/api/rejection-trends`}
                        refreshInterval={refreshInterval}
                        title="Cutting Process - Rejection Trends Analysis"
                    />
                )}

                {/* Mould Performance Tab */}
                {activeTab === 'moulds' && (
                    <MouldPerformance
                        apiUrl={`${baseApiUrl}/api/mould-performance`}
                        refreshInterval={refreshInterval}
                        title="Mould Performance Analysis"
                    />
                )}

                {/* Segregation Analysis Tab */}
                {activeTab === 'segregation' && (
                    <SegregationAnalysis
                        apiUrl={`${baseApiUrl}/api/segregation-analysis`}
                        refreshInterval={refreshInterval}
                        title="Segregation Analysis Dashboard"
                    />
                )}
            </div>
        </div>
    );
};