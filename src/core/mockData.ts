import { 
  Customer, Lead, ServiceItem, ServiceHistoryRecord, QuotationRecord, 
  AMCRecord, WarrantyRecord, FeedbackRecord, BlogPost, Employee, 
  AuditLog, EmailTemplate, SystemSettings 
} from './types';

export const initialCustomers: Customer[] = [
  {
    id: 'CUST-1001',
    fullName: 'Alexander Wright',
    email: 'alex.wright@apexcorp.io',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    address: {
      street: '742 Evergreen Terrace',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10001',
      propertyType: 'Commercial',
      squareFeet: 12500
    },
    leadSource: 'Google Search',
    referralInfo: 'Direct Organic Search',
    lifetimeValue: 4850,
    createdAt: '2025-11-12T09:30:00Z',
    nextServiceReminder: '2026-07-15',
    internalNotes: [
      'VIP Commercial client with bi-monthly pest maintenance schedule.',
      'Requires service visits outside normal business hours (after 7 PM).'
    ]
  },
  {
    id: 'CUST-1002',
    fullName: 'Sophia Martinez',
    email: 'sophia.m@horizontech.com',
    phone: '+1 (555) 876-5432',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    address: {
      street: '128 Willow Creek Way',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10004',
      propertyType: 'Residential',
      squareFeet: 3400
    },
    leadSource: 'Referral',
    referralInfo: 'Referred by Alexander Wright',
    lifetimeValue: 1200,
    createdAt: '2026-01-20T14:15:00Z',
    nextServiceReminder: '2026-08-01',
    internalNotes: [
      'Completed full subterranean termite barrier treatment.',
      '5-Year transferable warranty active.'
    ]
  },
  {
    id: 'CUST-1003',
    fullName: 'Marcus Vance',
    email: 'm.vance@vancemanufacturing.com',
    phone: '+1 (555) 432-1098',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    address: {
      street: '900 Industrial Parkway, Dock 4',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10010',
      propertyType: 'Industrial',
      squareFeet: 45000
    },
    leadSource: 'LinkedIn Marketing',
    lifetimeValue: 18900,
    createdAt: '2025-08-04T11:00:00Z',
    nextServiceReminder: '2026-07-05',
    internalNotes: [
      'Industrial warehouse compliance audit requirement.',
      'Strict documentation protocol needed for FDA inspection readiness.'
    ]
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'LEAD-2026-8941',
    customerName: 'Elena Rostova',
    email: 'elena.rostova@designstudio.co',
    phone: '+1 (555) 998-1122',
    serviceRequested: 'Commercial Sanitation & Disinfection',
    propertyType: 'Commercial',
    squareFeet: 6800,
    location: 'Downtown Financial District',
    referralSource: 'Google Ads',
    status: 'Scheduled',
    timestamp: '2026-06-28T10:45:00Z',
    ipAddress: '192.168.1.104',
    deviceInfo: 'MacBook Pro (macOS Sonoma)',
    browserInfo: 'Chrome 126.0.0',
    assignedTechnicianId: 'EMP-102',
    quotedAmount: 1450
  },
  {
    id: 'LEAD-2026-8942',
    customerName: 'David Sterling',
    email: 'david@sterlingestates.com',
    phone: '+1 (555) 776-3344',
    serviceRequested: 'Termite Protection & Barrier Treatment',
    propertyType: 'Residential',
    squareFeet: 5200,
    location: 'Highland Park Estate',
    referralSource: 'Organic Search',
    status: 'New',
    timestamp: '2026-06-29T08:12:00Z',
    ipAddress: '172.56.21.89',
    deviceInfo: 'iPhone 15 Pro Max',
    browserInfo: 'Safari Mobile 17.4'
  },
  {
    id: 'LEAD-2026-8943',
    customerName: 'Rachel Green',
    email: 'rachel.g@centralperk.io',
    phone: '+1 (555) 334-8899',
    serviceRequested: 'Rodent Extermination & Proofing',
    propertyType: 'Commercial',
    squareFeet: 2100,
    location: 'West Village',
    referralSource: 'Instagram Campaign',
    status: 'Quoted',
    timestamp: '2026-06-27T16:20:00Z',
    ipAddress: '68.195.14.22',
    deviceInfo: 'Windows PC',
    browserInfo: 'Edge 125.0',
    assignedTechnicianId: 'EMP-101',
    quotedAmount: 850
  }
];

