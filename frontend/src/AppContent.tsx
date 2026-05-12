import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Constituencies from './pages/Constituencies';
import Candidates from './pages/Candidates';
import Parties from './pages/Parties';
import Upload from './pages/Upload';
import Trends from './pages/Trends';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import { useRealTime } from './hooks/useRealTime';

const AppContent: React.FC = () => {
  useRealTime();
  
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/constituencies" element={<Constituencies />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/parties" element={<Parties />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default AppContent;
