import React from 'react';
import { areaRoutes, cityRoutes, plotRoutes, vastuRoutes } from '../../seo/routes';

const labelFor = (path: string, fallback: string) => {
  const slug = path.split('/').pop() || fallback;
  return slug.replace(/-house-plan$/, '').replace(/house-map-design-/, '').replace(/-sq-ft/, ' sq ft').replace(/-/g, ' × ').replace(/× sq ft/, 'sq ft');
};

export const DrawingsBrowseLinks: React.FC<{ currentPath?: string }> = ({ currentPath }) => {
  const plots = plotRoutes();
  const areas = areaRoutes();
  const cities = cityRoutes();
  const vastu = vastuRoutes();

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
      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', textAlign: 'center' }}>Browse plans by size, city and facing</h2>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '720px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
        Each page has its own price example. The drawings are still custom, from the plot you send. We do not claim completed projects in every city listed.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Section
          title="Common plot sizes"
          items={plots.map((route) => ({
            path: route.path,
            label: `${route.plotWidthFt}×${route.plotDepthFt} ft (${route.plotSqFt?.toLocaleString('en-IN')} sq ft)`,
          }))}
        />
        <Section
          title="Built-up or plot area"
          items={areas.map((route) => ({
            path: route.path,
            label: `${route.plotSqFt?.toLocaleString('en-IN')} sq ft house plan`,
          }))}
        />
        <Section
          title="Cities we deliver to (online, anywhere in India)"
          items={cities.map((route) => ({
            path: route.path,
            label: `House map design in ${route.city}`,
          }))}
        />
        <Section
          title="Facing and general Vastu notes"
          items={vastu.map((route) => ({
            path: route.path,
            label: `${route.facing ? route.facing[0].toUpperCase() + route.facing.slice(1) : labelFor(route.path, '')} facing house plan`,
          }))}
        />
        <p style={{ margin: 0 }}>
          <a href="/drawings/ghar-ka-naksha" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>घर का नक्शा / मकान का नक्शा</a>
          {' · '}
          <a href="/drawings" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>All house drawings</a>
        </p>
      </div>
    </div>
  );
};
