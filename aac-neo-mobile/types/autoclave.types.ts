import { z } from 'zod';
import { autoclaveFormSchema } from "@/schema/autoclave.schema";

// Type for the autoclave form data
export type AutoclaveFormData = z.infer<typeof autoclaveFormSchema>;