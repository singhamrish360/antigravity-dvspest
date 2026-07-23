import { 
  Customer, Lead, ServiceItem, ServiceHistoryRecord, QuotationRecord, 
  AMCRecord, WarrantyRecord, FeedbackRecord, BlogPost, Employee, 
  AuditLog, EmailTemplate, SystemSettings 
} from './types';

export const initialCustomers: Customer[] = [];

export const initialLeads: Lead[] = [];

export const initialServices: ServiceItem[] = [
  {
    id: 'SRV-101',
    title: 'Advanced Cockroaches Control',
    category: 'Cockroaches Control',
    description: 'Odorless herbal gel application and targeted micro-encapsulated spray to eradicate German and American cockroaches completely.',
    basePrice: 1499,
    durationMinutes: 60,
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    features: [
      'Odorless & eco-friendly herbal gel treatment',
      'Child, pet, and kitchen surface safe',
      'Targeted drain and cabinet crevice injection',
      '90-day satisfaction guarantee'
    ]
  },
  {
    id: 'SRV-102',
    title: 'Smart Rodents Control & Exclusion',
    category: 'Rodents Control',
    description: 'Comprehensive rat and mouse eradication using tamper-proof bait stations, acoustic sensors, and structural entry sealing.',
    basePrice: 1999,
    durationMinutes: 90,
    imageUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    features: [
      'Heavy-duty wire mesh entry-point sealing',
      'Lockable bio-secure bait stations',
      'Sanitization & odor neutralization treatment',
      'Zero-poison humane capture options'
    ]
  },
  {
    id: 'SRV-103',
    title: 'Anti-Mosquitoes Fogging & Larvicide',
    category: 'Mosquitoes Control',
    description: 'Cold thermal fogging and anti-larval chemical treatment in drains and standing water to protect against Dengue and Malaria.',
    basePrice: 1299,
    durationMinutes: 45,
    imageUrl: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=600&q=80',
    features: [
      'Outdoor thermal fogging misting',
      'Drain & water tank anti-larval granules',
      'Rapid mosquito knockdown chemical defense',
      'Ideal for lawns, gardens, and complexes'
    ]
  },
  {
    id: 'SRV-104',
    title: 'Subterranean Termites Control Shield',
    category: 'Termites Control',
    description: 'Drill-Fill-Seal chemical barrier protection along walls and foundations to eliminate termite colonies at the root.',
    basePrice: 6500,
    durationMinutes: 240,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    features: [
      'Thermal imaging moisture detection sweep',
      'Drill-Fill-Seal foundation barrier treatment',
      'Unconditional 5-Year written warranty',
      'Free annual inspection checks'
    ]
  },
  {
    id: 'SRV-105',
    title: 'Industrial & Grain Storage Fumigation',
    category: 'Fumigation Services',
    description: 'Specialized gas fumigation for warehouses, food processing units, grains, and shipping containers compliant with plant quarantine.',
    basePrice: 8500,
    durationMinutes: 300,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    features: [
      'Phosphine / Methyl Bromide gas fumigation',
      'FSSAI & Plant Quarantine clearance certificates',
      'Gas concentration monitoring & degassing',
      'Full commodity pest elimination'
    ]
  }
];

export const initialServiceHistory: ServiceHistoryRecord[] = [];

export const initialQuotes: QuotationRecord[] = [];

export const initialAMCs: AMCRecord[] = [];

export const initialWarranties: WarrantyRecord[] = [];

export const initialFeedback: FeedbackRecord[] = [
  {
    id: 'FB-501',
    customerId: 'DVS-CUST-1001',
    customerName: 'Rajesh Sharma (Hazratganj)',
    rating: 5,
    comment: 'Best pest control service in Lucknow! The technicians came on time and treated our commercial store with odorless gel. Zero roaches seen since!',
    date: '2026-05-16',
    status: 'Approved',
    isPinned: true,
    isFeatured: true
  },
  {
    id: 'FB-502',
    customerId: 'DVS-CUST-1002',
    customerName: 'Priya Verma (Gomti Nagar)',
    rating: 5,
    comment: 'The termite drill-fill treatment was very neat. They provided a 5-year written warranty. Highly recommended DVS Pest Control Infrastructure Co!',
    date: '2026-02-01',
    status: 'Approved',
    isFeatured: true
  }
];

