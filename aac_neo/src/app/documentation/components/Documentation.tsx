'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ContentSection from './ContentSection';
import { documentationSections } from './documentationData';

const Documentation: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>('getting-started');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Documentation</h1>
            <p className="text-center text-gray-600 mb-12">Everything you need to know about using the AAC Neo dashboard</p>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Use the Sidebar component */}
                <Sidebar
                    sections={documentationSections}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />

                {/* Use the ContentSection component */}
                <ContentSection
                    activeSection={activeSection}
                    sections={documentationSections}
                />
            </div>
        </div>
    );
};

export default Documentation;