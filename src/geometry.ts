import { categorias, type Categoria } from './data';

// Ângulo 0 = topo, sentido horário.
export function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [r * Math.sin(a), -r * Math.cos(a)];
}

export function arc(ri: number, ro: number, a: number, b: number): string {
  const large = b - a > 180 ? 1 : 0;
  const [x1, y1] = polar(ro, a);
  const [x2, y2] = polar(ro, b);
  const [x3, y3] = polar(ri, b);
  const [x4, y4] = polar(ri, a);
  return `M${x1} ${y1}A${ro} ${ro} 0 ${large} 1 ${x2} ${y2}L${x3} ${y3}A${ri} ${ri} 0 ${large} 0 ${x4} ${y4}Z`;
}

/** Arco aberto, útil para textPath. `reverse` desenha no sentido anti-horário para o texto não ficar de cabeça para baixo. */
export function arcLine(r: number, a: number, b: number, reverse = false): string {
  const [x1, y1] = polar(r, reverse ? b : a);
  const [x2, y2] = polar(r, reverse ? a : b);
  return `M${x1} ${y1}A${r} ${r} 0 ${b - a > 180 ? 1 : 0} ${reverse ? 0 : 1} ${x2} ${y2}`;
}

/** Diferença angular normalizada para (-180, 180]. */
export function shortest(delta: number): number {
  const d = ((delta % 360) + 540) % 360 - 180;
  return d === -180 ? 180 : d;
}

export const R = {
  emblem: 150,
  bandIn: 158,
  bandOut: 196,
  ringIn: 202,
  ringOut: 420,
  ticks: 432,
  fanIn: 444,
  fanOut: 726,
};

export interface Slot {
  cat: Categoria;
  a: number;
  b: number;
  mid: number;
}

// Serviços ocupam o arco superior (200°); as outras três frentes dividem o restante.
const servicos = categorias.filter((c) => c.frente === 'servicos');
const outras = ['representacoes', 'consultoria', 'cursos'].map((id) => categorias.find((c) => c.id === id)!);

const serviceStep = 200 / servicos.length;
const otherStep = 160 / outras.length;

export const slots: Slot[] = [
  ...servicos.map((cat, i) => {
    const a = -100 + i * serviceStep;
    return { cat, a, b: a + serviceStep, mid: a + serviceStep / 2 };
  }),
  ...outras.map((cat, i) => {
    const a = 100 + i * otherStep;
    return { cat, a, b: a + otherStep, mid: a + otherStep / 2 };
  }),
];

export const bands = [
  { nome: 'Serviços de engenharia', a: -100, b: 100 },
  ...outras.map((cat, i) => ({ nome: cat.rotulo, a: 100 + i * otherStep, b: 100 + (i + 1) * otherStep })),
];

const comp = slots.filter((s) => s.cat.grupo === 'Complementares');
export const complementares = comp.length ? { a: comp[0].a, b: comp[comp.length - 1].b } : null;
