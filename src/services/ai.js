function buildHintPrompt({ topic, strategy, lang }) {
  if (lang === 'cs') {
    return `Jsi trenér řečnických dovedností. Téma improvizovaného projevu: "${topic}".
Strategie: "${strategy.name}" – ${strategy.description}

Vytvoř pro řečníka trojici návrhů, jak improvizaci uchopit. Každý návrh je jedna věta, maximálně 18 slov. Odpověz PŘESNĚ v tomto formátu, jeden řádek na položku, žádný další text, žádné uvozovky, žádné markdown značky:
HOOK: <jak improvizaci začít, aby to publikum hned zaujalo>
OBSAH: <hlavní linka, kterou v projevu rozvineš>
ZÁVĚR: <jak projev smysluplně zakončit>`;
  }
  return `You are a public speaking coach. Topic for an impromptu speech: "${topic}".
Strategy: "${strategy.name}" – ${strategy.description}

Give the speaker three suggestions for how to handle the improvisation. Each suggestion is one sentence, max 18 words. Respond EXACTLY in this format, one line per item, no extra text, no quotes, no markdown:
HOOK: <how to open so the audience is hooked immediately>
OBSAH: <the main line of the speech>
ZÁVĚR: <how to land the closing>`;
}

const HINT_LABEL_MAP = {
  HOOK: 'hook',
  OBSAH: 'content',
  CONTENT: 'content',
  ZÁVĚR: 'conclusion',
  ZAVER: 'conclusion',
  CLOSE: 'conclusion',
  CONCLUSION: 'conclusion',
};

