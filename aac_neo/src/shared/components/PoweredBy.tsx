'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const PoweredBy: React.FC = () => {
    return (
        <div className="flex flex-col items-center mb-6">
            <span className="text-lg font-semibold text-gray-500">Powered by</span>
            <div className="flex items-center space-x-3">
                <Link
                    href="https://aacindiainstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-15 w-35 max-w-full overflow-hidden" >
                    <Image
                        src="/aac-institute.png"
                        alt="AAC Institute Logo"
                        fill
                        className="object-contain"
                        priority />
                    <div
                        className="
                            absolute inset-0
                            bg-gradient-to-r from-transparent via-white/90 to-transparent
                            bg-[length:250%_100%]
                            animate-[shimmer_2.5s_ease-in-out_infinite]" />
                </Link>
                <Link
                    href="https://aacindiainstitute.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:text-cyan-700 transition-colors" >
                    <ExternalLink size={20} />
                </Link>
            </div>
        </div>
    );
};

export default PoweredBy;
