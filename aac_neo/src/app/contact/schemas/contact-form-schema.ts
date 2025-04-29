import { z } from "zod";

// Define validation schema with Zod
export const contactFormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    subject: z.string().min(3, { message: 'Subject must be at least 3 characters' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters' })
});