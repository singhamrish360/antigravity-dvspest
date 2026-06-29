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

type Listener = () => void;

class EnterpriseStore {
  private customers: Customer[];
  private leads: Lead[];
  private services: ServiceItem[];
  private serviceHistory: ServiceHistoryRecord[];
  private quotes: QuotationRecord[];
  private amcs: AMCRecord[];
  private warranties: WarrantyRecord[];
  private feedback: FeedbackRecord[];
  private blogs: BlogPost[];
  private employees: Employee[];
  private auditLogs: AuditLog[];
  private emailTemplates: EmailTemplate[];
  private settings: SystemSettings;

  private listeners: Set<Listener> = new Set();

  constructor() {
    this.customers = this.loadFromStorage('ag_customers', initialCustomers);
    this.leads = this.loadFromStorage('ag_leads', initialLeads);
    this.services = this.loadFromStorage('ag_services', initialServices);
    this.serviceHistory = this.loadFromStorage('ag_service_history', initialServiceHistory);
    this.quotes = this.loadFromStorage('ag_quotes', initialQuotes);
    this.amcs = this.loadFromStorage('ag_amcs', initialAMCs);
    this.warranties = this.loadFromStorage('ag_warranties', initialWarranties);
    this.feedback = this.loadFromStorage('ag_feedback', initialFeedback);
    this.blogs = this.loadFromStorage('ag_blogs', initialBlogs);
    this.employees = this.loadFromStorage('ag_employees', initialEmployees);
    this.auditLogs = this.loadFromStorage('ag_audit_logs', initialAuditLogs);
    this.emailTemplates = this.loadFromStorage('ag_email_templates', initialEmailTemplates);
    this.settings = this.loadFromStorage('ag_settings', initialSystemSettings);
  }

  private loadFromStorage<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  }

  private saveToStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // Ignore storage quota issues in demo
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
    this.saveToStorage('ag_audit_logs', this.auditLogs);
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

  // Lead Management Actions
  public addLead(leadData: Omit<Lead, 'id' | 'timestamp' | 'status'>): Lead {
    const id = `LEAD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: Lead = {
      ...leadData,
      id,
      timestamp: new Date().toISOString(),
      status: 'New'
    };
    this.leads = [newLead, ...this.leads];
    this.saveToStorage('ag_leads', this.leads);
    this.logAudit('LEAD_CREATED', 'Consultation Form', `Created new lead ${id} for ${leadData.customerName}`);
    return newLead;
  }

  public updateLeadStatus(leadId: string, newStatus: LeadStatus) {
    this.leads = this.leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
    this.saveToStorage('ag_leads', this.leads);
    this.logAudit('LEAD_STATUS_CHANGED', 'Lead Pipeline', `Updated status of lead ${leadId} to ${newStatus}`);
  }

  // Feedback Management Actions
  public updateFeedbackStatus(id: string, status: FeedbackStatus) {
    this.feedback = this.feedback.map(f => f.id === id ? { ...f, status } : f);
    this.saveToStorage('ag_feedback', this.feedback);
    this.logAudit('FEEDBACK_MODERATED', 'Feedback Moderation', `Set feedback ${id} status to ${status}`);
  }

  public togglePinFeedback(id: string) {
    this.feedback = this.feedback.map(f => f.id === id ? { ...f, isPinned: !f.isPinned } : f);
    this.saveToStorage('ag_feedback', this.feedback);
    this.notify();
  }

  // Service CMS Actions
  public saveService(service: ServiceItem) {
    const exists = this.services.some(s => s.id === service.id);
    if (exists) {
      this.services = this.services.map(s => s.id === service.id ? service : s);
    } else {
      this.services = [...this.services, service];
    }
    this.saveToStorage('ag_services', this.services);
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
    this.saveToStorage('ag_blogs', this.blogs);
    this.logAudit('BLOG_SAVED', 'Blog CMS', `Saved blog article: ${blog.title}`);
  }

  // Settings Actions
  public updateSettings(newSettings: Partial<SystemSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToStorage('ag_settings', this.settings);
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
