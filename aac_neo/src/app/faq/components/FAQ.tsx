// src/app/faq/components/FAQ.tsx
'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import Link from 'next/link';

// FAQ item type definition
interface FAQItem {
    question: string;
    answer: React.ReactNode;
    category: string;
}

// FAQ categories
const categories = [
    'General',
    'Data & Analytics',
    'Installation',
    'Troubleshooting',
];

const FAQ: React.FC = () => {
    // State for search query
    const [searchQuery, setSearchQuery] = useState('');
    // State for active FAQ item
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    // State for active category filter
    const [activeCategory, setActiveCategory] = useState<string>('All');

    // Toggle FAQ item open/close
    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // FAQ data
    const faqs: FAQItem[] = [
        {
            question: 'What is AAC Neo Plant Intelligence?',
            answer: (
                <>
                    <p>
                        AAC Neo Plant Intelligence is an advanced monitoring and analytics platform designed specifically for Autoclaved Aerated Concrete (AAC) production facilities. It provides real-time insights, predictive analysis, and comprehensive quality monitoring tools to optimize your production processes.
                    </p>
                    <p className="mt-2">
                        The platform includes dashboards for monitoring key performance indicators, rejection trend analysis, mould performance tracking, and segregation analysis.
                    </p>
                </>
            ),
            category: 'General',
        },
        {
            question: 'How does the Quality Dashboard help improve production?',
            answer: (
                <>
                    <p>
                        The Quality Dashboard provides real-time monitoring of your production quality metrics, allowing you to:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Instantly identify problematic trends in rejection rates</li>
                        <li>Analyze the most common types of defects</li>
                        <li>Track mould performance to identify maintenance needs</li>
                        <li>Receive automated recommendations based on data patterns</li>
                        <li>Generate comprehensive reports for decision-making</li>
                    </ul>
                    <p className="mt-2">
                        By having access to these insights, production managers can take immediate corrective actions to reduce waste and improve product quality.
                    </p>
                </>
            ),
            category: 'Data & Analytics',
        },
        {
            question: 'Can I integrate AAC Neo with my existing production systems?',
            answer: (
                <>
                    <p>
                        Yes, AAC Neo is designed to integrate seamlessly with most existing production systems. We support various integration methods:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Direct API connections to your ERP or MES systems</li>
                        <li>CSV/Excel data import functionality</li>
                        <li>Custom connectors for proprietary systems</li>
                        <li>Manual data entry options for facilities with limited automation</li>
                    </ul>
                    <p className="mt-2">
                        Our implementation team works closely with your IT department to ensure a smooth integration process with minimal disruption to your production.
                    </p>
                </>
            ),
            category: 'Installation',
        },
        {
            question: 'How does the system analyze rejection trends?',
            answer: (
                <p>
                    The Rejection Trends module collects data on rejected batches and analyzes patterns over time. It categorizes rejections by type (such as TiltingCrane, Chipping, SideCutter, etc.) and displays the trends in interactive charts and tables. This helps you identify recurring issues, seasonal patterns, or specific process areas that require attention. The system can also correlate rejection rates with other variables like raw material sources, operator shifts, or environmental conditions to help identify root causes.
                </p>
            ),
            category: 'Data & Analytics',
        },
        {
            question: 'What hardware requirements are needed to run AAC Neo?',
            answer: (
                <>
                    <p>
                        AAC Neo is a cloud-based solution that requires minimal on-premise hardware. Basic requirements include:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Internet connectivity for real-time data access</li>
                        <li>Modern web browsers (Chrome, Firefox, Edge, Safari)</li>
                        <li>Optional data collection terminals at production points</li>
                        <li>Standard computers or tablets for accessing the dashboard</li>
                    </ul>
                    <p className="mt-2">
                        For larger facilities with extensive data collection needs, we recommend setting up a dedicated server connection. Contact our technical team for personalized hardware recommendations.
                    </p>
                </>
            ),
            category: 'Installation',
        },
        {
            question: 'How secure is my production data in AAC Neo?',
            answer: (
                <>
                    <p>
                        Data security is a top priority for AAC Neo. We implement multiple layers of protection:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>End-to-end encryption for all data transmission</li>
                        <li>Secure cloud storage with regular backups</li>
                        <li>Role-based access control for user permissions</li>
                        <li>Compliance with ISO 27001 security standards</li>
                        <li>Regular security audits and penetration testing</li>
                    </ul>
                    <p className="mt-2">
                        We also offer on-premise deployment options for companies with strict data sovereignty requirements.
                    </p>
                </>
            ),
            category: 'General',
        },
        {
            question: 'What should I do if the dashboard is not loading?',
            answer: (
                <>
                    <p>
                        If you're experiencing issues with the dashboard loading, please try these troubleshooting steps:
                    </p>
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                        <li>Refresh your browser page</li>
                        <li>Clear your browser cache and cookies</li>
                        <li>Check your internet connection</li>
                        <li>Verify that your API endpoint URLs are correctly configured</li>
                        <li>Check if there are any server maintenance announcements</li>
                        <li>Try accessing from a different browser or device</li>
                    </ol>
                    <p className="mt-2">
                        If the issue persists, please contact our technical support team at support@aacneo.com with details about the problem and any error messages you're seeing.
                    </p>
                </>
            ),
            category: 'Troubleshooting',
        },
        {
            question: 'How often is the data updated in the dashboards?',
            answer: (
                <p>
                    By default, the dashboards are configured to update data in real-time or near real-time, depending on your data collection infrastructure. You can configure automatic refresh intervals in the settings (ranging from 30 seconds to 1 hour) or manually refresh the data using the refresh button on each dashboard. For historical analysis, data is typically processed and aggregated nightly to ensure optimal performance when viewing long-term trends.
                </p>
            ),
            category: 'Data & Analytics',
        },
        {
            question: 'Can I export reports and data from AAC Neo?',
            answer: (
                <>
                    <p>
                        Yes, AAC Neo offers extensive export capabilities for all your data and reports:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>CSV exports for raw data analysis</li>
                        <li>PDF reports for sharing with stakeholders</li>
                        <li>Excel exports with formatted tables and charts</li>
                        <li>Scheduled automated report delivery via email</li>
                        <li>API access for custom integrations with other systems</li>
                    </ul>
                    <p className="mt-2">
                        Simply look for the export button in the dashboard interfaces or configure scheduled exports in the system settings.
                    </p>
                </>
            ),
            category: 'Data & Analytics',
        },
        {
            question: 'Do you offer training and support for new users?',
            answer: (
                <>
                    <p>
                        Absolutely! We provide comprehensive training and support:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Initial onboarding and training sessions for all user levels</li>
                        <li>Detailed documentation and video tutorials</li>
                        <li>Regular webinars on advanced features and best practices</li>
                        <li>24/7 technical support via email, chat, and phone</li>
                        <li>Optional on-site training for larger implementations</li>
                    </ul>
                    <p className="mt-2">
                        We also offer a dedicated account manager for enterprise customers to ensure you're getting the most value from the platform.
                    </p>
                </>
            ),
            category: 'General',
        },
        {
            question: 'I can\'t access all dashboard features. What should I do?',
            answer: (
                <>
                    <p>
                        Limited access to dashboard features is typically related to user permissions. Here's what you can do:
                    </p>
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                        <li>Check your user role in the profile settings</li>
                        <li>Contact your organization's AAC Neo administrator to request additional permissions</li>
                        <li>Verify that your subscription plan includes the features you're trying to access</li>
                        <li>Make sure you're using the latest version of the application</li>
                    </ol>
                    <p className="mt-2">
                        If you're an administrator and experiencing this issue, please contact our support team for assistance with your account configuration.
                    </p>
                </>
            ),
            category: 'Troubleshooting',
        },
        {
            question: 'How do I interpret the mould performance analytics?',
            answer: (
                <>
                    <p>
                        The Mould Performance module provides insights into how individual moulds are performing in your production process:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Rejection Rate:</strong> The percentage of batches rejected for each mould</li>
                        <li><strong>Risk Categories:</strong> Color-coded classifications (High, Medium, Low, Optimal) based on rejection rates</li>
                        <li><strong>Defect Types:</strong> Breakdown of the most common defect types per mould</li>
                        <li><strong>Performance Trends:</strong> Historical data showing how performance has changed over time</li>
                    </ul>
                    <p className="mt-2">
                        High-risk moulds (marked in red) should be prioritized for maintenance or replacement, while monitoring medium-risk moulds regularly is recommended to prevent further degradation.
                    </p>
                </>
            ),
            category: 'Data & Analytics',
        },
    ];

    // Filter FAQs based on search query and category
    const filteredFAQs = faqs.filter((faq) => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-center text-gray-600 mb-8">
                Find answers to common questions about AAC Neo Plant Intelligence
            </p>

            {/* Search and Filter */}
            <div className="max-w-3xl mx-auto mb-10">
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none"
                        placeholder="Search for questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    <button
                        className={`px-4 py-2 rounded-full ${activeCategory === 'All'
                                ? 'bg-cyan-400 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } transition-colors`}
                        onClick={() => setActiveCategory('All')}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`px-4 py-2 rounded-full ${activeCategory === category
                                    ? 'bg-cyan-400 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } transition-colors`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* FAQ List */}
            <div className="max-w-3xl mx-auto">
                {filteredFAQs.length === 0 ? (
                    <div className="text-center py-10">
                        <h3 className="text-lg font-medium text-gray-700">No matching questions found</h3>
                        <p className="mt-2 text-gray-500">Try adjusting your search or category filter</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredFAQs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                                <button
                                    className="flex justify-between items-center w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span className="text-lg font-medium text-gray-800">
                                        {faq.question}
                                    </span>
                                    <span className="ml-6 flex-shrink-0">
                                        {activeIndex === index ? (
                                            <ChevronUp className="h-5 w-5 text-cyan-500" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-gray-500" />
                                        )}
                                    </span>
                                </button>
                                {activeIndex === index && (
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                        <div className="prose max-w-none text-gray-600">
                                            {faq.answer}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact CTA */}
            <div className="max-w-3xl mx-auto mt-12 p-6 bg-cyan-50 rounded-lg text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    Still have questions?
                </h2>
                <p className="text-gray-600 mb-4">
                    If you couldn't find the answer you were looking for, our team is here to help.
                </p>
                <Link
                    href="/contact"
                    className="inline-block bg-cyan-400 hover:bg-cyan-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                >
                    Contact Us
                </Link>
            </div>
        </div>
    );
};

export default FAQ;