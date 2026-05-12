import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number;
  prefix?: string;
  suffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, delta, prefix, suffix }) => {
  const isPositive = delta && delta > 0;

  return (
    <div className="bg-white dark:bg-primary-mid p-6 rounded-card border border-border-subtle dark:border-primary-dark card-shadow transition-all duration-200 hover:border-accent-blue/30">
      <p className="text-sm text-text-secondary dark:text-gray-400 font-medium">{label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <h3 className="text-3xl font-bold font-mono text-text-primary dark:text-white">
          {prefix}{value}{suffix}
        </h3>
        {delta !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${isPositive ? 'text-accent-teal' : 'text-accent-coral'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(delta)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4 h-1 w-full bg-surface-light dark:bg-primary-dark rounded-full overflow-hidden">
        <div 
          className={`h-full ${isPositive ? 'bg-accent-teal' : 'bg-accent-coral'} transition-all duration-1000`} 
          style={{ width: `${Math.min(Math.abs(delta || 0) * 5, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default MetricCard;
