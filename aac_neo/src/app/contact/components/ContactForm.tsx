'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '@/shared/components/InputField';
import TextAreaField from '@/shared/components/TextAreaField';
import { contactFormSchema } from '../schemas/contact-form-schema';
import { ContactFormData } from '../types/contact-form-type';

interface ContactFormProps {
    onSubmitSuccess?: (data: ContactFormData) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmitSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema)
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            // Here you would typically send the data to your API
            console.log('Form submitted:', data);

            // Reset the form
            reset();

            // Call the success callback if provided
            if (onSubmitSuccess) {
                onSubmitSuccess(data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send us a Message</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField<ContactFormData> 
                        id="name"
                        label="Full Name"
                        register={register}
                        name="name"
                        error={errors.name}
                        required
                    />

                    <InputField<ContactFormData> 
                        id="email"
                        label="Email Address"
                        type="email"
                        register={register}
                        name="email"
                        error={errors.email}
                        required
                    />

                    <InputField<ContactFormData> 
                        id="subject"
                        label="Subject"
                        register={register}
                        name="subject"
                        error={errors.subject}
                        required
                    />

                    <TextAreaField<ContactFormData>
                        id="message"
                        label="Message"
                        register={register}
                        name="message"
                        error={errors.message}
                        required
                        rows={5}
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;