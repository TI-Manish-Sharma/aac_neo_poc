import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ContactForm from './components/ContactForm';
import AACContactInformation from './components/AACContactInformation';

export default function Contact() {
    return (
        <>
            <Head>
                <title>Contact Us - AACI Institute</title>
                <meta name="description" content="Contact AACI Institute for more information" />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Contact Information */}
                    <AACContactInformation />

                    {/* Contact Form */}
                    <div className="md:col-span-7">
                        <ContactForm />
                    </div>

                </div>
            </div>
        </>
    );
}