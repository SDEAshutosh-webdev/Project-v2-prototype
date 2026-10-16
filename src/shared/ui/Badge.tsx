import React from 'react';
import { cn } from '../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-zinc-50 text-zinc-700 border-zinc-200',
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border', styles[variant], className)}>
      {children}
    </span>
  );
};
