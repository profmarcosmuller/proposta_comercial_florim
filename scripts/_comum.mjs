// Utilitários compartilhados pelos geradores: caminhos do repositório, navegador e servidor local.
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ENTREGAS = join(RAIZ, 'entregas');
export const CACHE = join(RAIZ, 'scripts', '.cache');
for (const d of [ENTREGAS, CACHE]) mkdirSync(d, { recursive: true });

const CHROMES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);

export const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Sobe o Vite numa porta livre e abre o Chrome/Edge sem janela. */
export async function abrir() {
  const executablePath = CHROMES.find((c) => existsSync(c));
  if (!executablePath) throw new Error('Chrome ou Edge não encontrado. Defina CHROME_PATH com o caminho do navegador.');
  const servidor = await createServer({ root: RAIZ, server: { port: 0 }, logLevel: 'error' });
  await servidor.listen();
  const url = servidor.resolvedUrls.local[0].replace(/\/$/, '');
  const navegador = await puppeteer.launch({ executablePath, headless: 'new' });
  const fechar = async () => {
    await navegador.close();
    await servidor.close();
  };
  return { url, navegador, fechar };
}

/** Clica numa área ou subcategoria da roda pelo início do rótulo. */
export function clicar(pagina, rotulo) {
  return pagina.evaluate((l) => {
    const el = [...document.querySelectorAll('[role=button][aria-label]')].find((e) => e.getAttribute('aria-label').startsWith(l));
    el?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return !!el;
  }, rotulo);
}
