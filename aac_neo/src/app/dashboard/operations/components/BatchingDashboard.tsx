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
import TempHardnessChart from './TempHardnessChart';
import BatchProgressTracker, { BatchProgressData } from './BatchProgressTracker';

// Define the type for our hardness data which doesn't exist in the original BatchData
interface BatchHardnessData {
    batchNo: number;
    mouldNo: number;
    rising: 'Ok' | 'OVER' | 'UNDER';
    temp: number;
    hardness: number;
    time: string;
}

const BatchingDashboard: React.FC = () => {
    // Original state management
    const [batchingData, setBatchingData] = useState<BatchData[]>(INITIAL_BATCH_DATA);
    const [isRealTimeActive, setIsRealTimeActive] = useState(false);
    const [alerts, setAlerts] = useState<Alert[]>([]);

    // New state for hardness data
    const [hardnessData, setHardnessData] = useState<BatchHardnessData[]>([
        { batchNo: 1520, mouldNo: 12, rising: 'Ok', temp: 70.1, hardness: 140, time: '6:34' },
        { batchNo: 1521, mouldNo: 15, rising: 'Ok', temp: 70, hardness: 145, time: '6:39' },
        { batchNo: 1522, mouldNo: 18, rising: 'Ok', temp: 70.2, hardness: 150, time: '6:43' },
        { batchNo: 1523, mouldNo: 22, rising: 'UNDER', temp: 72, hardness: 125, time: '6:34' },
        { batchNo: 1524, mouldNo: 21, rising: 'Ok', temp: 70.1, hardness: 135, time: '6:55' },
        { batchNo: 1525, mouldNo: 27, rising: 'OVER', temp: 67, hardness: 170, time: '7:08' },
        { batchNo: 1526, mouldNo: 32, rising: 'Ok', temp: 69.1, hardness: 150, time: '7:05' },
        { batchNo: 1527, mouldNo: 4, rising: 'Ok', temp: 70.2, hardness: 140, time: '7:11' }
    ]);

    const [batchProgressData] = useState<BatchProgressData[]>([
        {
            batchNo: 2001,
            mouldNo: 1,
            createdDate: '5/23/2025',
            stages: {
                'Batching': 'In Progress',
                'Ferry Cart': 'Pending',
                'Tilting': 'Pending',
                'Cutting': 'Pending',
                'Autoclave': 'Pending',
                'Segregation': 'Pending'
            }
        },
        {
            batchNo: 2002,
            mouldNo: 2,
            createdDate: '5/23/2025',
            stages: {
                'Batching': 'Completed',
                'Ferry Cart': 'In Progress',
                'Tilting': 'Pending',
                'Cutting': 'Pending',
                'Autoclave': 'Pending',
                'Segregation': 'Pending'
            }
        },
        {
            batchNo: 2003,
            mouldNo: 3,
            createdDate: '5/23/2025',
            stages: {
                'Batching': 'Completed',
                'Ferry Cart': 'Completed',
                'Tilting': 'In Progress',
                'Cutting': 'Pending',
                'Autoclave': 'Pending',
                'Segregation': 'Pending'
            }
        }
    ]);

    // Handler for editing a batch
    const handleBatchEdit = (batchNo: number) => {
        console.log(`Editing batch #${batchNo}`);
        // Your edit logic here
    };

    // Initialize lastDischargeTimeRef from the last batch in INITIAL_BATCH_DATA
    const getInitialDischargeTime = (): string | null => {
        if (INITIAL_BATCH_DATA.length === 0) return null;

        // Get the time from the last batch (assuming INITIAL_BATCH_DATA is already in chronological order)
        const lastBatch = INITIAL_BATCH_DATA[INITIAL_BATCH_DATA.length - 1];
        const lastTime = lastBatch.dischargeTime;

        // Add some minutes to ensure the next batch time is ahead
        const [hours, minutes] = lastTime.split(':').map(Number);
        let newMinutes = minutes + Math.floor(Math.random() * 16) + 5; // Add 5-20 minutes
        let newHours = hours;

        // Handle hour rollover
        if (newMinutes >= 60) {
            newHours = (newHours + Math.floor(newMinutes / 60)) % 24;
            newMinutes = newMinutes % 60;
        }

        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    };

    // Refs for proper cleanup and tracking last discharge time
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastDischargeTimeRef = useRef<string | null>(getInitialDischargeTime());

    // Get next batch number - simplified
    const getNextBatchNumber = useCallback(() => {
        return (batches: BatchData[]) => {
            return batches.length > 0
                ? Math.max(...batches.map(batch => batch.batchNo)) + 1
                : 1;
        };
    }, []);

    // Helper function to generate sequential discharge times - optimized
    const getNextDischargeTime = useCallback(() => {
        // If no previous time exists, start with a reasonable time
        if (!lastDischargeTimeRef.current) {
            const hours = Math.floor(Math.random() * 8) + 8; // Between 8AM and 4PM
            const minutes = Math.floor(Math.random() * 60);
            const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            lastDischargeTimeRef.current = time;
            return time;
        }

        // Parse the last time
        const [hours, minutes] = lastDischargeTimeRef.current.split(':').map(Number);

        // Add a random interval (5-20 minutes) to the last time
        let newMinutes = minutes + Math.floor(Math.random() * 16) + 5;
        let newHours = hours;

        // Handle hour rollover
        if (newMinutes >= 60) {
            newHours = (newHours + Math.floor(newMinutes / 60)) % 24;
            newMinutes = newMinutes % 60;
        }

        const time = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
        lastDischargeTimeRef.current = time;
        return time;
    }, []);

    // Alert creation and management - optimized with early returns
    const checkAndCreateAlerts = useCallback((batch: BatchData) => {
        const alertMessages = [];
        const alertId = `batch-${batch.batchNo}`;

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

        // Skip if no issues found
        if (alertMessages.length === 0) return;

        // Create a single consolidated alert
        const alertType = batch.dischargeTemp > 49 ? 'error' : 'warning';
        const alertMessage = `Batch ${batch.batchNo}: ${alertMessages.join(', ')}`;

        // Add new alert if it doesn't exist
        setAlerts(prevAlerts => {
            // Check if this exact alert already exists
            if (prevAlerts.some(alert => alert.id === alertId)) {
                return prevAlerts;
            }

            // Add new alert
            return [...prevAlerts, {
                id: alertId,
                message: alertMessage,
                type: alertType,
                timestamp: new Date()
            }];
        });
    }, []);

    // Helper function to generate random hardness data based on temperature
    const generateHardnessFromTemp = (temp: number): number => {
        // Strong negative correlation: as temp increases, hardness decreases
        // Base: 150mm at 70°C
        const deviation = Math.random() * 5 - 2.5; // Random variation ±2.5
        return Math.round(220 - temp * 1.5 + deviation);
    };

    // Helper function to determine rising status based on hardness
    const determineRisingStatus = (hardness: number): 'Ok' | 'OVER' | 'UNDER' => {
        if (hardness > 165) return 'OVER';
        if (hardness < 130) return 'UNDER';
        return 'Ok';
    };

    // Mock data generation for real-time simulation - optimized
    const addMockBatchData = useCallback((count = 1, overrides = {}) => {
        setBatchingData(prevData => {
            const results = [];
            const currentData = [...prevData]; // Create a copy to work with
            const newBatches: BatchData[] = [];

            for (let i = 0; i < count; i++) {
                const getNextBatch = getNextBatchNumber();
                const nextBatchNo = getNextBatch(currentData);
                const nextTime = getNextDischargeTime();

                // Generate realistic mock values with controlled variation
                const mockDischargeTemp = Math.random() > 0.75 ?
                    Math.floor(Math.random() * 3) + 49 : // Sometimes > 48 to trigger alert
                    Math.floor(Math.random() * 2) + 46;  // Normal range 46-47

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
                    dischargeTime: nextTime,
                    dischargeTemp: mockDischargeTemp,
                    ...overrides // Apply any custom overrides
                };

                // Check for duplicates
                const existingBatch = currentData.find(batch => batch.batchNo === mockBatch.batchNo);
                if (!existingBatch) {
                    currentData.push(mockBatch);
                    newBatches.push(mockBatch);
                    results.push({ success: true, data: mockBatch });

                    // Check and create alerts for the new batch
                    checkAndCreateAlerts(mockBatch);
                } else {
                    console.warn(`Failed to add mock batch ${i + 1}: Batch number ${mockBatch.batchNo} already exists`);
                    results.push({ success: false, error: `Batch number ${mockBatch.batchNo} already exists` });
                    break;
                }
            }

            // Generate hardness data for new batches
            if (newBatches.length > 0) {
                setHardnessData(prevHardnessData => {
                    const newHardnessData = newBatches.map(batch => {
                        // Generate simulated hardness and temperature values that are correlated
                        // For this example, we'll use a modified version of discharge temp as the "curing" temp
                        const curingTemp = batch.dischargeTemp + (Math.random() * 4 - 2); // ±2°C from discharge temp
                        const hardness = generateHardnessFromTemp(curingTemp);
                        const rising = determineRisingStatus(hardness);

                        return {
                            batchNo: batch.batchNo,
                            mouldNo: batch.mouldNo,
                            rising,
                            temp: curingTemp,
                            hardness,
                            time: batch.dischargeTime
                        };
                    });

                    // Keep only the latest 20 batches for the hardness chart
                    return [...newHardnessData, ...prevHardnessData].slice(0, 20);
                });
            }

            return currentData;
        });
    }, [getNextBatchNumber, getNextDischargeTime, checkAndCreateAlerts]);

    // Memoized calculations for better performance - optimized with guard clauses
    const metrics = useMemo((): Metrics => {
        if (batchingData.length === 0) return {
            totalBatches: 0,
            avgMixingTime: 0,
            avgDischargeTemp: 0,
            avgWaterUsage: 0,
            avgDischargeTime: '0:00'
        };

        const totalBatches = batchingData.length;

        // Calculate averages in a single pass through the data
        const sums = batchingData.reduce((acc, batch) => {
            const [hours, minutes] = batch.dischargeTime.split(':').map(Number);

            return {
                mixingTimeSum: acc.mixingTimeSum + batch.mixingTime,
                dischargeTempSum: acc.dischargeTempSum + batch.dischargeTemp,
                waterUsageSum: acc.waterUsageSum + batch.waterKg,
                dischargeTimeMinutesSum: acc.dischargeTimeMinutesSum + (hours * 60 + minutes)
            };
        }, {
            mixingTimeSum: 0,
            dischargeTempSum: 0,
            waterUsageSum: 0,
            dischargeTimeMinutesSum: 0
        });

        // Calculate average discharge time
        const avgDischargeTimeMinutes = sums.dischargeTimeMinutesSum / totalBatches;
        const avgDischargeTimeHours = Math.floor(avgDischargeTimeMinutes / 60);
        const avgDischargeTimeMinutesRemainder = Math.round(avgDischargeTimeMinutes % 60);

        return {
            totalBatches,
            avgMixingTime: sums.mixingTimeSum / totalBatches,
            avgDischargeTemp: sums.dischargeTempSum / totalBatches,
            avgWaterUsage: sums.waterUsageSum / totalBatches,
            avgDischargeTime: `${avgDischargeTimeHours}:${avgDischargeTimeMinutesRemainder.toString().padStart(2, '0')}`
        };
    }, [batchingData]);

    // Memoized chart data - optimized to reduce complexity
    const chartData = useMemo((): ChartData => {
        // Early return for empty data
        if (batchingData.length === 0) {
            return {
                trendData: [],
                materialComposition: [],
                tempCategories: { optimal: 0, acceptable: 0, high: 0 }
            };
        }

        // Trend data for line charts - simplified mapping
        const trendData = batchingData.map((batch, index) => ({
            batch: batch.batchNo,
            mixingTime: batch.mixingTime,
            dischargeTemp: batch.dischargeTemp,
            waterKg: batch.waterKg,
            dischargeTime: batch.dischargeTime,
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

        // Calculate all material sums in a single loop
        const materialSums = batchingData.reduce((sums, batch) => {
            sums.freshSlurry += batch.freshSlurryKg;
            sums.cement += batch.cementKg;
            sums.wasteSlurry += batch.wasteSlurryKg;
            sums.lime += batch.limeKg;
            sums.water += batch.waterKg;

            // Count temperature categories in the same loop
            if (batch.dischargeTemp <= 47) sums.tempOptimal++;
            else if (batch.dischargeTemp <= 48) sums.tempAcceptable++;
            else sums.tempHigh++;

            return sums;
        }, {
            freshSlurry: 0,
            cement: 0,
            wasteSlurry: 0,
            lime: 0,
            water: 0,
            tempOptimal: 0,
            tempAcceptable: 0,
            tempHigh: 0
        });

        // Material composition for pie chart
        const materialComposition = [
            { name: 'Fresh Slurry', value: materialSums.freshSlurry, color: '#8884d8' },
            { name: 'Cement', value: materialSums.cement, color: '#82ca9d' },
            { name: 'Waste Slurry', value: materialSums.wasteSlurry, color: '#ffc658' },
            { name: 'Lime', value: materialSums.lime, color: '#ff7c7c' },
            { name: 'Water', value: materialSums.water, color: '#8dd1e1' }
        ];

        return {
            trendData,
            materialComposition,
            tempCategories: {
                optimal: materialSums.tempOptimal,
                acceptable: materialSums.tempAcceptable,
                high: materialSums.tempHigh
            }
        };
    }, [batchingData]);

    // Alert management
    const dismissAllAlerts = useCallback(() => {
        setAlerts([]);
    }, []);

    // Real-time toggle functionality - improved with proper cleanup
    const toggleRealTime = useCallback(() => {
        setIsRealTimeActive(prevState => {
            const newState = !prevState;

            // Stop real-time mode if it was active
            if (!newState && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            // Start real-time mode if it wasn't active
            if (newState && !intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    addMockBatchData(1);
                }, 5000);
            }

            return newState;
        });
    }, [addMockBatchData]);

    // Cleanup intervals on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-100 px-4 py-4 md:py-4">
            {/* Fixed Header and Alert Section */}
            <div className="flex-none">
                {/* Header */}
                <Header
                    isRealTimeActive={isRealTimeActive}
                    onToggleRealTime={toggleRealTime}
                />

                {/* Alert Banner */}
                <AlertBanner
                    alerts={alerts}
                    onDismissAll={dismissAllAlerts}
                />
            </div>

            {/* Scrollable Content Section */}
            <div className="flex-grow overflow-y-auto scrollbar-hide ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* KPI Cards */}
                    <div>
                        <KPICards metrics={metrics} />
                        <BatchProgressTracker
                            batches={batchProgressData}
                            onBatchEdit={handleBatchEdit} />
                        <TempHardnessChart data={hardnessData} />
                    </div>

                    {/* Raw Material Receipts and Order Dispatch stacked */}
                    <div className="flex flex-col space-y-6">
                        <OrderDispatch />
                        <RawMaterialReceipts />
                    </div>
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
        </div>
    );
};

export default BatchingDashboard;