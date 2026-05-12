import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { Search, MapPin, Users, Activity } from 'lucide-react';

const Constituencies: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: constituencies, isLoading } = useQuery({
    queryKey: ['constituencies'],
    queryFn: () => client.get('/api/constituencies').then(res => res.data.data)
  });

  const { data: selectedDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['constituency', selectedId],
    queryFn: () => client.get(`/api/constituencies/${selectedId}`).then(res => res.data.data),
    enabled: !!selectedId
  });

  const filtered = constituencies?.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full space-x-8">
      {/* List */}
      <div className="w-1/3 flex flex-col space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search constituencies..." 
            className="w-full bg-white dark:bg-primary-mid border border-border-subtle dark:border-primary-dark rounded-input pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {isLoading ? (
            [1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-white dark:bg-primary-mid rounded-card animate-pulse"></div>
            ))
          ) : (
            filtered?.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-4 rounded-card border transition-all duration-200 ${
                  selectedId === c.id 
                    ? 'bg-accent-blue/5 border-accent-blue border-l-4' 
                    : 'bg-white dark:bg-primary-mid border-border-subtle dark:border-primary-dark hover:border-accent-blue/30'
                }`}
              >
                <h4 className="font-bold text-text-primary dark:text-white">{c.name}</h4>
                <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">{c.state}</p>
                <div className="mt-2 flex items-center space-x-4 text-[10px] text-muted font-mono uppercase tracking-wider">
                  <span className="flex items-center space-x-1">
                    <Users size={12} />
                    <span>{c.registeredVoters.toLocaleString()} Voters</span>
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Details Panel */}
      <div className="flex-1 bg-white dark:bg-primary-mid rounded-card border border-border-subtle dark:border-primary-dark card-shadow overflow-hidden flex flex-col">
        {!selectedId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted p-12">
            <MapPin size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Select a constituency to view details</p>
            <p className="text-sm mt-2 text-center max-w-xs">Click on any constituency from the list to see real-time results, turnout, and candidate breakdown.</p>
          </div>
        ) : loadingDetails ? (
          <div className="flex-1 flex items-center justify-center animate-pulse">
            <p className="text-muted">Loading details...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-display font-bold text-text-primary dark:text-white">{selectedDetails.name}</h2>
                <p className="text-text-secondary dark:text-gray-400 mt-1">{selectedDetails.state}</p>
              </div>
              <div className="bg-accent-teal/10 text-accent-teal px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                Counting Live
              </div>
            </div>

            {/* Turnout Gauge */}
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-surface-light dark:bg-primary-dark rounded-card">
                <p className="text-xs text-muted font-bold uppercase tracking-widest mb-4">Turnout Stats</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-mono font-bold text-text-primary dark:text-white">
                      {selectedDetails.turnout?.percentage.toFixed(1)}%
                    </p>
                    <p className="text-[10px] text-muted mt-1 uppercase">Registered: {selectedDetails.turnout?.registered.toLocaleString()}</p>
                  </div>
                  <Activity size={32} className="text-accent-blue" />
                </div>
              </div>
              <div className="p-6 bg-surface-light dark:bg-primary-dark rounded-card">
                <p className="text-xs text-muted font-bold uppercase tracking-widest mb-4">Leading Candidate</p>
                {(() => {
                  const candidatesWithVotes = [...selectedDetails.candidates].sort((a: any, b: any) => 
                    (b.results[0]?.votes || 0) - (a.results[0]?.votes || 0)
                  );
                  const leader = candidatesWithVotes[0];
                  return (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: leader.party.colorHex }}>
                        {leader.party.abbreviation}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-text-primary dark:text-white leading-tight">{leader.name}</p>
                        <p className="text-xs text-muted font-bold uppercase">{leader.party.name}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Candidate Breakdown Table */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-text-primary dark:text-white">Candidate Breakdown</h3>
              <div className="border border-border-subtle dark:border-primary-dark rounded-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-surface-light dark:bg-primary-dark text-muted">
                    <tr>
                      <th className="text-left p-4 font-medium uppercase text-[10px] tracking-widest">Candidate</th>
                      <th className="text-left p-4 font-medium uppercase text-[10px] tracking-widest">Party</th>
                      <th className="text-right p-4 font-medium uppercase text-[10px] tracking-widest">Votes</th>
                      <th className="text-right p-4 font-medium uppercase text-[10px] tracking-widest">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle dark:divide-primary-dark">
                    {selectedDetails.candidates.map((cand: any) => {
                      const votes = cand.results[0]?.votes || 0;
                      const totalVotes = selectedDetails.turnout?.voted || 1;
                      return (
                        <tr key={cand.id} className="hover:bg-surface-light/50 dark:hover:bg-primary-dark/20 transition-colors">
                          <td className="p-4 font-medium text-text-primary dark:text-white">{cand.name}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cand.party.colorHex }}></span>
                              <span>{cand.party.abbreviation}</span>
                            </span>
                          </td>
                          <td className="p-4 text-right font-mono">{votes.toLocaleString()}</td>
                          <td className="p-4 text-right font-mono font-bold">
                            {((votes / totalVotes) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Constituencies;
