import { BatchRecord, BatchProcessSteps, BatchMaterials, BatchProcess } from '@/context/BatchContext';
import type { BatchIngredientFormData, FerryCartFormData, TiltingCraneFormData } from '@/types/batch.types';

/**
 * Creates a new batch record from basic batch information
 * @param batchNumber The batch number
 * @param mouldNumber The mould number 
 * @returns A new BatchRecord object with default values
 */
export function createNewBatch(batchNumber: string, mouldNumber: string): BatchRecord {
    const now = new Date();
    const batchId = `batch_${batchNumber}_${formatDateForId(now)}`;

    return {
        _id: batchId,
        batchId: batchNumber,
        mouldId: mouldNumber,
        status: 'In Progress',
        date: formatDate(now),
        processSteps: createDefaultProcessSteps(),
        metadata: {
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            createdBy: 'app_user'
        }
    };
}

/**
 * Updates a batch's ingredient data from the batching form
 * @param batch The batch to update
 * @param ingredientData The form data from the batching screen
 * @returns The updated batch record
 */
export function updateBatchIngredients(
    batch: BatchRecord,
    ingredientData: BatchIngredientFormData
): BatchRecord {
    // Create a deep copy to avoid mutating the original
    const updatedBatch = JSON.parse(JSON.stringify(batch)) as BatchRecord;

    // Update the materials
    updatedBatch.processSteps.batching.materials = {
        freshSlurry: parseFloat(ingredientData.freshSlurry) || 0,
        wasteSlurry: parseFloat(ingredientData.wasteSlurry) || 0,
        cement: parseFloat(ingredientData.cement) || 0,
        lime: parseFloat(ingredientData.lime) || 0,
        gypsum: parseFloat(ingredientData.gypsum) || 0,
        aluminumPowder: parseFloat(ingredientData.aluminumPowder) || 0,
        dcPowder: parseFloat(ingredientData.dcPowder) || 0,
        water: parseFloat(ingredientData.water) || 0,
        solutionOil: parseFloat(ingredientData.soluOil) || 0
    };

    // Update the process parameters
    const mixingTimeHours = parseInt(ingredientData.mixingTime.hours) || 0;
    const mixingTimeMinutes = parseInt(ingredientData.mixingTime.minutes) || 0;
    const mixingTimeDecimal = mixingTimeHours + (mixingTimeMinutes / 60);

    updatedBatch.processSteps.batching.process = {
        mixingTime: mixingTimeDecimal,
        dischargeTime: ingredientData.dischargeTime,
        dischargeTemp: parseFloat(ingredientData.dischargeTemp) || 0
    };

    // Update the timestamp
    updatedBatch.metadata.updatedAt = new Date().toISOString();

    return updatedBatch;
}

