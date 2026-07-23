import { 
  Customer, Lead, ServiceItem, ServiceHistoryRecord, QuotationRecord, 
  AMCRecord, WarrantyRecord, FeedbackRecord, BlogPost, Employee, 
  AuditLog, EmailTemplate, SystemSettings, LeadStatus, FeedbackStatus 
} from './types';

import { 
  initialCustomers, initialLeads, initialServices, initialServiceHistory, 
  initialQuotes, initialAMCs, initialWarranties, initialFeedback, 
  initialBlogs, initialEmployees, initialAuditLogs, initialEmailTemplates, 
  initialSystemSettings 
} from './mockData';

import { 
  getFirestoreCollection, 
  setFirestoreDocument, 
  addFirestoreDocument, 
  updateFirestoreDocument,
  seedFirestoreIfEmpty 
} from './db';
import { sendLeadNotificationEmail } from './email';

type Listener = () => void;

class EnterpriseStore {
  private customers: Customer[] = initialCustomers;
  private leads: Lead[] = initialLeads;
  private services: ServiceItem[] = initialServices;
  private serviceHistory: ServiceHistoryRecord[] = initialServiceHistory;
  private quotes: QuotationRecord[] = initialQuotes;
  private amcs: AMCRecord[] = initialAMCs;
  private warranties: WarrantyRecord[] = initialWarranties;
  private feedback: FeedbackRecord[] = initialFeedback;
  private blogs: BlogPost[] = initialBlogs;
  private employees: Employee[] = initialEmployees;
  private auditLogs: AuditLog[] = initialAuditLogs;
  private emailTemplates: EmailTemplate[] = initialEmailTemplates;
  private settings: SystemSettings = initialSystemSettings;

  private listeners: Set<Listener> = new Set();

  constructor() {
    this.initFirebaseData();
  }

