import fm from 'front-matter';

const rawModules = {
  cs: import.meta.glob('../content/strategies/cs/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
  en: import.meta.glob('../content/strategies/en/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
};

function splitSections(body) {
  const lines = body.split(/\r?\n/);
  const mainIdeaBody = [];
  const examples = [];
  let bucket = mainIdeaBody;
  let currentExample = null;

  for (const line of lines) {
    const h1 = line.match(/^#\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    if (h1) {
      bucket = mainIdeaBody;
      currentExample = null;
      continue;
    }
    if (h2) {
      currentExample = { title: h2[1].trim(), body: [] };
      examples.push(currentExample);
      bucket = currentExample.body;
      continue;
    }
    bucket.push(line);
  }

  return {
    mainIdea: mainIdeaBody.join('\n').trim(),
    examples: examples.map((e) => ({
      title: e.title,
      body: e.body.join('\n').trim(),
    })),
  };
}

function parseStrategy(path, raw) {
  const { attributes, body } = fm(raw);
  const { mainIdea, examples } = splitSections(body);
  return {
    path,
    id: attributes.id ?? path,
    name: attributes.name ?? attributes.id ?? 'Untitled',
    order: typeof attributes.order === 'number' ? attributes.order : 999,
    mainIdea,
    description: mainIdea,
    examples,
  };
}

const strategiesByLang = Object.fromEntries(
  Object.entries(rawModules).map(([lang, modules]) => [
    lang,
    Object.entries(modules)
      .map(([path, raw]) => parseStrategy(path, raw))
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
  ])
);

export function getStrategies(lang) {
  return strategiesByLang[lang] ?? strategiesByLang.en ?? [];
}
