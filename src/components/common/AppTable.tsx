import type { ReactNode } from 'react';

interface AppTableProps {
  children: ReactNode;
  className?: string;
}

export function AppTable({ children, className = '' }: AppTableProps) {
  return <table className={`w-full ${className}`}>{children}</table>;
}

export function AppTableHead({ children, className = '' }: AppTableProps) {
  return (
    <thead
      className={`bg-elevated border-b border-border-default ${className}`}
    >
      {children}
    </thead>
  );
}

export function AppTableBody({ children, className = '' }: AppTableProps) {
  return (
    <tbody className={`bg-surface divide-y divide-border-default ${className}`}>
      {children}
    </tbody>
  );
}

export const appTableHeadCellClass =
  'px-4 sm:px-6 py-3 text-left text-xs font-semibold text-content-secondary uppercase tracking-wider';

export const appTableCellClass =
  'px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-content';

export const appTableRowHoverClass = 'hover:bg-elevated/50 transition-colors';
