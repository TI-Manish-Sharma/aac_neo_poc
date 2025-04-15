import { z } from 'zod';

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
    freshSlurry: z.string()
        .min(1, 'Fresh slurry amount is required')
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value'),

    wasteSlurry: z.string()
        .min(1, 'Waste slurry amount is required')
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value'),

    cement: z.string()
        .min(1, 'Cement amount is required')
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value'),

    lime: z.string()
        .min(1, 'Lime amount is required')
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value'),

    gypsum: z.string()
        .min(1, 'Gypsum amount is required')
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value'),

    // Additives
    aluminumPowder: z.string()
        .min(1, 'Aluminum powder amount is required')
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value'),

    dcPowder: z.string()
        .min(1, 'DC powder amount is required')
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value'),

    water: z.string()
        .min(1, 'Water amount is required')
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value'),

    soluOil: z.string()
        .min(1, 'Solu. oil amount is required')
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value'),

    // Process Parameters
    dischargeTemp: z.string()
        .min(1, 'Discharge temperature is required')
        .regex(/^\d*\.?\d+$/, 'Please enter a valid numeric value'),

    mixingTime: z.object({
        hours: z.string()
            .min(1, 'Hours is required')
            .regex(/^([0-9]|1[0-9]|2[0-3])$/, 'Please enter a valid hour (0-23)'),
        minutes: z.string()
            .min(1, 'Minutes is required')
            .regex(/^([0-9]|[1-5][0-9])$/, 'Please enter a valid minute (0-59)')
    }),

    dischargeTime: z.string()
        .min(1, 'Discharge time is required')
});