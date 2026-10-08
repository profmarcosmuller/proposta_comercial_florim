import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: { port: 5180, open: false },
  // "npm run build" (usado pela Vercel) publica a apresentação completa.
  define: mode === 'site' ? { 'import.meta.env.VITE_MODO': JSON.stringify('apresentacao') } : {},
}));
