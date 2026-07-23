import React, { useState, useEffect } from 'react';
import { 
  Shield, Calendar, Clock, AlertTriangle, CheckCircle, FileText, 
  Send, User, LogOut, Phone, Mail, MapPin, Sparkles, AlertCircle
} from 'lucide-react';
import { security } from '../../core/security';
import { store } from '../../core/store';
import { Lead } from '../../core/types';
import { addFirestoreDocument, getFirestoreCollection } from '../../core/db';

interface Props {
  setMode: (mode: any) => void;
}

export const CustomerDashboard: React.FC<Props> = ({ setMode }) => {
  const session = security.getSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'book' | 'history' | 'complaints'>('overview');
  const [leads, setLeads] = useState<Lead[]>(store.getLeads());
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  // Booking Form State
  const [propertyType, setPropertyType] = useState('Residential');
  const [service, setService] = useState('Advanced Cockroaches Control');
  const [squareFeet, setSquareFeet] = useState(1500);
  const [location, setLocation] = useState('');
  const [referral, setReferral] = useState('Google India Search');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedLeadId, setGeneratedLeadId] = useState('');

  // Complaint Form State
  const [complaintText, setComplaintText] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Sync leads from store
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setLeads(store.getLeads());
    });
    return unsubscribe;
  }, []);

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const data = await getFirestoreCollection('complaints');
      const filtered = data.filter((c: any) => 
        c.userId === session.userId || 
        (session.email && c.email?.toLowerCase() === session.email.toLowerCase())
      );
      setComplaints(filtered);
    } catch (e) {
      console.error('Failed to load complaints:', e);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [session.userId]);

  // Filter bookings for this customer
  const myBookings = leads.filter(lead => 
    (session.email && lead.email?.toLowerCase() === session.email.toLowerCase()) || 
    (session.phoneNumber && lead.phone === session.phoneNumber)
  );

  const handleSignOut = () => {
    // Force reset auth session by changing view mode
    setMode('public');
    // Clear security state
    window.location.reload();
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead = store.addLead({
      customerName: session.userName,
      email: session.email || '',
      phone: session.phoneNumber || '9330478897', // fallback
      serviceRequested: service,
      propertyType: propertyType as any,
      squareFeet: Number(squareFeet),
      location: location,
      referralSource: referral
    });
    setGeneratedLeadId(newLead.id);
    setBookingSuccess(true);
    setLocation('');
    setTimeout(() => {
      setBookingSuccess(false);
      setActiveTab('history');
    }, 3000);
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText) return;

    const newComplaint = {
      id: `COMP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: session.userId,
      customerName: session.userName,
      email: session.email || 'Not Provided',
      phone: session.phoneNumber || 'Not Provided',
      bookingId: selectedBookingId || 'General',
      text: complaintText,
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    await addFirestoreDocument('complaints', newComplaint);
    setComplaintText('');
    setSelectedBookingId('');
    setComplaintSuccess(true);
    fetchComplaints();
    setTimeout(() => {
      setComplaintSuccess(false);
    }, 4000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #faf8f5 0%, #f4efe6 100%)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header */}
      <header className="glass-panel" style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', background: 'rgba(255, 255, 255, 0.8)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Shield size={22} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                DVS PEST CONTROL
              </span>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Premium Client Portal
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} />
              </div>
              <div style={{ fontSize: '0.9rem', textAlign: 'right' }}>
                <div style={{ fontWeight: 600 }}>{session.userName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Premium Member</div>
              </div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={handleSignOut} style={{ borderColor: '#ef4444', color: '#ef4444' }}>
              <LogOut size={14} /> Exit Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ flexGrow: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem', flexDirection: 'column' }}>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '0.5rem' }}>
          {(['overview', 'book', 'history', 'complaints'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
              style={{
                textTransform: 'capitalize',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {tab === 'book' ? 'Book Inspection' : tab === 'history' ? 'My Bookings' : tab === 'complaints' ? 'Lodge Complaint' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flexGrow: 1 }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Premium Welcome Card */}
              <div className="glass-panel" style={{ 
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                color: '#ffffff', 
                padding: '3rem 2rem', 
                borderRadius: 'var(--radius-lg)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', right: '5%', top: '10%', opacity: 0.1, color: '#ffffff' }}>
                  <Shield size={180} />
                </div>
                <div style={{ maxWidth: '600px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(217, 119, 6, 0.2)', padding: '0.5rem 1rem', borderRadius: '20px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                    <Sparkles size={14} /> DVS Premium Service Tier
                  </div>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
                    Welcome back, {session.userName}!
                  </h1>
                  <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    Access ultimate pest disinfection & barrier infrastructure right from your dashboard. We maintain clean, safe, and protected spaces for your home or commercial complexes.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => setActiveTab('book')}>
                      Book New Inspection
                    </button>
                    <button className="btn btn-outline" onClick={() => setActiveTab('history')} style={{ color: '#ffffff', borderColor: '#ffffff' }}>
                      View Booking Status
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#fff' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>My Active Bookings</h3>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {myBookings.length}
                    </div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#fff' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed Inspected Areas</h3>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {myBookings.filter(b => b.status === 'Completed').length}
                    </div>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#fff' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Support Cases</h3>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {complaints.filter(c => c.status === 'Open').length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Contact Sidebar details */}
              <div className="glass-panel" style={{ padding: '2rem', background: '#fff', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} /> DVS Customer Support Line
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Phone style={{ color: 'var(--accent-primary)' }} size={20} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lucknow Helpline</div>
                      <div style={{ fontWeight: 600 }}>+91 93304 78897</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mail style={{ color: 'var(--accent-primary)' }} size={20} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Support</div>
                      <div style={{ fontWeight: 600 }}>dvsinfrapest@gmail.com</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MapPin style={{ color: 'var(--accent-primary)' }} size={20} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Headquarters</div>
                      <div style={{ fontWeight: 600 }}>Lucknow, UP</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BOOK INSPECTION */}
          {activeTab === 'book' && (
            <div className="glass-panel" style={{ padding: '2.5rem', background: '#fff', borderRadius: 'var(--radius-lg)', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Schedule Premium Disinfection</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Book a professional DVS technician dispatch to your property.</p>
              </div>

              {bookingSuccess ? (
                <div style={{ padding: '3rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <CheckCircle size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Inspection Request Registered!</h3>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                    Your request has been logged. Lead reference ID: <strong>{generatedLeadId}</strong>. Redirecting you to your bookings pipeline...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Prefilled user details read-only display */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Contact Name</label>
                      <div style={{ fontWeight: 600 }}>{session.userName}</div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Linked Email</label>
                      <div style={{ fontWeight: 600 }}>{session.email || 'Not Associated'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Property Classification</label>
                      <select className="form-control" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                        <option value="Residential">Residential Homes & Apartments</option>
                        <option value="Commercial">Commercial (Offices, Shops, Kitchens)</option>
                        <option value="Industrial">Industrial (Warehousing, Mills)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Requested Treatment Service</label>
                      <select className="form-control" value={service} onChange={e => setService(e.target.value)}>
                        <option value="Advanced Cockroaches Control">Advanced Cockroaches Control</option>
                        <option value="Smart Rodents Control & Exclusion">Smart Rodents Control & Exclusion</option>
                        <option value="Anti-Mosquitoes Fogging & Larvicide">Anti-Mosquitoes Fogging & Larvicide</option>
                        <option value="Subterranean Termites Control Shield">Subterranean Termites Control Shield</option>
                        <option value="Industrial Fumigation">Industrial Fumigation</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Approximate Carpet Area (Sq. Ft.)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        required 
                        value={squareFeet} 
                        onChange={e => setSquareFeet(Number(e.target.value))} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">How Did You Find Us?</label>
                      <select className="form-control" value={referral} onChange={e => setReferral(e.target.value)}>
                        <option value="Google India Search">Google India Search</option>
                        <option value="Referral">Client Recommendation</option>
                        <option value="Newspaper">Local Newspaper / Print Ads</option>
                        <option value="Social Media">Social Media Platforms</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Execution Address / Landmark in Lucknow</label>
                    <textarea 
                      className="form-control" 
                      required 
                      rows={3} 
                      placeholder="e.g. Flat 302, Block A, Gomti Nagar Extension, Lucknow" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'center', padding: '0.75rem 3rem' }}>
                    <Send size={16} /> Dispatch Booking Request
                  </button>

                </form>
              )}
            </div>
          )}

          {/* TAB 3: MY BOOKINGS */}
          {activeTab === 'history' && (
            <div className="glass-panel" style={{ padding: '2rem', background: '#fff', borderRadius: 'var(--radius-lg)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Your Active & Past Bookings</h2>
              
              {myBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                  <Calendar size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                  <p>You have not logged any inspection requests yet.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('book')} style={{ marginTop: '1rem' }}>
                    Book First Treatment
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myBookings.map(booking => (
                    <div key={booking.id} style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--bg-glass-border)',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.5rem',
                      flexWrap: 'wrap'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{booking.id}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(booking.timestamp).toLocaleDateString('en-IN')}</span>
                        </div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{booking.serviceRequested}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <MapPin size={14} /> {booking.location}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>Property Size</div>
                          <div style={{ fontWeight: 600 }}>{booking.squareFeet} Sq. Ft.</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>Status</div>
                          <span className={`badge ${
                            booking.status === 'Completed' ? 'badge-success' : 
                            booking.status === 'Scheduled' || (booking.status as string) === 'In Progress' ? 'badge-info' : 
                            'badge-warning'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LODGE COMPLAINT */}
          {activeTab === 'complaints' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' }}>
              
              {/* Submission Form */}
              <div className="glass-panel" style={{ padding: '2rem', background: '#fff', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Lodge a Complaint</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  If you noticed any pest activity post-treatment, or had issues with technician dispatch, please let us know immediately.
                </p>

                {complaintSuccess ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#10b981' }}>
                    <CheckCircle size={40} style={{ margin: '0 auto 0.75rem auto' }} />
                    <h4 style={{ fontWeight: 700 }}>Complaint Registered!</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Our customer success team will investigate this and call you within 2 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleComplaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    <div className="form-group">
                      <label className="form-label">Select Associated Booking Reference</label>
                      <select 
                        className="form-control" 
                        value={selectedBookingId} 
                        onChange={e => setSelectedBookingId(e.target.value)}
                      >
                        <option value="">General Issue (No Booking Selected)</option>
                        {myBookings.map(b => (
                          <option key={b.id} value={b.id}>{b.id} - {b.serviceRequested}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Describe the Issue in Detail</label>
                      <textarea 
                        className="form-control" 
                        required 
                        rows={4} 
                        placeholder="e.g. Noticed cockroach activity in the kitchen drawer 2 days after gel application..." 
                        value={complaintText} 
                        onChange={e => setComplaintText(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                      <AlertCircle size={16} /> Submit Complaint
                    </button>
                  </form>
                )}
              </div>

              {/* Complaints History */}
              <div className="glass-panel" style={{ padding: '2rem', background: '#fff', borderRadius: 'var(--radius-lg)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Your Complaint History</h2>

                {loadingComplaints ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>Loading your complaints...</div>
                ) : complaints.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                    <CheckCircle size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.4, color: '#10b981' }} />
                    <p>No complaints lodged. Your properties are fully protected and safe!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {complaints.map((c: any) => (
                      <div key={c.id} style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--bg-glass-border)',
                        background: '#fafafa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#dc2626' }}>{c.id}</span>
                          <span className={`badge ${c.status === 'Resolved' ? 'badge-success' : 'badge-warning'}`}>
                            {c.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0', fontStyle: 'italic', color: 'var(--text-primary)' }}>
                          "{c.text}"
                        </p>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Booking ref: <strong>{c.bookingId}</strong> • Lodged on: {new Date(c.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Footer */}
      <footer style={{ background: '#1e293b', color: '#94a3b8', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.85rem', borderTop: '1px solid #334155', marginTop: 'auto' }}>
        © 2026 DVS PEST CONTROL INFRASTRUCTURE CO. All rights reserved. Premium Client Portal.
      </footer>

    </div>
  );
};
