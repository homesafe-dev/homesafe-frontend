import { useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';

export function useChartTheme() {
  const { isDark } = useTheme();

  return useMemo(() => {
    const axisColor = isDark ? '#9ca3af' : '#6b7280';
    const gridColor = isDark ? '#374151' : '#f3f4f6';
    const legendColor = isDark ? '#e5e7eb' : '#374151';

    return {
      isDark,
      axisColor,
      gridColor,
      legendColor,
      tooltip: {
        contentStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          borderRadius: '12px',
          fontSize: '12px',
          color: isDark ? '#e5e7eb' : '#111827',
          boxShadow: isDark
            ? '0 10px 15px -3px rgb(0 0 0 / 0.35)'
            : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
        labelStyle: { color: isDark ? '#e5e7eb' : '#111827' },
        itemStyle: { color: isDark ? '#e5e7eb' : '#111827' },
        cursor: {
          fill: isDark
            ? 'rgba(148, 163, 184, 0.14)'
            : 'rgba(59, 130, 246, 0.08)',
        },
      },
      legend: {
        wrapperStyle: { fontSize: '11px', color: legendColor },
      },
    };
  }, [isDark]);
}