export const initialBlogs: BlogPost[] = [
  {
    id: 'BLOG-101',
    title: 'Effective Termite Control Strategies for Buildings in Lucknow & UP',
    slug: 'effective-termite-control-lucknow-up',
    summary: 'Learn how humidity and soil conditions in Uttar Pradesh affect termite infestation and why drill-fill chemical barriers work best.',
    content: `Subterranean termites cause crores of rupees in structural damage across Uttar Pradesh annually. Due to high humidity and clay soil composition in Lucknow and surrounding regions, termites thrive in building foundations.

### 1. Thermal Detection & Drill-Fill-Seal Technique
Our technicians use thermal scanners to detect moist termite galleries behind walls without damaging plaster, followed by precision chemical injection.

### 2. Post-Construction Anti-Termite Barriers
Creating an uninterrupted chemical barrier along exterior and interior footings ensures 100% protection for up to 5 years.`,
    category: 'Termite Control Science',
    tags: ['Termites', 'Lucknow', 'Drill-Fill-Seal', 'Protection'],
    author: 'Er. Vikram Pratap Singh',
    publishDate: '2026-06-15',
    readingTimeMinutes: 4,
    coverImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    seoTitle: 'Termite Control in Lucknow | DVS Pest Control Infrastructure Co',
    seoDescription: 'Expert subterranean termite control and 5-year warranty treatment in Lucknow, Uttar Pradesh.'
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'EMP-101',
    fullName: 'Vram Singh',
    role: 'Field Technician',
    email: 'vram.singh@dvspest.in',
    phone: '+91 94150 11122',
    assignedJobsCount: 18,
    rating: 4.9,
    status: 'Active'
  },
  {
    id: 'EMP-102',
    fullName: 'Ramesh Yadav',
    role: 'Support Specialist',
    email: 'ramesh.yadav@dvspest.in',
    phone: '+91 98390 33344',
    assignedJobsCount: 25,
    rating: 5.0,
    status: 'Active'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'LOG-8801',
    timestamp: '2026-06-29T11:45:10Z',
    user: 'DVS Admin Operations',
    action: 'APPROVED_FEEDBACK',
    module: 'Feedback Moderation',
    ipAddress: '103.24.18.50',
    details: 'Approved customer review FB-501 for Lucknow website showcase.'
  }
];

export const initialEmailTemplates: EmailTemplate[] = [
  {
    id: 'TMPL-01',
    name: 'Consultation Booking Confirmation',
    subject: 'Your DVS Pest Inspection is Confirmed - Ref #{LEAD_ID}',
    bodyHtml: `<h3>Dear {CUSTOMER_NAME},</h3><p>Thank you for choosing <strong>DVS PEST CONTROL INFRASTRUCTURE CO</strong>. We have registered your inspection request for <strong>{SERVICE_NAME}</strong> in Lucknow.</p><br/><p>Best regards,<br/><strong>DVS Operations Team, Lucknow HQ</strong></p>`,
    triggerEvent: 'Booking Confirmation'
  }
];

export const initialSystemSettings: SystemSettings = {
  companyName: 'DVS PEST CONTROL INFRASTRUCTURE CO',
  contactEmail: 'dvsinfrapest@gmail.com',
  contactPhone: '+91 93304 78897',
  address: 'Lucknow',
  operatingHours: 'Mon - Sun: 8:00 AM - 9:00 PM (Emergency Dispatch Available across Lucknow & UP)',
  enable2FA: true,
  sessionTimeoutMinutes: 30,
  autoApproveFeedback: false,
  enableWAWhatsapp: true,
  googleCalendarLinked: true,
  aiChatbotActive: true,
  theme: 'light'
};
