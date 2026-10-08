// Conteúdo do Ecossistema Florim. Edite textos, ordem e links aqui.

export type FrenteId = 'servicos' | 'representacoes' | 'consultoria' | 'cursos';

export interface Sub {
  titulo: string;
  texto: string;
}

export interface Categoria {
  id: string;
  frente: FrenteId;
  rotulo: string;
  /** Quebra manual do rótulo na roda. */
  linhas?: string[];
  grupo?: string;
  chamada?: string;
  resumo: string;
  subs: Sub[];
  acao: { tipo: 'contato' | 'cursos'; texto: string };
}

// Textos da abertura do ecossistema.
export const textos = {
  subtitulo: 'Um só parceiro, soluções completas.',
  // **texto** fica em negrito.
  apresentacao: 'Engenharia, representações, cursos e consultoria sob a mesma marca. Mais de **10 anos** entregando projetos 360°.',
};
export const config = {
  // Página pública da Universidade Corporativa Florim (o endereço /AVA/Administrador é o painel interno).
  cursosUrl: 'https://florimengenharia.plataformaead.br.com/',
  certificado: 'R$ 59,90',
  // Somente dígitos, com país e DDD (ex.: 5547999999999). Vazio esconde o botão de contato.
  // Comercial: +55 47 9133-2477.
  whatsapp: '554791332477',
  email: 'comercial2@florimengenharia.com.br',
};

export const frentes: Record<FrenteId, { nome: string; curto: string }> = {
  servicos: { nome: 'Serviços de engenharia', curto: 'Serviços' },
  representacoes: { nome: 'Representações', curto: 'Representações' },
  consultoria: { nome: 'Consultoria', curto: 'Consultoria' },
  cursos: { nome: 'Cursos NR', curto: 'Cursos NR' },
};

const proposta = { tipo: 'contato', texto: 'Solicitar proposta' } as const;

