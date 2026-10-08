import emblemaUrl from '../assets/florim-emblema.svg';
import wordmarkUrl from '../assets/florim-wordmark.svg';
import type React from 'react';
import { useEffect, type KeyboardEvent } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  usePresence,
  useReducedMotionConfig as useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { categorias, frentes, negrito, textos, type Categoria } from '../data';
import { R, arc, arcLine, bands, complementares, polar, shortest, slots, type Slot } from '../geometry';
import { Icon } from '../icons';
import { Panel } from './Panel';

const W = 1600;
const H = 900;
const CY = 450;
const CX_IDLE = 800;
const CX_OPEN = 480;

const STEP = 12.5;
const GAP = 1.4;

interface Props {
  selected: string | null;
  leaf: number | null;
  onSelect: (id: string) => void;
  onLeaf: (i: number | null) => void;
  onClose: () => void;
}

function activate(fn: () => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };
}

export function Stage({ selected, leaf, onSelect, onLeaf, onClose }: Props) {
  const reduce = useReducedMotion();
  const rot = useMotionValue(0);
  const cx = useMotionValue(CX_IDLE);
  const slot = selected ? slots.find((s) => s.cat.id === selected) ?? null : null;
  const cat = slot?.cat ?? null;

  // Gira a roda até a categoria escolhida ficar voltada para o leque (3 h) e desloca a roda para a esquerda.
  useEffect(() => {
    const cur = rot.get();
    const target = slot ? cur + shortest(90 - (slot.mid + cur)) : cur + shortest(-cur);
    const t = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 60, damping: 17, mass: 1 };
    const a = animate(rot, target, t);
    const b = animate(cx, slot ? CX_OPEN : CX_IDLE, t);
    return () => {
      a.stop();
      b.stop();
    };
  }, [slot, rot, cx, reduce]);

  const open = !!slot;

  return (
    <div className="stage">
      <Frame />
      <svg
        className="stage-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Ecossistema Florim: áreas de atuação"
      >
        <Defs />

        <motion.g style={{ x: cx, y: CY }}>
          <motion.g
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <circle r={R.fanOut + 40} fill="url(#glow)" />
            <Ticks />
            <Sweep />
            {complementares && <ComplementMark open={open} rot={rot} />}
            {bands.map((b) => (
              <Band key={b.nome} band={b} rot={rot} open={open} />
            ))}
            {slots.map((s, i) => (
              <Sector
                key={s.cat.id}
                slot={s}
                index={i}
                rot={rot}
                state={!slot ? 'idle' : s === slot ? 'selected' : 'dimmed'}
                onClick={() => onSelect(s.cat.id)}
              />
            ))}
            <Emblem open={open} onClose={onClose} />
          </motion.g>

          <AnimatePresence>
            {slot && <Fan key={slot.cat.id} slot={slot} leaf={leaf} onLeaf={onLeaf} />}
          </AnimatePresence>
        </motion.g>

        <foreignObject x={48} y={40} width={300} height={820}>
          <AnimatePresence mode="wait">
            {!open ? <Intro key="intro" /> : <Back key="back" onClose={onClose} />}
          </AnimatePresence>
        </foreignObject>

        <foreignObject x={cat ? 1262 : 1300} y={0} width={cat ? 318 : 270} height={H}>
          <AnimatePresence mode="wait">
            {cat ? <Panel key={cat.id} cat={cat} leaf={leaf} onLeaf={onLeaf} /> : <Legend key="legend" onSelect={onSelect} />}
          </AnimatePresence>
        </foreignObject>
      </svg>
    </div>
  );
}

export function Defs() {
  return (
    <defs>
      {/* Paleta do kit de marca: ouro em degradê, ouro sólido, branco, grafite e preto em degradê. */}
      <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f9e898" />
        <stop offset=".5" stopColor="#e2be60" />
        <stop offset="1" stopColor="#c29727" />
      </linearGradient>
      <radialGradient id="glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#c29727" stopOpacity=".14" />
        <stop offset="1" stopColor="#c29727" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#f9e898" stopOpacity="0" />
        <stop offset=".5" stopColor="#f9e898" stopOpacity=".9" />
        <stop offset="1" stopColor="#f9e898" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="sector-fill" cx="0" cy="0" r={R.ringOut} gradientUnits="userSpaceOnUse">
        <stop offset=".45" stopColor="#161616" />
        <stop offset="1" stopColor="#262624" />
      </radialGradient>
      <radialGradient id="disc" cx=".5" cy=".4" r=".6">
        <stop offset="0" stopColor="#2e2e2c" />
        <stop offset="1" stopColor="#0a0a0a" />
      </radialGradient>
    </defs>
  );
}

