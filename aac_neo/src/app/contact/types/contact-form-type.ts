import { z } from "zod";
import { contactFormSchema } from "../schemas/contact-form-schema";

// Define the type for our form data
export type ContactFormData = z.infer<typeof contactFormSchema>;