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