export const initialServices: ServiceItem[] = [
  {
    id: 'SRV-101',
    title: 'Comprehensive General Pest Extermination',
    category: 'General Pest Control',
    description: 'Complete eradication of crawling insects, ants, roaches, spiders, and silverfish with eco-safe micro-encapsulated formulations.',
    basePrice: 299,
    durationMinutes: 90,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    features: [
      'Indoor & perimeter barrier defense',
      'Child and pet safe botanical treatments',
      'Targeted crack and crevice injection',
      '90-day satisfaction guarantee'
    ]
  },
  {
    id: 'SRV-102',
    title: 'Subterranean Termite Shield & Interception',
    category: 'Termite Protection',
    description: 'Advanced liquid trenching barrier and non-repellent baiting systems to eliminate subterranean termite colonies at the source.',
    basePrice: 1250,
    durationMinutes: 240,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    isPopular: true,
    features: [
      'Thermal imaging termite detection scan',
      'Non-repellent transfer chemistry',
      'Comprehensive 5-year renewable warranty',
      'Annual structural compliance inspections'
    ]
  },
  {
    id: 'SRV-103',
    title: 'Smart Rodent Exclusion & Smart Monitoring',
    category: 'Rodent Control',
    description: 'Full structural entry-point sealing, acoustic monitoring sensors, and humane multi-capture containment systems.',
    basePrice: 450,
    durationMinutes: 120,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    features: [
      'Heavy-duty copper mesh & silicone sealing',
      'Digital sensor trap alerts',
      'Sanitization & odor neutralizer spray',
      'Zero-poison bio-secure option'
    ]
  },
  {
    id: 'SRV-104',
    title: 'Enterprise Commercial Hospital-Grade Disinfection',
    category: 'Commercial Sanitation',
    description: 'Electrostatic misting technology using EPA List N registered disinfectant against pathogens, viruses, and bacteria.',
    basePrice: 899,
    durationMinutes: 180,
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    features: [
      '360-degree surface coverage misting',
      'Rapid touch-dry reentry (under 30 mins)',
      'OSHA & FDA compliance certificate',
      'ATP swab verification testing'
    ]
  }
];

export const initialServiceHistory: ServiceHistoryRecord[] = [
  {
    id: 'HIST-901',
    customerId: 'CUST-1001',
    customerName: 'Alexander Wright',
    serviceTitle: 'Comprehensive General Pest Extermination',
    technicianName: 'Brandon Vance (EMP-101)',
    date: '2026-05-14',
    status: 'Completed',
    beforeImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
    ],
    afterImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
    ],
    technicianNotes: 'Applied perimeter barrier along north loading dock. All exterior drains treated with bio-foam.',
    amountCharged: 450
  }
];

export const initialQuotes: QuotationRecord[] = [
  {
    id: 'QUOTE-401',
    leadId: 'LEAD-2026-8941',
    customerName: 'Elena Rostova',
    serviceTitle: 'Commercial Sanitation & Disinfection',
    amount: 1450,
    tax: 116,
    totalAmount: 1566,
    status: 'Approved',
    generatedDate: '2026-06-28',
    validUntil: '2026-07-28'
  }
];

export const initialAMCs: AMCRecord[] = [
  {
    id: 'AMC-701',
    customerId: 'CUST-1001',
    customerName: 'Alexander Wright',
    servicePackage: 'Enterprise Bi-Monthly Shield',
    startDate: '2025-11-15',
    endDate: '2026-11-14',
    visitsPerYear: 6,
    visitsCompleted: 3,
    status: 'Active',
    contractValue: 2700
  }
];

