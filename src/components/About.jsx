import { t } from '../i18n.js';

const TM_LINKS = {
  web: 'https://toastmastri.cz/',
  facebook: 'https://www.facebook.com/BrnenstiToastmastri',
  instagram: 'https://www.instagram.com/brnenstitoastmastri/',
};

const AUTHOR_LINKS = {
  web: 'https://www.kubasek.eu',
  facebook: 'https://www.facebook.com/KubasekMiroslav',
  instagram: 'https://www.instagram.com/kubasekmiroslav/',
};

function IconWeb() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M13 22v-7h2.5l.5-3H13V9.5c0-.9.3-1.5 1.5-1.5H16V5.2c-.3 0-1.3-.1-2.3-.1-2.3 0-3.7 1.4-3.7 4V12H8v3h2v7h3z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
    </svg>
  );
}

function ToastmastersLogo() {
  return (
    <img
      src="/toastmasters-logo.jpg"
      alt="Brněnští Toastmasteři"
      loading="lazy"
      decoding="async"
    />
  );
}

export default function About({ lang }) {
  return (
    <div className="about-shell">
      <header className="about-header">
        <h2 className="about-heading">{t(lang, 'about.title')}</h2>
        <p className="about-lead">{t(lang, 'about.lead')}</p>
      </header>

      <section className="about-card author-card">
        <div className="about-card-eyebrow">
          <div className="chip">{t(lang, 'about.authorEyebrow')}</div>
        </div>
        <div className="about-card-grid">
          <div className="author-avatar">
            <img
              src="/miroslav-kubasek.jpg"
              alt="Miroslav Kubásek"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="about-card-body">
            <h3 className="about-card-title">Miroslav Kubásek</h3>
            <p className="about-card-text">{t(lang, 'about.authorText')}</p>
            <ul className="about-links">
              <li>
                <a href={AUTHOR_LINKS.web} target="_blank" rel="noopener noreferrer">
                  <IconWeb /> kubasek.eu
                </a>
              </li>
              <li>
                <a href={AUTHOR_LINKS.facebook} target="_blank" rel="noopener noreferrer">
                  <IconFacebook /> Facebook
                </a>
              </li>
              <li>
                <a href={AUTHOR_LINKS.instagram} target="_blank" rel="noopener noreferrer">
                  <IconInstagram /> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-card club-card">
        <div className="about-card-eyebrow">
          <div className="chip">{t(lang, 'about.clubEyebrow')}</div>
        </div>
        <div className="about-card-grid">
          <div className="club-logo">
            <ToastmastersLogo />
          </div>
          <div className="about-card-body">
            <h3 className="about-card-title">Brněnští Toastmasteři</h3>
            <p className="about-card-text">{t(lang, 'about.clubText')}</p>
            <div className="about-meeting">
              <span className="about-meeting-label">{t(lang, 'about.meetingLabel')}</span>
              <div className="about-meeting-lines">
                <span className="about-meeting-time">{t(lang, 'about.meetingTime')}</span>
                <span className="about-meeting-place">{t(lang, 'about.meetingPlace')}</span>
              </div>
            </div>
            <ul className="about-links">
              <li>
                <a href={TM_LINKS.web} target="_blank" rel="noopener noreferrer">
                  <IconWeb /> Web
                </a>
              </li>
              <li>
                <a href={TM_LINKS.facebook} target="_blank" rel="noopener noreferrer">
                  <IconFacebook /> Facebook
                </a>
              </li>
              <li>
                <a href={TM_LINKS.instagram} target="_blank" rel="noopener noreferrer">
                  <IconInstagram /> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
