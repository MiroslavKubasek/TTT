import { useEffect, useState } from 'react';
import { t } from '../i18n.js';
import { decalogue } from '../content/decalogue.js';
import DecalogueArt from './DecalogueArt.jsx';

export default function Decalogue({ lang }) {
  const items = decalogue[lang] ?? decalogue.cs;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(items.length - 1, 0)));
  }, [items.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        setIndex((i) => (i + 1) % items.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setIndex((i) => (i - 1 + items.length) % items.length);
      } else if (e.key === 'Home') {
        setIndex(0);
      } else if (e.key === 'End') {
        setIndex(items.length - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items.length]);

  if (items.length === 0) return null;

  const item = items[index];
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="decalogue-shell">
      <header className="decalogue-header">
        <div className="chip">{t(lang, 'decalogue.eyebrow')}</div>
        <h2 className="decalogue-heading">{t(lang, 'decalogue.title')}</h2>
        <p className="muted decalogue-subtitle">{t(lang, 'decalogue.subtitle')}</p>
      </header>

      <nav className="decalogue-tabs" aria-label={t(lang, 'decalogue.tabsAriaLabel')}>
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            className={i === index ? 'dec-tab active' : 'dec-tab'}
            onClick={() => setIndex(i)}
            aria-current={i === index ? 'true' : undefined}
            aria-label={`${it.id}. ${it.title}`}
          >
            {it.id}
          </button>
        ))}
      </nav>

      <article className="decalogue-card" key={item.id}>
        <header className="decalogue-card-head">
          <span className="decalogue-num">{String(item.id).padStart(2, '0')}</span>
          <DecalogueArt id={item.id} className="decalogue-card-art" />
        </header>
        <h3 className="decalogue-title">{item.title}</h3>
        <p className="decalogue-body">{item.body}</p>
      </article>

      <nav className="decalogue-nav">
        <button
          className="slide-arrow"
          onClick={prev}
          aria-label={t(lang, 'decalogue.prev')}
        >
          ←
        </button>
        <span className="decalogue-counter">
          {index + 1} / {items.length}
        </span>
        <button
          className="slide-arrow"
          onClick={next}
          aria-label={t(lang, 'decalogue.next')}
        >
          →
        </button>
      </nav>
    </div>
  );
}
