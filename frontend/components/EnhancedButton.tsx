import React from 'react';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export default function EnhancedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  iconPosition = 'right',
  loading = false,
  fullWidth = false,
}: EnhancedButtonProps) {
  const baseClasses = 'relative overflow-hidden font-semibold rounded-2xl transition-all duration-500 hover-lift focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-12 py-6 text-xl',
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-500/30',
    secondary: 'bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary-700 text-white shadow-lg hover:shadow-xl focus:ring-secondary-500/30',
    ghost: 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/20 hover:border-white/30 focus:ring-primary-500/30',
    luxury: 'bg-gradient-to-r from-primary-500 via-luxury-500 to-secondary-500 text-white shadow-luxury hover:shadow-luxury-lg focus:ring-primary-500/30',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        {icon && iconPosition === 'left' && !loading && (
          <span className="transition-transform duration-300 group-hover:scale-110">
            {icon}
          </span>
        )}
        
        <span className="transition-all duration-300">
          {children}
        </span>
        
        {icon && iconPosition === 'right' && !loading && (
          <span className="transition-transform duration-300 group-hover:scale-110">
            {icon}
          </span>
        )}
      </div>
    </button>
  );
}

// Specialized button components
export function PrimaryButton(props: Omit<EnhancedButtonProps, 'variant'>) {
  return <EnhancedButton {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<EnhancedButtonProps, 'variant'>) {
  return <EnhancedButton {...props} variant="secondary" />;
}

export function GhostButton(props: Omit<EnhancedButtonProps, 'variant'>) {
  return <EnhancedButton {...props} variant="ghost" />;
}

export function LuxuryButton(props: Omit<EnhancedButtonProps, 'variant'>) {
  return <EnhancedButton {...props} variant="luxury" />;
}

// Icon button component
interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  tooltip?: string;
}

export function IconButton({
  icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '',
  tooltip,
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white shadow-lg hover:shadow-xl',
    ghost: 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-700 hover:bg-white/20 hover:border-white/30',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses[size]} ${variantClasses[variant]} relative overflow-hidden rounded-2xl transition-all duration-500 hover-lift focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={tooltip}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <span className="transition-transform duration-300 hover:scale-110">
          {icon}
        </span>
      </div>
    </button>
  );
}