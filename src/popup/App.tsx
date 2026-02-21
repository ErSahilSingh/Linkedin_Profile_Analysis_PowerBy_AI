import { useState, useEffect } from 'react';
import './App.css';
import Settings from './components/Settings';
import ResultsDisplay from './components/ResultsDisplay';
import { getStorage } from '../utils/storage';
import { User, Settings as SettingsIcon, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';

type State = 'START' | 'LOADING' | 'RESULTS' | 'SETTINGS' | 'ERROR';

function App() {
  const [state, setState] = useState<State>('START');
  const [profileData, setProfileData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const key = await getStorage('gemini_api_key');
    if (!key) setState('SETTINGS');
  };

  const getProfile = async () => {
    setState('LOADING');
    setError(null);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.url?.includes('linkedin.com/in/')) {
        throw new Error('Please navigate to a LinkedIn Profile page first.');
      }

      const response = await chrome.tabs.sendMessage(tab.id!, { action: 'GET_PROFILE_DATA' });
      
      if (!response) {
        throw new Error('Failed to extract profile data. Please refresh the page.');
      }

      setProfileData(response);
      analyze(response);
    } catch (err: any) {
      if (err.message.includes('Could not establish connection')) {
        setError('Connection lost. Please refresh the LinkedIn profile page and try again.');
      } else {
        setError(err.message);
      }
      setState('ERROR');
    }
  };

  const analyze = async (data: any) => {
    setState('LOADING');
    chrome.runtime.sendMessage({ action: 'ANALYZE_PROFILE', data }, (response) => {
      if (response.success) {
        setAnalysisResult(response.data);
        setState('RESULTS');
      } else {
        setError(response.error || 'Failed to analyze profile');
        setState('ERROR');
      }
    });
  };

  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={24} />
          Profile Analyzer
        </h1>
        <button className="btn btn-outline" style={{ padding: '4px', border: 'none' }} onClick={() => setState('SETTINGS')}>
          <SettingsIcon size={20} />
        </button>
      </header>

      {state === 'SETTINGS' && (
        <Settings onSaved={() => {
          setState('START');
        }} />
      )}

      {state === 'START' && (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ background: 'rgba(10, 102, 194, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <User size={32} color="var(--primary)" />
          </div>
          <h2>Ready to Analyze?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Open a LinkedIn profile and click the button below to get AI-powered insights.
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={getProfile}>
            Analyze This Profile
          </button>
        </div>
      )}

      {state === 'LOADING' && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Loader2 className="loading-spinner" style={{ margin: '0 auto 20px', width: '40px', height: '40px' }} />
          <h2>Analyzing Profile...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Gemini AI is reading the profile and generating suggestions.</p>
        </div>
      )}

      {state === 'RESULTS' && analysisResult && (
        <ResultsDisplay data={analysisResult} onReanalyze={() => analyze(profileData)} />
      )}

      {state === 'ERROR' && (
        <div className="card" style={{ textAlign: 'center', borderTop: `4px solid var(--danger)` }}>
          <AlertTriangle size={40} color="var(--danger)" style={{ marginBottom: '12px' }} />
          <h2 style={{ color: 'var(--danger)' }}>Analysis Error</h2>
          <p style={{ marginBottom: '20px' }}>{error}</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setState('START')}>Try Again</button>
            {error?.includes('refresh') && (
              <button className="btn btn-outline" onClick={() => chrome.tabs.reload()}>Refresh Page</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
