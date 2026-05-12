import React from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { History, TrendingUp, ArrowRight } from 'lucide-react';

const Trends: React.FC = () => {
  const { data: elections } = useQuery({
    queryKey: ['elections'],
    queryFn: () => client.get('/api/elections').then(res => res.data.data)
  });

  // Mock data for the overall trend chart
  const trendData = [
    { year: '2014', BJP: 31, INC: 19, Others: 50 },
    { year: '2019', BJP: 37, INC: 19, Others: 44 },
    { year: '2024', BJP: 36, INC: 21, Others: 43 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Historical Trends</h2>
          <p className="text-text-secondary dark:text-gray-400">Comparative analysis of election results over time.</p>
        </div>
        <div className="flex space-x-2">
          {elections?.map((e: any) => (
            <span key={e.id} className="px-3 py-1 bg-white dark:bg-primary-mid border border-border-subtle dark:border-primary-dark rounded-full text-xs font-bold text-muted">
              {e.name}
            </span>
          ))}
        </div>
      </div>

      {/* Main Trend Chart */}
      <div className="bg-white dark:bg-primary-mid p-8 rounded-card border border-border-subtle dark:border-primary-dark card-shadow">
        <h3 className="text-xl font-bold mb-8 flex items-center space-x-2">
          <TrendingUp className="text-accent-blue" />
          <span>National Vote Share Trend (%)</span>
        </h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="BJP" stroke="#FF9933" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="INC" stroke="#19AAED" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Others" stroke="#64748B" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-primary-mid p-6 rounded-card border border-border-subtle dark:border-primary-dark card-shadow">
          <h4 className="font-bold mb-4 flex items-center space-x-2">
            <History size={18} className="text-muted" />
            <span>Notable Swings</span>
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-light dark:bg-primary-dark rounded-card">
              <div>
                <p className="text-sm font-bold">Nandigram</p>
                <p className="text-[10px] text-muted uppercase">Bengal 2021</p>
              </div>
              <div className="flex items-center space-x-2 text-accent-coral">
                <span className="text-xs font-bold font-mono">AITC ➔ BJP</span>
                <ArrowRight size={14} />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-light dark:bg-primary-dark rounded-card">
              <div>
                <p className="text-sm font-bold">Khambhalia</p>
                <p className="text-[10px] text-muted uppercase">Gujarat 2022</p>
              </div>
              <div className="flex items-center space-x-2 text-accent-blue">
                <span className="text-xs font-bold font-mono">INC ➔ BJP</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-primary-mid p-6 rounded-card border border-border-subtle dark:border-primary-dark card-shadow">
          <h4 className="font-bold mb-4">Turnout Trend (%)</h4>
          <div className="space-y-6 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Gujarat 2022</span>
                <span>64.3%</span>
              </div>
              <div className="h-2 bg-surface-light dark:bg-primary-dark rounded-full overflow-hidden">
                <div className="h-full bg-accent-blue" style={{ width: '64.3%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Bengal 2021</span>
                <span>82.3%</span>
              </div>
              <div className="h-2 bg-surface-light dark:bg-primary-dark rounded-full overflow-hidden">
                <div className="h-full bg-accent-teal" style={{ width: '82.3%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;
