import React, { useState, useRef, useEffect, useCallback } from 'react';

// Define the stages a batch can go through
export const BATCH_STAGES = [
    'Batching',
    'Ferry Cart',
    'Tilting',
    'Cutting',
    'Autoclave',
    'Segregation'
];

// Define the possible status of a batch stage
export type StageStatus = 'Completed' | 'In Progress' | 'Pending';

// Define batch data structure
export interface BatchProgressData {
    batchNo: number;
    mouldNo: number;
    createdDate: string;
    stages: Record<string, StageStatus>;
}

// Sample data for preview
const sampleBatches: BatchProgressData[] = [
    {
        batchNo: 1001,
        mouldNo: 23,
        createdDate: '2025-05-20',
        stages: {
            'Batching': 'Completed',
            'Ferry Cart': 'Completed',
            'Tilting': 'In Progress',
            'Cutting': 'Pending',
            'Autoclave': 'Pending',
            'Segregation': 'Pending'
        }
    },
    {
        batchNo: 1002,
        mouldNo: 15,
        createdDate: '2025-05-21',
        stages: {
            'Batching': 'Completed',
            'Ferry Cart': 'Completed',
            'Tilting': 'Completed',
            'Cutting': 'In Progress',
            'Autoclave': 'Pending',
            'Segregation': 'Pending'
        }
    },
    {
        batchNo: 1003,
        mouldNo: 42,
        createdDate: '2025-05-22',
        stages: {
            'Batching': 'In Progress',
            'Ferry Cart': 'Pending',
            'Tilting': 'Pending',
            'Cutting': 'Pending',
            'Autoclave': 'Pending',
            'Segregation': 'Pending'
        }
    },
    {
        batchNo: 1004,
        mouldNo: 19,
        createdDate: '2025-05-18',
        stages: {
            'Batching': 'Completed',
            'Ferry Cart': 'Completed',
            'Tilting': 'Completed',
            'Cutting': 'Completed',
            'Autoclave': 'Completed',
            'Segregation': 'Completed'
        }
    }
];

