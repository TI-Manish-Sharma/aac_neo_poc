// src/app/support/page.tsx
import React from 'react';
import Link from 'next/link';
import { LifeBuoy, Mail, MessageSquare, Clock, Video } from 'lucide-react';
import SupportModal from './components/SupportModal';
import SupportCard from './components/SupportCard';
import SupportCardClient from './components/SupportCardClient';

export const metadata = {
    title: 'Support',
    description: 'Get help and support for AAC Neo',
};

export default function Support() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Support Center</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    We&apos;re here to help you make the most of AAC Neo and resolve any issues you may encounter.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <SupportCard
                    icon={<LifeBuoy className="w-8 h-8 text-cyan-500" />}
                    title="Technical Support"
                    description="Get help with technical issues, bugs, or system errors"
                    link="/support/technical"
                    linkText="Get Technical Help"
                />

                <SupportCardClient
                    icon={<MessageSquare className="w-8 h-8 text-cyan-500" />}
                    title="Contact Support Team"
                    description="Reach out to our support team for assistance with your account"
                    linkText="Contact Support"
                />

                <SupportCard
                    icon={<Video className="w-8 h-8 text-cyan-500" />}
                    title="Training Resources"
                    description="Training Programs for operational excellence in AAC Manufacturing"
                    link="https://aacindiainstitute.com/training"
                    linkText="View Resources"
                />
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
                <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Support Hours & SLA</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start">
                            <Clock className="w-6 h-6 text-cyan-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-gray-800 mb-1">Support Hours</h3>
                                <p className="text-gray-600">
                                    Monday to Friday: 9:00 AM - 6:00 PM IST<br />
                                    Weekend: Emergency support only
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <Mail className="w-6 h-6 text-cyan-500 mt-1 mr-3 flex-shrink-0" />
                            <div>
                                <h3 className="font-medium text-gray-800 mb-1">Email Support</h3>
                                <p className="text-gray-600">
                                    Response within 24 hours on business days<br />
                                    <a href="mailto:support@aacneo.com" className="text-cyan-600 hover:text-cyan-800">
                                        support@aacneo.com
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6">
                        <h3 className="font-medium text-gray-800 mb-3">Service Level Agreement</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-red-500 mr-2"></span>
                                <span className="font-medium">Critical Issues:</span>
                                <span className="ml-2 text-gray-600">Response within 2 hours, resolution within 8 hours</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>
                                <span className="font-medium">High Priority:</span>
                                <span className="ml-2 text-gray-600">Response within 4 hours, resolution within 24 hours</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
                                <span className="font-medium">Medium Priority:</span>
                                <span className="ml-2 text-gray-600">Response within 8 hours, resolution within 48 hours</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                                <span className="font-medium">Low Priority:</span>
                                <span className="ml-2 text-gray-600">Response within 24 hours, resolution within 5 business days</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Resources</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/faq" className="px-6 py-3 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
                        Frequently Asked Questions
                    </Link>
                    <Link href="/documentation" className="px-6 py-3 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
                        Documentation
                    </Link>
                </div>
            </div>
        </div>
    );
}