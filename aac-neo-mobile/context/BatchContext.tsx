import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Types that match the MongoDB schema
export interface BatchMaterials {
    freshSlurry: number;
    wasteSlurry: number;
    cement: number;
    lime: number;
    gypsum: number;
    aluminumPowder: number;
    dcPowder: number;
    water: number;
    solutionOil: number;
}

export interface BatchProcess {
    mixingTime: number;
    dischargeTime: string;
    dischargeTemp: number;
}

export interface FerryCartMeasurements {
    flow: number;
    temp: number;
    height: number;
    time: string;
}

export interface TiltingCraneMeasurements {
    risingQuality: string;
    temp: number;
    time: string;
    hardness: number;
}

export interface CuttingData {
    cuttingTime: string;
    blockSize: string;
    tiltingCraneRejection: number | null;
    chippingRejection: number | null;
    sideCutterRejection: number | null;
    joinedRejection: number | null;
    trimmingRejection: number | null;
    wireBrokenHC: number | null;
    wireBrokenVC: number | null;
    rejectedDueToHC: number | null;
    rejectedDueToVC: number | null;
    dimensionCheck: any | null;
}

export interface DefectData {
    rainCracksCuts: number;
    cornerCracksCuts: number;
    cornerDamage: number;
    chippedBlocks: number;
}

export interface SegregationData {
    shift: string;
    totalBlocks: number;
    size: string;
    defects: {
        [key: string]: DefectData;
    };
    totalDefects: number;
}

export interface BatchProcessSteps {
    batching: {
        shift: string;
        materials: BatchMaterials;
        process: BatchProcess;
    };
    ferryCarts: {
        shift: string;
        measurements: FerryCartMeasurements;
    };
    tiltingCrane: {
        shift: string;
        measurements: TiltingCraneMeasurements;
    };
    cutting: CuttingData;
    autoclave?: {
        autoclaveNumber: string;
        shift: string;
        processedAt: string;
        doorOpenTime: string;
    };
    segregation: SegregationData;
}

export interface BatchRecord {
    _id: string;
    batchId: string;
    mouldId: string;
    status: 'In Progress' | 'Completed' | 'Pending';
    date: string;
    processSteps: BatchProcessSteps;
    metadata: {
        createdAt: string;
        updatedAt: string;
        createdBy: string;
    };
}

export interface AutoclaveRecord {
    _id: string;
    autoclaveId: number;
    shift: string;
    batchesProcessed: string; // Comma separated batch IDs
    previousDoorOpenTime: string;
    previousDoorOpenPressure: number | null;
    doorCloseTime: string;
    doorClosePressure: number;
    vacuumFinishTime: string;
    vacuumFinishPressure: number;
    slowSteamStartTime: string;
    slowSteamStartPressure: number | null;
    fastSteamStartTime: string;
    fastSteamStartPressure: number | null;
    maxPressureTime: string;
    maxPressure: number;
    releaseStartTime: string;
    releaseStartPressure: number;
    doorOpenTime: string;
    doorOpenPressure: number;
    doorCloseDuration: string;
    vacuumFinishDuration: string;
    slowSteamDuration: string | null;
    fastSteamDuration: string | null;
    maxPressureDuration: string;
    releaseStartDuration: string;
    doorOpenDuration: string;
}

// For UI status tracking (to maintain compatibility with existing UI)
export type BatchStageStatus = 'completed' | 'in-progress' | 'pending';

export interface BatchStages {
    batching: BatchStageStatus;
    ferryCart: BatchStageStatus;
    tilting: BatchStageStatus;
    cutting: BatchStageStatus;
    autoclave: BatchStageStatus;
    segregation: BatchStageStatus;
}

