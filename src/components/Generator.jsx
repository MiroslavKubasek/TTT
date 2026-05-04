import { useEffect, useRef, useState } from 'react';
import { t } from '../i18n.js';
import { topics, sampleN } from '../data.js';
import { getStrategies } from '../services/strategies.js';
import { generateHint, generateTopic } from '../services/ai.js';
import StrategyArt from './StrategyArt.jsx';

const STRATEGY_OPTION_COUNT = 3;
const DRAWN_KEY = 'tt-coach-drawn-topics';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function loadDrawnToday() {
  try {
    const raw = localStorage.getItem(DRAWN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed?.date === todayStr() && Array.isArray(parsed.drawn)) {
      return parsed.drawn;
    }
  } catch {}
  return [];
}

function saveDrawnToday(drawn) {
  try {
    localStorage.setItem(
      DRAWN_KEY,
      JSON.stringify({ date: todayStr(), drawn })
    );
  } catch {}
}

function pickFreshTopic(allTopics) {
  if (!allTopics?.length) return '';
  const drawnToday = loadDrawnToday();
  const drawnSet = new Set(drawnToday);
  const pool = allTopics.filter((topic) => !drawnSet.has(topic));
  const source = pool.length > 0 ? pool : allTopics;
  const topic = source[Math.floor(Math.random() * source.length)];
  saveDrawnToday([...drawnToday, topic]);
  return topic;
}

