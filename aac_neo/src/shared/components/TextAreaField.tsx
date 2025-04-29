import React from 'react';
import { UseFormRegister, FieldError, RegisterOptions } from 'react-hook-form';

interface TextAreaFieldProps {
    id: string;
    label: string;
    register: UseFormRegister<any>;
    name: string;
    error?: FieldError;
    placeholder?: string;
    className?: string;
    registerOptions?: RegisterOptions;
    disabled?: boolean;
    required?: boolean;
    rows?: number;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
    id,
    label,
    register,
    name,
    error,
    placeholder = '',
    className = '',
    registerOptions = {},
    disabled = false,
    required = false,
    rows = 5
}) => {
    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-colors ${className}`}
                id={id}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                {...register(name, registerOptions)}
            ></textarea>
            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        </div>
    );
};

export default TextAreaField;