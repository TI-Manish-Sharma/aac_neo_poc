'use client';
// components/BatchingDashboard.tsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { BatchData, Alert, Metrics, ChartData, PARAMETER_RANGES, INITIAL_BATCH_DATA } from '../types/batch';
import AlertBanner from './AlertBanner';
import Header from './Header';
import KPICards from './KPICards';
import ChartsGrid from './ChartsGrid';
import BatchTable from './BatchTable';
import ProcessInsights from './ProcessInsights';
import RawMaterialReceipts from './RawMaterialReceipts';
import OrderDispatch from './OrderDispatch';

const BatchingDashboard: React.FC = () => {
    // State management
    const [batchingData, setBatchingData] = useState<BatchData[]>(INITIAL_BATCH_DATA);
    const [isRealTimeActive, setIsRealTimeActive] = useState(false);
    const [alerts, setAlerts] = useState<Alert[]>([]);

    // Refs for proper cleanup
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Helper function to generate random discharge time
    const generateRandomTime = useCallback(() => {
        const hour = Math.floor(Math.random() * 4) + 4; // 4-7 hours
        const minute = Math.floor(Math.random() * 60); // 0-59 minutes
        return `${hour}:${minute.toString().padStart(2, '0')}`;
    }, []);

    // Get next batch number
    const getNextBatchNumber = useCallback(() => {
        return (prevData: BatchData[]) => {
            const maxBatchNo = Math.max(...prevData.map(batch => batch.batchNo));
            return maxBatchNo + 1;
        };
    }, []);

    // Alert creation and management
    const checkAndCreateAlerts = useCallback((batch: BatchData) => {
        const alertMessages = [];

        // Check discharge temperature
        if (batch.dischargeTemp > PARAMETER_RANGES.dischargeTemp.max) {
            alertMessages.push(`High discharge temperature: ${batch.dischargeTemp}°C (max: ${PARAMETER_RANGES.dischargeTemp.max}°C)`);
        }

        // Check mixing time
        if (batch.mixingTime < PARAMETER_RANGES.mixingTime.min || batch.mixingTime > PARAMETER_RANGES.mixingTime.max) {
            alertMessages.push(`Mixing time out of range: ${batch.mixingTime}m (range: ${PARAMETER_RANGES.mixingTime.min}-${PARAMETER_RANGES.mixingTime.max}m)`);
        }

        // Check water usage
        if (batch.waterKg < PARAMETER_RANGES.waterKg.min || batch.waterKg > PARAMETER_RANGES.waterKg.max) {
            alertMessages.push(`Water usage out of range: ${batch.waterKg}kg (range: ${PARAMETER_RANGES.waterKg.min}-${PARAMETER_RANGES.waterKg.max}kg)`);
        }

        // Create a single consolidated alert if any issues found
        if (alertMessages.length > 0) {
            const alertType = batch.dischargeTemp > 49 ? 'error' : 'warning';
            const alertId = `batch-${batch.batchNo}`;
            const alertMessage = `Batch ${batch.batchNo}: ${alertMessages.join(', ')}`;

            // Check if this exact alert already exists
            setAlerts(prevAlerts => {
                const existingAlert = prevAlerts.find(alert => alert.id === alertId);
                if (existingAlert) {
                    // Alert already exists, don't add duplicate
                    return prevAlerts;
                }

                // Add new alert (without automatic timeout removal)
                const newAlert: Alert = {
                    id: alertId,
                    message: alertMessage,
                    type: alertType,
                    timestamp: new Date()
                };

                return [...prevAlerts, newAlert];
            });
        }
    }, []);

    // Manual alert dismissal function

    // Mock data generation for real-time simulation
    const addMockBatchData = useCallback((count = 1, overrides = {}) => {
        setBatchingData(prevData => {
            const results = [];
            let currentData = prevData;

            for (let i = 0; i < count; i++) {
                const getNextBatch = getNextBatchNumber();
                const nextBatchNo = getNextBatch(currentData);

                // Generate realistic mock values with controlled variation
                const mockBatch: BatchData = {
                    batchNo: nextBatchNo,
                    mouldNo: Math.floor(Math.random() * 35) + 1, // 1-35
                    freshSlurryKg: Math.floor(Math.random() * 20) + 2390, // 2390-2410
                    wasteSlurryKg: 300,
                    cementKg: Math.floor(Math.random() * 15) + 335, // 335-350
                    limeKg: Math.floor(Math.random() * 15) + 190, // 190-205
                    gypsumKg: 25,
                    aluminumPowderGm: 1230,
                    dcPowderGm: 15,
                    // Create some out-of-range values occasionally to trigger alerts
                    waterKg: Math.random() > 0.8 ?
                        Math.floor(Math.random() * 20) + 130 : // Sometimes > 125 to trigger alert
                        Math.floor(Math.random() * 50) + 70,   // Normal range 70-120
                    soluOilLitre: 3,
                    mixingTime: Math.random() > 0.85 ?
                        Number((Math.random() * 0.5 + 3.3).toFixed(2)) : // Sometimes > 3.2 to trigger alert
                        Number((Math.random() * 0.6 + 2.5).toFixed(2)),  // Normal range 2.5-3.1
                    dischargeTime: generateRandomTime(),
                    dischargeTemp: Math.random() > 0.75 ?
                        Math.floor(Math.random() * 3) + 49 : // Sometimes > 48 to trigger alert
                        Math.floor(Math.random() * 2) + 46,  // Normal range 46-47
                    ...overrides // Apply any custom overrides
                };

                // Check for duplicates
                const existingBatch = currentData.find(batch => batch.batchNo === mockBatch.batchNo);
                if (!existingBatch) {
                    currentData = [...currentData, mockBatch];
                    results.push({ success: true, data: mockBatch });

                    // Check and create alerts for the new batch
                    checkAndCreateAlerts(mockBatch);
                } else {
                    console.warn(`Failed to add mock batch ${i + 1}: Batch number ${mockBatch.batchNo} already exists`);
                    results.push({ success: false, error: `Batch number ${mockBatch.batchNo} already exists` });
                    break;
                }
            }

            return currentData;
        });
    }, [getNextBatchNumber, generateRandomTime, checkAndCreateAlerts]);

    // Memoized calculations for better performance
    const metrics = useMemo((): Metrics => {
        if (batchingData.length === 0) return {
            totalBatches: 0,
            avgMixingTime: 0,
            avgDischargeTemp: 0,
            avgWaterUsage: 0,
            avgDischargeTime: '0:00'
        };

        const totalBatches = batchingData.length;
        const avgMixingTime = batchingData.reduce((sum, batch) => sum + batch.mixingTime, 0) / totalBatches;
        const avgDischargeTemp = batchingData.reduce((sum, batch) => sum + batch.dischargeTemp, 0) / totalBatches;
        const avgWaterUsage = batchingData.reduce((sum, batch) => sum + batch.waterKg, 0) / totalBatches;

        // Calculate average discharge time
        const avgDischargeTime = (() => {
            const totalMinutes = batchingData.reduce((sum, batch) => {
                const [hours, minutes] = batch.dischargeTime.split(':').map(Number);
                return sum + (hours * 60 + minutes);
            }, 0);
            const avgMinutes = totalMinutes / totalBatches;
            const hours = Math.floor(avgMinutes / 60);
            const mins = Math.round(avgMinutes % 60);
            return `${hours}:${mins.toString().padStart(2, '0')}`;
        })();

        return {
            totalBatches,
            avgMixingTime,
            avgDischargeTemp,
            avgWaterUsage,
            avgDischargeTime
        };
    }, [batchingData]);

    // Memoized chart data
    const chartData = useMemo((): ChartData => {
        // Trend data for line charts
        const trendData = batchingData.map((batch, index) => ({
            batch: batch.batchNo,
            mixingTime: batch.mixingTime,
            dischargeTemp: batch.dischargeTemp,
            waterKg: batch.waterKg,
            freshSlurryKg: batch.freshSlurryKg,
            wasteSlurryKg: batch.wasteSlurryKg,
            cementKg: batch.cementKg,
            limeKg: batch.limeKg,
            gypsumKg: batch.gypsumKg,
            aluminumPowderGm: batch.aluminumPowderGm,
            dcPowderGm: batch.dcPowderGm,
            soluOilLitre: batch.soluOilLitre,
            sequence: index + 1
        }));

        // Material composition for pie chart
        const materialComposition = [
            { name: 'Fresh Slurry', value: batchingData.reduce((sum, batch) => sum + batch.freshSlurryKg, 0), color: '#8884d8' },
            { name: 'Cement', value: batchingData.reduce((sum, batch) => sum + batch.cementKg, 0), color: '#82ca9d' },
            { name: 'Waste Slurry', value: batchingData.reduce((sum, batch) => sum + batch.wasteSlurryKg, 0), color: '#ffc658' },
            { name: 'Lime', value: batchingData.reduce((sum, batch) => sum + batch.limeKg, 0), color: '#ff7c7c' },
            { name: 'Water', value: batchingData.reduce((sum, batch) => sum + batch.waterKg, 0), color: '#8dd1e1' }
        ];

        // Temperature categories
        const tempCategories = batchingData.reduce((acc, batch) => {
            if (batch.dischargeTemp <= 47) acc.optimal++;
            else if (batch.dischargeTemp <= 48) acc.acceptable++;
            else acc.high++;
            return acc;
        }, { optimal: 0, acceptable: 0, high: 0 });

        return {
            trendData,
            materialComposition,
            tempCategories
        };
    }, [batchingData]);

    // Alert management - now only manual dismissal
    const dismissAllAlerts = useCallback(() => {
        setAlerts([]);
    }, []);

    // Real-time toggle functionality
    const toggleRealTime = useCallback(() => {
        if (isRealTimeActive) {
            // Stop real-time mode
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setIsRealTimeActive(false);
        } else {
            // Start real-time mode
            setIsRealTimeActive(true);
            intervalRef.current = setInterval(() => {
                addMockBatchData(1);
            }, 5000);
        }
    }, [isRealTimeActive, addMockBatchData]);

    // Cleanup intervals on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-4 md:py-8 overflow-hidden bg-100">
            {/* Main content with proper top padding */}
            {/* Header */}
            <Header
                isRealTimeActive={isRealTimeActive}
                onToggleRealTime={toggleRealTime}
            />

            {/* KPI Cards */}
            <KPICards metrics={metrics} />

            {/* Alert Banner */}
            <AlertBanner
                alerts={alerts}
                onDismissAll={dismissAllAlerts}
            />

            {/* New Components - Raw Material Receipts and Order Dispatch */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <RawMaterialReceipts />
                <OrderDispatch />
            </div>
            {/* Charts Grid */}
            <ChartsGrid
                chartData={chartData}
                metrics={metrics}
            />

            {/* Batch Details Table */}
            <BatchTable
                batchData={batchingData}
                displayCount={8}
            />

            {/* Process Insights */}
            <ProcessInsights
                batchData={batchingData}
                metrics={metrics}
                tempCategories={chartData.tempCategories}
            />
        </div>
    );
};

export default BatchingDashboard;