'use client';
import React from 'react';
import { Section } from './types';

interface SidebarProps {
    sections: Section[];
    activeSection: string;
    setActiveSection: (sectionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, setActiveSection }) => {
    return (
        <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
                <div className="p-4 bg-gray-50 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Contents</h2>
                </div>
                <nav className="p-4">
                    <ul className="space-y-1">
                        {sections.map((section) => (
                            <li key={section.id}>
                                <button
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeSection === section.id
                                            ? 'bg-cyan-100 text-cyan-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {section.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;