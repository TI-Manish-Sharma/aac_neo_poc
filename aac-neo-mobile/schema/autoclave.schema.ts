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

// Schema for the autoclave form
export const autoclaveFormSchema = z.object({
    // General information
    autoclaveNumber: z.string()
        .min(1, 'Autoclave number is required')
        .regex(/^\d+$/, 'Please enter a valid numeric value'),

    shift: z.string()
        .min(1, 'Shift is required'),

    batchesProcessed: z.array(z.string())
        .min(1, 'At least one batch must be selected'),

    // Time and pressure readings
    previousDoorOpenTime: z.string()
        .min(1, 'Previous door open time is required'),
    previousDoorOpenPressure: createPositiveNumberValidator('Previous door open pressure'),

    doorCloseTime: z.string()
        .min(1, 'Door close time is required'),
    doorClosePressure: createPositiveNumberValidator('Door close pressure'),

    vacuumFinishTime: z.string().optional(),
    vacuumFinishPressure: z.string().optional(),

    slowSteamStartTime: z.string().optional(),
    slowSteamStartPressure: z.string().optional(),

    fastSteamStartTime: z.string().optional(),
    fastSteamStartPressure: z.string().optional(),

    maxPressureTime: z.string().optional(),
    maxPressure: z.string().optional(),

    releaseStartTime: z.string().optional(),
    releaseStartPressure: z.string().optional(),

    doorOpenTime: z.string()
        .min(1, 'Door open time is required'),
    doorOpenPressure: createPositiveNumberValidator('Door open pressure'),

    // Duration fields (calculated, not directly input by user)
    doorCloseDuration: z.string().optional(),
    vacuumFinishDuration: z.string().optional(),
    slowSteamDuration: z.string().optional(),
    fastSteamDuration: z.string().optional(),
    maxPressureDuration: z.string().optional(),
    releaseStartDuration: z.string().optional(),
    doorOpenDuration: z.string().optional()
});

// import { z } from 'zod';
// import { positiveNumber, optionalPositiveNumber, nonEmptyString, timeString } from './utils';

// export const autoclaveFormSchema = z.object({
//     autoclaveNumber: positiveNumber,
//     shift: nonEmptyString('Shift'),
//     batchesProcessed: z.array(z.string().min(1, 'Batch ID is required')).min(1, 'Select at least one batch'),
//     previousDoorOpenTime: timeString('Previous door open time'),
//     previousDoorOpenPressure: positiveNumber,
//     doorCloseTime: timeString('Door close time'),
//     doorClosePressure: positiveNumber,
//     vacuumFinishTime: timeString('Vacuum finish time'),
//     vacuumFinishPressure: positiveNumber,
//     slowSteamStartTime: timeString('Slow steam start time').optional(),
//     slowSteamStartPressure: optionalPositiveNumber,
//     fastSteamStartTime: timeString('Fast steam start time').optional(),
//     fastSteamStartPressure: optionalPositiveNumber,
//     maxPressureTime: timeString('Max pressure time').optional(),
//     maxPressure: optionalPositiveNumber,
//     releaseStartTime: timeString('Release start time').optional(),
//     releaseStartPressure: optionalPositiveNumber,
//     doorOpenTime: timeString('Door open time'),
//     doorOpenPressure: positiveNumber,
//     doorCloseDuration: z.string().optional(),
//     vacuumFinishDuration: z.string().optional(),
//     slowSteamDuration: z.string().optional(),
//     fastSteamDuration: z.string().optional(),
//     maxPressureDuration: z.string().optional(),
//     releaseStartDuration: z.string().optional(),
//     doorOpenDuration: z.string().optional(),
// });