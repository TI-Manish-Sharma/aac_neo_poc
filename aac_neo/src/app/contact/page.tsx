import React from 'react';
import ContactForm from './components/ContactForm';
import AACContactInformation from './components/AACContactInformation';

export const metadata = {
    title: 'Contact Us',
    description: 'Contact AAC Institute for more information',
};

export default function Contact() {
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                    {/* Contact Information */}
                    <div className="md:col-span-5 h-full">
                        <AACContactInformation />
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-7 h-full">
                        <ContactForm />
                    </div>

                </div>
            </div>
        </>
    );
}