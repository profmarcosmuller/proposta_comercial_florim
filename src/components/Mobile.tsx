import emblemaUrl from '../assets/florim-emblema.svg';
import { AnimatePresence, motion, useReducedMotionConfig as useReducedMotion } from 'framer-motion';
import { categorias, frentes, textos, type FrenteId } from '../data';
import { IconSvg } from '../icons';
import { Panel } from './Panel';

interface Props {
  selected: string | null;
  leaf: number | null;
  onSelect: (id: string) => void;
  onLeaf: (i: number | null) => void;
}

const ordem: FrenteId[] = ['servicos', 'representacoes', 'consultoria', 'cursos'];

export function Mobile({ selected, leaf, onSelect, onLeaf }: Props) {
  const reduce = useReducedMotion();
  return (
    <div className="mobile">
      <header className="m-head">
        <img src={emblemaUrl} alt="" width={84} height={82} />
        <h1 className="display gold-title">
          Ecossistema <em>Florim</em>
        </h1>
        <p className="intro-sub">{textos.subtitulo}</p>
        <p className="intro-lead">{textos.apresentacao.replace(/\*\*/g, '')}</p>
      </header>

      {ordem.map((f) => (
        <section key={f} className="m-front">
          <h2 className="m-front-title">{frentes[f].nome}</h2>
          <div className="m-list">
            {categorias
              .filter((c) => c.frente === f)
              .map((cat) => {
                const open = selected === cat.id;
                return (
                  <div key={cat.id} className={open ? 'm-item is-open' : 'm-item'}>
                    <button className="m-cat" aria-expanded={open} onClick={() => onSelect(cat.id)}>
                      <IconSvg id={cat.id} />
                      <span>
                        {cat.rotulo}
                        {cat.chamada && <small>{cat.chamada}</small>}
                      </span>
                      <motion.span className="m-plus" aria-hidden="true" animate={{ rotate: open ? 45 : 0 }}>
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          className="m-fan"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="m-fan-inner">
                            <Panel cat={cat} leaf={leaf} onLeaf={onLeaf} compact />
                            <ul className="m-leaves">
                              {cat.subs.map((s, i) => (
                                <motion.li
                                  key={s.titulo}
                                  style={{ originX: 0, originY: 0.5 }}
                                  initial={reduce ? false : { opacity: 0, rotate: -9, x: -10 }}
                                  animate={{ opacity: 1, rotate: 0, x: 0 }}
                                  transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 + i * 0.05 }}
                                >
                                  <button className={leaf === i ? 'm-leaf is-chosen' : 'm-leaf'} aria-pressed={leaf === i} onClick={() => onLeaf(leaf === i ? null : i)}>
                                    <span className="petal-num">{String(i + 1).padStart(2, '0')}</span>
                                    {s.titulo}
                                  </button>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
      <footer className="m-foot">Florim Engenharia · Soluções Estratégicas</footer>
    </div>
  );
}