  // Initialize and synchronize data with Firestore
  private async initFirebaseData() {
    try {
      // Seed Firestore with initial mock data if empty
      await seedFirestoreIfEmpty();

      // Load collections from Firestore
      this.customers = await getFirestoreCollection('customers');
      this.leads = await getFirestoreCollection('leads');
      this.services = await getFirestoreCollection('services');
      this.feedback = await getFirestoreCollection('feedback');
      
      const settingsData = await getFirestoreCollection('settings');
      if (settingsData && settingsData.length > 0) {
        this.settings = settingsData[0];
      }

      this.notify();
      console.log('🔥 Synchronized Enterprise Store with Cloud Firestore.');
    } catch (error) {
      console.warn('⚠️ Could not sync with Firestore, falling back to local memory storage:', error);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  public logAudit(action: string, moduleName: string, details: string, user = 'Current Administrator') {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      user,
      action,
      module: moduleName,
      ipAddress: '192.168.1.50',
      details
    };
    this.auditLogs = [newLog, ...this.auditLogs];
    // Sync audit trail to Firestore background
    addFirestoreDocument('audit_logs', newLog).catch(() => {});
    this.notify();
  }

  // Getters
  public getCustomers = () => this.customers;
  public getLeads = () => this.leads;
  public getServices = () => this.services;
  public getServiceHistory = () => this.serviceHistory;
  public getQuotes = () => this.quotes;
  public getAMCs = () => this.amcs;
  public getWarranties = () => this.warranties;
  public getFeedback = () => this.feedback;
  public getBlogs = () => this.blogs;
  public getEmployees = () => this.employees;
  public getAuditLogs = () => this.auditLogs;
  public getEmailTemplates = () => this.emailTemplates;
  public getSettings = () => this.settings;

  // Lead Management Actions with Firestore Sync
  public addLead(leadData: Omit<Lead, 'id' | 'timestamp' | 'status'>): Lead {
    const id = `LEAD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: Lead = {
      ...leadData,
      id,
      timestamp: new Date().toISOString(),
      status: 'New'
    };
    this.leads = [newLead, ...this.leads];
    
    // Sync to Firestore
    setFirestoreDocument('leads', id, newLead).catch(err => console.error(err));
    
    // Dispatch email notification to singhamrish360@gmail.com
    sendLeadNotificationEmail(newLead).catch(err => console.error('Failed to notify admin via email:', err));
    
    this.logAudit('LEAD_CREATED', 'Consultation Form', `Created new lead ${id} for ${leadData.customerName}`);
    return newLead;
  }

  public updateLeadStatus(leadId: string, newStatus: LeadStatus) {
    this.leads = this.leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
    
    // Sync update to Firestore
    updateFirestoreDocument('leads', leadId, { status: newStatus }).catch(err => console.error(err));
    this.logAudit('LEAD_STATUS_CHANGED', 'Lead Pipeline', `Updated status of lead ${leadId} to ${newStatus}`);
  }

  // Feedback Management Actions with Firestore Sync
  public updateFeedbackStatus(id: string, status: FeedbackStatus) {
    this.feedback = this.feedback.map(f => f.id === id ? { ...f, status } : f);
    
    // Sync to Firestore
    updateFirestoreDocument('feedback', id, { status }).catch(err => console.error(err));
    this.logAudit('FEEDBACK_MODERATED', 'Feedback Moderation', `Set feedback ${id} status to ${status}`);
  }

  public togglePinFeedback(id: string) {
    const feedbackItem = this.feedback.find(f => f.id === id);
    const newPinnedStatus = feedbackItem ? !feedbackItem.isPinned : false;
    
    this.feedback = this.feedback.map(f => f.id === id ? { ...f, isPinned: newPinnedStatus } : f);
    
    // Sync to Firestore
    updateFirestoreDocument('feedback', id, { isPinned: newPinnedStatus }).catch(err => console.error(err));
    this.notify();
  }

  // Service CMS Actions with Firestore Sync
  public saveService(service: ServiceItem) {
    const exists = this.services.some(s => s.id === service.id);
    if (exists) {
      this.services = this.services.map(s => s.id === service.id ? service : s);
    } else {
      this.services = [...this.services, service];
    }
    
    // Sync to Firestore
    setFirestoreDocument('services', service.id, service).catch(err => console.error(err));
    this.logAudit('SERVICE_SAVED', 'Services CMS', `Saved service ${service.title}`);
  }

  // Blog CMS Actions
  public saveBlog(blog: BlogPost) {
    const exists = this.blogs.some(b => b.id === blog.id);
    if (exists) {
      this.blogs = this.blogs.map(b => b.id === blog.id ? blog : b);
    } else {
      this.blogs = [blog, ...this.blogs];
    }
    
    // Sync to Firestore
    setFirestoreDocument('blogs', blog.id, blog).catch(err => console.error(err));
    this.logAudit('BLOG_SAVED', 'Blog CMS', `Saved blog article: ${blog.title}`);
  }

  // Settings Actions with Firestore Sync
  public updateSettings(newSettings: Partial<SystemSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    
    // Sync to Firestore
    setFirestoreDocument('settings', 'global', this.settings).catch(err => console.error(err));
    this.logAudit('SETTINGS_UPDATED', 'System Settings', 'Updated global enterprise system configuration');
  }

  // Data Exporter Helper
  public exportDataToCSV(data: Record<string, any>[], filename: string) {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(val => typeof val === 'object' ? `"${JSON.stringify(val).replace(/"/g, '""')}"` : `"${String(val).replace(/"/g, '""')}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Global Search System Across All Entities
  public globalSearch(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { customers: [], leads: [], blogs: [], services: [] };

    return {
      customers: this.customers.filter(c => c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)),
      leads: this.leads.filter(l => l.customerName.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.serviceRequested.toLowerCase().includes(q)),
      blogs: this.blogs.filter(b => b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)),
      services: this.services.filter(s => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q))
    };
  }
}

export const store = new EnterpriseStore();
