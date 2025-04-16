import { BatchRecord, BatchProcessSteps, BatchMaterials, BatchProcess } from '@/context/BatchContext';
import type { BatchIngredientFormData } from '@/types/batch.types';

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
        freshSlurry: 0,
        wasteSlurry: 0,
        cement: 0,
        lime: 0,
        gypsum: 0,
        aluminumPowder: 0,
        dcPowder: 0,
        water: 0,
        solutionOil: 0
    };
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