function parseHintText(text) {
  const result = { hook: '', content: '', conclusion: '' };
  if (!text) return result;
  const lines = text.split(/\r?\n/);
  for (const raw of lines) {
    const cleaned = raw
      .replace(/^[\s\-•*]+/, '')
      .replace(/^\*+|\*+$/g, '')
      .trim();
    const m = cleaned.match(/^([\p{Lu}]{3,12})\s*[:\-–]\s*(.+)$/u);
    if (!m) continue;
    const key = HINT_LABEL_MAP[m[1].toUpperCase()];
    if (!key || result[key]) continue;
    result[key] = m[2].replace(/^[*_"'`]+|[*_"'`]+$/g, '').trim();
  }
  return result;
}

function isHintEmpty(hint) {
  if (!hint) return true;
  if (typeof hint === 'string') return !hint.trim();
  return !hint.hook && !hint.content && !hint.conclusion;
}

function formatHintForOutlinePrompt(hint, lang) {
  if (isHintEmpty(hint)) return '';
  if (typeof hint === 'string') return hint;
  if (lang === 'cs') {
    return [
      hint.hook && `HOOK: ${hint.hook}`,
      hint.content && `OBSAH: ${hint.content}`,
      hint.conclusion && `ZÁVĚR: ${hint.conclusion}`,
    ]
      .filter(Boolean)
      .join('\n');
  }
  return [
    hint.hook && `HOOK: ${hint.hook}`,
    hint.content && `CONTENT: ${hint.content}`,
    hint.conclusion && `CLOSE: ${hint.conclusion}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function buildOutlinePrompt({ topic, strategy, hint, lang }) {
  const hasHint = !isHintEmpty(hint);
  const hintBlock = hasHint ? formatHintForOutlinePrompt(hint, lang) : '';
  if (lang === 'cs') {
    return `Vytvoř DVĚ různé osnovy improvizovaného projevu (Toastmasters Table Topics) na téma: "${topic}".
Obě verze použijí strategii "${strategy.name}" – ${strategy.description}
Každá verze by měla trvat 1 až 2 minuty a mít jasně odlišný úhel pohledu, aby se z toho dalo učit.
${hasHint
  ? `Verze A MUSÍ vycházet z této nápovědy (HOOK + OBSAH + ZÁVĚR), kterou dostal řečník:
${hintBlock}
Verze B naopak nabídne úplně jiný úhel pohledu a tuto nápovědu ignoruje.`
  : `Obě verze nabídnou odlišný a nápaditý úhel pohledu.`}

KAŽDÁ verze musí obsahovat 2 různé HOOKY – úvodní věty, které okamžitě zaujmou publikum. Řiď se osvědčenými technikami z řečnických manuálů (Toastmasters, Carmine Gallo, Nancy Duarte). Vyber 2 různé techniky z tohoto seznamu a každý hook postav na jiné technice:
- Provokativní otázka publiku
- Překvapivý fakt, statistika nebo kontrast
- Krátký osobní záblesk (1 věta, konkrétní scéna, smyslový detail)
- Odvážné nebo paradoxní tvrzení
- Trefná metafora nebo analogie
- Citát, který téma otočí
- "Představte si…" – vizualizace situace
- Zlom v čekání (pauza, ticho, napětí)

Pravidla pro hooky:
1. Jedna věta, maximálně 20 slov.
2. Musí plynule navést na zvolenou strategii a hlavní myšlenku dané verze.
3. Musí sedět na české publikum a na téma – žádné floskule ani obecnosti.
4. Dvě hooky v jedné verzi používají DVĚ ODLIŠNÉ techniky.
5. Napříč oběma verzemi nezopakuj stejný typ hooku dvakrát, pokud se tomu dá vyhnout.

Pravidla pro obsah projevu (mainIdea, content, conclusion):
1. Cílová stopáž celého projevu je 1–2 minuty, tj. zhruba 150–230 slov včetně úvodu a závěru. Piš tak, aby si to čtenář dovedl plynule přečíst nahlas.
2. "mainIdea" = 1 až 2 věty. Jasná teze nebo úhel pohledu, který se v projevu prosadí. Ne abstraktní mlha, ale konkrétní postoj.
3. "content" = pole 3 až 5 položek. KAŽDÁ položka je 2 až 3 krátké, plynulé věty – jakoby řečník už mluvil. Žádné heslovité úsečky ani „označovací" nadpisy; místo toho konkrétní obrazy, scény, příběhové detaily, čísla, citáty, paralely. Body na sebe navazují tak, aby z nich byla souvislá linka projevu od HOOKu k závěru.
4. "conclusion" = 1 až 2 věty. Hutné, jasné uzavření, které vrací publikum k hlavní myšlence a ideálně se vrací (callback) k tomu, čím hook otevřel.
5. Drž se zvolené strategie ("${strategy.name}") – obsah její strukturu skutečně předvádí, ne jen jmenuje.
6. Jazyk je živý, mluvený, konkrétní. Žádné AI-floskule typu „v dnešní rychlé době", „je důležité zmínit", „v neposlední řadě".

Odpověz VÝHRADNĚ validním JSON objektem (bez markdown bloků, bez komentářů) v tomto tvaru:
{
  "versions": [
    {
      "label": "${hasHint ? 'Podle nápovědy' : 'Verze A'}",
      "hooks": [
        { "technique": "název techniky", "text": "úvodní věta hooku" },
        { "technique": "název techniky", "text": "úvodní věta hooku" }
      ],
      "mainIdea": "1–2 věty: konkrétní teze / úhel pohledu",
      "content": ["3 až 5 položek; každá 2–3 krátké plynulé věty, jakoby řečník mluvil; obrazy a konkrétní detaily; body na sebe navazují"],
      "conclusion": "1–2 věty: hutný závěr s callbackem na hook"
    },
    {
      "label": "${hasHint ? 'Alternativa' : 'Verze B'}",
      "hooks": [
        { "technique": "název techniky", "text": "úvodní věta hooku" },
        { "technique": "název techniky", "text": "úvodní věta hooku" }
      ],
      "mainIdea": "1–2 věty: konkrétní teze / úhel pohledu",
      "content": ["3 až 5 položek; každá 2–3 krátké plynulé věty, jakoby řečník mluvil; obrazy a konkrétní detaily; body na sebe navazují"],
      "conclusion": "1–2 věty: hutný závěr s callbackem na hook"
    }
  ]
}
Žádný další text mimo JSON.`;
  }
  return `Create TWO different outlines for an impromptu speech (Toastmasters Table Topics) on: "${topic}".
Both versions apply the strategy "${strategy.name}" – ${strategy.description}
Each version should last 1 to 2 minutes and offer a clearly different angle so the speaker can learn from both.
${hasHint
  ? `Version A MUST follow this hint (HOOK + CONTENT + CLOSE) the speaker received:
${hintBlock}
Version B should offer a completely different angle and ignore this hint.`
  : `Both versions should offer distinct, inventive angles.`}

EACH version must include 2 different HOOKS – opening lines that grab attention immediately. Use proven techniques from public speaking manuals (Toastmasters, Carmine Gallo, Nancy Duarte). Pick 2 different techniques from this list and build each hook on a different one:
- Provocative question to the audience
- Surprising fact, statistic or contrast
- Brief personal flash (1 sentence, concrete scene, sensory detail)
- Bold or paradoxical statement
- Sharp metaphor or analogy
- A quote that flips the topic
- "Imagine…" – vivid visualisation
- Anticipation break (pause, silence, tension)

Rules for hooks:
1. One sentence, max 20 words.
2. Must lead smoothly into the chosen strategy and the main idea of that version.
3. Must fit the topic – no clichés or generic openers.
4. Two hooks within a single version use TWO DIFFERENT techniques.
5. Across both versions, avoid repeating the same technique twice if possible.

Rules for the speech body (mainIdea, content, conclusion):
1. Target speech length is 1–2 minutes, roughly 150–230 words total including opener and closing. Write so the reader can read it aloud naturally.
2. "mainIdea" = 1 to 2 sentences. A clear thesis or angle that the speech will pursue. Not abstract fog – a concrete stance.
3. "content" = an array of 3 to 5 items. EACH item is 2 to 3 short, flowing sentences – as if the speaker were already on stage. NOT bullet labels or headlines; instead concrete images, scenes, story beats, numbers, quotes, parallels. The items connect into one continuous line of speech from the hook to the close.
4. "conclusion" = 1 to 2 sentences. A tight close that lands the main idea and ideally calls back (callback) to whatever the hook opened with.
5. Stay true to the chosen strategy ("${strategy.name}") – the content actually demonstrates its structure, doesn't just name it.
6. Voice is alive, spoken, specific. No AI clichés like "in today's fast-paced world", "it is important to mention", "last but not least".

Respond ONLY with a valid JSON object (no markdown fences, no commentary) in this exact shape:
{
  "versions": [
    {
      "label": "${hasHint ? 'Follows the hint' : 'Version A'}",
      "hooks": [
        { "technique": "technique name", "text": "opening hook sentence" },
        { "technique": "technique name", "text": "opening hook sentence" }
      ],
      "mainIdea": "1–2 sentences: a concrete thesis / angle",
      "content": ["3 to 5 items; each item is 2–3 short flowing sentences, as if the speaker were on stage; concrete images and details; items connect into one continuous line"],
      "conclusion": "1–2 sentences: a tight closing with a callback to the hook"
    },
    {
      "label": "${hasHint ? 'Alternative' : 'Version B'}",
      "hooks": [
        { "technique": "technique name", "text": "opening hook sentence" },
        { "technique": "technique name", "text": "opening hook sentence" }
      ],
      "mainIdea": "1–2 sentences: a concrete thesis / angle",
      "content": ["3 to 5 items; each item is 2–3 short flowing sentences, as if the speaker were on stage; concrete images and details; items connect into one continuous line"],
      "conclusion": "1–2 sentences: a tight closing with a callback to the hook"
    }
  ]
}
No text outside the JSON.`;
}

function extractJson(text) {
  if (!text) throw new Error('Empty AI response');
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON in AI response');
  return JSON.parse(raw.slice(start, end + 1));
}

async function callOpenAI({ apiKey, model, baseUrl, prompt, jsonMode = true }) {
  const url = `${(baseUrl || 'https://api.openai.com/v1').replace(/\/$/, '')}/chat/completions`;
  const body = {
    model: model || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  };
  if (jsonMode) body.response_format = { type: 'json_object' };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

async function callGemini({ apiKey, model, prompt, jsonMode = true }) {
  const m = model || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const generationConfig = { temperature: 0.7 };
  if (jsonMode) generationConfig.responseMimeType = 'application/json';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
    }),
  });
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';
}

async function callAI({ prompt, settings, jsonMode = true }) {
  if (settings.provider === 'gemini') {
    return callGemini({ apiKey: settings.apiKey, model: settings.model, prompt, jsonMode });
  }
  return callOpenAI({
    apiKey: settings.apiKey,
    model: settings.model,
    baseUrl: settings.baseUrl,
    prompt,
    jsonMode,
  });
}

function normaliseHook(h) {
  if (!h) return null;
  if (typeof h === 'string') return { technique: '', text: h };
  return { technique: h.technique ?? '', text: h.text ?? '' };
}

function normaliseVersion(v, fallbackLabel) {
  const rawHooks = Array.isArray(v?.hooks) ? v.hooks : [];
  return {
    label: v?.label || fallbackLabel,
    hooks: rawHooks.map(normaliseHook).filter(Boolean),
    mainIdea: v?.mainIdea ?? '',
    content: Array.isArray(v?.content) ? v.content : [String(v?.content ?? '')],
    conclusion: v?.conclusion ?? '',
  };
}

export async function generateHint({ topic, strategy, lang, settings }) {
  const prompt = buildHintPrompt({ topic, strategy, lang });
  const text = await callAI({ prompt, settings, jsonMode: false });
  return parseHintText(text);
}

function buildTopicPrompt({ lang, exclude }) {
  const excludeList = Array.isArray(exclude) ? exclude.slice(-40) : [];
  if (lang === 'cs') {
    return `Vygeneruj jedno svěží téma pro improvizovaný 1–2 minutový projev (Toastmasters Table Topics) v češtině.

Pravidla:
1. Téma má 1 až 3 slova.
2. Je to jeden konkrétní pojem, objekt, nebo krátká fráze – například "Strach", "První dojem", "Tichá síla", "Pět minut", "Vůně dětství".
3. Otevírá prostor pro osobní improvizaci, dovoluje příběh nebo úvahu.
4. NESMÍ svádět k rolové scénce – žádné "Elegantní způsob X", "Rada někomu Y", "Jak bys přesvědčil Z".
5. Žádné citáty, žádné otázky končící otazníkem.
6. Buď nápaditý, ale zůstaň srozumitelný českému publiku.${
      excludeList.length
        ? `\n7. Nepoužij žádné z těchto naposledy vylosovaných témat: ${excludeList.map((t) => `"${t}"`).join(', ')}.`
        : ''
    }

Odpověz POUZE tím tématem, na jednom řádku, bez uvozovek, bez tečky na konci, bez úvodu.`;
  }
  return `Generate one fresh topic for an impromptu 1–2 minute speech (Toastmasters Table Topics) in English.

Rules:
1. The topic is 1 to 3 words.
2. It is one concrete noun, object or short phrase – e.g. "Fear", "First impression", "Quiet strength", "Five minutes", "Childhood scent".
3. Opens room for personal improvisation, allows a story or reflection.
4. MUST NOT invite a role-play scene – no "An elegant way to X", "Advice to Y", "How would you persuade Z".
5. No quotes, no question marks.
6. Be inventive but stay clear for an English-speaking audience.${
    excludeList.length
      ? `\n7. Do not use any of these recently drawn topics: ${excludeList.map((t) => `"${t}"`).join(', ')}.`
      : ''
  }

Respond ONLY with the topic, on a single line, no quotes, no trailing period, no preamble.`;
}

function cleanTopicText(text) {
  if (!text) return '';
  return text
    .split(/\r?\n/)[0]
    .replace(/^[\s\-•*]+/, '')
    .replace(/^["'`„]+|["'`„""'']+$/g, '')
    .replace(/[.。]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateTopic({ lang, settings, exclude }) {
  const prompt = buildTopicPrompt({ lang, exclude });
  const text = await callAI({ prompt, settings, jsonMode: false });
  return cleanTopicText(text);
}

export async function generateOutline({ topic, strategy, hint, lang, settings }) {
  const prompt = buildOutlinePrompt({ topic, strategy, hint, lang });
  const text = await callAI({ prompt, settings, jsonMode: true });
  const parsed = extractJson(text);
  const rawVersions = Array.isArray(parsed.versions) ? parsed.versions : [];
  const [a, b] = rawVersions;
  return {
    hintUsed: Boolean(hint),
    versions: [
      normaliseVersion(a, hint ? 'Follows the hint' : 'Version A'),
      normaliseVersion(b, hint ? 'Alternative' : 'Version B'),
    ],
  };
}
