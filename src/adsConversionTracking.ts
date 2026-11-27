// Google Ads click-conversion tracking for tel: and WhatsApp links.
// Uses event delegation so it works on every page without editing page components.
// Replace the PLACEHOLDER send_to labels after the conversion actions are created.

export const GOOGLE_TAG_ID = 'AW-806105672';

// Placeholder send_to values. Clicks are not sent until these are replaced
// with the real labels from the new conversion actions (AW-806105672/xxxxx).
export const ADS_CONVERSION_SEND_TO = {
  websiteCallClick: 'AW-806105672/PLACEHOLDER_WEBSITE_CALL_CLICK',
  whatsappClick: 'AW-806105672/PLACEHOLDER_WHATSAPP_CLICK',
} as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function isPlaceholder(sendTo: string): boolean {
  return sendTo.includes('PLACEHOLDER');
}

function fireConversion(sendTo: string): void {
  if (isPlaceholder(sendTo)) return;
  const gtag = window.gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', 'conversion', { send_to: sendTo });
}

function hrefFromClick(event: Event): string {
  const target = event.target;
  if (!(target instanceof Element)) return '';
  const anchor = target.closest('a');
  if (!anchor) return '';
  return anchor.getAttribute('href') || '';
}

function isWebsiteCallHref(href: string): boolean {
  return href.trim().toLowerCase().startsWith('tel:');
}

function isWhatsAppHref(href: string): boolean {
  const value = href.trim().toLowerCase();
  if (value.startsWith('whatsapp:')) return true;
  try {
    const url = new URL(value, window.location.origin);
    const host = url.hostname.replace(/^www\./, '');
    return host === 'wa.me' || host === 'api.whatsapp.com' || host === 'whatsapp.com' || host.endsWith('.whatsapp.com');
  } catch {
    return /wa\.me|whatsapp\.com/i.test(value);
  }
}

function onDocumentClick(event: Event): void {
  const href = hrefFromClick(event);
  if (!href) return;
  if (isWebsiteCallHref(href)) {
    fireConversion(ADS_CONVERSION_SEND_TO.websiteCallClick);
    return;
  }
  if (isWhatsAppHref(href)) {
    fireConversion(ADS_CONVERSION_SEND_TO.whatsappClick);
  }
}

export function initAdsClickConversionTracking(): void {
  if (typeof document === 'undefined') return;
  if (document.documentElement.dataset.adsClickTracking === 'on') return;
  document.documentElement.dataset.adsClickTracking = 'on';
  document.addEventListener('click', onDocumentClick, true);
}
