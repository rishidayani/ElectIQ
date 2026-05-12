import React from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { Bell, AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';

const Alerts: React.FC = () => {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => client.get('/api/alerts').then(res => res.data.data)
  });

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-accent-coral/10 text-accent-coral border-accent-coral/20';
      case 'warning': return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20';
      default: return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20';
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'success': return <CheckCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Monitoring Center</h2>
        <button 
          onClick={() => alert('Rule Configuration Module: This feature is currently in analytical testing.')}
          className="px-4 py-2 bg-accent-blue text-white rounded-input text-sm font-bold flex items-center space-x-2"
        >
          <Bell size={16} />
          <span>Configure Rules</span>
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white dark:bg-primary-mid rounded-card animate-pulse"></div>
          ))
        ) : (
          alerts?.map((alert: any) => (
            <div 
              key={alert.id} 
              className={`p-6 rounded-card border card-shadow flex items-start space-x-4 transition-all hover:scale-[1.01] bg-white dark:bg-primary-mid ${getSeverityStyles(alert.severity)}`}
            >
              <div className="mt-1">{getIcon(alert.severity)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-lg">{alert.message}</h4>
                  <div className="flex items-center space-x-1 text-xs text-muted font-mono">
                    <Clock size={12} />
                    <span>{new Date(alert.triggeredAt).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-sm mt-1 opacity-80">Rule triggered: {alert.rule.conditionType.replace('_', ' ')}</p>
              </div>
            </div>
          ))
        )}

        {alerts?.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-primary-mid rounded-card border border-dashed border-border-subtle">
            <Bell size={48} className="mx-auto text-muted opacity-20 mb-4" />
            <p className="text-muted">No active alerts at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
