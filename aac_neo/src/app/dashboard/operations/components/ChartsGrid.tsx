// components/ChartsGrid.tsx
import React from 'react';
import { ChartData, Metrics } from '../types/batch';
import ProcessTrendsChart from './ProcessTrendsChart';
import MaterialCompositionChart from './MaterialCompositionChart';
import MaterialConsumptionChart from './MaterialConsumptionChart';
import TemperatureDistributionCard from './TemperatureDistributionCard';

interface ChartsGridProps {
    chartData: ChartData;
    metrics: Metrics;
}

const ChartsGrid: React.FC<ChartsGridProps> = ({ chartData, metrics }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Process Trends */}
            <ProcessTrendsChart data={chartData.trendData} />

            {/* Material Composition */}
            <MaterialCompositionChart data={chartData.materialComposition} />

            {/* Material Consumption by Batch */}
            <MaterialConsumptionChart data={chartData.trendData.slice(-10)} />

            {/* Temperature Distribution */}
            <TemperatureDistributionCard
                tempCategories={chartData.tempCategories}
                totalBatches={metrics.totalBatches}
            />
        </div>
    );
};

export default ChartsGrid;