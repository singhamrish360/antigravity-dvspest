import { HeadTags } from './head';

const upsertTag = (
  selector: string,
  create: () => HTMLElement,
  apply: (el: HTMLElement) => void,
) => {
  let el = document.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  apply(el);
};

export const applyDocumentMeta = (head: HeadTags) => {
  document.title = head.title;
  document.documentElement.lang = head.lang || 'en';

  upsertTag('meta[name="description"]', () => {
    const el = document.createElement('meta');
    el.setAttribute('name', 'description');
    return el;
  }, (el) => el.setAttribute('content', head.description));

  upsertTag('link[rel="canonical"]', () => {
    const el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    return el;
  }, (el) => el.setAttribute('href', head.canonical));

  const og = [
    ['og:url', head.canonical],
    ['og:title', head.title],
    ['og:description', head.description],
    ['og:image', head.ogImage],
  ] as const;
  og.forEach(([property, value]) => {
    upsertTag(`meta[property="${property}"]`, () => {
      const el = document.createElement('meta');
      el.setAttribute('property', property);
      return el;
    }, (el) => el.setAttribute('content', value));
  });

  const twitter = [
    ['twitter:url', head.canonical],
    ['twitter:title', head.title],
    ['twitter:description', head.description],
    ['twitter:image', head.ogImage],
  ] as const;
  twitter.forEach(([name, value]) => {
    upsertTag(`meta[name="${name}"]`, () => {
      const el = document.createElement('meta');
      el.setAttribute('name', name);
      return el;
    }, (el) => el.setAttribute('content', value));
  });

  const existing = document.querySelectorAll('script[type="application/ld+json"][data-seo="page"]');
  existing.forEach((node) => node.remove());
  // Also remove the static homepage JSON-LD when we are on a drawings page,
  // so the document does not describe this URL as a pest-control service.
  document.querySelectorAll('script[type="application/ld+json"]:not([data-seo="page"])').forEach((node) => {
    node.setAttribute('data-seo-hidden', 'true');
    (node as HTMLScriptElement).type = 'application/ld+json-inactive';
  });

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo', 'page');
  script.textContent = JSON.stringify(head.jsonLd);
  document.head.appendChild(script);
};

export const restoreStaticJsonLd = () => {
  document.querySelectorAll('script[data-seo="page"]').forEach((node) => node.remove());
  document.querySelectorAll('script[data-seo-hidden="true"]').forEach((node) => {
    node.removeAttribute('data-seo-hidden');
    (node as HTMLScriptElement).type = 'application/ld+json';
  });
};