function Ticks() {
  const ticks = [];
  for (let a = 0; a < 360; a += 3) {
    const major = a % 15 === 0;
    const [x1, y1] = polar(R.ticks - (major ? 5 : 2), a);
    const [x2, y2] = polar(R.ticks + (major ? 5 : 2), a);
    ticks.push(<line key={a} x1={x1} y1={y1} x2={x2} y2={y2} className={major ? 'tick major' : 'tick'} />);
  }
  return (
    <g aria-hidden="true">
      <circle r={R.ringOut + 4} className="guide" />
      {ticks}
    </g>
  );
}

// Brilho que percorre o anel de marcações, como luz passando pelo metal.
function Sweep() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.g
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
      style={{ originX: '50%', originY: '50%' }}
    >
      <circle r={R.ticks + 9} fill="none" stroke="none" />
      <path d={arcLine(R.ticks, -28, 28)} fill="none" stroke="url(#sweep)" strokeWidth={2} strokeLinecap="round" opacity={0.75} />
    </motion.g>
  );
}

function Frame() {
  return (
    <>
      <div className="curtain" aria-hidden="true" />
      <header className="topbar" aria-hidden="true">
        <span className="badge">Ecossistema</span>
        <span className="topbar-brand">
          <img src={emblemaUrl} alt="" width={40} height={39} />
          <img src={wordmarkUrl} alt="" width={150} height={27} />
        </span>
        <span />
      </header>
    </>
  );
}

export function Band({ band, rot, open }: { band: (typeof bands)[number]; rot: MotionValue<number>; open: boolean }) {
  const d = useTransform(rot, (r) => arc(R.bandIn, R.bandOut, band.a + r + 0.4, band.b + r - 0.4));
  const id = 'band-' + band.nome.replace(/\W+/g, '');
  const mid = (band.a + band.b) / 2;
  const bottom = mid > 90 && mid < 270;
  // O texto curvo só aparece com a roda em repouso, quando a rotação é zero.
  const line = arcLine(bottom ? R.bandIn + 25 : R.bandIn + 14, band.a + 2, band.b - 2, bottom);
  return (
    <g aria-hidden="true">
      <motion.path d={d} className="band" />
      <path id={id} d={line} fill="none" />
      <motion.text
        className="band-text"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: open ? 0.15 : 0.5, delay: open ? 0 : 0.55 }}
      >
        <textPath href={'#' + id} startOffset="50%" textAnchor="middle">
          {band.nome.toUpperCase()}
        </textPath>
      </motion.text>
    </g>
  );
}

function ComplementMark({ open, rot }: { open: boolean; rot: MotionValue<number> }) {
  const c = complementares!;
  const d = useTransform(rot, (r) => arcLine(R.ringOut + 12, c.a + r + 1, c.b + r - 1));
  return (
    <motion.g aria-hidden="true" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.3, delay: open ? 0 : 0.5 }}>
      <motion.path d={d} className="comp-line" />
      <path id="comp-text" d={arcLine(R.ringOut + 22, c.a + 3, c.b - 3)} fill="none" />
      <text className="comp-text">
        <textPath href="#comp-text" startOffset="50%" textAnchor="middle">
          PROJETOS COMPLEMENTARES
        </textPath>
      </text>
    </motion.g>
  );
}

export function Sector({
  slot,
  index,
  rot,
  state,
  onClick,
}: {
  slot: Slot;
  index: number;
  rot: MotionValue<number>;
  state: 'idle' | 'selected' | 'dimmed';
  onClick: () => void;
}) {
  const reduce = useReducedMotion();
  const { cat } = slot;
  const big = cat.frente !== 'servicos';
  const labelR = big ? 311 : 318;
  const d = useTransform(rot, (r) => arc(R.ringIn, R.ringOut, slot.a + r + 0.45, slot.b + r - 0.45));
  const edge = useTransform(rot, (r) => arc(R.ringOut - 3, R.ringOut, slot.a + r + 0.45, slot.b + r - 0.45));
  const x = useTransform(rot, (r) => polar(labelR, slot.mid + r)[0]);
  const y = useTransform(rot, (r) => polar(labelR, slot.mid + r)[1]);
  const lines = cat.linhas ?? [cat.rotulo];
  const block = layoutLabel(big, lines.length, !!cat.chamada);

  return (
    <motion.g
      className={`sector is-${state}`}
      data-cat={cat.id}
      role="button"
      tabIndex={0}
      aria-label={`${cat.rotulo}${cat.grupo ? ' (projetos complementares)' : ''}: abrir leque`}
      aria-expanded={state === 'selected'}
      onClick={onClick}
      onKeyDown={activate(onClick)}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: state === 'dimmed' ? 0.42 : 1 }}
      transition={{ duration: 0.45, delay: state === 'idle' && !reduce ? 0.25 + index * 0.045 : 0 }}
    >
      <motion.path d={d} className="sector-shape" />
      <motion.path d={edge} className="sector-edge" />
      <motion.path
        d={d}
        fill="url(#gold)"
        initial={false}
        animate={{ opacity: state === 'selected' ? 1 : 0 }}
        transition={{ duration: 0.35 }}
        pointerEvents="none"
      />
      <motion.g style={{ x, y }} className="sector-label" pointerEvents="none">
        {/* Bloco ícone + texto centralizado no ponto médio da fatia. */}
        <g transform={`translate(0 ${-block.height / 2})`}>
          <g transform={`translate(0 ${block.icon / 2})`}>
            <Icon id={cat.id} size={block.icon} className="sector-icon" />
          </g>
          {lines.map((l, i) => (
            <text key={l} y={block.first + i * block.lh} className={big ? 'sector-text big' : 'sector-text'} textAnchor="middle">
              {l}
            </text>
          ))}
          {cat.chamada && (
            <text y={block.sub} className="sector-sub" textAnchor="middle">
              {cat.chamada}
            </text>
          )}
        </g>
      </motion.g>
    </motion.g>
  );
}

