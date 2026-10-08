import { useCallback, useEffect, useState } from 'react';
import { useCompact } from './useCompact';
import { MotionConfig } from 'framer-motion';
import { Stage } from './components/Stage';
import { Mobile } from './components/Mobile';
import { Poster } from './components/Poster';
import { Deck } from './components/Deck';

const params = new URLSearchParams(location.search);
const POSTER = params.has('poster');
// Apresentação completa: no site publicado e no arquivo único. ?ecossistema mostra só a roda.
const DECK = (params.has('apresentacao') || import.meta.env.VITE_MODO === 'apresentacao') && !params.has('ecossistema');
// Modo de captura (?frame&s=<id>&l=<n>): estado fixo e sem animação, usado pelos geradores em scripts/.
const FRAME = params.has('frame');
const INIT_S = params.get('s');
const INIT_L = params.get('l') !== null ? Number(params.get('l')) : null;

export default function App() {
  const compact = useCompact() && !FRAME;
  const [selected, setSelected] = useState<string | null>(INIT_S);
  const [leaf, setLeaf] = useState<number | null>(INIT_L);

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
      if (e.key !== 'Escape') return;
      if (leaf !== null) setLeaf(null);
      else if (selected) close();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [leaf, selected, close]);

  if (POSTER) return <Poster />;
  if (DECK)
    return (
      <MotionConfig reducedMotion="user">
        <div className="grain" aria-hidden="true" />
        <Deck />
      </MotionConfig>
    );

  return (
    <MotionConfig reducedMotion={FRAME ? 'always' : 'user'}>
      {!FRAME && <div className="grain" aria-hidden="true" />}
      <main className={FRAME ? 'is-frame' : undefined}>
        {compact ? (
          <Mobile selected={selected} leaf={leaf} onSelect={select} onLeaf={setLeaf} />
        ) : (
          <Stage selected={selected} leaf={leaf} onSelect={select} onLeaf={setLeaf} onClose={close} />
        )}
      </main>
    </MotionConfig>
  );
}
