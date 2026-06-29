export type NavigationMode = 'public' | 'crm' | 'admin' | 'ai';

export type LeadStatus = 
  | 'New'
  | 'Assigned'
  | 'Contacted'
  | 'Scheduled'
  | 'Visited'
  | 'Quoted'
  | 'Confirmed'
  | 'Completed'
  | 'Closed'
  | 'Cancelled';

export type FeedbackStatus = 'Pending' | 'Approved' | 'Rejected' | 'Archived';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial';
  squareFeet: number;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  address: Address;
  leadSource: string;
  referralInfo?: string;
  lifetimeValue: number;
  createdAt: string;
  nextServiceReminder?: string;
  internalNotes: string[];
}

export interface Lead {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceRequested: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial';
  squareFeet: number;
  location: string;
  referralSource: string;
  status: LeadStatus;
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
  browserInfo: string;
  assignedTechnicianId?: string;
  quotedAmount?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'Cockroaches Control' | 'Rodents Control' | 'Mosquitoes Control' | 'Termites Control' | 'Fumigation Services';
  description: string;
  basePrice: number;
  durationMinutes: number;
  imageUrl: string;
  isPopular?: boolean;
  features: string[];
}

export interface ServiceHistoryRecord {
  id: string;
  customerId: string;
  customerName: string;
  serviceTitle: string;
  technicianName: string;
  date: string;
  status: 'Completed' | 'Scheduled' | 'In Progress' | 'Cancelled';
  beforeImages: string[];
  afterImages: string[];
  technicianNotes: string;
  amountCharged: number;
}

export interface QuotationRecord {
  id: string;
  leadId: string;
  customerName: string;
  serviceTitle: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Declined';
  generatedDate: string;
  validUntil: string;
}

export interface AMCRecord {
  id: string;
  customerId: string;
  customerName: string;
  servicePackage: string;
  startDate: string;
  endDate: string;
  visitsPerYear: number;
  visitsCompleted: number;
  status: 'Active' | 'Expired' | 'Pending Renewal';
  contractValue: number;
}

export interface WarrantyRecord {
  id: string;
  customerId: string;
  serviceTitle: string;
  warrantyPeriodMonths: number;
  startDate: string;
  expiryDate: string;
  status: 'Valid' | 'Claimed' | 'Expired';
}

export interface FeedbackRecord {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: FeedbackStatus;
  isPinned?: boolean;
  isFeatured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  readingTimeMinutes: number;
  coverImageUrl: string;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface Employee {
  id: string;
  fullName: string;
  role: 'Administrator' | 'Field Technician' | 'Support Specialist' | 'Sales Executive';
  email: string;
  phone: string;
  assignedJobsCount: number;
  rating: number;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  triggerEvent: 'Booking Confirmation' | 'Feedback Request' | 'AMC Reminder' | 'Warranty Expiry' | 'Newsletter';
}

export interface AIDiagnosticResult {
  pestSpecies: string;
  confidenceScore: number;
  severityLevel: 'Low' | 'Moderate' | 'High' | 'Severe Risk';
  recommendedTreatment: string;
  estimatedCostRange: string;
  preventionTips: string[];
}

export interface SystemSettings {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  operatingHours: string;
  enable2FA: boolean;
  sessionTimeoutMinutes: number;
  autoApproveFeedback: boolean;
  enableWAWhatsapp: boolean;
  googleCalendarLinked: boolean;
  aiChatbotActive: boolean;
  theme: 'light' | 'dark';
}
