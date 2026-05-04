import { useEffect, useRef, useState } from 'react';
import { t } from '../i18n.js';

const PREP_SECONDS = 30;
const SPEECH_LIMIT = 150;

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(1, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

function colorForSpeech(seconds) {
  if (seconds >= 120) return 'red';
  if (seconds >= 90) return 'yellow';
  if (seconds >= 60) return 'green';
  return 'idle';
}

function labelForColor(color, lang) {
  if (color === 'green') return t(lang, 'timer.green');
  if (color === 'yellow') return t(lang, 'timer.yellow');
  if (color === 'red') return t(lang, 'timer.red');
  return '';
}

export default function Timer({ lang, challenge, onFinish, onBack }) {
  const [phase, setPhase] = useState('prep');
  const [prepLeft, setPrepLeft] = useState(PREP_SECONDS);
  const [speechElapsed, setSpeechElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (phase === 'prep') {
      intervalRef.current = setInterval(() => {
        setPrepLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setPhase('speech');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else if (phase === 'speech') {
      intervalRef.current = setInterval(() => {
        setSpeechElapsed((s) => {
          if (s >= SPEECH_LIMIT) {
            clearInterval(intervalRef.current);
            setPhase('done');
            return s;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [phase]);

  const skipPrep = () => {
    clearInterval(intervalRef.current);
    setPrepLeft(0);
    setPhase('speech');
  };

  const stopSpeech = () => {
    clearInterval(intervalRef.current);
    setPhase('done');
  };

  const color = phase === 'speech' ? colorForSpeech(speechElapsed) : phase === 'done' ? colorForSpeech(speechElapsed) : 'idle';
  const prepProgress = ((PREP_SECONDS - prepLeft) / PREP_SECONDS) * 100;
  const speechProgress = Math.min(100, (speechElapsed / SPEECH_LIMIT) * 100);

  return (
    <div className={`card timer phase-${phase} color-${color}`}>
      <div className="timer-topic">
        <div className="chip">{t(lang, 'generator.topicLabel')}</div>
        <h2>{challenge.topic}</h2>
        <div className="chip small">{challenge.strategy.name}</div>
      </div>

      {phase === 'prep' && (
        <>
          <h3 className="timer-label">{t(lang, 'timer.prepTitle')}</h3>
          <div className="time-display">{formatTime(prepLeft)}</div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${prepProgress}%` }} />
          </div>
          <p className="muted">{t(lang, 'timer.prepHint')}</p>
          <div className="actions">
            <button className="btn" onClick={onBack}>{t(lang, 'timer.back')}</button>
            <button className="btn primary" onClick={skipPrep}>{t(lang, 'timer.skip')}</button>
          </div>
        </>
      )}

      {phase === 'speech' && (
        <>
          <h3 className="timer-label">{t(lang, 'timer.speechTitle')}</h3>
          <div className="time-display">{formatTime(speechElapsed)}</div>
          <div className="progress">
            <div className="progress-bar" style={{ width: `${speechProgress}%` }} />
          </div>
          <p className="signal-label">{labelForColor(color, lang)}</p>
          <div className="actions">
            <button className="btn" onClick={onBack}>{t(lang, 'timer.back')}</button>
            <button className="btn primary" onClick={stopSpeech}>{t(lang, 'timer.stop')}</button>
          </div>
        </>
      )}

      {phase === 'done' && (
        <>
          <h3 className="timer-label">{t(lang, 'timer.timeUp')}</h3>
          {speechElapsed >= SPEECH_LIMIT && (
            <div className="bell-wrap" aria-hidden="true">
              <svg
                className="bell-icon"
                viewBox="0 0 80 88"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M40 12 V18" />
                <circle cx="40" cy="9" r="3" />
                <path d="M40 18 C 22 22, 20 38, 22 54 L 16 62 H 64 L 58 54 C 60 38, 58 22, 40 18 Z" />
                <path d="M34 68 a 6 4 0 0 0 12 0" />
              </svg>
            </div>
          )}
          <div className="time-display">{formatTime(speechElapsed)}</div>
          <p className="signal-label">{labelForColor(color, lang)}</p>
          <div className="actions">
            <button className="btn" onClick={onBack}>{t(lang, 'timer.back')}</button>
            <button className="btn primary" onClick={onFinish}>
              {t(lang, 'ai.reveal')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
