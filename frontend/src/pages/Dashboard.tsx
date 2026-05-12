import React from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import MetricCard from '../components/MetricCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const Dashboard: React.FC = () => {
  const [selectedElectionId, setSelectedElectionId] = React.useState<string | null>(null);

  const { data: elections, isLoading: loadingElections } = useQuery({
    queryKey: ['elections'],
    queryFn: () => client.get('/api/elections').then(res => {
      const data = res.data.data;
      if (data.length > 0 && !selectedElectionId) {
        setSelectedElectionId(data[0].id);
      }
      return data;
    })
  });

  const electionId = selectedElectionId;

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['stats', electionId],
    queryFn: () => client.get(`/api/elections/${electionId}/aggregate`).then(res => res.data.data),
    enabled: !!electionId
  });

  const { data: constituencies } = useQuery({
    queryKey: ['constituencies', electionId],
    queryFn: () => client.get(`/api/constituencies?electionId=${electionId}`).then(res => res.data.data),
    enabled: !!electionId
  });

  if (loadingElections || loadingStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-white dark:bg-primary-mid rounded-card"></div>
        ))}
      </div>
    );
  }

  const totalVotes = stats?.reduce((acc: number, curr: any) => acc + curr.votes, 0) || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">National Intelligence Dashboard</h2>
        <select 
          className="bg-white dark:bg-primary-mid border border-border-subtle dark:border-primary-dark rounded-input px-4 py-2 text-sm font-bold focus:outline-none"
          value={selectedElectionId || ''}
          onChange={(e) => setSelectedElectionId(e.target.value)}
        >
          {elections?.map((e: any) => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Votes" value={totalVotes.toLocaleString()} delta={12.5} />
        <MetricCard label="Constituencies" value={constituencies?.length || 0} delta={0} />
        <MetricCard label="Seats Declared" value={constituencies?.length || 0} delta={100} />
        <MetricCard label="Turnout" value="72.1" suffix="%" delta={2.1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vote Share Chart */}
        <div className="bg-white dark:bg-primary-mid p-6 rounded-card border border-border-subtle dark:border-primary-dark card-shadow">
          <h3 className="text-xl font-display font-bold mb-6 text-text-primary dark:text-white">Vote Share by Party</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="party.abbreviation" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                  {stats?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.party.colorHex} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seat Distribution */}
        <div className="bg-white dark:bg-primary-mid p-6 rounded-card border border-border-subtle dark:border-primary-dark card-shadow">
          <h3 className="text-xl font-display font-bold mb-6 text-text-primary dark:text-white">Party Vote Share Distribution</h3>
          <div className="space-y-4">
            {stats?.map((s: any) => (
              <div key={s.party.id} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-bold text-muted">{s.party.abbreviation}</div>
                <div className="flex-1 h-8 bg-surface-light dark:bg-primary-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000" 
                    style={{ 
                      width: `${(s.votes / totalVotes) * 100}%`,
                      backgroundColor: s.party.colorHex
                    }}
                  ></div>
                </div>
                <div className="w-16 text-right text-sm font-mono font-bold">
                  {((s.votes / totalVotes) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
