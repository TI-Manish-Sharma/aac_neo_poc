'use client';

import PoweredBy from '@/shared/components/PoweredBy';
import Link from 'next/link';
import React from 'react';
import AACFooter from './AACFooter';

interface ContactItemProps {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, label, children }) => (
    <div className="flex items-start space-x-4 hover:bg-cyan-50 focus-within:bg-cyan-50 rounded-lg p-3 transition-colors">
        <div className="flex-shrink-0 bg-cyan-100 rounded-full p-3">
            {icon}
        </div>
        <div>
            <h4 className="text-lg font-medium text-gray-800">{label}</h4>
            <div className="text-gray-600 mt-1">{children}</div>
        </div>
    </div>
);

const AACContactInformation: React.FC = () => (
    <section className="md:col-span-5">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
            <div className="p-6 flex-grow">
                <PoweredBy />

                <address className="not-italic mt-8 space-y-4">
                    <ContactItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243
                     a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        }
                        label="Address"
                    >
                        02, Tirtharaj Apartment,<br />
                        Behind Prakash Petrol Pump,<br />
                        Govind Nagar, Nashik – 422009
                    </ContactItem>

                    <ContactItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7
                     a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        }
                        label="Email"
                    >
                        <Link
                            href="mailto:info@aacindiainstitute.com"
                            className="text-cyan-600 underline hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                        >
                            info@aacindiainstitute.com
                        </Link>
                    </ContactItem>

                    <ContactItem
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493
                     a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516
                     l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19
                     a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        }
                        label="Phone"
                    >
                        <Link
                            href="tel:+918698610610"
                            className="text-cyan-600 underline hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                        >
                            +91 86986 10610
                        </Link>
                    </ContactItem>
                </address>
            </div>

            <AACFooter />            
        </div>
    </section>
);

export default AACContactInformation;
