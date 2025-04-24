import { z } from 'zod';

// Helper function to create positive number validator
const createPositiveNumberValidator = (fieldName: string) => {
    return z.string()
        .min(1, `${fieldName} is required`)
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value')
        .refine((value) => parseFloat(value) > 0, {
            message: `${fieldName} must be greater than zero`
        });
};

// Original schema for batch creation
export const batchFormSchema = z.object({
    batchNumber: z.string()
        .min(1, 'Batch number is required')
        .min(3, 'Batch number must be at least 3 characters')
        .max(10, 'Batch number cannot exceed 10 characters')
        .regex(/^[A-Z0-9-]+$/, 'Only uppercase letters, numbers, and hyphens are allowed'),

    mouldNumber: z.string()
        .min(1, 'Mould number is required')
        .max(10, 'Mould number cannot exceed 10 characters')
        .regex(/^[A-Z0-9-]+$/, 'Only uppercase letters, numbers, and hyphens are allowed')
});

// Schema for batch ingredients form
export const batchIngredientSchema = z.object({
    // Materials
    freshSlurry: createPositiveNumberValidator('Fresh slurry amount'),
    wasteSlurry: createPositiveNumberValidator('Waste slurry amount'),
    cement: createPositiveNumberValidator('Cement amount'),
    lime: createPositiveNumberValidator('Lime amount'),
    gypsum: createPositiveNumberValidator('Gypsum amount'),

    // Additives
    aluminumPowder: createPositiveNumberValidator('Aluminum powder amount'),
    dcPowder: createPositiveNumberValidator('DC powder amount'),
    water: createPositiveNumberValidator('Water amount'),
    soluOil: createPositiveNumberValidator('Solu. oil amount'),

    // Process Parameters
    dischargeTemp: createPositiveNumberValidator('Discharge temperature'),

    mixingTime: z.object({
        hours: z.string()
            .min(1, 'Hours is required')
            .regex(/^([0-9]|1[0-9]|2[0-3])$/, 'Please enter a valid hour (0-23)')
            .refine((value) => parseInt(value, 10) >= 0, {
                message: 'Hours cannot be negative'
            }),
        minutes: z.string()
            .min(1, 'Minutes is required')
            .regex(/^([0-9]|[1-5][0-9])$/, 'Please enter a valid minute (0-59)')
            .refine((value) => parseInt(value, 10) >= 0, {
                message: 'Minutes cannot be negative'
            })
    }).refine(
        (data) => !(parseInt(data.hours, 10) === 0 && parseInt(data.minutes, 10) === 0),
        {
            message: 'Total mixing time must be greater than zero',
            path: ['hours'] // Error shows on the hours field
        }
    ),

    dischargeTime: z.string()
        .min(1, 'Discharge time is required')
});

// Schema for the ferry cart form
export const ferryCartSchema = z.object({
    flow: z.string().min(1, { message: 'Flow is required' })
        .refine(val => !isNaN(parseFloat(val)), { message: 'Flow must be a number' })
        .refine(val => parseFloat(val) > 0, { message: 'Flow must be greater than 0' }),

    temp: z.string().min(1, { message: 'Temperature is required' })
        .refine(val => !isNaN(parseFloat(val)), { message: 'Temperature must be a number' })
        .refine(val => parseFloat(val) > 0, { message: 'Temperature must be greater than 0' }),

    height: z.string().min(1, { message: 'Height is required' })
        .refine(val => !isNaN(parseFloat(val)), { message: 'Height must be a number' })
        .refine(val => parseFloat(val) > 0, { message: 'Height must be greater than 0' }),

    time: z.string().min(1, { message: 'Time is required' })
});

// Schema for the tilting crane form
export const tiltingCraneSchema = z.object({
    risingQuality: z.string().min(1, { message: 'Rising quality is required' }),

    temp: z.string().min(1, { message: 'Temperature is required' })
        .refine(val => !isNaN(parseFloat(val)), { message: 'Temperature must be a number' })
        .refine(val => parseFloat(val) > 0, { message: 'Temperature must be greater than 0' }),

    time: z.string().min(1, { message: 'Time is required' }),

    hardness: z.string().min(1, { message: 'Hardness is required' })
        .refine(val => !isNaN(parseFloat(val)), { message: 'Hardness must be a number' })
        .refine(val => parseFloat(val) > 0, { message: 'Hardness must be greater than 0' })
});

// Schema for numeric values (either number or empty string)
const optionalNumericField = z.string()
    .refine(val => val === '' || !isNaN(Number(val)), {
        message: 'Must be a valid number'
    });

// Schema for cutting form validation
export const cuttingFormSchema = z.object({
    cuttingTime: z.string()
        .min(1, 'Cutting time is required'),

    blockSize: z.string()
        .min(1, 'Block size is required'),

    // Optional numeric fields for rejection data
    tiltingCraneRejection: optionalNumericField,
    chippingRejection: optionalNumericField,
    sideCutterRejection: optionalNumericField,
    joinedRejection: optionalNumericField,
    trimmingRejection: optionalNumericField,

    // Wire issues data
    wireBrokenHC: optionalNumericField,
    wireBrokenVC: optionalNumericField,
    rejectedDueToHC: optionalNumericField,
    rejectedDueToVC: optionalNumericField,
    dimensionCheck: optionalNumericField
});

// import { z } from 'zod';
// import { positiveNumber, optionalPositiveNumber, nonEmptyString, timeString } from './utils';

// // --- Batching Step ---
// export const batchFormSchema = z.object({
//     batchNumber: nonEmptyString('Batch number'),
//     mouldNumber: nonEmptyString('Mould number'),
//     freshSlurry: positiveNumber,
//     wasteSlurry: positiveNumber,
//     cement: positiveNumber,
//     lime: positiveNumber,
//     gypsum: positiveNumber,
//     aluminumPowder: positiveNumber,
//     dcPowder: positiveNumber,
//     water: positiveNumber,
//     soluOil: positiveNumber,
//     mixingTimeHours: positiveNumber,
//     mixingTimeMinutes: optionalPositiveNumber,
//     dischargeTemp: positiveNumber,
//     dischargeTime: timeString('Discharge time'),
// });

// // --- Ferry Cart Step ---
// export const ferryCartSchema = z.object({
//     flow: positiveNumber,
//     temp: positiveNumber,
//     height: positiveNumber,
//     time: timeString('Ferry cart time'),
// });

// // --- Tilting Crane Step ---
// export const tiltingCraneSchema = z.object({
//     risingQuality: nonEmptyString('Rising quality'),
//     temp: positiveNumber,
//     time: timeString('Tilting time'),
//     hardness: positiveNumber,
// });

// // --- Cutting Step ---
// export const cuttingFormSchema = z.object({
//     cuttingTime: timeString('Cutting time'),
//     blockSize: nonEmptyString('Block size'),
//     tiltingCraneRejection: optionalPositiveNumber,
//     chippingRejection: optionalPositiveNumber,
//     sideCutterRejection: optionalPositiveNumber,
//     joinedRejection: optionalPositiveNumber,
//     trimmingRejection: optionalPositiveNumber,
//     wireBrokenHC: optionalPositiveNumber,
//     wireBrokenVC: optionalPositiveNumber,
//     rejectedDueToHC: optionalPositiveNumber,
//     rejectedDueToVC: optionalPositiveNumber,
//     dimensionCheck: optionalPositiveNumber,
// });
