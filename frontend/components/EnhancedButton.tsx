import React from 'react';

interface EnhancedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'luxury' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  glow?: boolean;
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
  glow = false,
}: EnhancedButtonProps) {
  const baseClasses = 'relative overflow-hidden font-bold rounded-3xl transition-all duration-700 hover-lift focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group';
  
  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
    xl: 'px-12 py-6 text-xl',
    xxl: 'px-16 py-8 text-2xl',
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white shadow-luxury hover:shadow-luxury-xl focus:ring-primary-500/40 border-2 border-white/30',
    secondary: 'bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary-700 text-white shadow-luxury hover:shadow-luxury-xl focus:ring-secondary-500/40 border-2 border-white/30',
    ghost: 'bg-white/25 backdrop-blur-xl border-2 border-white/40 text-gray-700 hover:bg-white/35 hover:border-white/60 hover:shadow-luxury focus:ring-primary-500/40',
    luxury: 'bg-gradient-to-r from-primary-500 via-luxury-500 to-secondary-500 text-white shadow-luxury-lg hover:shadow-neon focus:ring-primary-500/40 border-2 border-white/40',
    gradient: 'bg-gradient-to-r from-primary-400 via-secondary-500 to-luxury-600 text-white shadow-luxury-lg hover:shadow-neon focus:ring-luxury-500/40 border-2 border-white/40',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const glowClass = glow ? 'animate-glow' : '';
  
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${glowClass} ${className}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      {/* Enhanced shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-shimmer"></div>
      
      {/* Luxury overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-3xl">
          <div className="w-8 h-8 border-3 border-white/40 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-4">
        {icon && iconPosition === 'left' && !loading && (
          <span className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
            {icon}
          </span>
        )}
        
        <span className="transition-all duration-500 group-hover:tracking-wider">
          {children}
        </span>
        
        {icon && iconPosition === 'right' && !loading && (
          <span className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
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
  return <EnhancedButton {...props} variant="luxury" glow={true} />;
}

export function GradientButton(props: Omit<EnhancedButtonProps, 'variant'>) {
  return <EnhancedButton {...props} variant="gradient" glow={true} />;
}

// Icon button component
interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  tooltip?: string;
  glow?: boolean;
}

export function IconButton({
  icon,
  onClick,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '',
  tooltip,
  glow = false,
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-18 h-18',
    xl: 'w-20 h-20',
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-luxury hover:shadow-luxury-lg border-2 border-white/30',
    secondary: 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white shadow-luxury hover:shadow-luxury-lg border-2 border-white/30',
    ghost: 'bg-white/25 backdrop-blur-xl border-2 border-white/40 text-gray-700 hover:bg-white/35 hover:border-white/60 hover:shadow-luxury',
    luxury: 'bg-gradient-to-br from-primary-500 via-luxury-500 to-secondary-500 text-white shadow-luxury-lg hover:shadow-neon border-2 border-white/40',
  };

  const glowClass = glow ? 'animate-glow' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${glowClass} relative overflow-hidden rounded-3xl transition-all duration-700 hover-lift focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group ${className}`}
      title={tooltip}
    >
      {/* Enhanced shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
      
      {/* Luxury overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
      
      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <span className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
          {icon}
        </span>
      </div>
    </button>
  );
}

// Floating Action Button
interface FABProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'luxury';
  size?: 'md' | 'lg';
  className?: string;
  tooltip?: string;
}

export function FloatingActionButton({
  icon,
  onClick,
  variant = 'primary',
  size = 'lg',
  className = '',
  tooltip,
}: FABProps) {
  const sizeClasses = {
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };
  
  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700',
    secondary: 'bg-gradient-to-br from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700',
    luxury: 'bg-gradient-to-br from-primary-500 via-luxury-500 to-secondary-500 hover:from-primary-600 hover:via-luxury-600 hover:to-secondary-600',
  };

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses[size]} ${variantClasses[variant]} fixed bottom-8 right-8 z-40 text-white rounded-full shadow-luxury-xl hover:shadow-neon transition-all duration-700 hover:scale-110 border-3 border-white/40 backdrop-blur-xl group animate-glow ${className}`}
      title={tooltip}
    >
      {/* Enhanced shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <span className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 text-2xl">
          {icon}
        </span>
      </div>
    </button>
  );
}