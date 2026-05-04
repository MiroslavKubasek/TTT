import { t } from '../i18n.js';

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  width: 18,
  height: 18,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function IconKey() {
  return (
    <svg {...ICON_PROPS} width={20} height={20}>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12 L21 2" />
      <path d="M17 6 L20 9" />
      <path d="M14 9 L17 12" />
    </svg>
  );
}

function IconList() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M3 6 L4.5 7.5 L7 5" />
      <rect x="3" y="10.5" width="3" height="3" rx="0.6" />
      <rect x="3" y="16.5" width="3" height="3" rx="0.6" />
      <line x1="10" y1="6" x2="20" y2="6" />
      <line x1="10" y1="12" x2="20" y2="12" />
      <line x1="10" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function IconCards() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="4" y="7" width="13" height="13" rx="2.5" />
      <rect x="7" y="4" width="13" height="13" rx="2.5" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11 a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  );
}

export default function Home({ lang, setView }) {
  return (
    <div className="home-shell">
      <section className="home-hero">
        <div className="home-hero-content">
          <h2 className="home-heading">{t(lang, 'home.title')}</h2>
          <blockquote className="home-motto">{t(lang, 'home.motto')}</blockquote>
          <p className="home-lead">{t(lang, 'home.lead')}</p>

          <div className="home-credits">
            <a
              className="home-credit"
              href="https://www.kubasek.eu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="home-credit-img">
                <img src="/miroslav-kubasek.jpg" alt="Miroslav Kubásek" loading="lazy" />
              </span>
              <span className="home-credit-text">
                <span className="home-credit-role">{t(lang, 'home.creditAuthor')}</span>
                <span className="home-credit-name">Miroslav Kubásek</span>
              </span>
            </a>
            <a
              className="home-credit"
              href="https://toastmastri.cz/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="home-credit-img">
                <img src="/toastmasters-logo.jpg" alt="Brněnští Toastmasteři" loading="lazy" />
              </span>
              <span className="home-credit-text">
                <span className="home-credit-role">{t(lang, 'home.creditClub')}</span>
                <span className="home-credit-name">Brněnští Toastmasteři</span>
              </span>
            </a>
          </div>

        </div>

        <img
          className="home-hero-photo"
          src="/miroslav-hero.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      </section>

      <div className="home-cta">
        <button className="btn home-cta-btn" onClick={() => setView('decalogue')}>
          <IconList />
          {t(lang, 'home.ctaDecalogue')}
        </button>
        <button className="btn home-cta-btn" onClick={() => setView('presentation')}>
          <IconCards />
          {t(lang, 'home.ctaPresentation')}
        </button>
        <button
          className="btn primary home-cta-btn"
          onClick={() => setView('generator')}
        >
          <IconMic />
          {t(lang, 'home.ctaTraining')}
        </button>
      </div>

      <aside className="home-api-notice">
        <span className="home-api-icon" aria-hidden="true">
          <IconKey />
        </span>
        <div className="home-api-body">
          <p>{t(lang, 'home.apiNotice')}</p>
          <button
            type="button"
            className="home-api-link"
            onClick={() => setView('settings')}
          >
            {t(lang, 'home.apiNoticeCta')} →
          </button>
        </div>
      </aside>
    </div>
  );
}
