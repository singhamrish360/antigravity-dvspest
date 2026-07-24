import React, { useState } from 'react';
import { Check, Clock, ArrowRight, Calculator, Table } from 'lucide-react';
import { store } from '../../core/store';

interface Props {
  onBookClick: () => void;
}

export const ServicesPage: React.FC<Props> = ({ onBookClick }) => {
  const services = store.getServices();
  const [calcSqFt, setCalcSqFt] = useState<number>(2500);
  const [calcServiceId, setCalcServiceId] = useState<string>(services[0]?.id || '');
  const [highlightedBhk, setHighlightedBhk] = useState<number | null>(null);

  const selectedService = services.find(s => s.id === calcServiceId) || services[0];
  const calculatedEstimate = selectedService ? Math.round(selectedService.basePrice * (calcSqFt / 1500)) : 0;

  // Exact pricing data from the user's Lucknow rates chart
  const bhkPricing = [
    { pest: 'Bees Control', rates: [1299, 1549, 1799, 2049, 2399] },
    { pest: 'General Pest Control Charges', rates: [899, 1300, 1600, 1800, 2100] },
    { pest: 'Cockroach Control Rates', rates: [999, 1199, 1499, 1799, 1999] },
    { pest: 'Ant Control Charges', rates: [949, 1299, 1549, 1899, 2099] },
    { pest: 'Termite Control Charges', rates: [3249, 5500, 6500, 7500, 8500] },
    { pest: 'Mosquito Control cost', rates: [999, 1899, 2600, 3000, 3300] },
    { pest: 'Charges for Bird Netting Services', rates: [1300, 2400, 3500, 4400, 5300] },
    { pest: 'Lizard Control Charges', rates: [900, 1500, 1800, 2100, 2500] },
    { pest: 'Bed Bug Control Charges', rates: [1399, 2599, 3399, 3999, 4499] }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <div className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>DVS Rate Card</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Pest Control & Fumigation Services</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Transparent rate schedules in Indian Rupees (₹) for residential and commercial treatments across Lucknow & UP.
        </p>
      </div>

      {/* BHK Pricing Matrix Section (Direct replication of Lucknow Rates Chart) */}
      <div className="glass-panel" style={{ padding: '2.5rem', background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Table size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Pricing for Pest Control Services in Lucknow</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>BHK Apartment Rate Card Matrix (Hover to highlight columns)</p>
            </div>
          </div>

          {/* BHK Highlight Quick Controls */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button 
                key={num}
                type="button"
                className={`btn btn-sm ${highlightedBhk === num ? 'btn-primary' : 'btn-secondary'}`}
                onMouseEnter={() => setHighlightedBhk(num)}
                onMouseLeave={() => setHighlightedBhk(null)}
                style={{ minWidth: '70px' }}
              >
                {num} BHK
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--bg-glass-border)' }}>
                <th style={{ padding: '1rem 0.75rem', fontWeight: 800 }}>Types Of Pest</th>
                {[1, 2, 3, 4, 5].map((num) => (
                  <th 
                    key={num} 
                    style={{ 
                      padding: '1rem 0.75rem', 
                      textAlign: 'center', 
                      fontWeight: 800,
                      background: highlightedBhk === num ? '#fef3c7' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    {num} BHK
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bhkPricing.map((item, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  style={{ 
                    borderBottom: '1px solid var(--bg-glass-border)',
                    background: rowIndex % 2 === 0 ? '#faf8f5' : '#ffffff',
                    transition: 'background 0.2s'
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.pest}</td>
                  {item.rates.map((rate, colIndex) => {
                    const bhkNum = colIndex + 1;
                    const isHighlighted = highlightedBhk === bhkNum;
                    return (
                      <td 
                        key={colIndex} 
                        style={{ 
                          padding: '0.85rem 0.75rem', 
                          textAlign: 'center',
                          fontWeight: isHighlighted ? 800 : 500,
                          color: isHighlighted ? 'var(--accent-primary)' : 'var(--text-primary)',
                          background: isHighlighted ? '#fffbeb' : 'transparent',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Rs {rate}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={onBookClick}>
            Book Inspection & Lock these Rates <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {services.map(srv => (
          <div key={srv.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
            
            {srv.id === 'SRV-101' || srv.id === 'SRV-102' || srv.id === 'SRV-103' || srv.id === 'SRV-104' || srv.id === 'SRV-105' ? (
              <div style={{ 
                width: '100%', 
                height: '240px', 
                borderRadius: 'var(--radius-sm)', 
                marginBottom: '1.5rem',
                backgroundImage: 'url(/services-grid.jpg)',
                backgroundSize: '205% 205%',
                backgroundPosition: 
                  srv.id === 'SRV-101' ? '0% 0%' : // Top Left (Cockroaches)
                  srv.id === 'SRV-102' ? '100% 0%' : // Top Right (Rodents)
                  srv.id === 'SRV-103' ? '0% 100%' : // Bottom Left (Mosquitoes)
                  srv.id === 'SRV-104' ? '100% 100%' : // Bottom Right (Termites)
                  '0% 100%', // Bottom Left for fumigation
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                border: '1px solid var(--bg-glass-border)'
              }} />
            ) : (
              <img src={srv.imageUrl} alt={srv.title} style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }} />
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-info">{srv.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} /> {srv.durationMinutes} mins
              </span>
            </div>

            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>{srv.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6, flexGrow: 1 }}>
              {srv.description}
            </p>

            <div style={{ marginBottom: '1.5rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>SERVICE HIGHLIGHTS</span>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                {srv.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={14} style={{ color: 'var(--accent-secondary)' }} /> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--bg-glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>BASE RATE</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent-primary)' }}>₹{srv.basePrice.toLocaleString()}</span>
              </div>
              <button className="btn btn-primary" onClick={onBookClick}>
                Book Now <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Pricing Estimator */}
      <style dangerouslySetInnerHTML={{ __html: `
        .calculator-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
        }
        @media (max-width: 768px) {
          .calculator-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}} />
      
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-surface)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="badge badge-success" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calculator size={14} /> Property Rate Matrix (₹)
          </div>
          <h2 style={{ fontSize: '2rem' }}>Property Scale Cost Calculator</h2>
        </div>

        <div className="calculator-grid" style={{ maxWidth: '700px', margin: '0 auto', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div className="form-group">
              <label className="form-label">Select Service Offering</label>
              <select className="form-control" value={calcServiceId} onChange={e => setCalcServiceId(e.target.value)}>
                {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Property Footprint: {calcSqFt.toLocaleString()} Sq. Ft.</label>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={calcSqFt}
                onChange={e => setCalcSqFt(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div className="glass-card" style={{ textAlign: 'center', padding: '2rem', background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>ESTIMATED TREATMENT INVESTMENT</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2.8rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>
              ₹{calculatedEstimate.toLocaleString()}
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onBookClick}>
              Confirm Inspection Request
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
