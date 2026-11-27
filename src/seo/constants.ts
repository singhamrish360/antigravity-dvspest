export const SITE_URL = 'https://pestcontrolinfra.co.in';
export const SITE_NAME = 'DVS Pest Control Infrastructure Co';

export const PHONE_DISPLAY = '+91 93304 78897';
export const PHONE_E164 = '+919330478897';
export const TEL_LINK = 'tel:+919330478897';
export const WA_BASE = 'https://wa.me/919330478897';

export const RATE_PER_SQFT = 6;
export const ELEVATION_FLAT_FEE = 6000;
export const EXAMPLE_SQFT = 1500;

export const DRAFTING_SERVICE_NAME = 'House plan and 3D elevation drawing';
export const CREDENTIALS_LINE = 'Drawings by Amrish Singh, B.Tech Civil, M.Tech Structural Engineering';
export const CITY_BASE = 'Lucknow';

export const OG_IMAGE_DRAWINGS = `${SITE_URL}/drawings/sample-3d-front-elevation.webp`;
export const OG_IMAGE_HOME = `${SITE_URL}/services-grid.jpg`;

export const formatInr = (amount: number) =>
  `₹${Math.round(amount).toLocaleString('en-IN')}`;

export const formatSqFt = (amount: number) =>
  amount.toLocaleString('en-IN');

export const twoDCost = (builtUpSqFt: number) => builtUpSqFt * RATE_PER_SQFT;

export const whatsappQuoteLink = (details: string) =>
  `${WA_BASE}?text=${encodeURIComponent(details)}`;

export const defaultWhatsappMessage = (sqFt?: number) => {
  const sizeNote = sqFt && sqFt > 0
    ? ` My plot size is ${formatSqFt(sqFt)} sq ft.`
    : ' My plot size is ___ sq ft.';
  return `Hi DVS, I would like a quote for house drawings.${sizeNote}`;
};

export const defaultPestWhatsappMessage = (topic?: string) => {
  const extra = topic && topic.trim() ? ` ${topic.trim()}` : '';
  return `Hi DVS, I would like to book a pest control inspection in Lucknow.${extra}`;
};
