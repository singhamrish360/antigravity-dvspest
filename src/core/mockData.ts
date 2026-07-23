import { 
  Customer, Lead, ServiceItem, ServiceHistoryRecord, QuotationRecord, 
  AMCRecord, WarrantyRecord, FeedbackRecord, BlogPost, Employee, 
  AuditLog, EmailTemplate, SystemSettings 
} from './types';

export const initialCustomers: Customer[] = [
  {
    id: 'DVS-CUST-1001',
    fullName: 'Rajesh Sharma',
    email: 'rajesh.sharma@lucknowretail.in',
    phone: '+91 98390 12345',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    address: {
      street: '45 Hazratganj Main Market',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      zipCode: '226001',
      propertyType: 'Commercial',
      squareFeet: 4500
    },
    leadSource: 'Google India Search',
    referralInfo: 'Direct Organic Search',
    lifetimeValue: 38500,
    createdAt: '2025-11-12T09:30:00Z',
    nextServiceReminder: '2026-07-15',
    internalNotes: [
      'VIP Commercial Client in Hazratganj. Bi-monthly herbal cockroach gel treatment.',
      'Requires services after store hours (after 8:30 PM).'
    ]
  },
  {
    id: 'DVS-CUST-1002',
    fullName: 'Priya Verma',
    email: 'priya.verma@gomtinagar.com',
    phone: '+91 94150 67890',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    address: {
      street: 'B-12 Gomti Nagar Extension',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      zipCode: '226010',
      propertyType: 'Residential',
      squareFeet: 2800
    },
    leadSource: 'Client Referral',
    referralInfo: 'Referred by Rajesh Sharma',
    lifetimeValue: 18500,
    createdAt: '2026-01-20T14:15:00Z',
    nextServiceReminder: '2026-08-01',
    internalNotes: [
      'Completed subterranean termite barrier treatment.',
      '5-Year transferable warranty certificate issued.'
    ]
  },
  {
    id: 'DVS-CUST-1003',
    fullName: 'Amitabh Srivastava',
    email: 'a.srivastava@upwarehouse.org',
    phone: '+91 97920 44332',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    address: {
      street: 'Plot 88 Industrial Area, Amausi',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      zipCode: '226008',
      propertyType: 'Industrial',
      squareFeet: 35000
    },
    leadSource: 'Industrial Marketing',
    lifetimeValue: 145000,
    createdAt: '2025-08-04T11:00:00Z',
    nextServiceReminder: '2026-07-05',
    internalNotes: [
      'Grain & food warehouse fumigation requirement.',
      'Strict Compliance clearance required for FSSAI audits.'
    ]
  }
];

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

export const initialServiceHistory: ServiceHistoryRecord[] = [
  {
    id: 'HIST-901',
    customerId: 'DVS-CUST-1001',
    customerName: 'Rajesh Sharma',
    serviceTitle: 'Advanced Cockroaches Control',
    technicianName: 'Vram Singh (EMP-101)',
    date: '2026-05-14',
    status: 'Completed',
    beforeImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
    ],
    afterImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
    ],
    technicianNotes: 'Applied herbal gel in all kitchen cabinets and drain outlets. Client satisfied.',
    amountCharged: 1499
  }
];

export const initialQuotes: QuotationRecord[] = [
  {
    id: 'QUOTE-401',
    leadId: 'LEAD-2026-8941',
    customerName: 'Sanjay Gupta',
    serviceTitle: 'Subterranean Termites Control Shield',
    amount: 9500,
    tax: 1710,
    totalAmount: 11210,
    status: 'Approved',
    generatedDate: '2026-06-28',
    validUntil: '2026-07-28'
  }
];

export const initialAMCs: AMCRecord[] = [
  {
    id: 'AMC-701',
    customerId: 'DVS-CUST-1001',
    customerName: 'Rajesh Sharma',
    servicePackage: 'Annual Commercial Pest AMC',
    startDate: '2025-11-15',
    endDate: '2026-11-14',
    visitsPerYear: 6,
    visitsCompleted: 3,
    status: 'Active',
    contractValue: 12000
  }
];

export const initialWarranties: WarrantyRecord[] = [
  {
    id: 'WAR-301',
    customerId: 'DVS-CUST-1002',
    serviceTitle: 'Subterranean Termites Control Shield',
    warrantyPeriodMonths: 60,
    startDate: '2026-01-20',
    expiryDate: '2031-01-20',
    status: 'Valid'
  }
];

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
