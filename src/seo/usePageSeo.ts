import { useEffect } from 'react';
import { applyDocumentMeta, restoreStaticJsonLd } from './applyDocumentMeta';
import { HeadTags } from './head';

export const usePageSeo = (head: HeadTags | null) => {
  useEffect(() => {
    if (!head) {
      restoreStaticJsonLd();
      return;
    }
    applyDocumentMeta(head);
    return () => {
      restoreStaticJsonLd();
    };
  }, [head?.title, head?.description, head?.canonical, head?.ogImage, head?.lang, head ? JSON.stringify(head.jsonLd) : '']);
};
