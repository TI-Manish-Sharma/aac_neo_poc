"use client"
// src/app/support/components/SupportCardClient.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import SupportModal from './SupportModal';

interface SupportCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    linkText: string;
}

const SupportCardClient: React.FC<SupportCardProps> = ({
    icon,
    title,
    description,
    linkText
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    
    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                    <div className="mb-4">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-4">{description}</p>

                    <Link
                        href={'#'}
                        onClick={openModal}
                        className="text-cyan-500 hover:text-cyan-700 font-medium inline-flex items-center"
                    >
                        {linkText}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
            {/* Support Modal */}
            <SupportModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
};

export default SupportCardClient;