// Medidas verticais do rótulo (ícone, linhas e chamada) para centralizá-lo na fatia.
function layoutLabel(big: boolean, lineCount: number, hasSub: boolean) {
  const icon = big ? 40 : 30;
  const cap = big ? 13 : 11; // altura das maiúsculas
  const lh = big ? 22 : 19;
  const first = icon + (big ? 12 : 10) + cap;
  const last = first + (lineCount - 1) * lh;
  const sub = last + 24;
  const height = (hasSub ? sub : last) + 3;
  return { icon, lh, first, sub, height };
}

export function Emblem({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <g
      className={open ? 'emblem is-open' : 'emblem'}
      role={open ? 'button' : undefined}
      tabIndex={open ? 0 : -1}
      aria-label={open ? 'Fechar leque e voltar à roda' : undefined}
      onClick={open ? onClose : undefined}
      onKeyDown={open ? activate(onClose) : undefined}
    >
      <circle r={R.emblem} fill="url(#disc)" />
      <circle r={R.emblem} className="emblem-ring" />
      <circle r={R.emblem - 10} className="emblem-ring thin" />
      <image href={emblemaUrl} x={-112} y={-109} width={224} height={218} />
    </g>
  );
}

function Fan({ slot, leaf, onLeaf }: { slot: Slot; leaf: number | null; onLeaf: (i: number | null) => void }) {
  const reduce = useReducedMotion();
  const [isPresent, safeToRemove] = usePresence();
  const u = useMotionValue(0);
  const n = slot.cat.subs.length;
  const spreadHalf = (n * STEP) / 2;
  const selHalf = (slot.b - slot.a) / 2 - 0.6;

  useEffect(() => {
    if (isPresent) {
      const c = animate(u, 1, reduce ? { duration: 0 } : { type: 'spring', stiffness: 85, damping: 15, delay: 0.32 });
      return () => c.stop();
    }
    animate(u, 0, { duration: reduce ? 0 : 0.2, ease: 'easeIn' }).then(safeToRemove);
  }, [isPresent, u, reduce, safeToRemove]);

  // Pescoço que liga a categoria ao leque.
  const neck = useTransform(u, (v) => {
    const t = Math.max(0, Math.min(1, v));
    const sh = selHalf + (Math.max(spreadHalf, selHalf) - selHalf) * t;
    const r1 = R.ringOut + 3;
    const r2 = r1 + (R.fanIn - 2 - r1) * t + 0.5;
    const [x1, y1] = polar(r1, 90 - selHalf);
    const [x2, y2] = polar(r2, 90 - sh);
    const [x3, y3] = polar(r2, 90 + sh);
    const [x4, y4] = polar(r1, 90 + selHalf);
    return `M${x1} ${y1}L${x2} ${y2}A${r2} ${r2} 0 0 1 ${x3} ${y3}L${x4} ${y4}A${r1} ${r1} 0 0 0 ${x1} ${y1}Z`;
  });
  const neckOpacity = useTransform(u, [0, 0.4], [0, 1]);

  return (
    <g role="group" aria-label={`Leque de ${slot.cat.rotulo}`}>
      <motion.path d={neck} className="neck" style={{ opacity: neckOpacity }} />
      {slot.cat.subs.map((sub, i) => (
        <Petal
          key={sub.titulo}
          u={u}
          index={i}
          offset={-spreadHalf + STEP * (i + 0.5)}
          title={sub.titulo}
          chosen={leaf === i}
          onClick={() => onLeaf(leaf === i ? null : i)}
        />
      ))}
    </g>
  );
}

