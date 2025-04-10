import { z } from 'zod';

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

export type BatchFormData = z.infer<typeof batchFormSchema>;