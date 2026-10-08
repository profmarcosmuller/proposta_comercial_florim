import { useEffect, useState } from 'react';

// Telas estreitas ou em pé (celular) usam a versão em lista do ecossistema.
const QUERY = '(max-width: 899px), (max-aspect-ratio: 1/1)';

export function useCompact() {
  const [compact, setCompact] = useState(() => matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = matchMedia(QUERY);
    const on = () => setCompact(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return compact;
}