// Define what will be in our context
type BatchContextType = {
    batches: BatchRecord[];
    setBatches: React.Dispatch<React.SetStateAction<BatchRecord[]>>;
    autoclaves: AutoclaveRecord[];
    setAutoclaves: React.Dispatch<React.SetStateAction<AutoclaveRecord[]>>;
    addBatch: (batch: BatchRecord) => void;
    addAutoclave: (autoclave: AutoclaveRecord) => void;
    getBatchById: (id: string) => BatchRecord | undefined;
    getAutoclaveById: (id: number) => AutoclaveRecord | undefined;
    getAutoclavesByBatchId: (batchId: string) => AutoclaveRecord | undefined;
    updateBatchStatus: (batchId: string, status: 'In Progress' | 'Completed' | 'Pending') => void;
    updateBatchStage: (batchId: string, stageName: keyof BatchStages, stageStatus: BatchStageStatus) => void;
    isLoading: boolean;
    // Function to get UI-compatible batch stages from MongoDB-style batch
    getBatchStages: (batch: BatchRecord) => BatchStages;
    // Function to get batches by status for UI display
    getBatchesByStatus: (status: 'In Progress' | 'Completed' | 'Pending') => BatchRecord[];
    // Function to convert BatchRecord to UI-compatible batch format
    convertToUiBatch: (batchRecord: BatchRecord) => UiBatch;
    // Function to get batches by stage and status
    getBatchesByStage: (stageName: keyof BatchStages, stageStatus: BatchStageStatus) => BatchRecord[];
    // Function to get all batches in UI-compatible format
    getAllBatches: () => UiBatch[];
};

// UI-compatible batch format (used in existing screens)
export interface UiBatch {
    id: string;
    batchNumber: string;
    mouldNumber: string;
    createdAt: string;
    status: 'in-progress' | 'completed' | 'pending';
    stages: BatchStages;
}

// Create the context with a default empty state
const BatchContext = createContext<BatchContextType>({
    batches: [],
    setBatches: () => { },
    autoclaves: [],
    setAutoclaves: () => { },
    addBatch: () => { },
    addAutoclave: () => { },
    getBatchById: () => undefined,
    getAutoclaveById: () => undefined,
    getAutoclavesByBatchId: () => undefined,
    updateBatchStatus: () => { },
    updateBatchStage: () => { },
    isLoading: true,
    getBatchStages: () => ({
        batching: 'pending',
        ferryCart: 'pending',
        tilting: 'pending',
        cutting: 'pending',
        autoclave: 'pending',
        segregation: 'pending',
    }),
    getBatchesByStatus: () => [],
    convertToUiBatch: () => ({
        id: '',
        batchNumber: '',
        mouldNumber: '',
        createdAt: '',
        status: 'pending',
        stages: {
            batching: 'pending',
            ferryCart: 'pending',
            tilting: 'pending',
            cutting: 'pending',
            autoclave: 'pending',
            segregation: 'pending',
        }
    }),
    getBatchesByStage: () => [],
    getAllBatches: () => [],
});

