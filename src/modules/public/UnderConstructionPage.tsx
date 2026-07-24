import React, { useState } from 'react';
import { 
  Hammer, Search, BarChart3, AlertCircle, Cpu, Database, Eye, RefreshCw,
  Layers, Calculator, Calendar, UploadCloud, CheckCircle2, User, Phone, Mail, MapPin
} from 'lucide-react';

export const UnderConstructionPage: React.FC = () => {
  const [scanActive, setScanActive] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Material Estimator State
  const [calcSqFt, setCalcSqFt] = useState<number>(1500);
  const [buildGrade, setBuildGrade] = useState<'premium' | 'standard' | 'basic'>('standard');

  // Timeline Active Stage State
  const [activeStage, setActiveStage] = useState<number>(0);

  // Quote Form State
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteLocation, setQuoteLocation] = useState('');
  const [quoteType, setQuoteType] = useState('Residential Home');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const runAnalysis = () => {
    setScanActive(true);
    setShowTable(false);
    setScanLogs([]);

    const logs = [
      '🛰️ [LINK]: Connecting to Lucknow construction registry...',
      '🧬 [CRAWLER]: Scanning ACC Cement & Ultratech Hazratganj price lists...',
      '🛡️ [SECURITY]: Authenticating with Tata Steel distributor databases...',
      '📊 [AI]: Compiling masonry brick & river bed sand rate schedules...',
      '📈 [MATRIX]: Finalizing aggregate index metrics...'
    ];

    logs.forEach((log, idx) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, log]);
      }, idx * 300);
    });

    setTimeout(() => {
      setScanActive(false);
      setShowTable(true);
    }, 1800);
  };

  // Material Estimation Constants based on Sq. Ft. & Grade
  const materialCoefficients = {
    premium: { cement: 0.45, steel: 0.0045, bricks: 8.5, sand: 1.4, aggregate: 1.6, rate: 2000 },
    standard: { cement: 0.4, steel: 0.004, bricks: 8.0, sand: 1.2, aggregate: 1.4, rate: 1550 },
    basic: { cement: 0.35, steel: 0.0035, bricks: 7.5, sand: 1.0, aggregate: 1.2, rate: 1200 }
  };

  const currentCoeff = materialCoefficients[buildGrade];
  const estimatedCement = Math.round(calcSqFt * currentCoeff.cement);
  const estimatedSteel = (calcSqFt * currentCoeff.steel).toFixed(2);
  const estimatedBricks = Math.round(calcSqFt * currentCoeff.bricks);
  const estimatedSand = Math.round(calcSqFt * currentCoeff.sand);
  const estimatedAggregate = Math.round(calcSqFt * currentCoeff.aggregate);
  const estimatedTotalCost = calcSqFt * currentCoeff.rate;

  // Construction Gantt Stages
  const stages = [
    { title: 'Excavation & Soil Prep', duration: '2 Weeks', details: 'Deep excavation, termite soil trenching, leveling and plinth-beam preparation.' },
    { title: 'Foundation Footings', duration: '3 Weeks', details: 'RCC footing casting, waterproofing barriers, and steel rebar grid checks.' },
    { title: 'RCC Structural Frame', duration: '4 Weeks', details: 'Column erection, roof slab shuttering and casting using Tata steel and premium concrete mixes.' },
    { title: 'Brickwork Masonry', duration: '4 Weeks', details: 'Class-I red brick wall construction, lintel beam framing, and door/window frame fixing.' },
    { title: 'Plastering & Conduits', duration: '3 Weeks', details: 'Internal and external mortar plastering, electric conduit wiring, plumbing pipe runs.' },
    { title: 'Finishing & Paints', duration: '3 Weeks', details: 'Flooring tiles installation, wall putty layering, and premium weather-shield exterior painting.' }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setQuoteName('');
      setQuotePhone('');
      setQuoteEmail('');
      setQuoteLocation('');
    }, 4000);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* Premium Alert Banner */}
      <div className="glass-panel animate-fade-in" style={{ padding: '3rem', background: '#090d16', border: '2px dashed var(--accent-primary)', textAlign: 'center', boxShadow: 'var(--shadow-glow)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Hammer size={32} className="animate-pulse" />
        </div>
        
        <div className="badge badge-warning" style={{ letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Lucknow Sector • Premium Construction Suite
        </div>
        
        <h1 style={{ fontSize: '2.8rem', color: '#ffffff', fontWeight: 800, marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
          Building Construction Infrastructure
        </h1>
        
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 2.5rem auto', lineHeight: 1.7 }}>
          An all-in-one pre-planning dashboard. Calculate material requirements, view standard timelines, and submit blueprints for Lucknow civil works estimation.
        </p>

        {/* Action Button & Loader */}
        <div style={{ maxWidth: '550px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {!scanActive && !showTable && (
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 700 }} onClick={runAnalysis}>
              🚀 Launch Live Lucknow Rate Crawlers
            </button>
          )}

          {scanActive && (
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#fbbf24', fontWeight: 700 }}>
                <RefreshCw size={20} className="animate-spin" />
                <span>ACTIVE CRAWLER SCANNING LUCKNOW MARKETS...</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {scanLogs.map((log, i) => <div key={i}>{log}</div>)}
              </div>
            </div>
          )}

          {showTable && (
            <span style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
              <CheckCircle2 size={18} /> Lucknow Material & Labor cost indexes loaded successfully!
            </span>
          )}
        </div>
      </div>

      {/* cost tables section */}
      {showTable && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Table 1: Material Rates Matrix */}
          <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={22} /> Lucknow Material Cost Index (Live Feed)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--bg-glass-border)' }}>
                    <th style={{ padding: '1rem' }}>Material Class</th>
                    <th style={{ padding: '1rem' }}>Brand / Standard Specification</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Lucknow Base Rate (₹)</th>
                    <th style={{ padding: '1rem' }}>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Cement (OPC/PPC)</td>
                    <td style={{ padding: '1rem' }}>Ultratech Premium Grade</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹440</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per bag (50kg)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Cement (PPC)</td>
                    <td style={{ padding: '1rem' }}>ACC Gold Water Shield</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹410</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per bag (50kg)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Steel Rebars (TMT)</td>
                    <td style={{ padding: '1rem' }}>TATA Tiscon 550SD Fe550</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹68,500</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per Metric Ton</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Red Clay Bricks</td>
                    <td style={{ padding: '1rem' }}>Local Class-I Lucknow Kiln</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹8</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per piece</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>M-Sand (Fine Sand)</td>
                    <td style={{ padding: '1rem' }}>Ghaghara / Sarda Beds (Premium Grade)</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹65</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per Cubic Foot (cft)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '1rem', fontWeight: 700 }}>Aggregate (Grit)</td>
                    <td style={{ padding: '1rem' }}>Jhansi Crushers 20mm Grade</td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>₹80</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>per Cubic Foot (cft)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Feature 1: Interactive Material Quantity Estimator */}
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-surface)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--bg-glass-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="badge badge-success" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calculator size={14} /> Material Estimator
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Construction Material Estimator</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Get standard quantity projections of steel, bricks, and concrete bags based on building footprint.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: 700 }}>Built-Up Plot Area: {calcSqFt.toLocaleString()} Sq. Ft.</label>
              <input 
                type="range" 
                min="500" 
                max="10000" 
                step="100" 
                value={calcSqFt} 
                onChange={e => setCalcSqFt(Number(e.target.value))} 
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Select Material Quality Grade</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['premium', 'standard', 'basic'] as const).map(grade => (
                  <button 
                    key={grade} 
                    type="button" 
                    className={`btn btn-sm ${buildGrade === grade ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setBuildGrade(grade)}
                    style={{ flexGrow: 1, textTransform: 'capitalize', fontWeight: 700 }}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity Outputs Card Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1rem', background: '#ffffff', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cement bags</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '0.25rem' }}>{estimatedCement} bags</div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', background: '#ffffff', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>TMT Rebar Steel</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-secondary)', marginTop: '0.25rem' }}>{estimatedSteel} Tons</div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', background: '#ffffff', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Red clay bricks</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.25rem' }}>{estimatedBricks.toLocaleString()} pcs</div>
            </div>

            <div className="glass-card" style={{ padding: '1rem', background: '#ffffff', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estimated Cost</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>₹{estimatedTotalCost.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Visual Construction Phase Gantt Timeline */}
      <div className="glass-panel" style={{ padding: '3rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-info" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={14} /> Project Timeline
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Standard Building Progress Timeline</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Click on any phase to view details about material verification and curing duration.</p>
        </div>

        {/* Timeline Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {stages.map((stage, i) => (
            <div 
              key={i} 
              onClick={() => setActiveStage(i)}
              className="glass-card"
              style={{ 
                padding: '1.25rem 1rem', 
                textAlign: 'center', 
                cursor: 'pointer',
                border: activeStage === i ? '2px solid var(--accent-primary)' : '1px solid var(--bg-glass-border)',
                background: activeStage === i ? '#fef3c7' : 'var(--bg-secondary)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PHASE 0{i + 1}</div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0.25rem 0' }}>{stage.title}</h4>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{stage.duration}</div>
            </div>
          ))}
        </div>

        {/* Active Stage Details Panel */}
        <div className="glass-card animate-fade-in" style={{ padding: '1.5rem', background: '#faf8f5', borderLeft: '4px solid var(--accent-primary)' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Phase 0{activeStage + 1}: {stages[activeStage].title} ({stages[activeStage].duration})
          </h4>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {stages[activeStage].details}
          </p>
        </div>
      </div>

      {/* Feature 3: Architectural Blueprint Upload & Request Quote Form */}
      <div className="glass-panel" style={{ padding: '3rem', background: 'var(--gradient-surface)', border: '1px solid var(--bg-glass-border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-warning" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <UploadCloud size={14} /> Site Inspection
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Request Structural Cost BOQ & Inspection</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Upload blueprints or submit site footprint details for Lucknow engineer allocation.</p>
        </div>

        <form onSubmit={handleFormSubmit} style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {formSubmitted && (
            <div className="glass-card" style={{ padding: '1.5rem', background: '#d1fae5', border: '1px solid #10b981', color: '#065f46', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
              <CheckCircle2 size={24} />
              <span><strong>Inspection Request Filed!</strong> DVS Construction Desk will reach out to schedule site inspection.</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><User size={14} /> Full Name</label>
              <input type="text" className="form-control" value={quoteName} onChange={e => setQuoteName(e.target.value)} placeholder="e.g. Sahil Khan" required />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> Phone Number</label>
              <input type="text" className="form-control" value={quotePhone} onChange={e => setQuotePhone(e.target.value)} placeholder="e.g. 9330478897" required />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={14} /> Email Address</label>
              <input type="email" className="form-control" value={quoteEmail} onChange={e => setQuoteEmail(e.target.value)} placeholder="e.g. name@domain.com" required />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> Lucknow Site Location</label>
              <input type="text" className="form-control" value={quoteLocation} onChange={e => setQuoteLocation(e.target.value)} placeholder="e.g. Hazratganj, Lucknow" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Project Category</label>
              <select className="form-control" value={quoteType} onChange={e => setQuoteType(e.target.value)}>
                <option value="Residential Home">Residential Home Building</option>
                <option value="Commercial Complex">Commercial Storefront / Complex</option>
                <option value="Industrial Warehouse">Industrial Shed / Warehouse</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Upload Blueprint (PDF/Images)</label>
              <div style={{ position: 'relative', height: '42px', width: '100%' }}>
                <input 
                  type="file" 
                  style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 2 }} 
                  onChange={() => alert('Blueprint file attached successfully!')}
                />
                <div style={{ width: '100%', height: '100%', border: '1px dashed var(--bg-glass-border)', background: '#fff', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  📁 Drag & Drop Blueprint File
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', fontSize: '1.05rem', fontWeight: 700 }}>
            Submit Blueprint for Free BOQ Estimation
          </button>
        </form>
      </div>

      {/* Blueprint Features Mapping */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Search size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Lucknow Web Rate Crawlers</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Our crawling micro-engines scan material websites in Lucknow hourly, tracking prices of bricks, ACC/Ultratech cement, Tata Tiscon steel rebars, and local UP sand grades.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <BarChart3 size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Material Blueprint Calculator</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Calculate required concrete volume, masonry wall brick numbers, and structural steel reinforcement weights based on your design blueprint measurements.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff', border: '1px solid var(--bg-glass-border)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Layers size={24} style={{ color: '#d97706' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>Site Foundation Analysis</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Ensuring deep structural soil checks and anti-termite chemical trench boundaries are integrated directly into the initial excavation phase blueprints.
          </p>
        </div>

      </div>

      {/* Lucknow HQ Notice */}
      <div className="glass-card" style={{ display: 'flex', gap: '1rem', background: '#faf8f5', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-glass-border)', alignItems: 'center' }}>
        <AlertCircle size={24} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong>Launch Notice:</strong> The Construction Rate Matrix module is currently being optimized for Lucknow's building bylaws. Live API connections to UP steel and cement suppliers are scheduled for rollout soon.
        </span>
      </div>

    </div>
  );
};

interface LayersProps {
  size?: number;
  style?: React.CSSProperties;
}

const Layers: React.FC<LayersProps> = ({ size = 24, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
