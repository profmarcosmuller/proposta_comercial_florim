import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { copyFileSync, mkdirSync } from 'node:fs';

// Gera um único HTML (com fontes, imagens e scripts embutidos) que abre offline com dois cliques.
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
    {
      // Remove o ícone externo: tudo já vai embutido no arquivo.
      name: 'sem-arquivos-externos',
      transformIndexHtml: (html) =>
        html
          .replace(/\s*<link rel="icon"[^>]*>/g, '')
          .replace('<title>Ecossistema Florim Engenharia</title>', '<title>Proposta Comercial · Florim Engenharia</title>'),
    },
    {
      // Copia o resultado para entregas/ com o nome final.
      name: 'copiar-para-entregas',
      closeBundle() {
        mkdirSync('entregas', { recursive: true });
        copyFileSync('dist-apresentacao/index.html', 'entregas/Apresentacao_Florim.html');
        console.log('\n  pronto: entregas/Apresentacao_Florim.html\n');
      },
    },
  ],
  define: { 'import.meta.env.VITE_MODO': JSON.stringify('apresentacao') },
  build: { outDir: 'dist-apresentacao', copyPublicDir: false, assetsInlineLimit: 100_000_000, chunkSizeWarningLimit: 100_000 },
});
