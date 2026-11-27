import React from 'react';
import { renderToString } from 'react-dom/server';
import { DrawingsLandingPage } from './modules/public/DrawingsLandingPage';
import { DrawingsPage } from './modules/public/DrawingsPage';
import { SITE_URL } from './seo/constants';
import { drawingsHead, applyHeadToTemplate, HeadTags } from './seo/head';
import { draftingJsonLd } from './seo/jsonld';
import { SEO_ROUTES, matchSeoRoute, DRAWINGS_HUB } from './seo/routes';

export { SEO_ROUTES, applyHeadToTemplate };
export type { HeadTags };

export const render = (url: string): { html: string; head: HeadTags } => {
  const route = matchSeoRoute(url) ?? DRAWINGS_HUB;
  const page = route.kind === 'hub' ? <DrawingsPage /> : <DrawingsLandingPage route={route} />;
  const head = drawingsHead(
    route.title,
    route.description,
    route.path,
    draftingJsonLd(`${SITE_URL}${route.path}`, route.faqs),
    route.lang,
  );
  return { html: renderToString(page), head };
};
