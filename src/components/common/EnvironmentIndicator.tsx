import React, { useState, useEffect } from 'react';
import environmentApi from '../../api/environmentApi';

const EnvironmentIndicator: React.FC = () => {
  const [environment, setEnvironment] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnvironment = async () => {
      try {
        const response = await environmentApi.getAppEnvironment();
        setEnvironment(response.app_environment);
      } catch (error) {
        console.error('Failed to fetch environment:', error);
        // Fallback to production if API fails
        setEnvironment('production');
      } finally {
        setLoading(false);
      }
    };

    fetchEnvironment();
  }, []);

  // Don't show indicator for production environment
  if (loading || environment === 'production') {
    return null;
  }

  // Get environment text based on environment
  const getEnvironmentText = () => {
    switch (environment.toLowerCase()) {
      case 'staging':
        return 'STAGING';
      case 'development':
      case 'dev':
        return 'DEV';
      case 'testing':
      case 'test':
        return 'TEST';
      default:
        return environment.toUpperCase();
    }
  };

  return (
    <div className="px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide text-red-600 border border-red-600">
      {getEnvironmentText()}
    </div>
  );
};

export default EnvironmentIndicator;
