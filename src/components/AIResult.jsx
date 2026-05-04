import { useEffect, useState } from 'react';
import { t } from '../i18n.js';
import { generateOutline } from '../services/ai.js';

export default function AIResult({ lang, challenge, settings, onBack }) {
  const [status, setStatus] = useState(settings.apiKey ? 'loading' : 'noKey');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const run = async () => {
    if (!settings.apiKey) {
      setStatus('noKey');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const res = await generateOutline({
        topic: challenge.topic,
        strategy: challenge.strategy,
        hint: challenge.hint,
        lang,
        settings,
      });
      setResult(res);
      setStatus('done');
    } catch (e) {
      setError(e.message || 'Error');
      setStatus('error');
    }
  };

  useEffect(() => {
    if (settings.apiKey) run();
  }, []);

  return (
    <div className="card ai-result">
      <div className="timer-topic">
        <div className="chip">{t(lang, 'generator.topicLabel')}</div>
        <h2>{challenge.topic}</h2>
        <div className="chip small">{challenge.strategy.name}</div>
        {challenge.hint &&
          (challenge.hint.hook || challenge.hint.content || challenge.hint.conclusion) && (
            <div className="ai-hint-note">
              <div className="chip hint-chip">{t(lang, 'generator.hintLabel')}</div>
              <dl className="hint-list compact">
                {challenge.hint.hook && (
                  <div className="hint-row">
                    <dt>{t(lang, 'generator.hintHook')}</dt>
                    <dd>{challenge.hint.hook}</dd>
                  </div>
                )}
                {challenge.hint.content && (
                  <div className="hint-row">
                    <dt>{t(lang, 'generator.hintContent')}</dt>
                    <dd>{challenge.hint.content}</dd>
                  </div>
                )}
                {challenge.hint.conclusion && (
                  <div className="hint-row">
                    <dt>{t(lang, 'generator.hintConclusion')}</dt>
                    <dd>{challenge.hint.conclusion}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
      </div>

      {status === 'loading' && (
        <div className="loading">
          <div className="spinner" />
          <p>{t(lang, 'ai.loading')}</p>
        </div>
      )}

      {status === 'noKey' && (
        <div className="hint-box hint-error">
          <span>{t(lang, 'ai.noKey')}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="notice error">
          <p>{t(lang, 'ai.error')}</p>
          <code>{error}</code>
          <button className="btn" onClick={run}>{t(lang, 'ai.retry')}</button>
        </div>
      )}

      {status === 'done' && result && (
        <div className="versions">
          {result.versions.map((v, vi) => (
            <section className="version" key={vi}>
              <header className="version-header">
                <span className="version-badge">
                  {t(lang, 'ai.version')} {vi + 1}
                </span>
                <span className="version-label">{v.label}</span>
              </header>
              <div className="outline">
                {v.hooks && v.hooks.length > 0 && (
                  <div className="outline-card hooks-card">
                    <div className="chip hook-chip">{t(lang, 'ai.hooks')}</div>
                    <ul className="hooks-list">
                      {v.hooks.map((h, i) => (
                        <li key={i}>
                          {h.technique && (
                            <span className="hook-technique">{h.technique}</span>
                          )}
                          <span className="hook-text">{h.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="outline-card">
                  <div className="chip">{t(lang, 'ai.mainIdea')}</div>
                  <p className="big">{v.mainIdea}</p>
                </div>
                <div className="outline-card">
                  <div className="chip">{t(lang, 'ai.content')}</div>
                  <ul>
                    {v.content.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="outline-card">
                  <div className="chip">{t(lang, 'ai.conclusion')}</div>
                  <p className="big">{v.conclusion}</p>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      <div className="actions">
        <button className="btn" onClick={onBack}>{t(lang, 'timer.back')}</button>
      </div>
    </div>
  );
}
