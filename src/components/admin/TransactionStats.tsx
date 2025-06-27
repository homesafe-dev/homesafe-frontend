import React, { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';

interface TransactionStats {
  total_transactions: number;
  successful_transactions: number;
  pending_transactions: number;
  failed_transactions: number;
  total_amount: number;
  successful_amount: number;
  pending_amount: number;
  failed_amount: number;
}

const TransactionStats: React.FC = () => {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch all transactions to calculate stats
        // In a real implementation, this should be a dedicated stats endpoint
        const response = await adminApi.getTransactions({ limit: 1000 });
        
        if (response.status && response.data?.data) {
          const transactions = response.data.data;
          
          const calculatedStats: TransactionStats = {
            total_transactions: transactions.length,
            successful_transactions: transactions.filter(t => t.status === 'successful').length,
            pending_transactions: transactions.filter(t => t.status === 'pending').length,
            failed_transactions: transactions.filter(t => t.status === 'failed').length,
            total_amount: transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0),
            successful_amount: transactions
              .filter(t => t.status === 'successful')
              .reduce((sum, t) => sum + parseFloat(t.amount), 0),
            pending_amount: transactions
              .filter(t => t.status === 'pending')
              .reduce((sum, t) => sum + parseFloat(t.amount), 0),
            failed_amount: transactions
              .filter(t => t.status === 'failed')
              .reduce((sum, t) => sum + parseFloat(t.amount), 0),
          };
          
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error('Error fetching transaction stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const statCards = [
    {
      title: 'Total Transactions',
      value: stats.total_transactions.toLocaleString(),
      amount: formatCurrency(stats.total_amount),
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Successful',
      value: stats.successful_transactions.toLocaleString(),
      amount: formatCurrency(stats.successful_amount),
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Pending',
      value: stats.pending_transactions.toLocaleString(),
      amount: formatCurrency(stats.pending_amount),
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Failed',
      value: stats.failed_transactions.toLocaleString(),
      amount: formatCurrency(stats.failed_amount),
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div key={index} className={`${card.bgColor} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
              <p className={`text-sm ${card.textColor} opacity-75`}>
                {card.amount}
              </p>
            </div>
            <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center`}>
              <svg
                className={`w-6 h-6 ${card.textColor}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionStats;
