'use client';

import PoweredBy from '@/shared/components/PoweredBy';
import Link from 'next/link';
import React from 'react';
import AACFooter from './AACFooter';
import { Mail, MapPin, Smartphone } from 'lucide-react';

interface ContactItemProps {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, label, children }) => (
    <div
        className="
        flex flex-wrap            /* allow items to wrap onto next line */
        items-start
        space-x-4
        hover:bg-cyan-50
        focus-within:bg-cyan-50
        rounded-lg p-3
        transition-colors
        overflow-visible          /* no clipping */
      "
    >
        <div className="flex-shrink-0 bg-cyan-100 rounded-full p-3 overflow-visible">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            {/* min-w-0 is critical so that this flex child CAN shrink below its content */}
            <h4 className="text-lg font-medium text-gray-800">{label}</h4>
            <div className="text-gray-600 mt-1 break-all whitespace-normal">
                {children}
            </div>
        </div>
    </div>
);


const AACContactInformation: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
        <div className="p-6 flex-grow">
            <PoweredBy />

            <address className="not-italic mt-8 space-y-4">
                <ContactItem
                    icon={<MapPin className="h-6 w-6 text-cyan-600" />}
                    label="Address">
                    02, Tirtharaj Apartment,
                    Behind Prakash Petrol Pump,
                    Govind Nagar, Nashik – 422009
                </ContactItem>

                <ContactItem
                    icon={<Mail className="h-6 w-6 text-cyan-600" />}
                    label="Email">
                    <Link
                        href="mailto:info@aacindiainstitute.com"
                        className="text-cyan-600 underline hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300">
                        info@aacindiainstitute.com
                    </Link>
                </ContactItem>

                <ContactItem
                    icon={<Smartphone className="h-6 w-6 text-cyan-600" />}
                    label="Phone">
                    <Link
                        href="tel:+918698610610"
                        className="text-cyan-600 underline hover:text-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300">
                        +91 86986 10610
                    </Link>
                </ContactItem>
            </address>
        </div>
        <AACFooter />
    </div>
);

export default AACContactInformation;