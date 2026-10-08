import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Stage } from './Stage';
import { Mobile } from './Mobile';
import { useCompact } from '../useCompact';

// Apresentação: páginas da Proposta Comercial com o Ecossistema interativo no meio.
const paginas = Object.values(
  import.meta.glob('../assets/proposta/pagina-*.jpg', { eager: true, import: 'default', query: '?url' }),
) as string[];

// O ecossistema entra depois de "Missão, visão e valores" (página 4).
const DEPOIS_DA_PAGINA = 4;
type Slide = { tipo: 'pagina'; src: string; n: number } | { tipo: 'ecossistema' };
const slides: Slide[] = [
  ...paginas.slice(0, DEPOIS_DA_PAGINA).map((src, i) => ({ tipo: 'pagina' as const, src, n: i + 1 })),
  { tipo: 'ecossistema' },
  ...paginas.slice(DEPOIS_DA_PAGINA).map((src, i) => ({ tipo: 'pagina' as const, src, n: DEPOIS_DA_PAGINA + i + 1 })),
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Deck() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [leaf, setLeaf] = useState<number | null>(null);
  const [idle, setIdle] = useState(false);
  const timer = useRef<number>(0);
  const toque = useRef<{ x: number; y: number } | null>(null);
  const compact = useCompact();

  const go = useCallback((to: number) => {
    setIndex((cur) => {
      const next = Math.max(0, Math.min(slides.length - 1, to));
      if (next !== cur) {
        setDir(next > cur ? 1 : -1);
        setSelected(null);
        setLeaf(null);
      }
      return next;
    });
  }, []);

  const select = useCallback((id: string) => {
    setLeaf(null);
    setSelected((cur) => (cur === id ? null : id));
  }, []);
  const close = useCallback(() => {
    setLeaf(null);
    setSelected(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) {
        if (e.key === 'Enter' && slides[index].tipo === 'ecossistema') return;
        e.preventDefault();
        go(index + 1);
      } else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(slides.length - 1);
      else if (e.key.toLowerCase() === 'f') toggleFullscreen();
      else if (e.key === 'Escape') {
        if (leaf !== null) setLeaf(null);
        else if (selected) close();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [index, leaf, selected, go, close]);

  // Controles somem quando o mouse fica parado.
  useEffect(() => {
    const wake = () => {
      setIdle(false);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setIdle(true), 2200);
    };
    wake();
    addEventListener('mousemove', wake);
    return () => removeEventListener('mousemove', wake);
  }, []);

  const slide = slides[index];

  return (
    <div
      className={idle ? 'deck is-idle' : 'deck'}
      onTouchStart={(e) => (toque.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={(e) => {
        // Deslizar para o lado troca de slide no celular.
        const t = toque.current;
        toque.current = null;
        if (!t) return;
        const dx = e.changedTouches[0].clientX - t.x;
        const dy = e.changedTouches[0].clientY - t.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.section
          key={index}
          className={slide.tipo === 'ecossistema' && compact ? 'deck-slide is-scroll' : 'deck-slide'}
          custom={dir}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.985 }),
            center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease } },
            exit: (d: number) => ({ opacity: 0, x: d * -40, transition: { duration: 0.35, ease: 'easeIn' } }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          aria-label={slide.tipo === 'ecossistema' ? 'Ecossistema Florim' : `Página ${slide.n}`}
        >
          {slide.tipo === 'ecossistema' ? (
            compact ? (
              <Mobile selected={selected} leaf={leaf} onSelect={select} onLeaf={setLeaf} />
            ) : (
              <Stage selected={selected} leaf={leaf} onSelect={select} onLeaf={setLeaf} onClose={close} />
            )
          ) : (
            <img className="deck-page" src={slide.src} alt={`Proposta Comercial Florim, página ${slide.n}`} onClick={() => go(index + 1)} draggable={false} />
          )}
        </motion.section>
      </AnimatePresence>

      <nav className="deck-nav" aria-label="Navegação da apresentação">
        <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Slide anterior">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="m15 6-6 6 6 6" /></svg>
        </button>
        <span className="deck-count">
          {String(index + 1).padStart(2, '0')} <i>/</i> {String(slides.length).padStart(2, '0')}
        </span>
        <button onClick={() => go(index + 1)} disabled={index === slides.length - 1} aria-label="Próximo slide">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="m9 6 6 6-6 6" /></svg>
        </button>
        <button onClick={toggleFullscreen} aria-label="Tela cheia" className="deck-fs">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
        </button>
      </nav>
      <motion.div
        className="deck-progress"
        animate={{ scaleX: (index + 1) / slides.length }}
        transition={{ duration: 0.5, ease }}
        style={{ originX: 0 }}
      />
    </div>
  );
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.();
}
