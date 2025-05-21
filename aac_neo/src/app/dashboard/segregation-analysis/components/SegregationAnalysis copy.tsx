import React, { useState } from 'react';
import { useSegregationAnalysis } from '../hooks/useSegregationAnalysis';
import SegregationFilters from './SegregationFilters';
import DefectsByTypeChart from './DefectsByTypeChart';
import SegregationTable from './SegregationTable';
import DefectsByPositionChart from './DefectsByPositionChart';
import MouldPerformanceChart from './MouldPerformanceChart';
import WorstBatchesTable from './WorstBatchesTable';
import RecommendationsPanel from './RecommendationsPanel';
import { ErrorState } from '../../shared/components/ErrorState';
import { NoDataState } from '../../shared/components/NoDataState';
import { Header } from '../../shared/components/Header';
import LoadingIndicator from '../../shared/components/LoadingIndicator';
import { ErrorBanner } from '../../shared/components/ErrorBanner';
import { KPISummary } from './KPISummary';
import { Filter } from 'lucide-react';

interface SegregationAnalysisProps {
    apiUrl?: string;
    refreshInterval?: number;
    title?: string;
}

const SegregationAnalysis: React.FC<SegregationAnalysisProps> = ({
    apiUrl = '/dashboard/segregation-analysis/api/segregation',
    refreshInterval = 0, // 0 means no auto-refresh
    title = 'Segregation Analysis Dashboard'
}) => {
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    // Use the custom hook to handle data fetching and state management
    const {
        data,
        isLoading,
        error,
        lastUpdated,
        filters,
        activeTab,
        handleApplyFilters,
        handleTabChange,
        handleRefresh,
        updateStartDate,
        updateEndDate,
        updateMouldId,
        exportToCSV
    } = useSegregationAnalysis(apiUrl, refreshInterval);

    // Show loading state
    if (isLoading && !data) {
        return <LoadingIndicator message="Loading segregation data..." />;
    }

    // Show error state
    if (error && !data) {
        return <ErrorState error={error} onRetry={handleRefresh} apiUrl={apiUrl} />;
    }

    // If we have no data but no error either
    if (!data) {
        return <NoDataState onRefresh={handleRefresh} />;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <Header
                title={title}
                lastUpdated={lastUpdated}
                isLoading={isLoading}
                onRefresh={handleRefresh}
            >
                <button
                    onClick={toggleFilters}
                    className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200">
                    <Filter size={16} className="mr-2" />
                    <span>Filters</span>
                </button>
                <button
                    onClick={exportToCSV}
                    className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    Export
                </button>
            </Header>

            {/* Show error banner if we've encountered an error but have previous data */}
            {error && <ErrorBanner message={error} />}

            {/* Filters */}
            {showFilters && (<SegregationFilters
                filters={filters}
                onStartDateChange={updateStartDate}
                onEndDateChange={updateEndDate}
                onMouldIdChange={updateMouldId}
                onApplyFilters={handleApplyFilters}
                isLoading={isLoading}
            />)}

            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex flex-wrap -mb-px">
                    <button
                        onClick={() => handleTabChange('overview')}
                        className={`mr-4 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ease-out ${activeTab === 'overview'
                            ? 'border-cyan-500 text-cyan-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        aria-current={activeTab === 'overview' ? 'page' : undefined}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => handleTabChange('defect-types')}
                        className={`mr-4 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ease-out ${activeTab === 'defect-types'
                            ? 'border-cyan-500 text-cyan-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        aria-current={activeTab === 'defect-types' ? 'page' : undefined}
                    >
                        Defect Types
                    </button>
                    <button
                        onClick={() => handleTabChange('positions')}
                        className={`mr-4 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ease-out ${activeTab === 'positions'
                            ? 'border-cyan-500 text-cyan-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        aria-current={activeTab === 'positions' ? 'page' : undefined}
                    >
                        Position Analysis
                    </button>
                    <button
                        onClick={() => handleTabChange('moulds')}
                        className={`mr-4 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ease-out ${activeTab === 'moulds'
                            ? 'border-cyan-500 text-cyan-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        aria-current={activeTab === 'moulds' ? 'page' : undefined}
                    >
                        Mould Performance
                    </button>
                    <button
                        onClick={() => handleTabChange('batches')}
                        className={`mr-4 py-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ease-out ${activeTab === 'batches'
                            ? 'border-cyan-500 text-cyan-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        aria-current={activeTab === 'batches' ? 'page' : undefined}
                    >
                        Worst Batches
                    </button>
                </nav>
            </div>

            {/* KPI Summary - only shown on overview tab */}
            {activeTab === 'overview' && <KPISummary metrics={data.summary} />}

            {/* Recommendations Panel - only shown on overview tab */}
            {activeTab === 'overview' && <RecommendationsPanel data={data} />}

            {/* Tab Content */}
            <div className="space-y-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <DefectsByTypeChart data={data.defectsByType} />
                        <DefectsByPositionChart data={data.defectsByPosition} />
                    </div>
                )}

                {/* Defect Types Tab */}
                {activeTab === 'defect-types' && (
                    <div className="space-y-6">
                        <DefectsByTypeChart data={data.defectsByType} detailed={true} />
                        <SegregationTable
                            data={data.defectsByType}
                            columns={[
                                { key: 'type', header: 'Defect Type' },
                                { key: 'count', header: 'Count' },
                                { key: 'percentage', header: 'Percentage' }
                            ]}
                            title="Defect Types Details"
                        />
                    </div>
                )}

                {/* Position Analysis Tab */}
                {activeTab === 'positions' && (
                    <div className="space-y-6">
                        <DefectsByPositionChart data={data.defectsByPosition} detailed={true} />
                        <SegregationTable
                            data={data.defectsByPosition.map((pos: { position: string; rainCracksCuts: number; cornerCracksCuts: number; cornerDamage: number; chippedBlocks: number; total: number; percentage: number }) => ({
                                position: pos.position,
                                rainCracksCuts: pos.rainCracksCuts,
                                cornerCracksCuts: pos.cornerCracksCuts,
                                cornerDamage: pos.cornerDamage,
                                chippedBlocks: pos.chippedBlocks,
                                total: pos.total,
                                percentage: pos.percentage
                            }))}
                            columns={[
                                { key: 'position', header: 'Position' },
                                { key: 'rainCracksCuts', header: 'Rain Cracks/Cuts' },
                                { key: 'cornerCracksCuts', header: 'Corner Cracks/Cuts' },
                                { key: 'cornerDamage', header: 'Corner Damage' },
                                { key: 'chippedBlocks', header: 'Chipped Blocks' },
                                { key: 'total', header: 'Total' },
                                { key: 'percentage', header: 'Percentage' }
                            ]}
                            title="Position Details"
                        />
                    </div>
                )}

                {/* Mould Performance Tab */}
                {activeTab === 'moulds' && (
                    <div className="space-y-6">
                        <MouldPerformanceChart data={data.mouldPerformance} />
                        <SegregationTable
                            data={data.mouldPerformance.map((mould: { mouldId: string; totalBatches: number; totalDefects: number; averageDefectsPerBatch: number }) => ({
                                mouldId: mould.mouldId,
                                totalBatches: mould.totalBatches,
                                totalDefects: mould.totalDefects,
                                averageDefectsPerBatch: mould.averageDefectsPerBatch
                            }))}
                            columns={[
                                { key: 'mouldId', header: 'Mould ID' },
                                { key: 'totalBatches', header: 'Total Batches' },
                                { key: 'totalDefects', header: 'Total Defects' },
                                { key: 'averageDefectsPerBatch', header: 'Avg. Defects/Batch' }
                            ]}
                            title="Mould Performance Details"
                            rowClassNameFn={(row) => {
                                const defectsPerBatch = row.averageDefectsPerBatch as number;
                                if (defectsPerBatch > 20) return 'bg-red-50';
                                if (defectsPerBatch > 10) return 'bg-yellow-50';
                                return '';
                            }}
                        />
                    </div>
                )}

                {/* Worst Batches Tab */}
                {activeTab === 'batches' && (
                    <div className="space-y-6">
                        <WorstBatchesTable data={data.worstBatches} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SegregationAnalysis;