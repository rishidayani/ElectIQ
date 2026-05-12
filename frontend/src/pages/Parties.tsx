import React from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { Shield, TrendingUp, Users } from 'lucide-react';

const Parties: React.FC = () => {
  const { data: parties, isLoading } = useQuery({
    queryKey: ['parties'],
    queryFn: () => client.get('/api/parties').then(res => res.data.data)
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Party Intelligence</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white dark:bg-primary-mid rounded-card animate-pulse"></div>
          ))
        ) : (
          parties?.map((party: any) => (
            <div key={party.id} className="bg-white dark:bg-primary-mid rounded-card border border-border-subtle dark:border-primary-dark card-shadow overflow-hidden flex flex-col">
              <div 
                className="h-2 w-full" 
                style={{ backgroundColor: party.colorHex }}
              ></div>
              <div className="p-8 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary dark:text-white">{party.name}</h3>
                    <p className="text-accent-blue font-mono text-sm font-bold mt-1">{party.abbreviation}</p>
                  </div>
                  <div className="w-12 h-12 bg-surface-light dark:bg-primary-dark rounded-full flex items-center justify-center text-muted">
                    <Shield size={24} />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center space-x-1">
                      <TrendingUp size={10} />
                      <span>National Share</span>
                    </p>
                    <p className="text-lg font-mono font-bold dark:text-white">--%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center space-x-1">
                      <Users size={10} />
                      <span>Candidates</span>
                    </p>
                    <p className="text-lg font-mono font-bold dark:text-white">--</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border-subtle dark:border-primary-dark">
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest mb-3">Alliance Mapping</p>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-surface-light dark:bg-primary-dark rounded-full text-[10px] font-bold text-text-secondary dark:text-gray-300">
                      Independent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Parties;
