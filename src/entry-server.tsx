import React from 'react';
import { renderToString } from 'react-dom/server';
import { DrawingsLandingPage } from './modules/public/DrawingsLandingPage';
import { DrawingsPage } from './modules/public/DrawingsPage';
import { HomePage } from './modules/public/HomePage';
import { PestLandingPage } from './modules/public/PestLandingPage';
import { SITE_URL } from './seo/constants';
import { drawingsHead, homeHead, pestHead, applyHeadToTemplate, HeadTags } from './seo/head';
import { draftingJsonLd, pestHomeJsonLd, pestPageJsonLd } from './seo/jsonld';
import { HOME_PEST_FAQS } from './seo/pest-faqs';
import { PEST_ROUTES, matchPestRoute } from './seo/pest-routes';
import { SEO_ROUTES, matchSeoRoute, DRAWINGS_HUB, normalizePath } from './seo/routes';

export { SEO_ROUTES, PEST_ROUTES, applyHeadToTemplate };
export type { HeadTags };

const noop = () => {};

export const render = (url: string): { html: string; head: HeadTags } => {
  const path = normalizePath(url);

  if (path === '/') {
    return {
      html: renderToString(
        <HomePage
          onBookClick={noop}
          onServicesClick={noop}
          onChatClick={noop}
          onDrawingsClick={noop}
        />,
      ),
      head: homeHead(pestHomeJsonLd(HOME_PEST_FAQS)),
    };
  }

  const pestRoute = matchPestRoute(path);
  if (pestRoute) {
    return {
      html: renderToString(<PestLandingPage route={pestRoute} />),
      head: pestHead(
        pestRoute.title,
        pestRoute.description,
        pestRoute.path,
        pestPageJsonLd({
          pageUrl: `${SITE_URL}${pestRoute.path}`,
          serviceName: pestRoute.serviceName,
          serviceType: pestRoute.serviceType,
          description: pestRoute.description,
          faqs: pestRoute.faqs,
          areaName: pestRoute.areaName,
        }),
        pestRoute.lang,
      ),
    };
  }

  const route = matchSeoRoute(path) ?? DRAWINGS_HUB;
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
