// Ícones em traço, grade de 32 unidades.
const paths: Record<string, string> = {
  agrimensura: 'M4 26 16 5 28 26ZM9 18h14M16 5v26M5 31h22M16 2a3 3 0 1 0 0 6 3 3 0 1 0 0-6',
  ambiental: 'M26 4C9 4 3 11 5 21c11 6 23-1 21-17ZM5 29 22 10M12 22v-8m0 8h8',
  arquitetura: 'M3 15 16 4 29 15M6 13v17h20V13M13 30V19h7v11M2 30h28',
  estrutural: 'M4 4h24v5H4Zm0 21h24v5H4ZM9 9v16m14-16v16M9 9l14 16M23 9 9 25',
  hidrossanitario: 'M16 3C13 10 6 15 6 21a10 10 0 0 0 20 0C26 15 19 10 16 3ZM11 22a5 5 0 0 0 5 5',
  ppci: 'M16 3c4 9-3 9 2 15 3-2 4-5 4-7 9 9 6 20-5 20S2 23 8 14c0 5 3 6 4 6-3-8 4-10 4-17Z',
  telecom: 'M3 10a19 19 0 0 1 26 0M7 15a13 13 0 0 1 18 0M11 20a7 7 0 0 1 10 0M16 24a2 2 0 1 0 0 4 2 2 0 1 0 0-4',
  eletrico: 'm19 2-14 18h10l-2 12 14-19H17Z',
  licenciamento: 'M6 3h14l7 7v20H6ZM20 3v8h7M11 17h10M11 22h6m6 4 3 3 9-10',
  representacoes: 'm2 11 7-7 8 3 7-2 7 8-6 11-8 5L5 20ZM9 4l5 8 6-3 5 5-9 13M8 17l8 10M12 13l10 10',
  cursos: 'm1 11 15-7 15 7-15 7ZM6 14v10c5 5 15 5 20 0V14M31 11v13',
  consultoria: 'M3 29h27M7 24v-7m9 7V11m9 13V5M4 12l9-7 7 2 9-6',
};

export function Icon({ id, size = 30, className }: { id: string; size?: number; className?: string }) {
  return (
    <g className={className} transform={`translate(${-size / 2} ${-size / 2}) scale(${size / 32})`}>
      <path d={paths[id] ?? paths.estrutural} />
    </g>
  );
}

export function IconSvg({ id, size = 28 }: { id: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="icon-svg">
      <path d={paths[id] ?? paths.estrutural} />
    </svg>
  );
}