export default function Generator({ lang, challenge, setChallenge, settings, onStart }) {
  const [hintStatus, setHintStatus] = useState('idle');
  const [hintError, setHintError] = useState('');
  const [editingTopic, setEditingTopic] = useState(false);
  const [aiDrawState, setAiDrawState] = useState({ status: 'idle', error: '' });
  const topicRef = useRef(null);

  useEffect(() => {
    if (editingTopic) return;
    if (topicRef.current && topicRef.current.innerText !== (challenge?.topic ?? '')) {
      topicRef.current.innerText = challenge?.topic ?? '';
    }
  }, [challenge?.topic, editingTopic]);

  useEffect(() => {
    if (!editingTopic || !topicRef.current) return;
    const el = topicRef.current;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, [editingTopic]);

  const resetHint = () => {
    setHintStatus('idle');
    setHintError('');
  };

  const draw = () => {
    const topic = pickFreshTopic(topics[lang]);
    const strategyOptions = sampleN(getStrategies(lang), STRATEGY_OPTION_COUNT);
    setChallenge({ topic, strategyOptions, strategy: null, hint: null });
    resetHint();
    setAiDrawState({ status: 'idle', error: '' });
  };

  const drawFromAI = async () => {
    if (!settings?.apiKey) return;
    setAiDrawState({ status: 'loading', error: '' });
    try {
      const exclude = loadDrawnToday();
      const topic = await generateTopic({ lang, settings, exclude });
      if (!topic) throw new Error('Empty AI response');
      saveDrawnToday([...exclude, topic]);
      const strategyOptions = sampleN(getStrategies(lang), STRATEGY_OPTION_COUNT);
      setChallenge({ topic, strategyOptions, strategy: null, hint: null });
      resetHint();
      setAiDrawState({ status: 'idle', error: '' });
    } catch (e) {
      setAiDrawState({ status: 'error', error: e.message || 'Error' });
    }
  };

  const reshuffleStrategies = () => {
    if (!challenge) return;
    const all = getStrategies(lang);
    const currentIds = new Set((challenge.strategyOptions ?? []).map((s) => s.id));
    const pool = all.filter((s) => !currentIds.has(s.id));
    const newOptions =
      pool.length >= STRATEGY_OPTION_COUNT
        ? sampleN(pool, STRATEGY_OPTION_COUNT)
        : sampleN(all, STRATEGY_OPTION_COUNT);
    setChallenge({
      ...challenge,
      strategyOptions: newOptions,
      strategy: null,
      hint: null,
    });
    resetHint();
  };

  const selectStrategy = (s) => {
    if (!challenge) return;
    if (challenge.strategy?.id === s.id) return;
    setChallenge({ ...challenge, strategy: s, hint: null });
    resetHint();
  };

  const startEditTopic = () => {
    if (!challenge) return;
    setEditingTopic(true);
  };

  const finishEditTopic = () => {
    if (!editingTopic) return;
    const next = (topicRef.current?.innerText ?? '').replace(/\s+/g, ' ').trim();
    setEditingTopic(false);
    if (!next) {
      if (topicRef.current) topicRef.current.innerText = challenge.topic;
      return;
    }
    if (next !== challenge.topic) {
      setChallenge({ ...challenge, topic: next, hint: null });
      resetHint();
    }
  };

  const cancelEditTopic = () => {
    if (topicRef.current) topicRef.current.innerText = challenge.topic;
    setEditingTopic(false);
  };

  const kickMe = async () => {
    if (!challenge?.strategy) return;
    if (!settings?.apiKey) {
      setHintStatus('noKey');
      return;
    }
    setHintStatus('loading');
    setHintError('');
    try {
      const hint = await generateHint({
        topic: challenge.topic,
        strategy: challenge.strategy,
        lang,
        settings,
      });
      setChallenge({ ...challenge, hint });
      setHintStatus('done');
    } catch (e) {
      setHintError(e.message || 'Error');
      setHintStatus('error');
    }
  };

  const options = challenge?.strategyOptions ?? [];
  const selectedId = challenge?.strategy?.id;
  const hasHint = Boolean(
    challenge?.hint &&
      (challenge.hint.hook || challenge.hint.content || challenge.hint.conclusion)
  );

  return (
    <div className="card generator">
      <h2>{t(lang, 'generator.heading')}</h2>
      <p className="muted">{t(lang, 'generator.subheading')}</p>

      {challenge ? (
        <div className="challenge">
          <div className="chip">{t(lang, 'generator.topicLabel')}</div>
          <div className="topic-row">
            <h1
              ref={topicRef}
              className={'topic' + (editingTopic ? ' editing' : '')}
              contentEditable={editingTopic}
              suppressContentEditableWarning
              spellCheck={editingTopic}
              onBlur={finishEditTopic}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  topicRef.current?.blur();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  cancelEditTopic();
                }
              }}
            />
            <button
              type="button"
              className={'topic-edit-btn' + (editingTopic ? ' active' : '')}
              onClick={() => {
                if (editingTopic) topicRef.current?.blur();
                else startEditTopic();
              }}
              aria-label={t(lang, 'generator.editTopic')}
              title={t(lang, 'generator.editTopic')}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z" />
              </svg>
            </button>
          </div>

          <div className="chip">{t(lang, 'generator.strategyLabel')}</div>
          {options.length > 0 && (
            <>
              <p className="muted strategy-pick-hint">
                {t(lang, 'generator.pickStrategy')}
              </p>
              <div className="strategy-options">
                {options.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={
                      'strategy-option' + (selectedId === s.id ? ' selected' : '')
                    }
                    onClick={() => selectStrategy(s)}
                  >
                    <StrategyArt id={s.id} className="strategy-option-art" />
                    <span className="strategy-option-name">{s.name}</span>
                    <span className="strategy-option-desc">{s.description}</span>
                    {selectedId === s.id && (
                      <span className="strategy-option-badge">
                        {t(lang, 'generator.selected')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="strategy-actions">
                <button className="btn ghost" onClick={reshuffleStrategies}>
                  {t(lang, 'generator.reshuffleStrategies')}
                </button>
              </div>
            </>
          )}

          {hintStatus === 'loading' && (
            <div className="hint-box loading-hint">
              <div className="spinner small" />
              <span>{t(lang, 'generator.hintLoading')}</span>
            </div>
          )}
          {hintStatus === 'error' && (
            <div className="hint-box hint-error">
              <strong>{t(lang, 'generator.hintErrorTitle')}</strong>
              <code>{hintError}</code>
            </div>
          )}
          {hintStatus === 'noKey' && (
            <div className="hint-box hint-error">
              <span>{t(lang, 'ai.noKey')}</span>
            </div>
          )}
          {challenge.hint &&
            (challenge.hint.hook || challenge.hint.content || challenge.hint.conclusion) && (
              <div className="hint-box">
                <div className="chip hint-chip">{t(lang, 'generator.hintLabel')}</div>
                <dl className="hint-list">
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
      ) : (
        <div className="challenge challenge-empty" aria-hidden="true">
          <div className="chip">{t(lang, 'generator.topicLabel')}</div>
          <div className="topic-row">
            <span className="topic-placeholder">
              {t(lang, 'generator.placeholderTopic')}
            </span>
          </div>
          <div className="chip">{t(lang, 'generator.strategyLabel')}</div>
          <p className="muted strategy-pick-hint">
            {t(lang, 'generator.placeholderStrategyHint')}
          </p>
          <div className="strategy-options">
            {[1, 2, 3].map((i) => (
              <div className="strategy-option-skeleton" key={i}>
                <span className="strategy-option-skeleton-name">
                  {t(lang, 'generator.placeholderStrategy')} {i}
                </span>
                <span className="strategy-option-skeleton-desc">…</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="actions">
        <div className="draw-group" role="group" aria-label={t(lang, 'generator.drawGroupLabel')}>
          <span className="draw-group-label">{t(lang, 'generator.drawGroupLabel')}</span>
          <div className="draw-group-buttons">
            <button className="btn" onClick={draw}>
              {t(lang, 'generator.generate')}
            </button>
            {settings?.apiKey && (
              <button
                type="button"
                className="btn ai-draw-btn"
                onClick={drawFromAI}
                disabled={aiDrawState.status === 'loading'}
                title={t(lang, 'generator.generateAITitle')}
              >
                <span className="ai-draw-icon" aria-hidden="true">
                  {aiDrawState.status === 'loading' ? (
                    <span className="spinner small" />
                  ) : (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3 L13.6 9 L20 10.5 L13.6 12 L12 18 L10.4 12 L4 10.5 L10.4 9 Z" />
                      <circle cx="18.5" cy="5.5" r="0.9" fill="currentColor" stroke="none" />
                      <circle cx="5.5" cy="18" r="0.9" fill="currentColor" stroke="none" />
                    </svg>
                  )}
                </span>
                {aiDrawState.status === 'loading'
                  ? t(lang, 'generator.generateAILoading')
                  : t(lang, 'generator.generateAI')}
              </button>
            )}
          </div>
        </div>
        <button
          className="btn"
          disabled={!challenge?.strategy || hintStatus === 'loading'}
          onClick={kickMe}
        >
          {hasHint
            ? t(lang, 'generator.kickMeAgain')
            : t(lang, 'generator.kickMe')}
        </button>
        <button
          className="btn primary"
          disabled={!challenge?.strategy}
          onClick={onStart}
        >
          {t(lang, 'generator.start')}
        </button>
      </div>

      {aiDrawState.status === 'error' && (
        <div className="hint-box hint-error" role="alert">
          <strong>{t(lang, 'generator.generateAIErrorTitle')}</strong>
          <code>{aiDrawState.error}</code>
        </div>
      )}
    </div>
  );
}
