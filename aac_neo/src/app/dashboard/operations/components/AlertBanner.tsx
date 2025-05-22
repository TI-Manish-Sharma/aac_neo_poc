/* eslint-disable */
"use client";
// components/AlertBanner.tsx
import React, { useRef, useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert } from '../types/batch';

interface AlertBannerProps {
    alerts: Alert[];
    onDismissAll: () => void;
}

const DESIRED_SPEED = 100; // pixels per second

const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onDismissAll }) => {
    const marqueeRef = useRef<HTMLDivElement>(null);
    const [duration, setDuration] = useState(10); // fallback duration

    useEffect(() => {
        if (!marqueeRef.current) return;

        // The total width we need to scroll (including duplicates & separator)
        const totalWidth = marqueeRef.current.scrollWidth;

        // Compute how many seconds to cover that at DESIRED_SPEED px/sec
        const secs = totalWidth / DESIRED_SPEED;

        // Don’t let it drop below a minimum (optional)
        setDuration(Math.max(80, secs));
    }, [alerts]);

    if (alerts.length === 0) return null;

    return (
        <>
            {/* Alert Text with Exclaimation Icon*/}
            <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6" />
                <span className="font-large font-bold text-lg">Alerts</span>
            </div>

            {/* Marquee Banner */}
            <div className="z-50 bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg mb-6 rounded-lg">
                <div className="relative overflow-hidden h-12">
                    <div
                        ref={marqueeRef}
                        className="absolute inset-0 flex items-center whitespace-nowrap"
                        style={{
                            animation: `marquee ${duration}s linear infinite`
                        }}
                    >
                        {/* First set */}
                        {alerts.map(a => (
                            <div key={a.id} className="flex items-center space-x-2 px-6">
                                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium text-sm">{a.message}</span>
                                <span className="text-xs opacity-75">
                                    ({a.timestamp.toLocaleTimeString()})
                                </span>
                            </div>
                        ))}

                        {/* Separator */}
                        <div className="flex items-center px-6">
                            <span className="opacity-50">•••</span>
                        </div>

                        {/* Duplicate set */}
                        {alerts.map(a => (
                            <div key={`${a.id}-dup`} className="flex items-center space-x-2 px-6">
                                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                <span className="font-medium text-sm">{a.message}</span>
                                <span className="text-xs opacity-75">
                                    ({a.timestamp.toLocaleTimeString()})
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* <button
                        onClick={onDismissAll}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-1 z-10"
                        title="Dismiss all alerts"
                    >
                        <X className="h-4 w-4" />
                    </button> */}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes marquee {
                        from { transform: translateX(100%); }
                        to   { transform: translateX(-100%); }
                    }
                `
            }} />
        </>
    );
};

export default AlertBanner;
