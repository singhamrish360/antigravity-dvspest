import data from './routes-data.json';
import { CORE_DRAWING_FAQS, FaqItem } from './faqs';

export type SeoKind = 'hub' | 'plot' | 'area' | 'city' | 'vastu' | 'hindi';
export type VastuFacing = 'east' | 'north' | 'west' | 'south';

export interface SeoRoute {
  path: string;
  kind: SeoKind;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  faqs: FaqItem[];
  lang: 'en' | 'hi';
  plotWidthFt?: number;
  plotDepthFt?: number;
  plotSqFt?: number;
  exampleFloors?: number;
  city?: string;
  facing?: VastuFacing;
  vastuPoints?: string[];
}

interface RawRoute {
  path: string;
  kind: SeoKind;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  extraFaqs?: FaqItem[];
  lang?: 'en' | 'hi';
  plotWidthFt?: number;
  plotDepthFt?: number;
  plotSqFt?: number;
  exampleFloors?: number;
  city?: string;
  facing?: VastuFacing;
  vastuPoints?: string[];
}

export const SEO_ROUTES: SeoRoute[] = (data as RawRoute[]).map((route) => ({
  path: route.path,
  kind: route.kind,
  title: route.title,
  description: route.description,
  h1: route.h1,
  intro: route.intro,
  faqs: [...CORE_DRAWING_FAQS, ...(route.extraFaqs ?? [])],
  lang: route.lang ?? 'en',
  plotWidthFt: route.plotWidthFt,
  plotDepthFt: route.plotDepthFt,
  plotSqFt: route.plotSqFt,
  exampleFloors: route.exampleFloors,
  city: route.city,
  facing: route.facing,
  vastuPoints: route.vastuPoints,
}));

export const DRAWINGS_HUB = SEO_ROUTES.find((route) => route.path === '/drawings')!;

export const normalizePath = (pathname: string) => {
  if (!pathname) return '/';
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
};

export const matchSeoRoute = (pathname: string): SeoRoute | undefined =>
  SEO_ROUTES.find((route) => route.path === normalizePath(pathname));

export const plotRoutes = () => SEO_ROUTES.filter((route) => route.kind === 'plot');
export const areaRoutes = () => SEO_ROUTES.filter((route) => route.kind === 'area');
export const cityRoutes = () => SEO_ROUTES.filter((route) => route.kind === 'city');
export const vastuRoutes = () => SEO_ROUTES.filter((route) => route.kind === 'vastu');
