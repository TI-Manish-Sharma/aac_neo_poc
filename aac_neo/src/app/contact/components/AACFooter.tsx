'use client';

import Link from 'next/link';
import React from 'react';

const AACFooter: React.FC = () => (
    <footer className="mt-auto bg-gradient-to-r from-cyan-50 to-white px-6 py-3">
        <div className="flex justify-center space-x-6">
            <Link
                href="https://www.facebook.com/aacindiainstitute/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AAC India Institute on Facebook"
                className="p-3 bg-white rounded-full shadow hover:bg-cyan-100 transform hover:scale-110 transition">
                {/* Facebook SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
            </Link>

            <Link
                href="https://www.youtube.com/@AACIndiaInstitute"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AAC India Institute on YouTube"
                className="p-3 bg-white rounded-full shadow hover:bg-red-100 transform hover:scale-110 transition"
            >
                {/* YouTube SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
            </Link>

            <Link
                href="https://www.linkedin.com/in/ojas-joshi-648aa31b7/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ojas Joshi on LinkedIn"
                className="p-3 bg-white rounded-full shadow hover:bg-blue-100 transform hover:scale-110 transition"
            >
                {/* LinkedIn SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                </svg>
            </Link>
        </div>
    </footer>
);

export default AACFooter;
