// src/app/support/components/SupportModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import InputField from '@/shared/components/InputField';
import TextAreaField from '@/shared/components/TextAreaField';

// Define validation schema with Zod
const supportFormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    issueType: z.enum(['technical', 'account', 'billing', 'feature', 'other'], {
        errorMap: () => ({ message: 'Please select an issue type' }),
    }),
    priority: z.enum(['low', 'medium', 'high', 'critical'], {
        errorMap: () => ({ message: 'Please select a priority' }),
    }),
    subject: z.string().min(3, { message: 'Subject must be at least 3 characters' }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type SupportFormData = z.infer<typeof supportFormSchema>;

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<SupportFormData>({
        resolver: zodResolver(supportFormSchema),
        defaultValues: {
            priority: 'medium'
        }
    });

    // Prevent scrolling on body when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const onSubmit = async (data: SupportFormData) => {
        try {
            // Here you would typically send the data to your API
            console.log('Support form submitted:', data);

            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reset the form
            reset();

            // Show success message
            setIsSubmitted(true);

            // Close modal after 2 seconds
            setTimeout(() => {
                setIsSubmitted(false);
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error submitting support form:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

                {/* Modal */}
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-xl">
                    <div className="px-6 py-5 flex justify-between items-center border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800">Contact Support</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                        {isSubmitted ? (
                            <div className="py-8">
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-green-700">
                                                Your support request has been submitted successfully. We'll get back to you soon.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-lg font-medium text-gray-900">Support Request Submitted</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Thank you for contacting us. Our support team will review your request and respond shortly.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField<SupportFormData>
                                        id="name"
                                        label="Full Name"
                                        register={register}
                                        name="name"
                                        error={errors.name}
                                        required
                                    />

                                    <InputField<SupportFormData>
                                        id="email"
                                        label="Email Address"
                                        type="email"
                                        register={register}
                                        name="email"
                                        error={errors.email}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-0">
                                        <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
                                            Issue Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="issueType"
                                            className={`w-full px-4 py-2 border ${errors.issueType ? 'border-red-500' : 'border-gray-300'} 
                        rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-colors`}
                                            {...register('issueType')}
                                        >
                                            <option value="">Select an issue type</option>
                                            <option value="technical">Technical Issue</option>
                                            <option value="account">Account Management</option>
                                            <option value="billing">Billing & Subscription</option>
                                            <option value="feature">Feature Request</option>
                                            <option value="other">Other</option>
                                        </select>
                                        {errors.issueType && <p className="mt-1 text-sm text-red-600">{errors.issueType.message}</p>}
                                    </div>

                                    <div className="mb-0">
                                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="priority"
                                            className={`w-full px-4 py-2 border ${errors.priority ? 'border-red-500' : 'border-gray-300'} 
                        rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-colors`}
                                            {...register('priority')}
                                        >
                                            <option value="low">Low - No rush</option>
                                            <option value="medium">Medium - Affecting work but has workaround</option>
                                            <option value="high">High - Significantly affecting operations</option>
                                            <option value="critical">Critical - System down or unusable</option>
                                        </select>
                                        {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
                                    </div>
                                </div>

                                <InputField<SupportFormData>
                                    id="subject"
                                    label="Subject"
                                    register={register}
                                    name="subject"
                                    error={errors.subject}
                                    required
                                />

                                <TextAreaField<SupportFormData>
                                    id="message"
                                    label="Describe your issue in detail"
                                    register={register}
                                    name="message"
                                    error={errors.message}
                                    required
                                    rows={6}
                                />
                            </form>
                        )}
                    </div>

                    {!isSubmitted && (
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                className="bg-cyan-400 hover:bg-cyan-500 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-70"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Support Request'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportModal;