export const DRAWINGS_PAGE_CSS = `
  .drawings-pricing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .drawings-steps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
  .drawings-calc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }
  .drawings-gallery-feature {
    display: flex;
    justify-content: center;
    margin-bottom: 1.25rem;
  }
  .drawings-gallery-sheets {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
  .drawings-gallery-item {
    background: #ffffff;
    cursor: pointer;
    padding: 0;
    overflow: hidden;
    text-align: left;
    width: 100%;
    font: inherit;
    color: inherit;
    appearance: none;
    border: 1px solid var(--bg-glass-border);
  }
  .drawings-gallery-item img {
    display: block;
    width: 100%;
    height: auto;
    background: #ffffff;
  }
  .drawings-gallery-item figcaption,
  .drawings-gallery-item .caption {
    padding: 0.85rem 1rem 1rem;
    font-weight: 600;
    font-size: 0.95rem;
  }
  .drawings-lightbox {
    position: fixed;
    inset: 0;
    background: rgba(28, 22, 16, 0.84);
    z-index: 80;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }
  .drawings-lightbox img {
    max-width: min(1100px, 100%);
    max-height: calc(100vh - 7rem);
    width: auto;
    height: auto;
    object-fit: contain;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
  }
  .drawings-link-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.65rem 1.25rem;
  }
  .drawings-link-grid a {
    color: var(--accent-primary);
    font-weight: 600;
    text-decoration: none;
  }
  .drawings-link-grid a:hover { text-decoration: underline; }
  @media (max-width: 768px) {
    .drawings-pricing-grid,
    .drawings-calc-grid,
    .drawings-link-grid {
      grid-template-columns: 1fr;
    }
    .drawings-steps-grid,
    .drawings-gallery-sheets {
      grid-template-columns: 1fr;
    }
  }
`;