export const categorias: Categoria[] = [
  {
    id: 'agrimensura', frente: 'servicos', rotulo: 'Agrimensura', acao: proposta,
    resumo: 'Topografia, georreferenciamento e regularização com precisão de campo e respaldo técnico.',
    subs: [
      { titulo: 'Topografia e levantamentos', texto: 'Levantamentos, medições e demarcações em campo, a base segura de qualquer projeto ou regularização.' },
      { titulo: 'Georreferenciamento', texto: 'Georreferenciamento de imóveis e análise territorial para registro, planejamento e decisão.' },
      { titulo: 'Regularização e REURB', texto: 'Diagnóstico territorial e documental, peças técnicas, memoriais e acompanhamento do processo.' },
      { titulo: 'Infraestrutura urbana e rural', texto: 'Drenagem, pavimentação, sistema viário, saneamento e implantação de empreendimentos.' },
    ],
  },
  {
    id: 'ambiental', frente: 'servicos', rotulo: 'Ambiental', acao: proposta,
    resumo: 'Estudos e gestão ambiental para o empreendimento avançar com segurança técnica e legal.',
    subs: [
      { titulo: 'Diagnósticos e estudos', texto: 'Diagnósticos, estudos e relatórios que mostram o impacto real do empreendimento.' },
      { titulo: 'Planos e acompanhamento', texto: 'Planos ambientais e acompanhamento técnico em todas as fases da obra.' },
      { titulo: 'EIA/RIMA', texto: 'Estudo e Relatório de Impacto Ambiental para empreendimentos que exigem esse nível de análise.' },
      { titulo: 'Regularização e REURB', texto: 'Peças técnicas, memoriais e acompanhamento ambiental em processos de regularização.' },
    ],
  },
  {
    id: 'licenciamento', frente: 'servicos', rotulo: 'Licenciamento ambiental', linhas: ['Licenciamento', 'ambiental'], acao: proposta,
    resumo: 'Licenças, renovações e condicionantes conduzidas do enquadramento à emissão.',
    subs: [
      { titulo: 'Enquadramento', texto: 'Definição do tipo de licença e do órgão competente para o seu empreendimento.' },
      { titulo: 'Licenças e renovações', texto: 'Preparação, protocolo e acompanhamento de licenças e renovações.' },
      { titulo: 'Condicionantes', texto: 'Gestão das condicionantes para manter a licença válida durante toda a operação.' },
      { titulo: 'Laudos ambientais', texto: 'Laudos técnicos e estudos ambientais específicos exigidos no processo.' },
      { titulo: 'EIA/RIMA', texto: 'Estudo e relatório para empreendimentos de significativo impacto ambiental.' },
    ],
  },
  {
    id: 'arquitetura', frente: 'servicos', rotulo: 'Arquitetura', acao: proposta,
    resumo: 'Projetos que unem função, estética e viabilidade, integrados às demais disciplinas desde o início.',
    subs: [
      { titulo: 'Concepção de espaços', texto: 'Programa de necessidades, implantação e organização dos espaços.' },
      { titulo: 'Projeto arquitetônico', texto: 'Projeto completo, pensado para a necessidade real do empreendimento.' },
      { titulo: 'Compatibilização', texto: 'Arquitetura alinhada com estrutura e instalações: menos retrabalho na obra.' },
      { titulo: 'Regularização e REURB', texto: 'Levantamento, peças técnicas e memoriais para regularizar edificações.' },
    ],
  },
  {
    id: 'estrutural', frente: 'servicos', rotulo: 'Estrutural', acao: proposta,
    resumo: 'Estruturas seguras e econômicas, dimensionadas e detalhadas em sintonia com a arquitetura.',
    subs: [
      { titulo: 'Concepção e dimensionamento', texto: 'Escolha do sistema estrutural e dimensionamento de cada elemento.' },
      { titulo: 'Detalhamento', texto: 'Pranchas detalhadas, prontas para orçar e executar.' },
      { titulo: 'Integração de projetos', texto: 'Estrutura compatibilizada com arquitetura e instalações.' },
    ],
  },
  {
    id: 'eletrico', frente: 'servicos', grupo: 'Complementares', rotulo: 'Elétrico', acao: proposta,
    resumo: 'Instalações elétricas seguras e eficientes, com SPDA quando o projeto exige.',
    subs: [
      { titulo: 'Instalações elétricas', texto: 'Projeto elétrico da edificação e dos sistemas associados.' },
      { titulo: 'SPDA', texto: 'Sistema de proteção contra descargas atmosféricas.' },
    ],
  },
  {
    id: 'hidrossanitario', frente: 'servicos', grupo: 'Complementares', rotulo: 'Hidrossanitário', acao: proposta,
    resumo: 'Água, esgoto e águas pluviais projetados para funcionar bem e durar.',
    subs: [
      { titulo: 'Água', texto: 'Abastecimento e distribuição dimensionados para o uso real da edificação.' },
      { titulo: 'Esgoto', texto: 'Coleta e destinação de esgoto conforme as normas e exigências locais.' },
      { titulo: 'Águas pluviais', texto: 'Captação e drenagem das águas de chuva da edificação e do terreno.' },
    ],
  },
  {
    id: 'ppci', frente: 'servicos', grupo: 'Complementares', rotulo: 'PPCI', acao: proposta,
    resumo: 'Prevenção e proteção contra incêndio, de acordo com as exigências do Corpo de Bombeiros.',
    subs: [
      { titulo: 'Prevenção e proteção', texto: 'Sistemas de prevenção, rotas de fuga, sinalização e combate a incêndio.' },
      { titulo: 'Enquadramento local', texto: 'Classificação da edificação e atendimento às normas aplicáveis.' },
    ],
  },
  {
    id: 'telecom', frente: 'servicos', grupo: 'Complementares', rotulo: 'Telecom', acao: proposta,
    resumo: 'Infraestrutura de telecomunicações e redes pronta para a demanda de hoje e de amanhã.',
    subs: [
      { titulo: 'Infraestrutura de telecom', texto: 'Entrada, prumadas e encaminhamentos de telecomunicações.' },
      { titulo: 'Redes e cabeamento', texto: 'Projeto de redes e cabeamento estruturado.' },
    ],
  },
  {
    id: 'representacoes', frente: 'representacoes', rotulo: 'Representações', chamada: 'Para empresas e obras',
    acao: { tipo: 'contato', texto: 'Solicitar cotação' },
    resumo: 'Parceiros selecionados e um único ponto de contato: a Florim cuida do atendimento e da proposta.',
    subs: [
      { titulo: 'Endereço fiscal', texto: 'Endereço fiscal e soluções empresariais para sua empresa operar com estrutura e credibilidade.' },
      { titulo: 'Sistemas construtivos', texto: 'Blocos e painéis pré-moldados de concreto: obra mais rápida, padronizada e com menos etapas.' },
      { titulo: 'Agregados e materiais', texto: 'Agregados minerais e materiais de construção, cotados por especificação, volume e frete.' },
      { titulo: 'Infraestrutura', texto: 'Terraplanagem, pavimentação e transporte de materiais para obras e empreendimentos.' },
    ],
  },
  {
    id: 'consultoria', frente: 'consultoria', rotulo: 'Consultoria', chamada: 'Inteligência de mercado',
    acao: { tipo: 'contato', texto: 'Solicitar análise' },
    resumo: 'Antes de comprar uma empresa, um imóvel ou um negócio, saiba exatamente onde está entrando.',
    subs: [
      { titulo: 'Mercado e concorrência', texto: 'Demanda, posicionamento, concorrentes, clientes e fornecedores: o retrato real do negócio.' },
      { titulo: 'Due diligence estratégica', texto: 'Análise comercial e estratégica da oportunidade antes da aquisição ou do investimento.' },
      { titulo: 'Riscos e oportunidades', texto: 'Matriz de riscos com impacto, probabilidade e o que fazer com cada um.' },
      { titulo: 'Cenários de viabilidade', texto: 'Premissas, custos, capital necessário, prazos e receitas em cenários comparáveis.' },
      { titulo: 'Recomendação', texto: 'Uma posição clara: avançar, negociar, aprofundar a análise ou não seguir.' },
    ],
  },
  {
    id: 'cursos', frente: 'cursos', rotulo: 'Cursos NR', chamada: 'Aulas gratuitas',
    acao: { tipo: 'cursos', texto: 'Acessar a plataforma' },
    resumo: `Capacitação em Normas Regulamentadoras na plataforma EAD da Florim. Aulas gratuitas, certificado por ${config.certificado}.`,
    subs: [
      { titulo: 'Aulas gratuitas', texto: 'Assista às aulas e aos módulos sem custo, no seu ritmo.' },
      { titulo: `Certificado ${config.certificado}`, texto: `Concluiu o curso? Emita seu certificado por ${config.certificado}.` },
      { titulo: 'Catálogo de cursos', texto: 'Todos os cursos de segurança do trabalho disponíveis na plataforma.' },
      { titulo: 'Segurança do trabalho', texto: 'Para empresas: laudos, programas e soluções técnicas sob demanda.' },
    ],
  },
];

/** Divide o texto nos trechos marcados com **negrito**. */
export function negrito(t: string) {
  return t.split(/\*\*(.+?)\*\*/g);
}

export function linkEmail(cat: Categoria, sub?: Sub): string {
  const assunto = `Interesse: ${cat.rotulo}${sub ? ` · ${sub.titulo}` : ''}`;
  return `mailto:${config.email}?subject=${encodeURIComponent(assunto)}`;
}

export function linkContato(cat: Categoria, sub?: Sub): string | null {
  const tel = config.whatsapp.trim();
  if (!/^[1-9]\d{9,14}$/.test(tel)) return null;
  const interesse = cat.rotulo + (sub ? ` · ${sub.titulo}` : '');
  return `https://wa.me/${tel}?text=${encodeURIComponent(`Olá! Tenho interesse em ${interesse} com a Florim Engenharia.`)}`;
}