// Component to display a single batch in different styles
const BatchItem = ({
    batch,
    style,
    onBatchEdit,
    readOnly = true
}: {
    batch: BatchProgressData,
    style: 'compact' | 'minimal' | 'horizontal' | 'card',
    onBatchEdit?: (batchNo: number) => void,
    readOnly?: boolean
}) => {
    // Get status color class based on status
    const getStatusColorClass = (status: StageStatus): string => {
        switch (status) {
            case 'Completed':
                return 'bg-emerald-500';
            case 'In Progress':
                return 'bg-yellow-400';
            case 'Pending':
            default:
                return 'bg-gray-300';
        }
    };

    // Get text color class based on status
    const getTextColorClass = (status: StageStatus): string => {
        switch (status) {
            case 'Completed':
                return 'text-emerald-500';
            case 'In Progress':
                return 'text-yellow-600';
            case 'Pending':
            default:
                return 'text-gray-400';
        }
    };

    // Get current stage name
    const getCurrentStageName = (stages: Record<string, StageStatus>): string => {
        const inProgressStage = BATCH_STAGES.find(stage => stages[stage] === 'In Progress');
        if (inProgressStage) return inProgressStage;

        // If no in-progress stage, find the next pending stage
        const nextPendingStage = BATCH_STAGES.find(stage => stages[stage] === 'Pending');
        if (nextPendingStage) return nextPendingStage;

        // If all stages are completed
        return 'Completed';
    };

    const currentStage = getCurrentStageName(batch.stages);
    const progressPercent = BATCH_STAGES.filter(stage =>
        batch.stages[stage] === 'Completed'
    ).length / BATCH_STAGES.length * 100;

    // Compact style
    if (style === 'compact') {
        return (
            <div className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold">#{batch.batchNo}</h3>
                    {!readOnly && onBatchEdit && (
                        <button
                            onClick={() => onBatchEdit(batch.batchNo)}
                            className="p-1 text-gray-600 hover:text-blue-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>

                {/* Stage indicators as pills in a flow */}
                <div className="flex flex-wrap gap-1 mb-2">
                    {BATCH_STAGES.map(stage => (
                        <div
                            key={stage}
                            className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${batch.stages[stage] === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                batch.stages[stage] === 'In Progress' ? 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-400' :
                                    'bg-gray-100 text-gray-500'
                                }`}
                        >
                            {stage.split(' ')[0]}
                        </div>
                    ))}
                </div>

                <div className="text-xs text-gray-500 flex justify-between">
                    <div>Mould: {batch.mouldNo}</div>
                    <div>{batch.createdDate.split('-').slice(1).join('/')}</div>
                </div>
            </div>
        );
    }

    // Minimal style
    if (style === 'minimal') {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                    <span className="font-medium">#{batch.batchNo}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${currentStage === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {currentStage === 'Completed' ? 'Complete' : currentStage}
                    </span>
                </div>

                {/* Dots for stages */}
                <div className="flex justify-between mt-2 mb-1">
                    {BATCH_STAGES.map(stage => (
                        <div
                            key={stage}
                            className={`w-3 h-3 rounded-full ${getStatusColorClass(batch.stages[stage])}`}
                            title={stage}
                        ></div>
                    ))}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                    M{batch.mouldNo} · {batch.createdDate.split('-').slice(1).join('/')}
                </div>
            </div>
        );
    }

    // Horizontal style (enhanced)
    if (style === 'horizontal') {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 flex items-center hover:shadow-md transition-shadow">
                <div className="font-bold text-lg mr-3 min-w-[50px] text-center">#{batch.batchNo}</div>

                <div className="flex-grow">
                    {/* Horizontal progress bar with stage markers */}
                    <div className="relative w-full bg-gray-200 rounded-full h-3 my-1">
                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        ></div>

                        {/* Stage markers */}
                        {BATCH_STAGES.map((stage, index) => {
                            const position = (index / (BATCH_STAGES.length - 1)) * 100;
                            return (
                                <div
                                    key={stage}
                                    className={`absolute w-4 h-4 rounded-full -mt-0.5 border-2 border-white ${getStatusColorClass(batch.stages[stage])} transition-colors duration-300`}
                                    style={{ left: `calc(${position}% - 8px)`, top: '-2px' }}
                                    title={stage}
                                ></div>
                            );
                        })}
                    </div>

                    {/* Stage labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        {BATCH_STAGES.map((stage) => (
                            <div
                                key={stage}
                                className={`text-center ${batch.stages[stage] === 'In Progress' ? 'font-bold ' + getTextColorClass(batch.stages[stage]) : ''}`}
                                style={{ width: `${100 / BATCH_STAGES.length}%` }}
                            >
                                {stage.split(' ')[0]}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between text-xs mt-2">
                        <div className="bg-gray-100 px-2 py-0.5 rounded-full">Mould: {batch.mouldNo}</div>
                        <div className={`px-2 py-0.5 rounded-full font-medium ${currentStage === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {currentStage === 'Completed' ? 'Complete' : currentStage}
                        </div>
                        <div className="bg-gray-100 px-2 py-0.5 rounded-full">{batch.createdDate}</div>
                    </div>
                </div>

                {!readOnly && onBatchEdit && (
                    <button
                        onClick={() => onBatchEdit(batch.batchNo)}
                        className="ml-3 p-1.5 text-gray-600 hover:text-blue-500 bg-gray-50 rounded-full hover:bg-gray-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                )}
            </div>
        );
    }

    // Card style (default)
    return (
        <div className="bg-white rounded-lg shadow p-3 border border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Batch #{batch.batchNo}</h3>
                {!readOnly && onBatchEdit && (
                    <button
                        onClick={() => onBatchEdit(batch.batchNo)}
                        className="p-1 text-gray-600 hover:text-blue-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColorClass(batch.stages[currentStage] || 'Completed')
                    }`}></div>
                <span className="text-sm font-medium">
                    {currentStage === 'Completed' ? 'All stages complete' : `Current: ${currentStage}`}
                </span>
            </div>

            {/* Stage indicators */}
            <div className="grid grid-cols-6 gap-1 mb-2">
                {BATCH_STAGES.map(stage => (
                    <div
                        key={stage}
                        className="text-center"
                        title={stage}
                    >
                        <div className={`w-full h-1 ${getStatusColorClass(batch.stages[stage])}`}></div>
                        <div className="text-xs mt-1 truncate">{stage.split(' ')[0]}</div>
                    </div>
                ))}
            </div>

            <div className="text-xs text-gray-500 flex justify-between mt-1">
                <div>Mould Box: {batch.mouldNo}</div>
                <div>Created: {batch.createdDate}</div>
            </div>
        </div>
    );
};

export default function BatchProgressTracker({
    batches = sampleBatches,
    onBatchEdit,
    className = '',
    readOnly = true
}: {
    batches?: BatchProgressData[],
    onBatchEdit?: (batchNo: number) => void,
    className?: string,
    readOnly?: boolean
}) {
    const [displayStyle, setDisplayStyle] = useState<'compact' | 'minimal' | 'horizontal' | 'card'>('card');
    const [autoScroll, setAutoScroll] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const scrollSpeed = useRef(0.5); // pixels per frame, can be adjusted

    // Create a larger array with repeated batches for seamless scrolling
    const repeatedBatches = [...batches, ...batches, ...batches, ...batches].map((batch, index) => ({
        ...batch,
        batchNo: batch.batchNo + (index * 10) // Ensure unique keys
    }));

    // Function to handle auto-scrolling
    const startAutoScroll = useCallback(() => {
        if (!scrollContainerRef.current || !autoScroll) return;
        
        const container = scrollContainerRef.current;
        
        // Check if we need to reset scroll position for looping
        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
            // When close to bottom, reset to top smoothly
            container.scrollTo({ top: 0, behavior: 'auto' });
        }
        
        // Increment scroll position for smooth scrolling
        container.scrollBy({ top: scrollSpeed.current, behavior: 'auto' });
        
        // Continue animation
        animationRef.current = requestAnimationFrame(startAutoScroll);
    }, [autoScroll]);


    // Start or stop auto-scrolling based on autoScroll state
    useEffect(() => {
        if (autoScroll) {
            animationRef.current = requestAnimationFrame(startAutoScroll);
        } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [autoScroll, startAutoScroll]);

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className} mb-6`}>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">Live Batch Tracking</h2>
                <div className="flex space-x-2 items-center">
                    <label className="flex items-center text-sm">
                        <input 
                            type="checkbox" 
                            checked={autoScroll} 
                            onChange={() => setAutoScroll(!autoScroll)} 
                            className="mr-1 h-4 w-4 text-blue-600"
                        />
                        Auto-scroll
                    </label>
                    <select
                        value={displayStyle}
                        onChange={(e) => setDisplayStyle(e.target.value as 'compact' | 'minimal' | 'horizontal' | 'card')}
                        className="bg-white border border-gray-300 text-gray-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="compact">Compact</option>
                        <option value="minimal">Minimal</option>
                        <option value="horizontal">Horizontal</option>
                        <option value="card">Card</option>
                    </select>
                </div>
            </div>

            <div className="border-b border-cyan-500 mb-4"></div>

            {/* Legend */}
            <div className="flex justify-center mb-4 space-x-6 text-xs">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></div>
                    <span>Completed</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>
                    <span>In Progress</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                    <span>Pending</span>
                </div>
            </div>

            {/* Batch Grid with Smooth Scrolling */}
            <div 
                ref={scrollContainerRef}
                className="grid gap-3 grid-cols-1 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide"
                style={{ scrollBehavior: 'auto' }}
            >
                {/* Render multiple copies of batches for continuous scrolling */}
                {repeatedBatches.map((batch, index) => (
                    <BatchItem
                        key={`batch-${batch.batchNo}-${index}`}
                        batch={batch}
                        style={displayStyle}
                        onBatchEdit={onBatchEdit}
                        readOnly={readOnly}
                    />
                ))}
            </div>
        </div>
    );
}