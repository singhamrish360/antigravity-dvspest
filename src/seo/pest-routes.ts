import data from './pest-routes-data.json';
import { FaqItem } from './faqs';
import { CORE_PEST_FAQS } from './pest-faqs';
import { normalizePath } from './routes';

export type PestKind = 'hub' | 'service' | 'area' | 'hindi' | 'builders' | 'segment';

export interface BhkRates {
  label: string;
  amounts: number[];
}

export interface PestRoute {
  path: string;
  kind: PestKind;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  faqs: FaqItem[];
  lang: 'en' | 'hi';
  serviceName: string;
  serviceType: string;
  areaName?: string;
  highlights?: string[];
  bhkRates?: BhkRates;
  startingRate?: number;
  relatedPaths?: string[];
  whatsappTopic: string;
}

interface RawPestRoute {
  path: string;
  kind: PestKind;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  extraFaqs?: FaqItem[];
  lang?: 'en' | 'hi';
  serviceName: string;
  serviceType: string;
  areaName?: string;
  highlights?: string[];
  bhkRates?: BhkRates;
  startingRate?: number;
  relatedPaths?: string[];
  whatsappTopic: string;
}

export const PEST_ROUTES: PestRoute[] = (data as RawPestRoute[]).map((route) => ({
  path: route.path,
  kind: route.kind,
  title: route.title,
  description: route.description,
  h1: route.h1,
  intro: route.intro,
  faqs: [...CORE_PEST_FAQS, ...(route.extraFaqs ?? [])],
  lang: route.lang ?? 'en',
  serviceName: route.serviceName,
  serviceType: route.serviceType,
  areaName: route.areaName,
  highlights: route.highlights,
  bhkRates: route.bhkRates,
  startingRate: route.startingRate,
  relatedPaths: route.relatedPaths,
  whatsappTopic: route.whatsappTopic,
}));

export const matchPestRoute = (pathname: string): PestRoute | undefined =>
  PEST_ROUTES.find((route) => route.path === normalizePath(pathname));

export const pestServiceRoutes = () =>
  PEST_ROUTES.filter((route) => route.kind === 'service' || route.kind === 'builders');

export const pestAreaRoutes = () => PEST_ROUTES.filter((route) => route.kind === 'area');

export const pestHindiRoute = () => PEST_ROUTES.find((route) => route.kind === 'hindi');

export const SERVICE_ID_TO_PATH: Record<string, string> = {
  'SRV-101': '/pest-control/cockroach-control-lucknow',
  'SRV-102': '/pest-control/rodent-control-lucknow',
  'SRV-103': '/pest-control/mosquito-control-lucknow',
  'SRV-104': '/pest-control/termite-control-lucknow',
  'SRV-105': '/pest-control/fumigation-lucknow',
};

export const AREA_NAME_TO_PATH: Record<string, string> = Object.fromEntries(
  pestAreaRoutes().map((route) => [route.areaName ?? '', route.path]),
);

export const pestSegmentRoutes = () => PEST_ROUTES.filter((route) => route.kind === 'segment');

export const PEST_HUB = PEST_ROUTES.find((route) => route.path === '/pest-control')!;

export const lucknowLocalitiesServed = (): string[] =>
  pestAreaRoutes()
    .map((route) => route.areaName)
    .filter((name): name is string => Boolean(name));
