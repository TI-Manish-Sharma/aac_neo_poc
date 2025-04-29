import React from 'react';
import { UseFormRegister, FieldError, RegisterOptions, FieldValues, Path } from 'react-hook-form';

interface InputFieldProps<TFieldValues extends FieldValues = FieldValues> {
    id: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel';
    register: UseFormRegister<FieldValues>;
    name: string;
    error?: FieldError;
    placeholder?: string;
    className?: string;
    registerOptions?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
    disabled?: boolean;
    required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    id,
    label,
    type = 'text',
    register,
    name,
    error,
    placeholder = '',
    className = '',
    registerOptions = {},
    disabled = false,
    required = false,
}) => {
    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-colors ${className}`}
                id={id}
                placeholder={placeholder}
                disabled={disabled}
                {...register(name, registerOptions)}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        </div>
    );
};

export default InputField;