export const initialWarranties: WarrantyRecord[] = [
  {
    id: 'WAR-301',
    customerId: 'CUST-1002',
    serviceTitle: 'Subterranean Termite Shield',
    warrantyPeriodMonths: 60,
    startDate: '2026-01-20',
    expiryDate: '2031-01-20',
    status: 'Valid'
  }
];

export const initialFeedback: FeedbackRecord[] = [
  {
    id: 'FB-501',
    customerId: 'CUST-1001',
    customerName: 'Alexander Wright',
    rating: 5,
    comment: 'Exceptional service! The technicians arrived promptly at 8 PM as scheduled. Our commercial space has been completely pest-free for 6 months.',
    date: '2026-05-16',
    status: 'Approved',
    isPinned: true,
    isFeatured: true
  },
  {
    id: 'FB-502',
    customerId: 'CUST-1002',
    customerName: 'Sophia Martinez',
    rating: 5,
    comment: 'The thermal imaging scan spotted termite activity behind our living room wall before any visible damage occurred. Highly professional team!',
    date: '2026-02-01',
    status: 'Approved',
    isFeatured: true
  },
  {
    id: 'FB-503',
    customerId: 'CUST-1003',
    customerName: 'Marcus Vance',
    rating: 4,
    comment: 'Great industrial compliance paperwork provided for our FDA audit. Very thorough technicians.',
    date: '2026-04-10',
    status: 'Pending'
  }
];

export const initialBlogs: BlogPost[] = [
  {
    id: 'BLOG-101',
    title: 'The AI Revolution in Integrated Commercial Pest Management',
    slug: 'ai-revolution-commercial-pest-management',
    summary: 'Discover how computer vision, thermal imaging sensors, and predictive AI analytics are transforming industrial sanitation standards.',
    content: `Integrated Pest Management (IPM) is undergoing an unprecedented digital transformation. Traditional reactive pest control relies heavily on periodic visual inspections. Today, AI-powered smart sensor networks and computer vision models enable continuous 24/7 monitoring.

### 1. Thermal Imaging & Sub-Surface Detection
Infrared thermal cameras integrated with machine learning algorithms can now detect micro-variations in wall temperature, identifying subterranean termite galleries long before structural wood damage manifests.

### 2. Automated Species Identification
By feeding macro photography into specialized neural network models, pest species can be identified down to exact sub-species within milliseconds, allowing technicians to deploy ultra-targeted botanical formulations.`,
    category: 'AI & Technology',
    tags: ['AI', 'Smart Sensors', 'Commercial IPM', 'Innovation'],
    author: 'Dr. Evelyn Carter',
    publishDate: '2026-06-15',
    readingTimeMinutes: 5,
    coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    seoTitle: 'AI in Commercial Pest Management | Anti-Gravity Tech',
    seoDescription: 'Learn how artificial intelligence and smart thermal sensors are revolutionizing commercial pest control and FDA safety compliance.'
  },
  {
    id: 'BLOG-102',
    title: 'Essential Summer Pest Exclusion Guide for Commercial Facilities',
    slug: 'summer-pest-exclusion-guide-facilities',
    summary: 'A comprehensive checklist for facility managers to audit perimeter defenses and prevent seasonal insect migrations.',
    content: `As ambient temperatures rise, urban insect populations experience exponential reproduction cycles. Commercial facility managers must implement proactive exclusion strategies.

Key structural exclusion points include:
1. Dock door seals and brush strips.
2. HVAC condensate lines and drainage traps.
3. Exterior lighting spectrum adjustment to non-attracting amber wavelengths.`,
    category: 'Facility Management',
    tags: ['Exclusion', 'Commercial', 'Checklist', 'Summer'],
    author: 'Brandon Vance',
    publishDate: '2026-06-01',
    readingTimeMinutes: 4,
    coverImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    seoTitle: 'Summer Pest Exclusion Guide for Facility Managers',
    seoDescription: 'Download our expert checklist for structural pest exclusion and perimeter protection in commercial facilities.'
  }
];

