'use client';
import React, { useState } from 'react';
import AACPlantVisualization from '../_components/AACPlantVisualization';
import RejectionTrends from '../_components/RejectionTrends';
import MouldPerformance from '../_components/MouldPerformance';
import SegregationAnalysis from '../_components/SegregationAnalysis';

interface DashboardProps {
    baseApiUrl?: string;
    refreshInterval?: number;
}

const Dashboard: React.FC<DashboardProps> = ({
    baseApiUrl = 'http://localhost:8000',
    refreshInterval = 0
}) => {
    // State for active tab
    const [activeTab, setActiveTab] = useState<string>('overview');

    return (
        <div className="container-fluid px-4 py-4">
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="display-5 fw-bold text-primary mb-0">AAC Plant Quality Dashboard</h1>
                    <p className="text-success">Monitor rejection rates, trends, mould performance, and segregation analysis</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'trends' ? 'active' : ''}`}
                        onClick={() => setActiveTab('trends')}
                    >
                        Rejection Trends
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'moulds' ? 'active' : ''}`}
                        onClick={() => setActiveTab('moulds')}
                    >
                        Mould Performance
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'segregation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('segregation')}
                    >
                        Segregation Analysis
                    </button>
                </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
                {/* Overview Tab (Batch Quality) */}
                <div className={`tab-pane fade ${activeTab === 'overview' ? 'show active' : ''}`}>
                    {activeTab === 'overview' && (
                        <AACPlantVisualization
                            apiUrl={`${baseApiUrl}/api/batch-quality`}
                            refreshInterval={refreshInterval}
                            title="Production Quality Overview"
                        />
                    )}
                </div>

                {/* Rejection Trends Tab */}
                <div className={`tab-pane fade ${activeTab === 'trends' ? 'show active' : ''}`}>
                    {activeTab === 'trends' && (
                        <RejectionTrends
                            apiUrl={`${baseApiUrl}/api/rejection-trends`}
                            refreshInterval={refreshInterval}
                            title="Rejection Trends Analysis"
                        />
                    )}
                </div>

                {/* Mould Performance Tab */}
                <div className={`tab-pane fade ${activeTab === 'moulds' ? 'show active' : ''}`}>
                    {activeTab === 'moulds' && (
                        <MouldPerformance
                            apiUrl={`${baseApiUrl}/api/mould-performance`}
                            refreshInterval={refreshInterval}
                            title="Mould Performance Analysis"
                        />
                    )}
                </div>

                {/* Segregation Analysis Tab */}
                <div className={`tab-pane fade ${activeTab === 'segregation' ? 'show active' : ''}`}>
                    {activeTab === 'segregation' && (
                        <SegregationAnalysis
                            apiUrl={`${baseApiUrl}/api/segregation-analysis`}
                            refreshInterval={refreshInterval}
                            title="Segregation Analysis Dashboard"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;