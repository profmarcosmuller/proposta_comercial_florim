import { AnimatePresence, motion } from 'framer-motion';
import { config, frentes, linkContato, linkEmail, type Categoria } from '../data';

interface Props {
  cat: Categoria;
  leaf: number | null;
  onLeaf: (i: number | null) => void;
  compact?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function Panel({ cat, leaf, onLeaf, compact }: Props) {
  const sub = leaf !== null ? cat.subs[leaf] : undefined;
  const kicker = frentes[cat.frente].nome + (cat.grupo ? ' · ' + cat.grupo : '');

  return (
    <motion.section
      className={compact ? 'panel compact' : 'panel'}
      aria-live="polite"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0, transition: { duration: 0.55, delay: compact ? 0 : 0.4, ease } }}
      exit={{ opacity: 0, x: -12, transition: { duration: 0.16 } }}
    >
      <div className="panel-card">
      <span className="badge">{kicker}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={leaf ?? 'overview'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease } }}
          exit={{ opacity: 0, y: -6, transition: { duration: 0.14 } }}
        >
          {sub ? (
            <>
              <button className="crumb" onClick={() => onLeaf(null)}>
                <span aria-hidden="true">←</span> {cat.rotulo}
              </button>
              <p className="panel-num">{String((leaf ?? 0) + 1).padStart(2, '0')}</p>
              <h2 className={sub.titulo.split(" ").some((w) => w.length > 13) ? "display is-long" : "display"}>{sub.titulo}</h2>
              <p className="panel-text">{sub.texto}</p>
            </>
          ) : (
            <>
              <h2 className="display gold-title">
                <em>{cat.rotulo}</em>
              </h2>
              <p className="panel-text">{cat.resumo}</p>
              {!compact && (
                <p className="panel-hint">
                  {cat.subs.length} {cat.frente === 'servicos' ? 'frentes de trabalho' : 'opções'} no leque. Selecione uma para ver os detalhes.
                </p>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <Action cat={cat} leaf={leaf} />
      </div>
    </motion.section>
  );
}

function Action({ cat, leaf }: { cat: Categoria; leaf: number | null }) {
  if (cat.acao.tipo === 'cursos') {
    return (
      <motion.a className="cta" href={config.cursosUrl} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
        {cat.acao.texto} <span aria-hidden="true">→</span>
      </motion.a>
    );
  }
  const sub = leaf !== null ? cat.subs[leaf] : undefined;
  const href = linkContato(cat, sub);
  return (
    <div className="actions">
      {href && (
        <motion.a className="cta" href={href} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
          {cat.acao.texto} <span aria-hidden="true">→</span>
        </motion.a>
      )}
      <a className="mail" href={linkEmail(cat, sub)}>
        ou escreva para <span>{config.email}</span>
      </a>
    </div>
  );
}
