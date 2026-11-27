export interface SampleWorkItem {
  src: string;
  title: string;
  alt: string;
  featured?: boolean;
}

export const SAMPLE_WORK: SampleWorkItem[] = [
  {
    src: '/drawings/sample-3d-front-elevation.webp',
    title: '3D front elevation',
    alt: '3D front elevation of a residence, prepared as a sample of DVS drawing work',
    featured: true,
  },
  {
    src: '/drawings/sample-ground-floor-plan.webp',
    title: 'Ground floor plan',
    alt: 'Ground floor plan from a sample AutoCAD house drawing set',
  },
  {
    src: '/drawings/sample-front-elevation.webp',
    title: 'Front elevation',
    alt: 'Front elevation drawing from a sample AutoCAD house drawing set',
  },
  {
    src: '/drawings/sample-section.webp',
    title: 'Section',
    alt: 'Building section from a sample AutoCAD house drawing set',
  },
];