function wrap(text: string, max = 22): string[] {
  const out: string[] = [];
  let line = '';
  for (const w of text.split(' ')) {
    if (line && (line + ' ' + w).length > max) {
      out.push(line);
      line = w;
    } else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  return out;
}

function Petal({
  u,
  index,
  offset,
  title,
  chosen,
  onClick,
}: {
  u: MotionValue<number>;
  index: number;
  offset: number;
  title: string;
  chosen: boolean;
  onClick: () => void;
}) {
  const d = useTransform(u, (v) => {
    const a = 90 + offset * v;
    const hw = ((STEP - GAP) / 2) * (0.2 + 0.8 * Math.min(1, v));
    const ro = R.fanIn + 8 + (R.fanOut - R.fanIn - 8) * v;
    return arc(R.fanIn, Math.max(R.fanIn + 2, ro), a - hw, a + hw);
  });
  const x = useTransform(u, (v) => polar(R.fanIn + 30, 90 + offset * v)[0]);
  const y = useTransform(u, (v) => polar(R.fanIn + 30, 90 + offset * v)[1]);
  const labelOpacity = useTransform(u, [0.7, 1], [0, 1]);
  const lines = wrap(title);
  const top = -((lines.length - 1) * 19) / 2;

  return (
    <g
      className={chosen ? 'petal is-chosen' : 'petal'}
      data-leaf={index}
      role="button"
      tabIndex={0}
      aria-pressed={chosen}
      aria-label={`${title}: ver descrição`}
      onClick={onClick}
      onKeyDown={activate(onClick)}
    >
      <motion.path d={d} className="petal-shape" />
      <motion.path
        d={d}
        fill="url(#gold)"
        initial={false}
        animate={{ opacity: chosen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        pointerEvents="none"
      />
      <motion.g style={{ x, y, opacity: labelOpacity }} pointerEvents="none">
        <g transform={`rotate(${offset})`}>
          <text x={0} y={top + 5} className="petal-num">
            {String(index + 1).padStart(2, '0')}
          </text>
          {lines.map((l, i) => (
            <text key={l} x={34} y={top + 6 + i * 19} className="petal-text">
              {l}
            </text>
          ))}
        </g>
      </motion.g>
    </g>
  );
}

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

function Reveal({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="reveal">
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: 0, transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] } }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Intro() {
  return (
    <motion.div className="intro" {...fade}>
      <h1 className="display gold-title">
        <Reveal delay={0.2}>Ecossistema</Reveal>
        <Reveal delay={0.34}>
          <em>Florim</em>
        </Reveal>
      </h1>
      <p className="intro-sub">{textos.subtitulo}</p>
      <p className="intro-lead">
        {negrito(textos.apresentacao).map((t, k) => (k % 2 ? <strong key={k}>{t}</strong> : t))}
      </p>
      <p className="hint">
        <span className="round-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="m9 6 6 6-6 6" /></svg>
        </span>
        Toque em uma área para explorar
      </p>
    </motion.div>
  );
}

function Back({ onClose }: { onClose: () => void }) {
  return (
    <motion.div {...fade}>
      <button className="back" onClick={onClose}>
        <span className="round-arrow is-back" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18"><path d="m15 6-6 6 6 6" /></svg>
        </span>
        Todas as áreas
      </button>
    </motion.div>
  );
}

function Legend({ onSelect }: { onSelect: (id: string) => void }) {
  const count = (f: Categoria['frente']) => categorias.filter((c) => c.frente === f);
  const items = [
    { f: 'servicos' as const, n: `${count('servicos').length} disciplinas`, first: 'agrimensura' },
    { f: 'representacoes' as const, n: `${count('representacoes')[0]?.subs.length ?? 0} soluções`, first: 'representacoes' },
    { f: 'consultoria' as const, n: 'Inteligência de mercado', first: 'consultoria' },
    { f: 'cursos' as const, n: 'Aulas gratuitas', first: 'cursos' },
  ];
  return (
    <motion.div className="legend" {...fade}>
      <span className="badge">Como atuamos</span>
      <h2 className="display legend-title">
        Quatro <em>frentes</em>
      </h2>
      <ul>
        {items.map((it, i) => (
          <motion.li
            key={it.f}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.5 + i * 0.08 } }}
          >
            <button data-cat={it.first} onClick={() => onSelect(it.first)}>
              <span className="legend-num">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <strong>{frentes[it.f].nome}</strong>
                <small>{it.n}</small>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
