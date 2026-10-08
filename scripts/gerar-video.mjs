// Grava a roda em funcionamento e salva entregas/Ecossistema_Florim_Animacao.mp4 (precisa do ffmpeg instalado).
import { execFileSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { ENTREGAS, abrir, clicar, espera } from './_comum.mjs';

const bruto = join(ENTREGAS, 'gravacao.webm');
const { url, navegador, fechar } = await abrir();
const p = await navegador.newPage();
await p.setViewport({ width: 1920, height: 1080 });
await p.goto('about:blank');
const gravacao = await p.screencast({ path: bruto });
await p.goto(`${url}/`, { waitUntil: 'networkidle0' });
await espera(3500);
for (const [area, sub] of [
  ['Agrimensura', 'Georreferenciamento'],
  ['Licenciamento ambiental', 'Laudos'],
  ['Representações', 'Sistemas'],
  ['Consultoria', 'Riscos'],
  ['Cursos NR', 'Certificado'],
]) {
  await clicar(p, area);
  await espera(2600);
  await clicar(p, sub);
  await espera(2400);
}
await p.evaluate(() => document.querySelector('.back')?.click());
await espera(3000);
await gravacao.stop();
await fechar();

execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '0.6', '-i', bruto, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18',
  '-preset', 'slow', '-r', '30', '-movflags', '+faststart', join(ENTREGAS, 'Ecossistema_Florim_Animacao.mp4')], { stdio: 'inherit' });
rmSync(bruto);
console.log('vídeo salvo em entregas/Ecossistema_Florim_Animacao.mp4');
