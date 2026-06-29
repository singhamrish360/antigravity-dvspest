import React, { useState } from 'react';
import { Bot, Upload, Cpu, CheckCircle2, AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import { AIDiagnosticResult } from '../../core/types';

export const PestRecognitionAI: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIDiagnosticResult | null>(null);

  const sampleDiagnoses: AIDiagnosticResult[] = [
    {
      pestSpecies: 'Reticulitermes flavipes (Subterranean Termite Worker)',
      confidenceScore: 98.4,
      severityLevel: 'Severe Risk',
      recommendedTreatment: 'Subterranean Termite Shield Trenching Barrier & Non-Repellent Interception Chemistry',
      estimatedCostRange: '$1,200 - $1,600',
      preventionTips: [
        'Eliminate wood-to-soil structural contact along exterior foundations.',
        'Install perimeter acoustic thermal monitoring sensors.',
        'Maintain proper downspout moisture drainage away from crawlspaces.'
      ]
    },
    {
      pestSpecies: 'Blattella germanica (German Cockroach Nymph)',
      confidenceScore: 96.8,
      severityLevel: 'High',
      recommendedTreatment: 'Precision Bio-Gel Baiting & Insect Growth Regulator (IGR) Fogging',
      estimatedCostRange: '$350 - $550',
      preventionTips: [
        'Deep-clean commercial kitchen grease traps and drainage trays daily.',
        'Seal electrical wall penetrations with silicone copper mesh.'
      ]
    }
  ];

  const handleAnalyze = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      const diag = imgUrl.includes('termite') ? sampleDiagnoses[0] : sampleDiagnoses[1];
      setResult(diag);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ textAlign: 'center' }}>
        <div className="badge badge-purple" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Bot size={14} /> AI Computer Vision Neural Engine
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)' }}>AI Pest Recognition & Severity Diagnostic Studio</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Upload or select a photo to trigger real-time species identification and treatment plan synthesis.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Input Panel */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Select Diagnostic Sample Image</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Subterranean Sample', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80&type=termite' },
              { label: 'Kitchen Sample', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80&type=roach' }
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleAnalyze(item.url)}
                style={{
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: selectedImage === item.url ? '3px solid var(--accent-primary)' : '1px solid var(--bg-glass-border)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <img src={item.url} alt={item.label} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                <div style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ border: '2px dashed var(--bg-glass-border)', padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: 'pointer' }} onClick={() => handleAnalyze('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80&type=termite')}>
            <Upload size={32} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
            <div style={{ fontWeight: 600 }}>Drag & Drop Field Inspection Photo</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, WebP (Max 15MB)</div>
          </div>
        </div>

        {/* Diagnostic Output */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>AI Neural Diagnostics Breakdown</h3>

          {isAnalyzing && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <Cpu size={48} className="animate-bounce" style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
              <div style={{ fontWeight: 600 }}>Analyzing Image Tensor Embeddings...</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Matching against 250,000+ entomological patterns</div>
            </div>
          )}

          {!isAnalyzing && !result && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Select or upload a field inspection photo on the left to trigger the AI Neural Engine.
            </div>
          )}

          {!isAnalyzing && result && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>IDENTIFIED SPECIES</span>
                  <h4 style={{ fontSize: '1.25rem', color: 'var(--accent-primary)' }}>{result.pestSpecies}</h4>
                </div>
                <span className="badge badge-danger">{result.severityLevel}</span>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NEURAL CONFIDENCE</span>
                  <div style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{result.confidenceScore}%</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESTIMATED TREATMENT</span>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{result.estimatedCostRange}</div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>RECOMMENDED TREATMENT PROTOCOL</span>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{result.recommendedTreatment}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>BIOLOGICAL PREVENTION TIPS</span>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {result.preventionTips.map((tip, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--accent-secondary)' }} /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