// Helper function to create a default process steps object
function createDefaultProcessSteps(): BatchProcessSteps {
    const defaultShift = getCurrentShift();

    return {
        batching: {
            shift: defaultShift,
            materials: createDefaultMaterials(),
            process: createDefaultProcess()
        },
        ferryCarts: {
            shift: defaultShift,
            measurements: {
                flow: 0,
                temp: 0,
                height: 0,
                time: ""
            }
        },
        tiltingCrane: {
            shift: defaultShift,
            measurements: {
                risingQuality: "",
                temp: 0,
                time: "",
                hardness: 0
            }
        },
        cutting: {
            cuttingTime: "",
            blockSize: "600x200x100", // Default block size
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
    };
}

// Helper function to create default materials
function createDefaultMaterials(): BatchMaterials {
    return {
        freshSlurry: null,
        wasteSlurry: null,
        cement: null,
        lime: null,
        gypsum: null,
        aluminumPowder: null,
        dcPowder: null,
        water: null,
        solutionOil: null
    } as unknown as BatchMaterials;
}

// Helper function to create default process
function createDefaultProcess(): BatchProcess {
    return {
        mixingTime: 0,
        dischargeTime: "",
        dischargeTemp: 0
    };
}

// Helper function to determine the current shift
function getCurrentShift(): string {
    const hour = new Date().getHours();

    // Assuming day shift is 6:00 AM - 6:00 PM
    return (hour >= 6 && hour < 18) ? "Day" : "Night";
}

// Helper function to format date as YYYYMMDD for IDs
function formatDateForId(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}

// Helper function to format date as YYYY-MM-DD for display
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Updates a batch's ferry cart data from the ferry cart form
 * @param batch The batch to update
 * @param ferryCartData The form data from the ferry cart screen
 * @returns The updated batch record
 */
export function updateBatchFerryCartData(
    batch: BatchRecord,
    ferryCartData: FerryCartFormData
): BatchRecord {
    // Create a deep copy to avoid mutating the original
    const updatedBatch = JSON.parse(JSON.stringify(batch)) as BatchRecord;

    // Update the ferry cart measurements
    updatedBatch.processSteps.ferryCarts.measurements = {
        flow: parseFloat(ferryCartData.flow) || 0,
        temp: parseFloat(ferryCartData.temp) || 0,
        height: parseFloat(ferryCartData.height) || 0,
        time: ferryCartData.time
    };

    // Set the current shift
    updatedBatch.processSteps.ferryCarts.shift = getCurrentShift();

    // Update the timestamp
    updatedBatch.metadata.updatedAt = new Date().toISOString();

    return updatedBatch;
}


/**
 * Updates a batch's tilting crane data from the tilting crane form
 * @param batch The batch to update
 * @param tiltingCraneData The form data from the tilting crane screen
 * @returns The updated batch record
 */
export function updateBatchTiltingCraneData(
    batch: BatchRecord,
    tiltingCraneData: TiltingCraneFormData
): BatchRecord {
    // Create a deep copy to avoid mutating the original
    const updatedBatch = JSON.parse(JSON.stringify(batch)) as BatchRecord;

    // Update the tilting crane measurements
    updatedBatch.processSteps.tiltingCrane.measurements = {
        risingQuality: tiltingCraneData.risingQuality,
        temp: parseFloat(tiltingCraneData.temp) || 0,
        time: tiltingCraneData.time,
        hardness: parseFloat(tiltingCraneData.hardness) || 0
    };

    // Set the current shift
    updatedBatch.processSteps.tiltingCrane.shift = getCurrentShift();

    // Update the timestamp
    updatedBatch.metadata.updatedAt = new Date().toISOString();

    return updatedBatch;
}

import type { AutoclaveFormData } from '@/types/autoclave.types';

/**
 * Updates a batch with autoclave data
 * This updates the batch record with information about the autoclave process
 * 
 * Note: In this application, autoclave data is primarily stored in the AutoclaveRecord
 * entity, not directly in the batch. This function is used to add a reference and
 * metadata to the batch for tracking which autoclave processed it.
 * 
 * @param batch The batch to update
 * @param autoclaveData The form data from the autoclave screen
 * @returns The updated batch record
 */
export function updateBatchAutoclaveData(
    batch: BatchRecord,
    autoclaveData: AutoclaveFormData
): BatchRecord {
    // Create a deep copy to avoid mutating the original
    const updatedBatch = JSON.parse(JSON.stringify(batch)) as BatchRecord;

    // Create autoclave reference in the batch if it doesn't exist
    if (!updatedBatch.processSteps.autoclave) {
        updatedBatch.processSteps.autoclave = {
            autoclaveNumber: '',
            shift: '',
            processedAt: '',
            doorOpenTime: ''
        };
    }

    // Update basic autoclave reference information in the batch
    updatedBatch.processSteps.autoclave = {
        autoclaveNumber: autoclaveData.autoclaveNumber,
        shift: autoclaveData.shift,
        processedAt: new Date().toISOString(),
        doorOpenTime: autoclaveData.doorOpenTime // Using doorOpenTime as completion reference
    };

    // Update the timestamp
    updatedBatch.metadata.updatedAt = new Date().toISOString();

    return updatedBatch;
}

