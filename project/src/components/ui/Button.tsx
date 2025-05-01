import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700';
      case 'success':
        return 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700';
      case 'outline':
        return 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-700 focus:ring-gray-500 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 dark:text-gray-200 dark:hover:bg-gray-800';
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'md':
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <button
      className={`
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        font-medium rounded-md transition-colors 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        inline-flex items-center justify-center
        ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {!isLoading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;