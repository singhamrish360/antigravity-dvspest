import { PHONE_DISPLAY } from './constants';

export interface FaqItem {
  q: string;
  a: string;
}

export const CORE_DRAWING_FAQS: FaqItem[] = [
  {
    q: 'What information should I send?',
    a: 'WhatsApp your plot size in sq ft, or the plot length and width in feet, for a 2D quote. If you only need a 3D front elevation, send your existing drawings. You can also share the number of floors and any other notes.',
  },
  {
    q: 'Which file formats will I receive?',
    a: 'Final drawings are delivered as DWG and PDF files.',
  },
  {
    q: 'How does payment work?',
    a: `WhatsApp or call ${PHONE_DISPLAY} for a quote. We will share payment details with you before the drafting work starts.`,
  },
  {
    q: 'How many revisions are included?',
    a: 'The fee includes up to 2 to 3 major changes and up to 4 to 5 minor changes.',
  },
  {
    q: 'How long does delivery take, and where do you deliver?',
    a: 'Finished drawings are delivered online in 10 days, anywhere in India.',
  },
  {
    q: 'What is included in the 2D AutoCAD set?',
    a: 'The 2D set includes plans, sections and elevations, with plumbing and electrical layouts, at ₹6 per sq ft of built-up area.',
  },
  {
    q: 'How is the 3D front elevation priced?',
    a: 'A 3D front elevation is a flat ₹6,000 for any size, when you already have drawings or have asked us to draft the 2D set as well.',
  },
];
