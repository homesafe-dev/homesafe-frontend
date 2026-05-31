import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({
  children,
  className = '',
  padding = false,
}: CardProps) {
  return (
    <div
      className={`bg-surface rounded-lg shadow-sm border border-border-default ${
        padding ? 'p-6 sm:p-8' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
