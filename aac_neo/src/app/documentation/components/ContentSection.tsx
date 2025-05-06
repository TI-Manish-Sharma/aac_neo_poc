'use client';
import React from 'react';
import { Section } from './types';

interface ContentSectionProps {
    activeSection: string;
    sections: Section[];
}

const ContentSection: React.FC<ContentSectionProps> = ({ activeSection, sections }) => {
    // Find the content for the active section
    const currentContent = sections.find(section => section.id === activeSection)?.content;

    return (
        <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
                {currentContent}
            </div>
        </div>
    );
};

export default ContentSection;