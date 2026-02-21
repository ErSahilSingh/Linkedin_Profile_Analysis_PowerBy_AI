import React from 'react';
import { CheckCircle2, Lightbulb, TrendingUp, Copy, RefreshCcw } from 'lucide-react';

interface ResultsProps {
  data: any;
  onReanalyze: () => void;
}

const ResultsDisplay: React.FC<ResultsProps> = ({ data, onReanalyze }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-mid';
    return 'score-low';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="results-container">
      <div className="card" style={{ textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Overall Profile Score</h3>
        <div className={`score-badge ${getScoreColor(data.overallScore)}`} style={{ fontSize: '48px' }}>
          {data.overallScore}
        </div>
        <p style={{ margin: '12px 0', fontSize: '14px' }}>{data.reasoning}</p>
      </div>

      <div className="card">
        <h3>Section Scores</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {Object.entries(data.scores).map(([key, score]: [string, any]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ textTransform: 'capitalize' }}>{key}:</span>
              <span className={getScoreColor(score)} style={{ fontWeight: 'bold' }}>{score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={20} className="score-mid" />
          Critical Improvements
        </h3>
        {Object.entries(data.improvements).map(([section, tips]: [string, any]) => (
          <div key={section} style={{ marginBottom: '12px' }}>
            <h4 style={{ textTransform: 'capitalize', margin: '4px 0', fontSize: '14px' }}>{section}</h4>
            <ul style={{ margin: '4px 0', paddingLeft: '20px', fontSize: '13px' }}>
              {tips.map((tip: string, i: number) => (
                <li key={i} style={{ marginBottom: '4px' }}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} className="score-high" />
          Recommended Keywords
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {data.missingKeywords.map((kw: string, i: number) => (
            <span key={i} style={{ background: 'rgba(10, 102, 194, 0.1)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={20} />
          Better Headlines
        </h3>
        {data.headlineRecommendations.map((h: string, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-color)', padding: '8px', borderRadius: '4px', marginBottom: '8px', fontSize: '13px' }}>
            <span style={{ flex: 1 }}>{h}</span>
            <button className="btn" onClick={() => copyToClipboard(h)} title="Copy to clipboard">
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', paddingBottom: '16px' }}>
        <button className="btn btn-primary" style={{ flex: 1, gap: '8px' }} onClick={onReanalyze}>
          <RefreshCcw size={18} />
          Re-analyze Profile
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
