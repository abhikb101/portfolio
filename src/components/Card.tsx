import React from 'react';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'bordered' | 'colored';
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    className = '',
}) => {
    const baseClasses = 'rounded-lg p-6';

    const variantClasses = {
        default: 'bg-white',
        bordered: 'bg-white border-2 border-[#1A1A1A]',
        colored: 'bg-[#F0F0F0]',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <div className={classes}>
            {children}
        </div>
    );
};
