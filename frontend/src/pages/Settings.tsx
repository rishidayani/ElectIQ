import React from 'react';
import { Settings as SettingsIcon, Database, Globe, Bell, Shield, Palette } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-display font-bold text-text-primary dark:text-white">Platform Configuration</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Settings Nav */}
        <div className="space-y-1">
          {[
            { label: 'General', icon: Globe },
            { label: 'Data Sources', icon: Database },
            { label: 'Notifications', icon: Bell },
            { label: 'Appearance', icon: Palette },
            { label: 'Security', icon: Shield },
          ].map((item, idx) => (
            <button 
              key={item.label}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-input text-sm font-medium transition-all ${idx === 0 ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'text-muted hover:bg-white dark:hover:bg-primary-mid'}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-primary-mid p-8 rounded-card border border-border-subtle dark:border-primary-dark card-shadow space-y-6">
            <h3 className="text-lg font-bold flex items-center space-x-2">
              <Globe size={20} className="text-accent-blue" />
              <span>General Settings</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Platform Name</label>
                <input 
                  type="text" 
                  defaultValue="ElectIQ"
                  className="w-full bg-surface-light dark:bg-primary-dark border border-border-subtle dark:border-primary-dark rounded-input px-4 py-2 text-sm focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Default Region</label>
                <select className="w-full bg-surface-light dark:bg-primary-dark border border-border-subtle dark:border-primary-dark rounded-input px-4 py-2 text-sm focus:outline-none">
                  <option>Gujarat</option>
                  <option>West Bengal</option>
                  <option>All India</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-4 border-t border-border-subtle dark:border-primary-dark mt-4">
                <div>
                  <p className="text-sm font-bold">Maintenance Mode</p>
                  <p className="text-xs text-muted">Restrict public access during data ingestion</p>
                </div>
                <div className="w-12 h-6 bg-border-subtle dark:bg-primary-dark rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border-subtle dark:border-primary-dark flex justify-end">
              <button 
                onClick={() => alert('Global settings updated successfully.')}
                className="px-6 py-2 bg-accent-blue text-white rounded-input text-sm font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-accent-coral/5 border border-accent-coral/20 p-6 rounded-card">
            <h4 className="text-sm font-bold text-accent-coral flex items-center space-x-2">
              <Shield size={16} />
              <span>Danger Zone</span>
            </h4>
            <p className="text-xs text-accent-coral opacity-80 mt-1">Irreversible actions that affect the entire platform data.</p>
            <button 
              onClick={() => {
                if(confirm('ARE YOU SURE? This will permanently delete ALL election records from the database.')) {
                  alert('Purge operation initiated. Database reset will follow.');
                }
              }}
              className="mt-4 px-4 py-2 border border-accent-coral text-accent-coral rounded-input text-xs font-bold hover:bg-accent-coral hover:text-white transition-all"
            >
              Purge All Election Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
