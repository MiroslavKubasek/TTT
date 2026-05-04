const COMMON = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const ART = {
  // STAR – usmívající se hvězda, která vypráví příběh
  star: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <path d="M40 8 L48 30 L70 32 L52 46 L60 66 L40 54 L20 66 L28 46 L10 32 L32 30 Z" />
      <circle cx="34" cy="36" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="46" cy="36" r="1.6" fill="currentColor" stroke="none" />
      <path d="M33 42 Q40 47 47 42" />
    </svg>
  ),

  // OREO/PREP – sušenka z boku, sendvič s krémem
  oreo: (
    <svg viewBox="0 0 80 60" {...COMMON}>
      <ellipse cx="40" cy="18" rx="28" ry="8" />
      <path d="M14 28 Q22 24 30 28 T46 28 T62 28 T78 28" strokeWidth="1.5" />
      <ellipse cx="40" cy="42" rx="28" ry="8" />
      <circle cx="32" cy="16" r="1" fill="currentColor" stroke="none" />
      <circle cx="40" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="48" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),

  // ZOOM OUT – soustředné kruhy s šipkou ven (pohled se rozšiřuje)
  zoomOut: (
    <svg viewBox="0 0 80 60" {...COMMON}>
      <circle cx="34" cy="30" r="22" strokeDasharray="2 4" />
      <circle cx="34" cy="30" r="14" />
      <circle cx="34" cy="30" r="7" />
      <circle cx="34" cy="30" r="2" fill="currentColor" stroke="none" />
      <path d="M58 30 L72 30 M68 26 L72 30 L68 34" />
    </svg>
  ),

  // PCS – detektivní lupa s vykřičníkem (heuréka, řešení nalezeno)
  pcs: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <circle cx="32" cy="30" r="16" />
      <line x1="44" y1="42" x2="62" y2="60" strokeWidth="3" />
      <line x1="32" y1="22" x2="32" y2="34" />
      <circle cx="32" cy="40" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),

  // PPF – ciferník se třemi ručičkami: minulost, teď, budoucnost
  ppf: (
    <svg viewBox="0 0 80 60" {...COMMON}>
      <circle cx="40" cy="30" r="22" />
      <line x1="40" y1="10" x2="40" y2="14" />
      <line x1="62" y1="30" x2="58" y2="30" />
      <line x1="40" y1="50" x2="40" y2="46" />
      <line x1="18" y1="30" x2="22" y2="30" />
      <line x1="40" y1="30" x2="26" y2="30" />
      <line x1="40" y1="30" x2="40" y2="14" />
      <line x1="40" y1="30" x2="56" y2="22" />
      <circle cx="40" cy="30" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),

  // PRO/CON – váhy v rovnováze
  proCon: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <line x1="40" y1="16" x2="40" y2="58" />
      <line x1="28" y1="58" x2="52" y2="58" />
      <line x1="18" y1="22" x2="62" y2="22" />
      <line x1="22" y1="22" x2="22" y2="34" />
      <path d="M14 34 Q22 42 30 34" />
      <line x1="58" y1="22" x2="58" y2="34" />
      <path d="M50 34 Q58 42 66 34" />
      <line x1="22" y1="44" x2="22" y2="50" />
      <line x1="19" y1="47" x2="25" y2="47" />
      <line x1="55" y1="47" x2="61" y2="47" />
    </svg>
  ),

  // PENDULUM – kyvadlo se stopovou křivkou
  pendulum: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <line x1="14" y1="12" x2="66" y2="12" />
      <circle cx="40" cy="12" r="2" fill="currentColor" stroke="none" />
      <line x1="40" y1="12" x2="56" y2="50" />
      <circle cx="56" cy="50" r="7" />
      <path d="M16 52 Q40 66 64 52" strokeDasharray="2 3" />
    </svg>
  ),

  // DEVIL'S ADVOCATE – ďáblík s rohy a šibalským úsměvem
  devilsAdvocate: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <circle cx="40" cy="40" r="20" />
      <path d="M28 24 L24 12 L34 20" />
      <path d="M52 24 L56 12 L46 20" />
      <circle cx="32" cy="38" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="48" cy="38" r="1.6" fill="currentColor" stroke="none" />
      <path d="M30 48 Q40 56 50 48" />
      <line x1="68" y1="22" x2="68" y2="44" />
      <line x1="64" y1="24" x2="64" y2="14" />
      <line x1="68" y1="24" x2="68" y2="12" />
      <line x1="72" y1="24" x2="72" y2="14" />
    </svg>
  ),
};

export default function StrategyArt({ id, className = '' }) {
  const art = ART[id];
  if (!art) return null;
  return (
    <span className={'strategy-art ' + className} aria-hidden="true">
      {art}
    </span>
  );
}
