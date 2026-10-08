// Gera em entregas/: o mapa completo (PNG + PDF, escuro e claro) e uma imagem 16:9 por área com o leque aberto.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ENTREGAS, abrir, clicar, espera } from './_comum.mjs';

const { url, navegador, fechar } = await abrir();
const p = await navegador.newPage();
const erros = [];
p.on('pageerror', (e) => erros.push(e.message));

for (const [query, nome] of [['poster', 'Escuro'], ['poster&claro', 'Claro']]) {
  await p.setViewport({ width: 1600, height: 1840, deviceScaleFactor: 2.5 });
  await p.goto(`${url}/?${query}`, { waitUntil: 'networkidle0' });
  await espera(2500);
  await p.screenshot({ path: join(ENTREGAS, `Ecossistema_Florim_Mapa_${nome}.png`), clip: { x: 0, y: 0, width: 1600, height: 1840 } });
  await p.pdf({ path: join(ENTREGAS, `Ecossistema_Florim_Mapa_${nome}.pdf`), width: '1600px', height: '1840px', printBackground: true, pageRanges: '1' });
  console.log('mapa', nome);
}

const pasta = join(ENTREGAS, 'leques');
mkdirSync(pasta, { recursive: true });
const areas = [
  ['00', 'Roda', null], ['01', 'Agrimensura'], ['02', 'Ambiental'], ['03', 'Licenciamento_ambiental', 'Licenciamento ambiental'],
  ['04', 'Arquitetura'], ['05', 'Estrutural'], ['06', 'Eletrico', 'Elétrico'], ['07', 'Hidrossanitario', 'Hidrossanitário'],
  ['08', 'PPCI'], ['09', 'Telecom'], ['10', 'Representacoes', 'Representações'], ['11', 'Consultoria'], ['12', 'Cursos_NR', 'Cursos NR'],
];
await p.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
for (const [n, arquivo, rotulo = arquivo] of areas) {
  await p.goto(`${url}/`, { waitUntil: 'networkidle0' });
  await espera(2200);
  await p.addStyleTag({ content: '.back{visibility:hidden!important}.grain{display:none}' });
  if (rotulo) {
    if (!(await clicar(p, rotulo + ':')) && !(await clicar(p, rotulo + ' ('))) erros.push('área não encontrada: ' + rotulo);
    await espera(2600);
  }
  await p.screenshot({ path: join(pasta, `${n}_${arquivo}.png`) });
  console.log('leque', arquivo);
}

await fechar();
if (erros.length) console.error('erros:', erros);
