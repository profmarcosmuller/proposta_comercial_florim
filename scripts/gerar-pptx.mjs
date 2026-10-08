// Prepara dados, ícones e logos e chama o gerador em Python do PowerPoint interativo.
// Requer Python com: pip install python-pptx pillow lxml
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CACHE, ENTREGAS, RAIZ, abrir } from './_comum.mjs';

const { url, navegador, fechar } = await abrir();
const p = await navegador.newPage();
await p.goto(`${url}/?frame`, { waitUntil: 'networkidle0' });
const dados = await p.evaluate(async () => {
  const d = await import('/src/data.ts');
  const g = await import('/src/geometry.ts');
  return {
    categorias: d.categorias,
    config: d.config,
    frentes: d.frentes,
    slots: g.slots.map((s) => ({ id: s.cat.id, a: s.a, b: s.b, mid: s.mid })),
    bands: g.bands,
    comp: g.complementares,
    contato: Object.fromEntries(d.categorias.map((c) => [c.id, [d.linkContato(c), ...c.subs.map((s) => d.linkContato(c, s))]])),
    email: Object.fromEntries(d.categorias.map((c) => [c.id, d.linkEmail(c)])),
  };
});
writeFileSync(join(CACHE, 'dados.json'), JSON.stringify(dados, null, 1));

// Ícones em PNG transparente (dourado e escuro) a partir de src/icons.tsx.
const fonte = readFileSync(join(RAIZ, 'src', 'icons.tsx'), 'utf8');
const caminhos = Object.fromEntries([...fonte.matchAll(/^\s+(\w+): '([^']+)'/gm)].map((m) => [m[1], m[2]]));
await p.setViewport({ width: 256, height: 256 });
for (const [id, d] of Object.entries(caminhos)) {
  for (const [nome, cor] of [['ouro', '#e2be60'], ['escuro', '#1f1f1f']]) {
    await p.setContent(
      `<html><body style="margin:0;background:transparent"><svg width="256" height="256" viewBox="-1 -1 34 34"><path d="${d}" fill="none" stroke="${cor}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></body></html>`,
    );
    await p.screenshot({ path: join(CACHE, `ico-${id}-${nome}.png`), omitBackground: true });
  }
}
for (const [arquivo, w, h] of [['florim-emblema.svg', 1080, 1048], ['florim-wordmark.svg', 1480, 270]]) {
  await p.setViewport({ width: w, height: h });
  await p.goto(`${url}/src/assets/${arquivo}`);
  await p.evaluate(() => {
    document.documentElement.style.background = 'transparent';
    const s = document.querySelector('svg');
    s.setAttribute('width', innerWidth);
    s.setAttribute('height', innerHeight);
  });
  await p.screenshot({ path: join(CACHE, arquivo.replace('.svg', '.png')), omitBackground: true });
}
await fechar();

const saida = join(ENTREGAS, 'Proposta_Comercial_Florim_Interativa.pptx');
execFileSync(process.env.PYTHON ?? 'python', [join(RAIZ, 'scripts', 'pptx_ecossistema.py'), CACHE, join(RAIZ, 'src', 'assets', 'proposta'), saida], {
  stdio: 'inherit',
  env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
});
