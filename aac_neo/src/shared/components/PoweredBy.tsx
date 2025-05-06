'use client';
import Image from 'next/image';
import Link from 'next/link';

const PoweredBy: React.FC = () => {
    return (
        <div className="flex flex-col items-center mb-6">
            <div className="flex items-center space-x-4 bg-gray-50 rounded-full px-6 py-3 shadow-md border border-gray-200 group">
                <p className="text-lg font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">
                    Powered by
                </p>
                <Link
                    href="https://aacindiainstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-12 w-32 overflow-hidden"
                >
                    <Image
                        src="/aac-institute.png"
                        alt="AAC Institute Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                    <div
                        className="
              absolute inset-0
              bg-gradient-to-r from-transparent via-white/90 to-transparent
              bg-[length:250%_100%]
              animate-[shimmer_2.5s_ease-in-out_infinite]
            "
                    />
                </Link>
                <Link
                    href="https://aacindiainstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-700 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0  
                 002 2h10a2 2 0 002-2v-4M14 4h6m0  
                 0v6m0-6L10 14"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default PoweredBy;
