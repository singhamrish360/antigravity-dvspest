import React, { useState } from 'react';
import { store } from '../../core/store';
import { Plus, Edit, Check, X } from 'lucide-react';
import { FeedbackStatus, Customer } from '../../core/types';
import { CustomerDirectory } from '../crm/CustomerDirectory';
import { CustomerProfileDetail } from '../crm/CustomerProfileDetail';
import { LeadPipeline } from '../crm/LeadPipeline';

interface Props {
  activeModule: string;
}

export const AdminModulesManager: React.FC<Props> = ({ activeModule }) => {
  const [, setRefreshKey] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  // Module 1: Customers Master Database (CRM Integration)
  if (activeModule === 'customers') {
    return (
      <div className="glass-panel" style={{ background: '#ffffff', minHeight: '500px' }}>
        {selectedCustomer ? (
          <CustomerProfileDetail 
            customer={selectedCustomer} 
            onBack={() => setSelectedCustomer(null)} 
          />
        ) : (
          <CustomerDirectory 
            onSelectCustomer={(cust) => setSelectedCustomer(cust)} 
          />
        )}
      </div>
    );
  }

  // Module 2: Lead Pipeline Kanban (CRM Integration)
  if (activeModule === 'leads') {
    return (
      <div className="glass-panel" style={{ background: '#ffffff', minHeight: '500px' }}>
        <LeadPipeline />
      </div>
    );
  }

  // Module 3: Service Requests
  if (activeModule === 'requests') {
    const leads = store.getLeads();
    return (
      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Inspection & Consultation Pipeline</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--bg-glass-border)' }}>
                <th style={{ padding: '0.85rem' }}>Lead ID</th>
                <th style={{ padding: '0.85rem' }}>Customer Name</th>
                <th style={{ padding: '0.85rem' }}>Service Requested</th>
                <th style={{ padding: '0.85rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                  <td style={{ padding: '0.85rem' }}>{l.id}</td>
                  <td style={{ padding: '0.85rem', fontWeight: 700 }}>{l.customerName}</td>
                  <td style={{ padding: '0.85rem' }}>{l.serviceRequested}</td>
                  <td style={{ padding: '0.85rem' }}><span className="badge badge-warning">{l.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Module 4: Employees Management
  if (activeModule === 'employees') {
    const employees = store.getEmployees();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEmp, setEditingEmp] = useState<any | null>(null);

    // Form Fields
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('Field Technician');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [assignedJobs, setAssignedJobs] = useState(0);
    const [rating, setRating] = useState(5.0);

    const handleOpenAdd = () => {
      setEditingEmp(null);
      setFullName('');
      setRole('Field Technician');
      setEmail('');
      setPhone('');
      setAssignedJobs(0);
      setRating(5.0);
      setIsFormOpen(true);
    };

    const handleOpenEdit = (emp: any) => {
      setEditingEmp(emp);
      setFullName(emp.fullName);
      setRole(emp.role);
      setEmail(emp.email);
      setPhone(emp.phone);
      setAssignedJobs(emp.assignedJobsCount);
      setRating(emp.rating);
      setIsFormOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const id = editingEmp ? editingEmp.id : `EMP-${Math.floor(100 + Math.random() * 900)}`;
      store.saveEmployee({
        id,
        fullName,
        role: role as any,
        email,
        phone,
        assignedJobsCount: Number(assignedJobs),
        rating: Number(rating),
        status: 'Active'
      });
      setIsFormOpen(false);
      triggerRefresh();
    };

    const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this personnel member from the DVS Roster?')) {
        store.deleteEmployee(id);
        triggerRefresh();
      }
    };

    return (
      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Technicians Roster & Operations</h2>
          {!isFormOpen && (
            <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
              <Plus size={16} /> Add New Personnel
            </button>
          )}
        </div>

        {/* Form Container */}
        {isFormOpen && (
          <form onSubmit={handleSubmit} className="glass-card" style={{ background: 'var(--bg-secondary)', marginBottom: '2rem', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.25rem' }}>{editingEmp ? 'Edit Personnel Member' : 'Add New Personnel Member'}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Role Category</label>
                <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="Field Technician">Field Technician</option>
                  <option value="Support Specialist">Support Specialist</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="text" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Jobs</label>
                <input type="number" className="form-control" value={assignedJobs} onChange={e => setAssignedJobs(Number(e.target.value))} min="0" />
              </div>

              <div className="form-group">
                <label className="form-label">Performance Rating (1.0 - 5.0)</label>
                <input type="number" step="0.1" className="form-control" value={rating} onChange={e => setRating(Number(e.target.value))} min="1.0" max="5.0" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsFormOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm">Save Member</button>
            </div>
          </form>
        )}

        {employees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No personnel registered. Click "Add New Personnel" to seed your Lucknow & UP roster!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {employees.map(emp => (
              <div key={emp.id} className="glass-card" style={{ background: '#faf8f5', border: '1px solid var(--bg-glass-border)' }}>
                <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>{emp.role}</span>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{emp.fullName}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{emp.email}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{emp.phone}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--bg-glass-border)', marginBottom: '1.25rem' }}>
                  <span>Assigned Jobs: <strong>{emp.assignedJobsCount}</strong></span>
                  <span style={{ color: '#d97706', fontWeight: 700 }}>★ {emp.rating}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => handleOpenEdit(emp)}>Edit</button>
                  <button className="btn btn-outline btn-sm" style={{ borderColor: '#dc2626', color: '#dc2626', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => handleDelete(emp.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Module 5 & 12: Services & Pricing CMS
  if (activeModule === 'services' || activeModule === 'pricing') {
    const services = store.getServices();
    return (
      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Services & Rates Manager (₹)</h2>
          <button className="btn btn-primary btn-sm" onClick={() => alert('Add Service Dialog Configured')}>
            <Plus size={16} /> Add New Service Offering
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {services.map(srv => (
            <div key={srv.id} className="glass-card" style={{ background: '#faf8f5' }}>
              <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>{srv.category}</span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{srv.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{srv.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--bg-glass-border)' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent-primary)' }}>₹{srv.basePrice.toLocaleString()}</span>
                <button className="btn btn-secondary btn-sm"><Edit size={14} /> Edit Rates</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Module 8 & 9: Feedback Moderation
  if (activeModule === 'feedback' || activeModule === 'reviews') {
    const feedback = store.getFeedback();
    return (
      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Feedback Moderation Panel</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {feedback.map(item => (
            <div key={item.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#faf8f5' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700 }}>{item.customerName}</span>
                  <span className={`badge ${item.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>{item.status}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>"{item.comment}"</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => { store.updateFeedbackStatus(item.id, 'Approved' as FeedbackStatus); triggerRefresh(); }}>
                  <Check size={14} /> Approve
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => { store.updateFeedbackStatus(item.id, 'Rejected' as FeedbackStatus); triggerRefresh(); }}>
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fallback for remaining modules
  return (
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', background: '#ffffff' }}>
      <h2 style={{ marginBottom: '0.5rem', textTransform: 'capitalize' }}>{activeModule.replace('-', ' ')} Module</h2>
      <p style={{ color: 'var(--text-secondary)' }}>DVS Enterprise module active for Lucknow headquarters.</p>
    </div>
  );
};
