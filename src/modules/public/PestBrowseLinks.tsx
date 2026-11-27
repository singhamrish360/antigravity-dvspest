import React from 'react';
import { pestAreaRoutes, pestHindiRoute, pestSegmentRoutes, pestServiceRoutes, PestRoute } from '../../seo/pest-routes';

const serviceLabel = (route: PestRoute) => {
  if (route.kind === 'builders') return 'Anti-termite for builders and new buildings';
  return route.serviceName.replace(/ in Lucknow$/i, '').replace(/^Warehouse and grain storage fumigation$/i, 'Warehouse and grain fumigation');
};

export const PestBrowseLinks: React.FC<{ currentPath?: string }> = ({ currentPath }) => {
  const services = pestServiceRoutes();
  const segments = pestSegmentRoutes();
  const areas = pestAreaRoutes();
  const hindi = pestHindiRoute();

  const Section = ({ title, items }: { title: string; items: { path: string; label: string }[] }) => (
    <div>
      <h3 style={{ fontSize: '1.05rem', marginBottom: '0.65rem' }}>{title}</h3>
      <div className="drawings-link-grid">
        {items.map((item) => (
          <a key={item.path} href={item.path} aria-current={item.path === currentPath ? 'page' : undefined}>
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>
        Pest control services and Lucknow areas
      </h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '720px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
        Each page is about a listed service or a Lucknow locality we serve. Area pages do not claim a local office or completed jobs in that locality.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Section
          title="Services"
          items={services.map((route) => ({ path: route.path, label: serviceLabel(route) }))}
        />
        <Section
          title="Homes, shops and businesses"
          items={segments.map((route) => ({ path: route.path, label: route.serviceName.replace(/ in Lucknow$/i, '') }))}
        />
        <Section
          title="Areas we serve in Lucknow"
          items={areas.map((route) => ({ path: route.path, label: route.areaName ?? route.h1 }))}
        />
        <p style={{ margin: 0 }}>
          {hindi && (
            <>
              <a href={hindi.path} style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                दीमक / कीड़े का इलाज लखनऊ
              </a>
              {' · '}
            </>
          )}
          <a href="/pest-control" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Pest control in Lucknow</a>
          {' · '}
          <a href="/" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Home</a>
          {' · '}
          <a href="/drawings" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>House drawings</a>
        </p>
      </div>
    </div>
  );
};
