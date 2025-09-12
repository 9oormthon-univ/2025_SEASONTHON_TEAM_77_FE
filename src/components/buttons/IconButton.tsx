import React from 'react';
import { motion } from 'framer-motion';

interface IconButtonProps {
  onClick: () => void;
  icon: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  withMotion?: boolean;
  variant?: 'default' | 'round' | 'square';
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  alt = '버튼',
  size = 'md',
  className = '',
  disabled = false,
  withMotion = true,
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const variantClasses = {
    default: '',
    round: 'rounded-full',
    square: 'rounded-lg'
  };

  const buttonClasses = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim();

  const buttonProps = {
    onClick,
    disabled,
    className: buttonClasses,
    'aria-label': alt
  };

  const iconElement = (
    <img 
      src={icon} 
      alt={alt} 
      className="w-full h-full object-cover"
    />
  );

  if (withMotion) {
    return (
      <motion.button
        {...buttonProps}
        whileHover={!disabled ? { scale: 1.1 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        transition={{ duration: 0.2 }}
      >
        {iconElement}
      </motion.button>
    );
  }

  return <button {...buttonProps}>{iconElement}</button>;
};

export default IconButton;
