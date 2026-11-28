import { FaqItem } from './faqs';
import {
  ALTERNATE_NAMES,
  CITY_BASE,
  DRAFTING_SERVICE_NAME,
  ELEVATION_FLAT_FEE,
  LEGAL_NAME,
  PHONE_E164,
  RATE_PER_SQFT,
  SITE_NAME,
  SITE_URL,
} from './constants';

import { lucknowLocalitiesServed } from './pest-routes';

const brandName = {
  name: SITE_NAME,
  legalName: LEGAL_NAME,
  alternateName: [...ALTERNATE_NAMES],
};

export const pestControlJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'PestControlService',
  ...brandName,
  image: `${SITE_URL}/services-grid.jpg`,
  '@id': `${SITE_URL}/#pestcontrol`,
  url: SITE_URL,
  telephone: PHONE_E164,
  priceRange: '₹899 - ₹8500',
  address: {
    '@type': 'PostalAddress',
    addressLocality: CITY_BASE,
    addressRegion: 'Uttar Pradesh',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.8467,
    longitude: 80.9462,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '08:00',
    closes: '21:00',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Lucknow' },
    { '@type': 'AdministrativeArea', name: 'Uttar Pradesh' },
  ],
});

export const draftingJsonLd = (pageUrl: string, faqs: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/drawings#service`,
      name: DRAFTING_SERVICE_NAME,
      url: pageUrl,
      serviceType: 'AutoCAD house plan and 3D elevation drafting',
      description:
        '2D AutoCAD house plans, sections and elevations with plumbing and electrical layouts at ₹6 per sq ft, or a 3D front elevation for a flat ₹6,000. Delivered online anywhere in India in 10 days, with up to 2 to 3 major and 4 to 5 minor revisions.',
      provider: {
        '@type': 'LocalBusiness',
        ...brandName,
        telephone: PHONE_E164,
        address: {
          '@type': 'PostalAddress',
          addressLocality: CITY_BASE,
          addressRegion: 'Uttar Pradesh',
          addressCountry: 'IN',
        },
      },
      areaServed: { '@type': 'Country', name: 'India' },
      offers: [
        {
          '@type': 'Offer',
          '@id': `${SITE_URL}/drawings#offer-2d`,
          name: '2D AutoCAD house drawings',
          description:
            'Plans, sections and elevations, including plumbing and electrical drawings, at ₹6 per sq ft of built-up area. Delivered as DWG and PDF in 10 days, anywhere in India. Up to 2 to 3 major and 4 to 5 minor revisions are included.',
          price: String(RATE_PER_SQFT),
          priceCurrency: 'INR',
          unitText: 'sq ft',
          availability: 'https://schema.org/InStock',
          url: pageUrl,
        },
        {
          '@type': 'Offer',
          '@id': `${SITE_URL}/drawings#offer-3d`,
          name: '3D front elevation',
          description:
            'A 3D front elevation at a flat ₹6,000 for any size, delivered online anywhere in India in 10 days.',
          price: String(ELEVATION_FLAT_FEE),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: pageUrl,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ],
});

export const faqJsonLd = (pageUrl: string, faqs: FaqItem[]) => ({
  '@type': 'FAQPage',
  '@id': `${pageUrl}#faq`,
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
});

export const pestPageJsonLd = (opts: {
  pageUrl: string;
  serviceName: string;
  serviceType: string;
  description: string;
  faqs: FaqItem[];
  areaName?: string;
}) => {
  const areaServed = opts.areaName
    ? { '@type': 'Place', name: `${opts.areaName}, Lucknow` }
    : [
        { '@type': 'AdministrativeArea', name: CITY_BASE },
        { '@type': 'AdministrativeArea', name: 'Uttar Pradesh' },
      ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'PestControlService'],
        '@id': `${SITE_URL}/#pestcontrol`,
        ...brandName,
        image: `${SITE_URL}/services-grid.jpg`,
        url: SITE_URL,
        telephone: PHONE_E164,
        priceRange: '₹899 - ₹8500',
        address: {
          '@type': 'PostalAddress',
          addressLocality: CITY_BASE,
          addressRegion: 'Uttar Pradesh',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 26.8467,
          longitude: 80.9462,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '08:00',
          closes: '21:00',
        },
        areaServed: [
          { '@type': 'AdministrativeArea', name: CITY_BASE },
          { '@type': 'AdministrativeArea', name: 'Uttar Pradesh' },
          ...lucknowLocalitiesServed().map((name) => ({
            '@type': 'Place',
            name: `${name}, Lucknow`,
          })),
        ],
      },
      {
        '@type': 'Service',
        '@id': `${opts.pageUrl}#service`,
        name: opts.serviceName,
        serviceType: opts.serviceType,
        description: opts.description,
        url: opts.pageUrl,
        provider: { '@id': `${SITE_URL}/#pestcontrol` },
        areaServed,
      },
      faqJsonLd(opts.pageUrl, opts.faqs),
    ],
  };
};

export const pestHomeJsonLd = (faqs: FaqItem[]) =>
  pestPageJsonLd({
    pageUrl: `${SITE_URL}/`,
    serviceName: 'Pest control in Lucknow',
    serviceType: 'Pest control',
    description:
      'DVS Infra Consultant treats cockroaches, termites, rodents and mosquitoes, and does warehouse fumigation, for homes and businesses in Lucknow and Uttar Pradesh.',
    faqs,
  });

