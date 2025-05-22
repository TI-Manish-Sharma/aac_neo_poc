// components/FlashingAlert.tsx
import React from 'react';
import { AlertTriangle, Bell } from 'lucide-react';

interface FlashingAlertProps {
    isVisible: boolean;
    alertCount?: number;
    severity?: 'warning' | 'error' | 'critical';
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
}

const FlashingAlert: React.FC<FlashingAlertProps> = ({
    isVisible,
    alertCount = 0,
    severity = 'warning',
    position = 'top-right',
    size = 'medium',
    onClick
}) => {
    if (!isVisible) {
        return null;
    }

    // Get severity-based styling
    const getSeverityConfig = () => {
        switch (severity) {
            case 'critical':
                return {
                    bgColor: 'bg-red-600',
                    textColor: 'text-white',
                    borderColor: 'border-red-700',
                    flashSpeed: '0.5s',
                    icon: <AlertTriangle className="h-4 w-4" />
                };
            case 'error':
                return {
                    bgColor: 'bg-red-500',
                    textColor: 'text-white',
                    borderColor: 'border-red-600',
                    flashSpeed: '0.8s',
                    icon: <AlertTriangle className="h-4 w-4" />
                };
            default: // warning
                return {
                    bgColor: 'bg-orange-500',
                    textColor: 'text-white',
                    borderColor: 'border-orange-600',
                    flashSpeed: '1.2s',
                    icon: <Bell className="h-4 w-4" />
                };
        }
    };

    // Get position styling
    const getPositionClasses = () => {
        switch (position) {
            case 'top-left':
                return 'fixed top-4 left-4 z-50';
            case 'top-right':
                return 'fixed top-4 right-4 z-50';
            case 'bottom-left':
                return 'fixed bottom-4 left-4 z-50';
            case 'bottom-right':
                return 'fixed bottom-4 right-4 z-50';
            case 'center':
                return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50';
            default:
                return 'fixed top-4 right-4 z-50';
        }
    };

    // Get size styling
    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return {
                    container: 'px-3 py-2 text-sm',
                    text: 'text-sm font-bold',
                    count: 'text-xs'
                };
            case 'large':
                return {
                    container: 'px-6 py-4 text-lg',
                    text: 'text-lg font-black',
                    count: 'text-sm'
                };
            default: // medium
                return {
                    container: 'px-4 py-3 text-base',
                    text: 'text-base font-bold',
                    count: 'text-xs'
                };
        }
    };

    const severityConfig = getSeverityConfig();
    const positionClasses = getPositionClasses();
    const sizeClasses = getSizeClasses();

    return (
        <>
            <div
                className={`
                    ${positionClasses}
                    ${severityConfig.bgColor} 
                    ${severityConfig.textColor} 
                    ${severityConfig.borderColor}
                    ${sizeClasses.container}
                    border-2 rounded-lg shadow-lg cursor-pointer
                    hover:shadow-xl transition-shadow duration-200
                    select-none
                `}
                style={{
                    animation: `flash ${severityConfig.flashSpeed} infinite`
                }}
                onClick={onClick}
                title={`${alertCount} active alert${alertCount !== 1 ? 's' : ''}. Click to view details.`}
            >
                <div className="flex items-center space-x-2">
                    {severityConfig.icon}
                    <span className={sizeClasses.text}>
                        ALERT
                    </span>
                    {alertCount > 0 && (
                        <div className="flex items-center space-x-1">
                            <span className="text-white opacity-75">•</span>
                            <span className={`${sizeClasses.count} bg-white bg-opacity-20 px-2 py-1 rounded-full font-semibold`}>
                                {alertCount > 99 ? '99+' : alertCount}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* CSS for flashing animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes flash {
                        0%, 50% {
                            opacity: 1;
                            transform: scale(1);
                        }
                        25% {
                            opacity: 0.7;
                            transform: scale(1.05);
                        }
                        75% {
                            opacity: 0.9;
                            transform: scale(0.98);
                        }
                    }
                    
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                        }
                        50% {
                            opacity: 0.8;
                            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
                        }
                    }
                    
                    /* Alternative pulse animation for critical alerts */
                    .critical-pulse {
                        animation: pulse 1s infinite;
                    }
                `
            }} />
        </>
    );
};

export default FlashingAlert;