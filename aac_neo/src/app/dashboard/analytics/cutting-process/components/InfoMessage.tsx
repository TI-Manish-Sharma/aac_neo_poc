import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface InfoMessageProps {
    message: string;
    icon?: React.ReactNode;
    color?: 'blue' | 'amber' | 'green';
}

const InfoMessage: React.FC<InfoMessageProps> = ({
    message,
    icon = <AlertTriangle size={20} />,
    color = 'blue'
}) => {
    const colorStyles = {
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-500',
            text: 'text-blue-700',
            iconColor: 'text-blue-500'
        },
        amber: {
            bg: 'bg-amber-50',
            border: 'border-amber-500',
            text: 'text-amber-700',
            iconColor: 'text-amber-500'
        },
        green: {
            bg: 'bg-green-50',
            border: 'border-green-500',
            text: 'text-green-700',
            iconColor: 'text-green-500'
        }
    };

    const styles = colorStyles[color];

    return (
        <div className={`${styles.bg} border-l-4 ${styles.border} p-4 rounded`}>
            <div className="flex items-center">
                <span className={`${styles.iconColor} mr-3`}>{icon}</span>
                <p className={styles.text}>{message}</p>
            </div>
        </div>
    );
};

export default InfoMessage;