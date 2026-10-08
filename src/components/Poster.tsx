import emblemaUrl from '../assets/florim-emblema.svg';
import wordmarkUrl from '../assets/florim-wordmark.svg';
import { useMotionValue } from 'framer-motion';
import { config } from '../data';
import { R, arc, arcLine, bands, polar, slots } from '../geometry';
import { Band, Defs, Emblem, Sector } from './Stage';

// Versão estática "toda aberta" da roda, para impressão e apresentações.
// Abrir em /?poster (fundo escuro) ou /?poster&claro (página clara).

const SUB_IN = R.ringOut + 10;
const SUB_OUT = 660;
const SUB_TEXT = (SUB_IN + SUB_OUT) / 2;

function wrap(text: string, max: number): string[] {
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

function SubRing() {
  return (
    <g>
      {slots.map((slot) => {
        const n = slot.cat.subs.length;
        const step = (slot.b - slot.a) / n;
        return (
          <g key={slot.cat.id}>
            <path d={arcLine(SUB_OUT + 8, slot.a + 0.6, slot.b - 0.6)} className="poster-group" />
            {slot.cat.subs.map((sub, i) => {
              const a = slot.a + i * step;
              const b = a + step;
              const mid = (a + b) / 2;
              const [x, y] = polar(SUB_TEXT, mid);
              const right = mid > 0 && mid < 180;
              const rotate = right ? mid - 90 : mid + 90;
              const width = (SUB_TEXT * step * Math.PI) / 180;
              const lines = wrap(sub.titulo, width < 60 ? 22 : 26);
              const lh = 16;
              return (
                <g key={sub.titulo + i}>
                  <path
                    d={arc(SUB_IN, SUB_OUT, a + (i === 0 ? 0.6 : 0.25), b - (i === n - 1 ? 0.6 : 0.25))}
                    className="poster-cell"
                  />
                  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
                    {lines.map((l, k) => (
                      <text
                        key={l}
                        y={(k - (lines.length - 1) / 2) * lh + 4.5}
                        textAnchor="middle"
                        className="poster-cell-text"
                      >
                        {l}
                      </text>
                    ))}
                  </g>
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

function OuterTicks() {
  const ticks = [];
  for (let a = 0; a < 360; a += 2) {
    const major = a % 10 === 0;
    const [x1, y1] = polar(SUB_OUT + 20, a);
    const [x2, y2] = polar(SUB_OUT + 20 + (major ? 9 : 4), a);
    ticks.push(<line key={a} x1={x1} y1={y1} x2={x2} y2={y2} className={major ? 'tick major' : 'tick'} />);
  }
  return <g aria-hidden="true">{ticks}</g>;
}

export function Poster() {
  const rot = useMotionValue(0);
  const claro = new URLSearchParams(location.search).has('claro');
  const size = SUB_OUT + 40;

  return (
    <div className={claro ? 'poster is-light' : 'poster'}>
      <div className="curtain" aria-hidden="true" />
      <header className="topbar" aria-hidden="true">
        <span className="badge">Ecossistema</span>
        <span className="topbar-brand">
          <img src={emblemaUrl} alt="" width={48} height={47} />
          <img src={wordmarkUrl} alt="" width={190} height={35} />
        </span>
        <span />
      </header>

      <header className="poster-head">
                <h1 className="display gold-title">
          Ecossistema <em>Florim</em>
        </h1>
        <p className="intro-sub">Engenharia · Representações · Consultoria · Cursos NR</p>
      </header>

      <svg className="poster-wheel" viewBox={`${-size} ${-size} ${size * 2} ${size * 2}`} role="img" aria-label="Ecossistema Florim completo">
        <Defs />
        <circle r={size} fill="url(#glow)" />
        <circle r={SUB_OUT + 4} className="poster-backdrop" />
        <OuterTicks />
        <SubRing />
        {bands.map((b) => (
          <Band key={b.nome} band={b} rot={rot} open={false} />
        ))}
        {slots.map((s, i) => (
          <Sector key={s.cat.id} slot={s} index={i} rot={rot} state="idle" onClick={() => {}} />
        ))}
        <Emblem open={false} onClose={() => {}} />
      </svg>

      <footer className="poster-foot">
        <span>+10 anos · Projetos 360° · Itajaí/SC · Atendimento em todo o Brasil</span>
        <span>
          {config.email} · +55 47 9133-2477
        </span>
      </footer>
    </div>
  );
}
