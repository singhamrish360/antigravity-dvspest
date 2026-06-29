import React, { useState } from 'react';
import { Users, Search, Filter, Plus, FileText, ArrowUpRight, DollarSign, ChevronRight } from 'lucide-react';
import { store } from '../../core/store';
import { Customer } from '../../core/types';

interface Props {
  onSelectCustomer: (customer: Customer) => void;
}

export const CustomerDirectory: React.FC<Props> = ({ onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProperty, setFilterProperty] = useState<string>('All');

  const customers = store.getCustomers();

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm);
    const matchesProperty = filterProperty === 'All' || c.address.propertyType === filterProperty;
    return matchesSearch && matchesProperty;
  });

  const handleExportCSV = () => {
    store.exportDataToCSV(customers.map(c => ({
      ID: c.id,
      Name: c.fullName,
      Email: c.email,
      Phone: c.phone,
      PropertyType: c.address.propertyType,
      SquareFeet: c.address.squareFeet,
      LeadSource: c.leadSource,
      LifetimeValue: c.lifetimeValue,
      CreatedAt: c.createdAt
    })), 'Customer_Directory');
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyBetween: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '0.4rem' }}>360° Enterprise Directory</div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Customer Master Database</h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <FileText size={16} /> Export Directory (CSV)
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by customer name, email, phone or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <select className="form-control" style={{ width: '180px' }} value={filterProperty} onChange={e => setFilterProperty(e.target.value)}>
            <option value="All">All Property Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredCustomers.length}</strong> of <strong>{customers.length}</strong> enterprise records
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--bg-glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Customer Profile</th>
                <th style={{ padding: '1rem' }}>Property & Type</th>
                <th style={{ padding: '1rem' }}>Lead Source</th>
                <th style={{ padding: '1rem' }}>Lifetime Value</th>
                <th style={{ padding: '1rem' }}>Next Reminder</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(cust => (
                <tr key={cust.id} style={{ borderBottom: '1px solid var(--bg-glass-border)', transition: 'background var(--transition-fast)' }} className="table-row-hover">
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={cust.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cust.fullName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cust.id} • {cust.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>{cust.address.city}, {cust.address.state}</div>
                    <span className="badge badge-info" style={{ marginTop: '0.2rem' }}>{cust.address.propertyType}</span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {cust.leadSource}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                      ${cust.lifetimeValue.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {cust.nextServiceReminder || 'None Scheduled'}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => onSelectCustomer(cust)}>
                      360° Profile <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
