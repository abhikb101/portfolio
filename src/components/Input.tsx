import React from 'react';

interface InputProps {
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    disabled?: boolean;
    required?: boolean;
}

export const Input: React.FC<InputProps> = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    className = '',
    disabled = false,
    required = false,
}) => {
    const baseClasses = 'w-full px-4 py-3 border-2 border-[#F0F0F0] rounded-lg font-body text-base focus:outline-none focus:border-[#0052FF] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const classes = `${baseClasses} ${className}`;

    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={classes}
        />
    );
};