export const initialEmployees: Employee[] = [
  {
    id: 'EMP-101',
    fullName: 'Brandon Vance',
    role: 'Field Technician',
    email: 'brandon.vance@antigravity.io',
    phone: '+1 (555) 111-2233',
    assignedJobsCount: 14,
    rating: 4.9,
    status: 'Active'
  },
  {
    id: 'EMP-102',
    fullName: 'Sarah Jenkins',
    role: 'Support Specialist',
    email: 'sarah.j@antigravity.io',
    phone: '+1 (555) 444-5566',
    assignedJobsCount: 28,
    rating: 5.0,
    status: 'Active'
  },
  {
    id: 'EMP-103',
    fullName: 'Dr. Evelyn Carter',
    role: 'Administrator',
    email: 'evelyn.carter@antigravity.io',
    phone: '+1 (555) 777-8899',
    assignedJobsCount: 5,
    rating: 4.8,
    status: 'Active'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'LOG-8801',
    timestamp: '2026-06-29T11:45:10Z',
    user: 'Dr. Evelyn Carter (Admin)',
    action: 'APPROVED_FEEDBACK',
    module: 'Feedback Moderation',
    ipAddress: '10.0.4.12',
    details: 'Approved customer testimonial FB-501 for public website showcase.'
  },
  {
    id: 'LOG-8802',
    timestamp: '2026-06-29T09:30:22Z',
    user: 'System Bot',
    action: 'LEAD_CAPTURED',
    module: 'Consultation Form',
    ipAddress: '172.56.21.89',
    details: 'Generated new lead LEAD-2026-8942 for David Sterling.'
  }
];

export const initialEmailTemplates: EmailTemplate[] = [
  {
    id: 'TMPL-01',
    name: 'Consultation Booking Confirmation',
    subject: 'Your Anti-Gravity Inspection & Consultation is Confirmed - Reference #{LEAD_ID}',
    bodyHtml: `<h3>Dear {CUSTOMER_NAME},</h3><p>Thank you for choosing Anti-Gravity Enterprise Ecosystem. We have received your consultation request for <strong>{SERVICE_NAME}</strong>.</p><p>Our dedicated technician team will review your property details and contact you shortly at <strong>{PHONE}</strong> to finalize schedule details.</p><br/><p>Best regards,<br/><strong>Anti-Gravity Operations Team</strong></p>`,
    triggerEvent: 'Booking Confirmation'
  },
  {
    id: 'TMPL-02',
    name: 'Post-Service Feedback Request',
    subject: 'How was your recent service with Anti-Gravity?',
    bodyHtml: `<h3>Hi {CUSTOMER_NAME},</h3><p>Your satisfaction is our top priority. Please take 60 seconds to share your experience regarding your recent service visit on {SERVICE_DATE}.</p><br/><p><a href="https://antigravity.io/feedback">Submit Feedback & Review</a></p>`,
    triggerEvent: 'Feedback Request'
  }
];

export const initialSystemSettings: SystemSettings = {
  companyName: 'Anti-Gravity Enterprise Ecosystem Inc.',
  contactEmail: 'support@antigravity-ecosystem.io',
  contactPhone: '+1 (800) 555-PEST',
  address: '100 Enterprise Boulevard, Suite 500, Metropolis, NY 10001',
  operatingHours: 'Mon - Sun: 7:00 AM - 10:00 PM (Emergency 24/7 Dispatch Available)',
  enable2FA: true,
  sessionTimeoutMinutes: 30,
  autoApproveFeedback: false,
  enableWAWhatsapp: true,
  googleCalendarLinked: true,
  aiChatbotActive: true,
  theme: 'dark'
};
