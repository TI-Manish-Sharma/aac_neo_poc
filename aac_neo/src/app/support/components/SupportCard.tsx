// src/app/support/components/SupportCard.tsx
import React from 'react';
import Link from 'next/link';

interface SupportCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    link?: string;
    onClick?: () => void;
    linkText: string;
}

const SupportCard: React.FC<SupportCardProps> = ({
    icon,
    title,
    description,
    link,
    onClick,
    linkText
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
                <div className="mb-4">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 mb-4">{description}</p>

                {link ? (
                    <Link
                        href={link}
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
                ) : (
                    <button
                        onClick={onClick}
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
                    </button>
                )}
            </div>
        </div>
    );
};

export default SupportCard;