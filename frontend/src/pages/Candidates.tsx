import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { Search, User, MapPin, Building2 } from 'lucide-react';

const Candidates: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data: candidates, isLoading } = useQuery({
    queryKey: ['candidates', search],
    queryFn: () => client.get(`/api/candidates?query=${search}`).then(res => res.data.data)
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Candidate Profiles</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search candidates..." 
            className="w-full bg-white dark:bg-primary-mid border border-border-subtle dark:border-primary-dark rounded-input pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 bg-white dark:bg-primary-mid rounded-card animate-pulse"></div>
          ))
        ) : (
          candidates?.map((cand: any) => (
            <div key={cand.id} className="bg-white dark:bg-primary-mid p-6 rounded-card border border-border-subtle dark:border-primary-dark card-shadow hover:border-accent-blue/30 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-light dark:bg-primary-dark flex items-center justify-center text-muted group-hover:bg-accent-blue/10 group-hover:text-accent-blue transition-colors border-2 border-border-subtle dark:border-primary-dark">
                    {cand.photoUrl ? (
                      <img src={cand.photoUrl} alt={cand.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary dark:text-white">{cand.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cand.party.colorHex }}></span>
                      <span className="text-xs font-bold text-muted uppercase tracking-wider">{cand.party.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border-subtle dark:border-primary-dark grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center space-x-1">
                    <MapPin size={10} />
                    <span>Constituency</span>
                  </p>
                  <p className="text-sm font-medium dark:text-gray-200">{cand.constituency.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center space-x-1">
                    <Building2 size={10} />
                    <span>Region</span>
                  </p>
                  <p className="text-sm font-medium dark:text-gray-200">{cand.constituency.state}</p>
                </div>
              </div>
              
              <button 
                onClick={() => alert(`Redirecting to full profile of ${cand.name}...`)}
                className="w-full mt-6 py-2 bg-surface-light dark:bg-primary-dark text-text-primary dark:text-white text-xs font-bold rounded-input hover:bg-accent-blue hover:text-white transition-all uppercase tracking-widest"
              >
                View Full Profile
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Candidates;
