import { useEffect, useState } from 'react';
import { t } from './i18n.js';
import Generator from './components/Generator.jsx';
import Timer from './components/Timer.jsx';
import AIResult from './components/AIResult.jsx';
import Settings from './components/Settings.jsx';
import Presentation from './components/Presentation.jsx';
import Decalogue from './components/Decalogue.jsx';
import About from './components/About.jsx';
import Home from './components/Home.jsx';

const SETTINGS_KEY = 'tt-coach-settings';
const LANG_KEY = 'tt-coach-lang';
const THEME_KEY = 'tt-coach-theme';

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { provider: 'openai', apiKey: '', model: '', baseUrl: '' };
}

function loadLang() {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored === 'cs' || stored === 'en') return stored;
  return navigator.language?.startsWith('cs') ? 'cs' : 'en';
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

const TRAINING_VIEWS = new Set(['generator', 'timer', 'ai']);

export default function App() {
  const [lang, setLang] = useState(loadLang);
  const [theme, setTheme] = useState(loadTheme);
  const [view, setView] = useState('home');
  const [settings, setSettings] = useState(loadSettings);
  const [challenge, setChallenge] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const goTo = (next) => {
    setView(next);
    setMenuOpen(false);
  };

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const saveSettings = (s) => {
    setSettings(s);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  };

  const isTraining = TRAINING_VIEWS.has(view);
  const isPresentation = view === 'presentation';
  const isSettings = view === 'settings';

  return (
    <div className={isPresentation ? 'app app-presentation' : 'app'}>
      <div className="bg-gradient" />
      <header className="app-header">
        <button
          type="button"
          className="brand"
          onClick={() => goTo('home')}
          aria-label={t(lang, 'nav.home')}
        >
          <span className="logo">
            <img src="/toastmasters-logo.jpg" alt="" aria-hidden="true" />
          </span>
          <span className="brand-text">
            <span className="brand-title">{t(lang, 'appTitle')}</span>
            <span className="muted brand-subtitle">{t(lang, 'appSubtitle')}</span>
          </span>
        </button>
        <button
          type="button"
          className={'menu-toggle' + (menuOpen ? ' open' : '')}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={t(lang, 'nav.menuToggle')}
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
        <div
          id="primary-menu"
          className={'header-actions' + (menuOpen ? ' open' : '')}
        >
          <nav className="tabs">
            <button
              className={view === 'decalogue' ? 'tab active' : 'tab'}
              onClick={() => goTo('decalogue')}
            >
              {t(lang, 'nav.decalogue')}
            </button>
            <button
              className={isPresentation ? 'tab active' : 'tab'}
              onClick={() => goTo('presentation')}
            >
              {t(lang, 'nav.presentation')}
            </button>
            <button
              className={isTraining ? 'tab active' : 'tab'}
              onClick={() => goTo('generator')}
            >
              {t(lang, 'nav.training')}
            </button>
            <button
              className={view === 'about' ? 'tab active' : 'tab'}
              onClick={() => goTo('about')}
            >
              {t(lang, 'nav.about')}
            </button>
            <button
              className={isSettings ? 'tab active' : 'tab'}
              onClick={() => goTo('settings')}
            >
              {t(lang, 'nav.settings')}
            </button>
          </nav>
          <div className="lang-switch">
            <button
              className={lang === 'cs' ? 'lang active' : 'lang'}
              onClick={() => setLang('cs')}
            >
              CZ
            </button>
            <button
              className={lang === 'en' ? 'lang active' : 'lang'}
              onClick={() => setLang('en')}
            >
              EN
            </button>
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={t(lang, 'theme.toggle')}
            title={t(lang, 'theme.toggle')}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="app-main">
        {view === 'home' && <Home lang={lang} setView={setView} />}
        {view === 'generator' && (
          <Generator
            lang={lang}
            challenge={challenge}
            setChallenge={setChallenge}
            settings={settings}
            onStart={() => setView('timer')}
          />
        )}
        {view === 'timer' && challenge && (
          <Timer
            lang={lang}
            challenge={challenge}
            onBack={() => setView('generator')}
            onFinish={() => setView('ai')}
          />
        )}
        {view === 'ai' && challenge && (
          <AIResult
            lang={lang}
            challenge={challenge}
            settings={settings}
            onBack={() => setView('generator')}
          />
        )}
        {view === 'presentation' && (
          <Presentation lang={lang} initialStrategyId={challenge?.strategy?.id} />
        )}
        {view === 'decalogue' && <Decalogue lang={lang} />}
        {view === 'about' && <About lang={lang} />}
        {view === 'settings' && (
          <Settings lang={lang} settings={settings} onSave={saveSettings} />
        )}
      </main>

      <footer className="app-footer">
        <span className="muted">
          © {new Date().getFullYear()} {t(lang, 'footer.copyright')}
        </span>
      </footer>
    </div>
  );
}
