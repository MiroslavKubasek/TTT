import { useState } from 'react';
import { t } from '../i18n.js';

const KEY_URLS = {
  openai: 'https://platform.openai.com/api-keys',
  gemini: 'https://aistudio.google.com/app/apikey',
};

export default function Settings({ lang, settings, onSave }) {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
    setSaved(true);
  };

  const modelPlaceholder =
    form.provider === 'gemini'
      ? t(lang, 'settings.modelPlaceholderGemini')
      : t(lang, 'settings.modelPlaceholderOpenAI');

  return (
    <form className="card settings" onSubmit={submit}>
      <h2>{t(lang, 'settings.title')}</h2>

      <label className="field">
        <span>{t(lang, 'settings.provider')}</span>
        <div className="segmented">
          <button
            type="button"
            className={form.provider === 'openai' ? 'seg active' : 'seg'}
            onClick={() => update('provider', 'openai')}
          >
            {t(lang, 'settings.providerOpenAI')}
          </button>
          <button
            type="button"
            className={form.provider === 'gemini' ? 'seg active' : 'seg'}
            onClick={() => update('provider', 'gemini')}
          >
            {t(lang, 'settings.providerGemini')}
          </button>
        </div>
      </label>

      <label className="field">
        <span>{t(lang, 'settings.apiKey')}</span>
        <input
          type="password"
          autoComplete="off"
          value={form.apiKey || ''}
          placeholder={t(lang, 'settings.apiKeyPlaceholder')}
          onChange={(e) => update('apiKey', e.target.value)}
        />
        <a
          className="settings-link"
          href={KEY_URLS[form.provider] || KEY_URLS.openai}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(lang, 'settings.getKey')} →
        </a>
      </label>

      <label className="field">
        <span>{t(lang, 'settings.model')}</span>
        <input
          type="text"
          value={form.model || ''}
          placeholder={modelPlaceholder}
          onChange={(e) => update('model', e.target.value)}
        />
      </label>

      {form.provider === 'openai' && (
        <label className="field">
          <span>{t(lang, 'settings.baseUrl')}</span>
          <input
            type="text"
            value={form.baseUrl || ''}
            placeholder={t(lang, 'settings.baseUrlPlaceholder')}
            onChange={(e) => update('baseUrl', e.target.value)}
          />
        </label>
      )}

      <p className="help">{t(lang, 'settings.help')}</p>

      <button type="submit" className="btn primary">
        {saved ? t(lang, 'settings.saved') : t(lang, 'settings.save')}
      </button>
    </form>
  );
}
