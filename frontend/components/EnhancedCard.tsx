import React from 'react';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'luxury' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function EnhancedCard({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hover = true,
  interactive = false,
  icon,
  title,
  subtitle,
  footer,
  onClick,
  disabled = false,
}: EnhancedCardProps) {
  const baseClasses = 'relative overflow-hidden transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };
  
  const variantClasses = {
    default: 'bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl shadow-lg',
    glass: 'bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-glass',
    luxury: 'bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-luxury',
    gradient: 'bg-gradient-to-br from-primary-50/80 via-white/90 to-secondary-50/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-lg',
  };
  
  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-2' : '';
  const interactiveClasses = interactive ? 'cursor-pointer hover:scale-105' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  const cardClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${hoverClasses} ${interactiveClasses} ${disabledClasses} ${className}`;

  return (
    <div
      className={cardClasses}
      onClick={!disabled ? onClick : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        {(icon || title || subtitle) && (
          <div className="mb-6">
            {icon && (
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-white">{icon}</span>
              </div>
            )}
            {title && (
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">{title}</h3>
            )}
            {subtitle && (
              <p className="text-gray-600 font-medium">{subtitle}</p>
            )}
          </div>
        )}
        
        {/* Main content */}
        <div className="mb-6">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="pt-6 border-t border-gray-200/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// Specialized card components
export function GlassCard(props: Omit<EnhancedCardProps, 'variant'>) {
  return <EnhancedCard {...props} variant="glass" />;
}

export function LuxuryCard(props: Omit<EnhancedCardProps, 'variant'>) {
  return <EnhancedCard {...props} variant="luxury" />;
}

export function GradientCard(props: Omit<EnhancedCardProps, 'variant'>) {
  return <EnhancedCard {...props} variant="gradient" />;
}

// Interactive card component
interface InteractiveCardProps extends EnhancedCardProps {
  href?: string;
  external?: boolean;
}

export function InteractiveCard({ href, external, ...props }: InteractiveCardProps) {
  const handleClick = () => {
    if (href) {
      if (external) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <EnhancedCard
      {...props}
      interactive={true}
      onClick={handleClick}
      className={`${props.className || ''} group`}
    />
  );
}

// Feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
}

export function FeatureCard({ icon, title, description, className = '', variant = 'primary' }: FeatureCardProps) {
  const variantClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
  };

  return (
    <EnhancedCard
      variant="luxury"
      className={`text-center group ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg">
        <span className="text-white text-2xl">{icon}</span>
      </div>
      <h3 className="text-3xl font-display font-bold text-gray-900 mb-6">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
    </EnhancedCard>
  );
}

// Stats card component
interface StatsCardProps {
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({ value, label, trend, icon, className = '' }: StatsCardProps) {
  return (
    <EnhancedCard
      variant="glass"
      size="sm"
      className={`text-center ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-primary-600">{icon}</span>
        </div>
      )}
      <div className="text-4xl md:text-5xl font-display font-bold text-gradient-primary mb-2">{value}</div>
      <div className="text-gray-600 font-medium mb-2">{label}</div>
      {trend && (
        <div className={`flex items-center justify-center gap-1 text-sm font-medium ${
          trend.isPositive ? 'text-success-600' : 'text-error-600'
        }`}>
          <svg className={`w-4 h-4 ${trend.isPositive ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {Math.abs(trend.value)}%
        </div>
      )}
    </EnhancedCard>
  );
}