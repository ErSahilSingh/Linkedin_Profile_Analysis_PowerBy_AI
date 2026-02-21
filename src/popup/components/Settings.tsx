import React, { useState, useEffect } from 'react';
import { getStorage, setStorage } from '../../utils/storage';
import { Key, Save, CheckCircle } from 'lucide-react';

interface SettingsProps {
  onSaved: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onSaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getStorage('gemini_api_key').then(key => {
      if (key) setApiKey(key);
    });
  }, []);

  const handleSave = async () => {
    await setStorage('gemini_api_key', apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onSaved();
    }, 1500);
  };

  return (
    <div className="card">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
        <Key size={20} />
        Gemini API Settings
      </h2>
      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Enter your Google Gemini API key to enable analysis. Your key is stored securely in your browser.
      </p>
      <input
        type="password"
        className="input"
        placeholder="Enter Gemini API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button 
        className="btn btn-primary" 
        onClick={handleSave}
        disabled={!apiKey}
        style={{ width: '100%', gap: '8px' }}
      >
        {saved ? <CheckCircle size={18} /> : <Save size={18} />}
        {saved ? 'Saved!' : 'Save API Key'}
      </button>
    </div>
  );
};

export default Settings;