export const BatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [batches, setBatches] = useState<BatchRecord[]>([]);
    const [autoclaves, setAutoclaves] = useState<AutoclaveRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load initial data when the component mounts
    useEffect(() => {
        // In a real app, you would fetch this data from an API
        // For now, we'll use mock data that matches your MongoDB schema
        const loadInitialData = async () => {
            try {
                // Simulate API call delay
                await new Promise((resolve) => setTimeout(resolve, 500));

                // Mock batches data with detailed stage information based on your MongoDB schema
                const mockBatches: BatchRecord[] = [
                    {
                        _id: "batch_1520_20250409",
                        batchId: "1520",
                        mouldId: "3",
                        status: "Completed",
                        date: "2025-04-09",
                        processSteps: {
                            batching: {
                                shift: "Day",
                                materials: {
                                    freshSlurry: 2395,
                                    wasteSlurry: 300,
                                    cement: 340,
                                    lime: 205,
                                    gypsum: 25,
                                    aluminumPowder: 1230,
                                    dcPowder: 15,
                                    water: 110,
                                    solutionOil: 3
                                },
                                process: {
                                    mixingTime: 2.8,
                                    dischargeTime: "22:42",
                                    dischargeTemp: 47
                                }
                            },
                            ferryCarts: {
                                shift: "Day",
                                measurements: {
                                    flow: 17,
                                    temp: 46,
                                    height: 290,
                                    time: "22:46"
                                }
                            },
                            tiltingCrane: {
                                shift: "Day",
                                measurements: {
                                    risingQuality: "Ok",
                                    temp: 70.1,
                                    time: "01:13",
                                    hardness: 140
                                }
                            },
                            cutting: {
                                cuttingTime: "01:17",
                                blockSize: "600x200x100",
                                tiltingCraneRejection: null,
                                chippingRejection: null,
                                sideCutterRejection: null,
                                joinedRejection: null,
                                trimmingRejection: null,
                                wireBrokenHC: null,
                                wireBrokenVC: null,
                                rejectedDueToHC: null,
                                rejectedDueToVC: null,
                                dimensionCheck: null
                            },
                            segregation: {
                                shift: "Day",
                                totalBlocks: 252,
                                size: "600X200X150MM",
                                defects: {
                                    "1": {
                                        rainCracksCuts: 1,
                                        cornerCracksCuts: 0,
                                        cornerDamage: 0,
                                        chippedBlocks: 0
                                    },
                                    "2": {
                                        rainCracksCuts: 3,
                                        cornerCracksCuts: 0,
                                        cornerDamage: 0,
                                        chippedBlocks: 0
                                    },
                                    "3": {
                                        rainCracksCuts: 3,
                                        cornerCracksCuts: 0,
                                        cornerDamage: 0,
                                        chippedBlocks: 0
                                    },
                                    "4": {
                                        rainCracksCuts: 5,
                                        cornerCracksCuts: 0,
                                        cornerDamage: 3,
                                        chippedBlocks: 0
                                    },
                                    "5": {
                                        rainCracksCuts: 3,
                                        cornerCracksCuts: 0,
                                        cornerDamage: 0,
                                        chippedBlocks: 3
                                    },
                                    "6": {
                                        rainCracksCuts: 3,
                                        cornerCracksCuts: 0,
                                        cornerDamage: 2,
                                        chippedBlocks: 0
                                    }
                                },
                                totalDefects: 26
                            }
                        },
                        metadata: {
                            createdAt: "2025-04-09T06:18:45.461Z",
                            updatedAt: "2025-04-09T06:18:45.461Z",
                            createdBy: "migration_script"
                        }
                    },
                    {
                        _id: "batch_1521_20250409",
                        batchId: "1521",
                        mouldId: "4",
                        status: "In Progress",
                        date: "2025-04-09",
                        processSteps: {
                            batching: {
                                shift: "Day",
                                materials: {
                                    freshSlurry: 2400,
                                    wasteSlurry: 305,
                                    cement: 345,
                                    lime: 210,
                                    gypsum: 28,
                                    aluminumPowder: 1235,
                                    dcPowder: 16,
                                    water: 115,
                                    solutionOil: 3.2
                                },
                                process: {
                                    mixingTime: 2.9,
                                    dischargeTime: "23:15",
                                    dischargeTemp: 48
                                }
                            },
                            ferryCarts: {
                                shift: "Day",
                                measurements: {
                                    flow: 18,
                                    temp: 47,
                                    height: 295,
                                    time: "23:20"
                                }
                            },
                            tiltingCrane: {
                                shift: "Day",
                                measurements: {
                                    risingQuality: "Ok",
                                    temp: 71.2,
                                    time: "01:45",
                                    hardness: 142
                                }
                            },
                            cutting: {
                                cuttingTime: "01:50",
                                blockSize: "600x200x100",
                                tiltingCraneRejection: null,
                                chippingRejection: null,
                                sideCutterRejection: null,
                                joinedRejection: null,
                                trimmingRejection: null,
                                wireBrokenHC: null,
                                wireBrokenVC: null,
                                rejectedDueToHC: null,
                                rejectedDueToVC: null,
                                dimensionCheck: null
                            },
                            segregation: {
                                shift: "Day",
                                totalBlocks: 0, // Not completed yet
                                size: "600X200X150MM",
                                defects: {},
                                totalDefects: 0
                            }
                        },
                        metadata: {
                            createdAt: "2025-04-09T07:20:33.128Z",
                            updatedAt: "2025-04-09T07:20:33.128Z",
                            createdBy: "migration_script"
                        }
                    },
                    {
                        _id: "batch_1522_20250409",
                        batchId: "1522",
                        mouldId: "5",
                        status: "In Progress",
                        date: "2025-04-09",
                        processSteps: {
                            batching: {
                                shift: "Night",
                                materials: {
                                    freshSlurry: 2350,
                                    wasteSlurry: 290,
                                    cement: 335,
                                    lime: 200,
                                    gypsum: 22,
                                    aluminumPowder: 1225,
                                    dcPowder: 14,
                                    water: 105,
                                    solutionOil: 2.8
                                },
                                process: {
                                    mixingTime: 2.7,
                                    dischargeTime: "01:30",
                                    dischargeTemp: 46
                                }
                            },
                            ferryCarts: {
                                shift: "Night",
                                measurements: {
                                    flow: 16,
                                    temp: 45,
                                    height: 285,
                                    time: "01:35",
                                }
                            },
                            tiltingCrane: {
                                shift: "Night",
                                measurements: {
                                    risingQuality: "",
                                    temp: 0,
                                    time: "",
                                    hardness: 0
                                }
                            },
                            cutting: {
                                cuttingTime: "",
                                blockSize: "600x200x100",
                                tiltingCraneRejection: null,
                                chippingRejection: null,
                                sideCutterRejection: null,
                                joinedRejection: null,
                                trimmingRejection: null,
                                wireBrokenHC: null,
                                wireBrokenVC: null,
                                rejectedDueToHC: null,
                                rejectedDueToVC: null,
                                dimensionCheck: null
                            },
                            segregation: {
                                shift: "",
                                totalBlocks: 0,
                                size: "",
                                defects: {},
                                totalDefects: 0
                            }
                        },
                        metadata: {
                            createdAt: "2025-04-09T08:30:12.895Z",
                            updatedAt: "2025-04-09T08:30:12.895Z",
                            createdBy: "migration_script"
                        }
                    },
                    {
                        _id: "batch_1523_20250410",
                        batchId: "1523",
                        mouldId: "6",
                        status: "In Progress",
                        date: "2025-04-10",
                        processSteps: {
                            batching: {
                                shift: "Day",
                                materials: {
                                    freshSlurry: 2380,
                                    wasteSlurry: 310,
                                    cement: 342,
                                    lime: 208,
                                    gypsum: 26,
                                    aluminumPowder: 1228,
                                    dcPowder: 15.5,
                                    water: 112,
                                    solutionOil: 3.1
                                },
                                process: {
                                    mixingTime: 2.85,
                                    dischargeTime: "10:45",
                                    dischargeTemp: 47.5
                                }
                            },
                            ferryCarts: {
                                shift: "Day",
                                measurements: {
                                    flow: 17.5,
                                    temp: 46.5,
                                    height: 292,
                                    time: "10:52"
                                }
                            },
                            tiltingCrane: {
                                shift: "Day",
                                measurements: {
                                    risingQuality: "Ok",
                                    temp: 70.8,
                                    time: "11:25",
                                    hardness: 138
                                }
                            },
                            cutting: {
                                cuttingTime: "01:50", // Not yet started
                                blockSize: "600x200x100",
                                tiltingCraneRejection: null,
                                chippingRejection: null,
                                sideCutterRejection: null,
                                joinedRejection: null,
                                trimmingRejection: null,
                                wireBrokenHC: null,
                                wireBrokenVC: null,
                                rejectedDueToHC: null,
                                rejectedDueToVC: null,
                                dimensionCheck: null
                            },
                            segregation: {
                                shift: "",
                                totalBlocks: 0,
                                size: "",
                                defects: {},
                                totalDefects: 0
                            }
                        },
                        metadata: {
                            createdAt: "2025-04-10T05:15:22.123Z",
                            updatedAt: "2025-04-10T05:38:42.456Z",
                            createdBy: "app_user"
                        }
                    }
                ];

                // Mock autoclave data
                const mockAutoclaves: AutoclaveRecord[] = [
                    {
                        _id: "67f6114583f313bf2e6d9f06",
                        autoclaveId: 101,
                        shift: "Day",
                        batchesProcessed: "1510, 1511, 1512",
                        previousDoorOpenTime: "02:38",
                        previousDoorOpenPressure: null,
                        doorCloseTime: "03:23",
                        doorClosePressure: 0,
                        vacuumFinishTime: "03:52",
                        vacuumFinishPressure: -0.4,
                        slowSteamStartTime: "03:58",
                        slowSteamStartPressure: -0.4,
                        fastSteamStartTime: "05:03",
                        fastSteamStartPressure: null,
                        maxPressureTime: "06:39",
                        maxPressure: 11.5,
                        releaseStartTime: "12:10",
                        releaseStartPressure: 10.5,
                        doorOpenTime: "13:38",
                        doorOpenPressure: 0,
                        doorCloseDuration: "19:23",
                        vacuumFinishDuration: "19:07",
                        slowSteamDuration: null,
                        fastSteamDuration: null,
                        maxPressureDuration: "21:19",
                        releaseStartDuration: "00:09",
                        doorOpenDuration: "05:38"
                    },
                    {
                        _id: "67f6114583f313bf2e6d9f07",
                        autoclaveId: 102,
                        shift: "Night",
                        batchesProcessed: "1538, 1539, 1540, 1541, 1542",
                        previousDoorOpenTime: "14:30",
                        previousDoorOpenPressure: 0,
                        doorCloseTime: "15:15",
                        doorClosePressure: 0,
                        vacuumFinishTime: "15:45",
                        vacuumFinishPressure: -0.38,
                        slowSteamStartTime: "15:50",
                        slowSteamStartPressure: -0.38,
                        fastSteamStartTime: "16:55",
                        fastSteamStartPressure: 0.5,
                        maxPressureTime: "18:25",
                        maxPressure: 11.3,
                        releaseStartTime: "00:05",
                        releaseStartPressure: 10.3,
                        doorOpenTime: "01:20",
                        doorOpenPressure: 0,
                        doorCloseDuration: "15:15",
                        vacuumFinishDuration: "15:45",
                        slowSteamDuration: "01:05",
                        fastSteamDuration: "01:30",
                        maxPressureDuration: "05:40",
                        releaseStartDuration: "01:15",
                        doorOpenDuration: "01:20"
                    }
                ];

                setBatches(mockBatches);
                setAutoclaves(mockAutoclaves);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading initial batch data:', error);
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const getBatchesByStage = (stageName: keyof BatchStages, stageStatus: BatchStageStatus): BatchRecord[] => {
        return batches.filter(batch => {
            // Get the stages for this batch
            const stages = getBatchStages(batch);
            // Check if this stage matches the requested status
            return stages[stageName] === stageStatus;
        });
    };

    // Helper function to determine batch stage status from process steps
    const getBatchStages = (batch: BatchRecord): BatchStages => {
        // Default to all pending
        const stages: BatchStages = {
            batching: 'pending',
            ferryCart: 'pending',
            tilting: 'pending',
            cutting: 'pending',
            autoclave: 'pending',
            segregation: 'pending'
        };

        // Check overall status
        if (batch.status === 'Pending') {
            return stages;
        }

        // Check which steps have been completed
        if (batch.processSteps.batching.process.dischargeTime) {
            stages.batching = 'completed';
        }

        if (batch.processSteps.ferryCarts.measurements.time) {
            stages.batching = 'completed';
            stages.ferryCart = 'completed';
        }

        if (batch.processSteps.tiltingCrane.measurements.time) {
            stages.batching = 'completed';
            stages.ferryCart = 'completed';
            stages.tilting = 'completed';
        }

        if (batch.processSteps.cutting.cuttingTime !== "") {
            stages.batching = 'completed';
            stages.ferryCart = 'completed';
            stages.tilting = 'completed';
            stages.cutting = 'completed';
        }

        // Check if in autoclave (by checking if it's in an autoclave record)
        const inAutoclave = autoclaves.some(autoclave =>
            autoclave.batchesProcessed.split(',').map(id => id.trim()).includes(batch.batchId)
        );

        if (inAutoclave) {
            stages.batching = 'completed';
            stages.ferryCart = 'completed';
            stages.tilting = 'completed';
            stages.cutting = 'completed';
            stages.autoclave = 'completed';
        }

        if (batch.processSteps.segregation.totalBlocks > 0) {
            stages.batching = 'completed';
            stages.ferryCart = 'completed';
            stages.tilting = 'completed';
            stages.cutting = 'completed';
            stages.autoclave = 'completed';
            stages.segregation = 'completed';
        }

        // Determine which step is in progress (the first one that isn't completed)
        if (stages.batching === 'pending') {
            stages.batching = 'in-progress';
        } else if (stages.ferryCart === 'pending') {
            stages.ferryCart = 'in-progress';
        } else if (stages.tilting === 'pending') {
            stages.tilting = 'in-progress';
        } else if (stages.cutting === 'pending') {
            stages.cutting = 'in-progress';
        } else if (stages.autoclave === 'pending') {
            stages.autoclave = 'in-progress';
        } else if (stages.segregation === 'pending') {
            stages.segregation = 'in-progress';
        }

        // If batch is completed, ensure all stages are marked as completed
        if (batch.status === 'Completed') {
            Object.keys(stages).forEach(key => {
                stages[key as keyof BatchStages] = 'completed';
            });
        }

        return stages;
    };

    // Function to add a new batch
    const addBatch = (batch: BatchRecord) => {
        setBatches((prevBatches) => [...prevBatches, batch]);
    };

    // Function to add a new autoclave record
    const addAutoclave = (autoclave: AutoclaveRecord) => {
        setAutoclaves((prevAutoclaves) => [...prevAutoclaves, autoclave]);
    };

    // Function to get a batch by ID
    const getBatchById = (id: string): BatchRecord | undefined => {
        return batches.find((batch) => batch.batchId === id);
    };

    // Function to get an autoclave by ID
    const getAutoclaveById = (id: number): AutoclaveRecord | undefined => {
        return autoclaves.find((autoclave) => autoclave.autoclaveId === id);
    };

    // Function to get the autoclave record for a batch
    const getAutoclavesByBatchId = (batchId: string): AutoclaveRecord | undefined => {
        return autoclaves.find((autoclave) =>
            autoclave.batchesProcessed.split(',').map(id => id.trim()).includes(batchId)
        );
    };

    // Function to get batches by status (for UI)
    const getBatchesByStatus = (status: 'In Progress' | 'Completed' | 'Pending'): BatchRecord[] => {
        return batches.filter(batch => batch.status === status);
    };

    // Function to convert BatchRecord to UI-compatible batch format
    const convertToUiBatch = (batchRecord: BatchRecord): UiBatch => {
        const stages = getBatchStages(batchRecord);

        return {
            id: batchRecord._id,
            batchNumber: batchRecord.batchId,
            mouldNumber: batchRecord.mouldId,
            createdAt: batchRecord.metadata.createdAt,
            status: batchRecord.status.toLowerCase().replace(' ', '-') as 'in-progress' | 'completed' | 'pending',
            stages
        };
    };

    // Function to update batch status
    const updateBatchStatus = (batchId: string, status: 'In Progress' | 'Completed' | 'Pending') => {
        setBatches((prevBatches) =>
            prevBatches.map((batch) =>
                batch.batchId === batchId ? { ...batch, status } : batch
            )
        );
    };

    // Function to update a specific stage within a batch
    const updateBatchStage = (batchId: string, stageName: keyof BatchStages, stageStatus: BatchStageStatus) => {
        // Find the batch to update
        const batchToUpdate = batches.find(batch => batch.batchId === batchId);

        if (!batchToUpdate) return;

        // This is more complex as we need to update the appropriate process step data
        // based on the stage name and status. For a real implementation, you'd update
        // specific fields of the processSteps object.

        // For now, let's just update the status
        if (stageStatus === 'completed' && stageName === 'segregation') {
            updateBatchStatus(batchId, 'Completed');
        } else if (stageStatus === 'in-progress') {
            updateBatchStatus(batchId, 'In Progress');
        }

        // In a real implementation, you would update the specific process step data here
    };

    // Return all Batches
    const getAllBatches = () => {
        return batches.map(batch => convertToUiBatch(batch));
    }

    return (
        <BatchContext.Provider
            value={{
                batches,
                setBatches,
                autoclaves,
                setAutoclaves,
                addBatch,
                addAutoclave,
                getBatchById,
                getAutoclaveById,
                getAutoclavesByBatchId,
                updateBatchStatus,
                updateBatchStage,
                isLoading,
                getBatchStages,
                getBatchesByStatus,
                convertToUiBatch,
                getBatchesByStage,
                getAllBatches,
            }}
        >
            {children}
        </BatchContext.Provider>
    );
};

// Custom hook to use the batch context
export const useBatch = () => useContext(BatchContext);