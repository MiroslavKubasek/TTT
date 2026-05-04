const COMMON = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const ICONS = {
  // 1 – Nehledej dokonalost: hvězdička s lupou (něco hledá, ale to nemusí být perfektní)
  1: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <path d="M30 12 L36 28 L52 30 L40 41 L44 56 L30 48 L16 56 L20 41 L8 30 L24 28 Z" />
      <circle cx="56" cy="48" r="10" />
      <line x1="49" y1="41" x2="64" y2="56" />
    </svg>
  ),

  // 2 – Postoj: kompas s ručičkou
  2: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <circle cx="40" cy="35" r="22" />
      <path d="M40 16 L46 35 L40 52 L34 35 Z" />
      <circle cx="40" cy="35" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),

  // 3 – Emoce: srdce
  3: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <path d="M40 56 C20 42 12 30 22 20 C28 14 36 16 40 24 C44 16 52 14 58 20 C68 30 60 42 40 56 Z" />
    </svg>
  ),

  // 4 – Hook: rybářský háček
  4: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <line x1="40" y1="10" x2="40" y2="44" />
      <path d="M40 44 Q26 48 26 36 Q26 28 36 28" />
      <circle cx="40" cy="8" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),

  // 5 – Cíl: terč se šipkou
  5: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <circle cx="36" cy="38" r="22" />
      <circle cx="36" cy="38" r="14" />
      <circle cx="36" cy="38" r="6" />
      <circle cx="36" cy="38" r="1.5" fill="currentColor" stroke="none" />
      <line x1="62" y1="14" x2="42" y2="34" />
      <path d="M62 14 L56 16 L60 20" />
    </svg>
  ),

  // 6 – Krátké věty: nůžky
  6: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <circle cx="22" cy="22" r="6" />
      <circle cx="22" cy="48" r="6" />
      <line x1="28" y1="26" x2="62" y2="46" />
      <line x1="28" y1="44" x2="62" y2="24" />
    </svg>
  ),

  // 7 – Zpomal: želva
  7: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <path d="M14 42 Q14 28 36 28 Q56 28 56 42 Q56 50 36 50 Q14 50 14 42 Z" />
      <line x1="20" y1="50" x2="20" y2="58" />
      <line x1="32" y1="50" x2="32" y2="58" />
      <line x1="40" y1="50" x2="40" y2="58" />
      <line x1="52" y1="50" x2="52" y2="58" />
      <circle cx="62" cy="38" r="6" />
      <circle cx="64" cy="36" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),

  // 8 – Pauzy: pause symbol v kruhu
  8: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <circle cx="40" cy="35" r="22" />
      <line x1="34" y1="24" x2="34" y2="46" />
      <line x1="46" y1="24" x2="46" y2="46" />
    </svg>
  ),

  // 9 – Gesta: zdvižená ruka
  9: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <path d="M30 60 Q26 50 28 38 L28 22 Q28 18 32 18 Q36 18 36 22 L36 36 L36 14 Q36 10 40 10 Q44 10 44 14 L44 36 L46 16 Q46 12 50 12 Q54 12 54 16 L54 38 L56 22 Q56 18 60 18 Q64 18 64 22 L64 42 Q64 60 50 62 Z" />
    </svg>
  ),

  // 10 – Jedna myšlenka: jediná šipka jasně dopředu
  10: (
    <svg viewBox="0 0 80 70" {...COMMON}>
      <line x1="14" y1="35" x2="62" y2="35" />
      <path d="M54 26 L66 35 L54 44" />
    </svg>
  ),
};

export default function DecalogueArt({ id, className = '' }) {
  const icon = ICONS[id];
  if (!icon) return null;
  return (
    <span className={'decalogue-art ' + className} aria-hidden="true">
      {icon}
    </span>
  );
}
