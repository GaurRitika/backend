import React from 'react';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'luxury' | 'gradient' | 'premium' | 'elite';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  hover?: boolean;
  interactive?: boolean;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  glow?: boolean;
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
  glow = false,
}: EnhancedCardProps) {
  const baseClasses = 'relative overflow-hidden transition-all duration-700 focus:outline-none focus:ring-4 focus:ring-offset-2 group';
  
  const sizeClasses = {
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-10',
    xl: 'p-12',
    xxl: 'p-16',
  };
  
  const variantClasses = {
    default: 'bg-white/95 backdrop-blur-xl border-2 border-white/40 rounded-3xl shadow-luxury',
    glass: 'bg-white/25 backdrop-blur-2xl border-2 border-white/40 rounded-3xl shadow-luxury-lg',
    luxury: 'bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl border-2 border-white/50 rounded-3xl shadow-luxury-lg',
    gradient: 'bg-gradient-to-br from-primary-50/80 via-white/90 to-secondary-50/80 backdrop-blur-xl border-2 border-white/40 rounded-3xl shadow-luxury',
    premium: 'bg-gradient-to-br from-white/90 via-primary-50/30 to-secondary-50/30 backdrop-blur-2xl border-2 border-white/60 rounded-[2rem] shadow-luxury-xl',
    elite: 'bg-gradient-to-br from-primary-500/10 via-white/95 to-secondary-500/10 backdrop-blur-2xl border-2 border-primary-300/40 rounded-[2rem] shadow-neon',
  };
  
  const hoverClasses = hover ? 'hover:shadow-luxury-xl hover:-translate-y-3 hover:scale-[1.02]' : '';
  const interactiveClasses = interactive ? 'cursor-pointer hover:scale-105' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const glowClass = glow ? 'animate-glow' : '';
  
  const cardClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${hoverClasses} ${interactiveClasses} ${disabledClasses} ${glowClass} ${className}`;

  return (
    <div
      className={cardClasses}
      onClick={!disabled ? onClick : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {/* Enhanced shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-shimmer"></div>
      
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/8 to-secondary-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
      
      {/* Luxury border glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary-500/20 via-transparent to-secondary-500/20 blur-sm"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        {(icon || title || subtitle) && (
          <div className="mb-8">
            {icon && (
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-3xl flex items-center justify-center mb-6 shadow-luxury group-hover:shadow-neon transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <span className="text-white text-xl">{icon}</span>
              </div>
            )}
            {title && (
              <h3 className="text-3xl font-display font-bold text-gray-900 mb-3 group-hover:text-gradient-primary transition-all duration-500">{title}</h3>
            )}
            {subtitle && (
              <p className="text-gray-600 font-semibold text-lg group-hover:text-gray-700 transition-colors duration-500">{subtitle}</p>
            )}
          </div>
        )}
        
        {/* Main content */}
        <div className="mb-8">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="pt-8 border-t border-gray-200/50 group-hover:border-primary-200/50 transition-colors duration-500">
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
  return <EnhancedCard {...props} variant="luxury" glow={true} />;
}

export function GradientCard(props: Omit<EnhancedCardProps, 'variant'>) {
  return <EnhancedCard {...props} variant="gradient" />;
}

export function PremiumCard(props: Omit<EnhancedCardProps, 'variant'>) {
  return <EnhancedCard {...props} variant="premium" glow={true} />;
}

export function EliteCard(props: Omit<EnhancedCardProps, 'variant'>) {
  return <EnhancedCard {...props} variant="elite" glow={true} />;
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
      className={`${props.className || ''} group transition-all duration-700`}
    />
  );
}

// Feature card component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'luxury';
  size?: 'md' | 'lg' | 'xl';
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  className = '', 
  variant = 'primary',
  size = 'lg'
}: FeatureCardProps) {
  const variantClasses = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    luxury: 'from-primary-500 via-luxury-500 to-secondary-500',
  };

  const iconSizes = {
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const titleSizes = {
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const descSizes = {
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <LuxuryCard
      className={`text-center group ${className}`}
      size={size}
    >
      <div className={`${iconSizes[size]} bg-gradient-to-br ${variantClasses[variant]} rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-luxury group-hover:shadow-neon`}>
        <span className="text-white text-3xl">{icon}</span>
      </div>
      <h3 className={`${titleSizes[size]} font-display font-bold text-gray-900 mb-8 group-hover:text-gradient-primary transition-all duration-500`}>{title}</h3>
      <p className={`text-gray-600 leading-relaxed ${descSizes[size]} group-hover:text-gray-700 transition-colors duration-500 font-medium`}>{description}</p>
    </LuxuryCard>
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
  variant?: 'default' | 'primary' | 'secondary' | 'success';
}

export function StatsCard({ 
  value, 
  label, 
  trend, 
  icon, 
  className = '',
  variant = 'default'
}: StatsCardProps) {
  const variantClasses = {
    default: 'from-gray-500/20 to-gray-600/20',
    primary: 'from-primary-500/20 to-primary-600/20',
    secondary: 'from-secondary-500/20 to-secondary-600/20',
    success: 'from-success-500/20 to-success-600/20',
  };

  return (
    <GlassCard
      size="md"
      className={`text-center ${className}`}
      glow={true}
    >
      {icon && (
        <div className={`w-16 h-16 bg-gradient-to-br ${variantClasses[variant]} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-luxury`}>
          <span className="text-primary-600 text-xl">{icon}</span>
        </div>
      )}
      <div className="text-5xl md:text-6xl font-display font-black text-gradient-luxury mb-4 group-hover:scale-110 transition-transform duration-500">{value}</div>
      <div className="text-gray-600 font-bold mb-3 text-lg group-hover:text-gray-700 transition-colors duration-500">{label}</div>
      {trend && (
        <div className={`flex items-center justify-center gap-2 text-base font-bold transition-all duration-500 group-hover:scale-105 ${
          trend.isPositive ? 'text-success-600' : 'text-error-600'
        }`}>
          <svg className={`w-5 h-5 ${trend.isPositive ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {Math.abs(trend.value)}%
        </div>
      )}
    </GlassCard>
  );
}

// Testimonial card component
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar?: string;
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  rating,
  className = '',
}: TestimonialCardProps) {
  return (
    <PremiumCard
      className={`${className}`}
      size="lg"
    >
      {rating && (
        <div className="flex justify-center mb-6">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-6 h-6 ${i < rating ? 'text-warning-400' : 'text-gray-300'} transition-all duration-300 group-hover:scale-110`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
      
      <blockquote className="text-xl font-medium text-gray-700 mb-8 leading-relaxed italic group-hover:text-gray-800 transition-colors duration-500">
        "{quote}"
      </blockquote>
      
      <div className="flex items-center">
        {avatar ? (
          <img
            src={avatar}
            alt={author}
            className="w-16 h-16 rounded-full mr-4 border-3 border-primary-200 group-hover:border-primary-400 transition-all duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-16 h-16 rounded-full mr-4 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-500">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-bold text-gray-900 text-lg group-hover:text-gradient-primary transition-all duration-500">{author}</div>
          <div className="text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-500">{role}</div>
        </div>
      </div>
    </PremiumCard>
  );
}