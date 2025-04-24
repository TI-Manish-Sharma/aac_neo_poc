// src/schema/utils.ts
import { z } from 'zod';

/**
 * Coerces string inputs to numbers and validates positive values.
 * - Parses strings like "12.5" to numbers.
 * - Throws if empty or non-numeric.
 */
export const positiveNumber = z.preprocess((val) => {
    if (typeof val === 'string') {
        const n = parseFloat(val.trim());
        return isNaN(n) ? undefined : n;
    }
    return val;
}, z.number({ required_error: 'Value is required', invalid_type_error: 'Must be a number' }).positive());

/** Optional positive number (empty strings become undefined) */
export const optionalPositiveNumber = positiveNumber.optional();

/** Ensures a non-empty string */
export const nonEmptyString = (field: string) => z.string().min(1, `${field} is required`);

/** Validates HH:MM time format */
export const timeString = (field: string) =>
    z.string()
        .min(1, `${field} is required`)
        .regex(/^\d{2}:\d{2}$/, `${field} must be in HH:MM`);