import React from 'react';
import { motion } from 'framer-motion';

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  withMotion?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  withMotion = true
}) => {
  const baseClasses = 'font-semibold rounded-full transition-all duration-300 flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-[#FFC845] text-black hover:bg-[#FFD666]',
    secondary: 'bg-[#F6F6F6] text-black hover:bg-[#E6E6E6]',
    outline: 'bg-[#F6F6F6] text-black border border-[#FFC845] hover:bg-[#FFF9E6]'
  };

  const sizeClasses = {
    sm: 'w-[120px] h-[40px] text-sm',
    md: 'w-[159px] h-[52px] text-base',
    lg: 'w-[200px] h-[60px] text-lg'
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  const buttonProps = {
    onClick,
    disabled,
    className: buttonClasses
  };

  if (withMotion) {
    return (
      <motion.button
        {...buttonProps}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.button>
    );
  }

  return <button {...buttonProps}>{children}</button>;
};

export default ActionButton;
