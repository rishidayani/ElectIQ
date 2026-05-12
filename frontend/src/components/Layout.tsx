import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  BarChart3, 
  History, 
  Upload, 
  Bell, 
  Settings,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

import { useNavigate, useLocation, Link } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, path, active }: SidebarItemProps) => (
  <Link
    to={path}
    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors duration-200
      ${active 
        ? 'bg-accent-blue/10 text-accent-blue border-l-2 border-accent-blue' 
        : 'text-text-secondary hover:bg-surface-light dark:hover:bg-primary-mid hover:text-text-primary dark:hover:text-white'
      }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Constituencies', icon: Map, path: '/constituencies' },
    { label: 'Candidates', icon: Users, path: '/candidates' },
    { label: 'Parties', icon: BarChart3, path: '/parties' },
    { label: 'Trends', icon: History, path: '/trends' },
    { label: 'Upload', icon: Upload, path: '/upload' },
    { label: 'Alerts', icon: Bell, path: '/alerts' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const activeTab = navItems.find(item => location.pathname.startsWith(item.path))?.label || 'Dashboard';

  return (
    <div className="min-h-screen bg-surface-light dark:bg-primary-dark flex">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-primary-mid border-r border-border-subtle dark:border-primary-dark transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className={`font-display text-2xl font-bold text-primary-dark dark:text-white ${!isSidebarOpen && 'hidden'}`}>
            ElectIQ
          </h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-muted">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-4">
          {navItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ''}
              path={item.path}
              active={activeTab === item.label}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-border-subtle dark:border-primary-dark">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-text-primary dark:text-white truncate">Admin User</p>
                <p className="text-xs text-text-secondary dark:text-gray-400 truncate">Analyst</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-primary-mid h-16 border-b border-border-subtle dark:border-primary-dark flex items-center justify-between px-8">
          <h2 className="text-lg font-medium text-text-primary dark:text-white">{activeTab}</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-surface-light dark:bg-primary-dark border border-border-subtle dark:border-primary-dark rounded-input px-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue"
              />
              <span className="absolute right-3 top-2 text-muted text-[10px]">⌘K</span>
            </div>
            <button 
              onClick={toggleDarkMode}
              className="text-muted hover:text-text-primary dark:hover:text-white p-2 rounded-full hover:bg-surface-light dark:hover:bg-primary-dark transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="text-muted hover:text-text-primary dark:hover:text-white">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
