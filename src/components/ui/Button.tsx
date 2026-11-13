import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const getButtonText = (node: React.ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getButtonText).join('');
  }
  if (React.isValidElement(node) && node.props && node.props.children) {
    return getButtonText(node.props.children);
  }
  return '';
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useStore();

    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black";

    const variants = {
      primary: "bg-brand-primary text-white shadow-brand hover:brightness-105 border border-white/10 shadow-[0_4px_12px_rgba(249,115,22,0.25)]",
      secondary: "bg-surface text-primary border border-base hover:border-brand-primary/30 hover:bg-surface/80",
      ghost: "bg-transparent text-secondary hover:text-primary hover:bg-surface/50",
      danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
      gold: "bg-brand-gold text-obsidian-950 shadow-lg hover:brightness-105 border border-white/20",
    };

    const sizes = {
      sm: "text-[11px] px-3.5 py-1.5 uppercase tracking-wider",
      md: "text-[13px] px-5 py-2.5",
      lg: "text-base px-8 py-3.5",
    };

    const text = getButtonText(children as React.ReactNode).trim().toLowerCase();
    const isSpecialCta = 
      text.includes('start my vault') || 
      text.includes('get started') || 
      text.includes('upgrade your estate') ||
      text.includes('initialize') ||
      text.includes('de-risk') ||
      text.includes('maximize my legacy') ||
      text.includes('finalize my succession');

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isSpecialCta) {
        e.preventDefault();
        navigate(isAuthenticated ? '/dashboard' : '/onboarding');
        return;
      }
      if (props.onClick) {
        props.onClick(e);
      }
    };

    // Dynamically swap children to "Go to Dashboard" if authenticated
    let renderedChildren = children;
    if (isSpecialCta && isAuthenticated) {
      const hasArrow = text.includes('arrow') || (Array.isArray(children) && children.some(c => React.isValidElement(c) && (c.type as { name?: string })?.name?.includes('Arrow')));
      renderedChildren = (
        <>
          Go to Dashboard
          {hasArrow && (
            <svg viewBox="0 0 24 24" className="ml-2 w-4 h-4 stroke-current stroke-2 fill-none">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
        onClick={handleClick}
      >
        {renderedChildren}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
