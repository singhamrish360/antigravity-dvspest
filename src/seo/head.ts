import { OG_IMAGE_DRAWINGS, OG_IMAGE_HOME, SITE_NAME, SITE_URL } from './constants';

export interface HeadTags {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  jsonLd: unknown;
  lang?: string;
}

export const homeHead = (jsonLd: unknown): HeadTags => ({
  title: 'Pest Control in Lucknow | DVS Infra Consultant',
  description:
    'DVS Infra Consultant provides pest control for homes and businesses in Lucknow and Uttar Pradesh, and online house drawings delivered anywhere in India. Book cockroach, termite, rodent and mosquito treatments, or get a house plan quote.',
  canonical: `${SITE_URL}/`,
  ogImage: OG_IMAGE_HOME,
  jsonLd,
  lang: 'en',
});

export const pestHead = (
  title: string,
  description: string,
  canonicalPath: string,
  jsonLd: unknown,
  lang = 'en',
): HeadTags => ({
  title,
  description,
  canonical: `${SITE_URL}${canonicalPath}`,
  ogImage: OG_IMAGE_HOME,
  jsonLd,
  lang,
});

export const drawingsHead = (
  title: string,
  description: string,
  canonicalPath: string,
  jsonLd: unknown,
  lang = 'en',
): HeadTags => ({
  title,
  description,
  canonical: `${SITE_URL}${canonicalPath}`,
  ogImage: OG_IMAGE_DRAWINGS,
  jsonLd,
  lang,
});

export const escapeAttr = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const replaceMeta = (html: string, attr: 'name' | 'property', key: string, value: string) => {
  const pattern = new RegExp(
    `<meta[^>]*${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`,
    'i',
  );
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
};

export const applyHeadToTemplate = (template: string, head: HeadTags): string => {
  let html = template;

  html = html.replace(/<html lang="[^"]*"/, `<html lang="${escapeAttr(head.lang || 'en')}"`);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(head.title)}</title>`);
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttr(head.canonical)}" />`,
  );

  html = replaceMeta(html, 'name', 'description', head.description);
  html = replaceMeta(html, 'property', 'og:url', head.canonical);
  html = replaceMeta(html, 'property', 'og:title', head.title);
  html = replaceMeta(html, 'property', 'og:description', head.description);
  html = replaceMeta(html, 'property', 'og:image', head.ogImage);
  html = replaceMeta(html, 'name', 'twitter:url', head.canonical);
  html = replaceMeta(html, 'name', 'twitter:title', head.title);
  html = replaceMeta(html, 'name', 'twitter:description', head.description);
  html = replaceMeta(html, 'name', 'twitter:image', head.ogImage);

  const json = JSON.stringify(head.jsonLd, null, 4);
  const script = `<script type="application/ld+json">\n    ${json}\n    </script>`;
  if (/<script type="application\/ld\+json">[\s\S]*?<\/script>/.test(html)) {
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, script);
  } else {
    html = html.replace('</head>', `    ${script}\n  </head>`);
  }

  return html;
};
