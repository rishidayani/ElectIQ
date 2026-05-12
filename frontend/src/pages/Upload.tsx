import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [electionId, setElectionId] = useState('');
  const [mapping, setMapping] = useState({
    constituencyName: '',
    candidateName: '',
    partyName: '',
    votes: '',
  });
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<any>(null);

  const { data: elections } = useQuery({
    queryKey: ['elections'],
    queryFn: () => client.get('/api/elections').then(res => res.data.data)
  });

  const handleUpload = async () => {
    if (!file || !electionId) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('electionId', electionId);
    formData.append('mapping', JSON.stringify(mapping));

    try {
      const res = await client.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.data);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-primary-mid p-8 rounded-card border border-border-subtle dark:border-primary-dark card-shadow">
        <h2 className="text-2xl font-display font-bold mb-6 text-text-primary dark:text-white">Data Ingestion Wizard</h2>
        
        {status === 'success' ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-accent-teal/10 text-accent-teal rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold">Upload Successful!</h3>
            <p className="text-text-secondary">Processed {result.rowsProcessed} rows with {JSON.parse(result.errors).length} errors.</p>
            <button 
              onClick={() => { setStatus('idle'); setFile(null); }}
              className="mt-6 px-6 py-2 bg-accent-blue text-white rounded-input font-medium"
            >
              Upload Another File
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Step 1: Election & File */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted uppercase tracking-wider">Select Election</label>
                <select 
                  className="w-full bg-surface-light dark:bg-primary-dark border border-border-subtle dark:border-primary-dark rounded-input px-4 py-2 text-sm focus:outline-none"
                  value={electionId}
                  onChange={(e) => setElectionId(e.target.value)}
                >
                  <option value="">Choose an election...</option>
                  {elections?.map((e: any) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted uppercase tracking-wider">Upload CSV</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".csv"
                    className="hidden" 
                    id="csv-upload"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <label 
                    htmlFor="csv-upload"
                    className="w-full flex items-center justify-between bg-surface-light dark:bg-primary-dark border border-border-subtle dark:border-primary-dark rounded-input px-4 py-2 text-sm cursor-pointer hover:bg-border-subtle/50 transition-colors"
                  >
                    <span className="truncate">{file ? file.name : 'No file chosen'}</span>
                    <UploadIcon size={16} className="text-muted" />
                  </label>
                </div>
              </div>
            </div>

            {/* Step 2: Mapping */}
            <div className="space-y-4 pt-6 border-t border-border-subtle dark:border-primary-dark">
              <h3 className="text-sm font-bold text-muted uppercase tracking-wider">Column Mapping</h3>
              <p className="text-xs text-text-secondary">Map your CSV columns to the required fields.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(mapping).map((key) => (
                  <div key={key} className="space-y-1">
                    <label className="text-[10px] font-bold text-muted uppercase">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input 
                      type="text" 
                      placeholder={`e.g. ${key}`}
                      className="w-full bg-surface-light dark:bg-primary-dark border border-border-subtle dark:border-primary-dark rounded-input px-3 py-1.5 text-sm focus:outline-none"
                      value={(mapping as any)[key]}
                      onChange={(e) => setMapping({...mapping, [key]: e.target.value})}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button 
              disabled={!file || !electionId || status === 'uploading'}
              onClick={handleUpload}
              className={`w-full mt-8 py-3 rounded-input font-bold flex items-center justify-center space-x-2 transition-all
                ${!file || !electionId || status === 'uploading' 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-accent-blue text-white hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/20'
                }`}
            >
              {status === 'uploading' ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>Run Ingestion Engine</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {status === 'error' && (
              <div className="mt-4 p-4 bg-accent-coral/10 text-accent-coral rounded-card flex items-center space-x-2 text-sm">
                <AlertCircle size={18} />
                <span>An error occurred during ingestion. Please check your mapping and file format.</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white dark:bg-primary-mid p-6 rounded-card border border-border-subtle dark:border-primary-dark card-shadow">
          <FileText size={24} className="text-accent-blue mb-4" />
          <h4 className="font-bold text-sm">Idempotent Upsert</h4>
          <p className="text-xs text-text-secondary mt-2">Re-uploading the same data will update existing records instead of duplicating them.</p>
        </div>
        <div className="bg-white dark:bg-primary-mid p-6 rounded-card border border-border-subtle dark:border-primary-dark card-shadow">
          <CheckCircle size={24} className="text-accent-teal mb-4" />
          <h4 className="font-bold text-sm">Data Validation</h4>
          <p className="text-xs text-text-secondary mt-2">All rows are validated for type and presence before being committed to the database.</p>
        </div>
        <div className="bg-white dark:bg-primary-mid p-6 rounded-card border border-border-subtle dark:border-primary-dark card-shadow">
          <AlertCircle size={24} className="text-accent-amber mb-4" />
          <h4 className="font-bold text-sm">Error Logging</h4>
          <p className="text-xs text-text-secondary mt-2">Detailed error reports are generated for any rows that fail to process.</p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
