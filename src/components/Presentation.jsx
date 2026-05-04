import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { t } from '../i18n.js';
import { getStrategies } from '../services/strategies.js';
import StrategyArt from './StrategyArt.jsx';

const SHORT_NAMES = {
  cs: {
    star: 'STAR',
    oreo: 'OREO',
    zoomOut: 'ZoomOut',
    pcs: 'PCS',
    ppf: 'PPF',
    proCon: 'Pro&Proti',
    pendulum: 'Kyvadlo',
    devilsAdvocate: 'Ďábel'
  },
  en: {
    star: 'STAR',
    oreo: 'OREO',
    zoomOut: 'ZoomOut',
    pcs: 'PCS',
    ppf: 'PPF',
    proCon: 'Pros&Cons',
    pendulum: 'Pendulum',
    devilsAdvocate: 'Devil'
  }
};

export default function Presentation({ lang, initialStrategyId }) {
  const shortNames = SHORT_NAMES[lang] || SHORT_NAMES.cs;
  const strategies = getStrategies(lang);
  const initialIndex = (() => {
    if (!initialStrategyId) return 0;
    const found = strategies.findIndex((s) => s.id === initialStrategyId);
    return found >= 0 ? found : 0;
  })();
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (!initialStrategyId) return;
    const found = strategies.findIndex((s) => s.id === initialStrategyId);
    if (found >= 0) setIndex(found);
  }, [initialStrategyId, strategies]);

  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(strategies.length - 1, 0)));
  }, [strategies.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setIndex((i) => (i + 1) % strategies.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setIndex((i) => (i - 1 + strategies.length) % strategies.length);
      } else if (e.key === 'Home') {
        setIndex(0);
      } else if (e.key === 'End') {
        setIndex(strategies.length - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [strategies.length]);

  if (strategies.length === 0) {
    return (
      <div className="card presentation-empty">
        <p className="muted">{t(lang, 'presentation.empty')}</p>
      </div>
    );
  }

  const strategy = strategies[index];
  const prev = () => setIndex((i) => (i - 1 + strategies.length) % strategies.length);
  const next = () => setIndex((i) => (i + 1) % strategies.length);

  return (
    <div className="slide-shell">
      <header className="decalogue-header">
        <h2 className="decalogue-heading">{t(lang, 'presentation.title')}</h2>
        <p className="muted decalogue-subtitle">{t(lang, 'presentation.subtitle')}</p>
      </header>

      <nav className="strategy-tabs" aria-label="Strategie">
        {strategies.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={i === index ? 'strat-tab active' : 'strat-tab'}
            onClick={() => setIndex(i)}
            aria-current={i === index ? 'true' : undefined}
            aria-label={s.name}
          >
            {shortNames[s.id] || s.name}
          </button>
        ))}
      </nav>

      <article className="slide" key={strategy.id}>
        <header className="slide-header">
          <div className="slide-title-row">
            <h1 className="slide-title">{strategy.name}</h1>
            <StrategyArt id={strategy.id} className="slide-art" />
          </div>
          <div className="slide-subtitle">{t(lang, 'presentation.mainIdea')}</div>
          <div className="slide-main-idea">
            <ReactMarkdown>{strategy.mainIdea}</ReactMarkdown>
          </div>
        </header>

        <section className="slide-examples">
          {strategy.examples.map((example, i) => (
            <div className="example-card" key={i}>
              <div className="example-chip">
                {t(lang, 'presentation.example')} {i + 1}
              </div>
              <h3 className="example-title">{example.title}</h3>
              <div className="example-body">
                <ReactMarkdown>{example.body}</ReactMarkdown>
              </div>
            </div>
          ))}
        </section>
      </article>

      <nav className="slide-nav">
        <button className="slide-arrow" onClick={prev} aria-label="Previous">
          ←
        </button>
        <span className="decalogue-counter">
          {index + 1} / {strategies.length}
        </span>
        <button className="slide-arrow" onClick={next} aria-label="Next">
          →
        </button>
      </nav>
    </div>
  );
}
