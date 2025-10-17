import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    type = 'button',
    className = '',
    disabled = false,
}) => {
    const baseClasses = 'font-body font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-[#0052FF] text-white hover:bg-blue-700 focus:ring-[#0052FF]',
        secondary: 'border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F0F0F0] focus:ring-[#1A1A1A]',
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm h-10',
        md: 'px-6 py-3 text-base h-12',
        lg: 'px-8 py-4 text-lg h-14',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            {children}
        </button>
    );
};
