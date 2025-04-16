export interface BatchFormData {
    batchNumber: string;
    mouldNumber: string;
}

// Define batch status type
export type BatchStatus = 'completed' | 'in-progress' | 'pending';

export interface BatchRecord extends BatchFormData {
    id: string;
    createdAt: string;
    status: 'in-progress' | 'completed';
    // Optional stages property for detailed tracking
    stages?: {
        batching: BatchStatus;
        ferryCart: BatchStatus;
        tilting: BatchStatus;
        cutting: BatchStatus;
        autoclave: BatchStatus;
        segregation: BatchStatus;
    };
}

// Interface for batch ingredient form data
export interface BatchIngredientFormData {
    // Materials
    freshSlurry: string;
    wasteSlurry: string;
    cement: string;
    lime: string;
    gypsum: string;

    // Additives
    aluminumPowder: string;
    dcPowder: string;
    water: string;
    soluOil: string;

    // Process Parameters
    dischargeTemp: string;

    // New structure for mixing time
    mixingTime: {
        hours: string;
        minutes: string;
    };

    // For the time picker
    dischargeTime: string;
}

// Interface for ingredient record with complete data
export interface BatchIngredientRecord extends Omit<BatchIngredientFormData, 'mixingTime' | 'mixingTimeHours' | 'mixingTimeMinutes'> {
    batchId: string;
    batchNumber: string;
    mouldNumber: string;
    mixingTime: string; // Combined HH:MM format
    createdAt: string;
}