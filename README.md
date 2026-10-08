# Proposta Comercial + Ecossistema Florim

Apresentação da Florim Engenharia com o **Ecossistema interativo**: uma roda com as 12 áreas da empresa. Ao clicar numa área, a roda gira e abre um leque com as subcategorias. Ao clicar numa subcategoria, aparece a descrição.

O arquivo final é **`entregas/Apresentacao_Florim.html`**: dois cliques para abrir no Chrome ou no Edge, funciona sem internet.

Também pode ficar **online pela Vercel**: veja [Publicar na Vercel](#publicar-na-vercel).

---

## Como apresentar

| Tecla | O que faz |
|---|---|
| **F** | Tela cheia |
| **→** ou clique | Próximo slide |
| **←** | Slide anterior |
| **Esc** | Fecha a descrição e depois o leque |

Os botões do canto inferior direito fazem o mesmo e somem quando o mouse fica parado. No celular, deslize para o lado.

---

## O que editar e onde

### Textos do ecossistema → `src/data.ts`
Tudo o que aparece na roda está nesse arquivo:

- **`textos`**: a frase de abertura e o texto de apresentação. O que estiver entre `**asteriscos**` fica em negrito.
- **`config`**: WhatsApp comercial (só números, com 55 e DDD), e-mail e link da plataforma de cursos.
- **`categorias`**: as 12 áreas. Em cada uma:
  - `rotulo`: o nome que aparece na roda;
  - `chamada`: a frase pequena debaixo do nome, que só as áreas grandes têm;
  - `resumo`: o texto do cartão ao abrir a área;
  - `subs`: as subcategorias do leque, cada uma com `titulo` e `texto`. O ideal é ter **de 2 a 6** por área;
  - `acao.texto`: o texto do botão dourado.

Mude só o que está **entre aspas** e mantenha as vírgulas e chaves no lugar. Exemplo:

```ts
{ titulo: 'Georreferenciamento', texto: 'Georreferenciamento de imóveis e análise territorial.' },
```

### Páginas da proposta → `src/assets/proposta/`
São as páginas do Canva em imagem: `pagina-01.jpg`, `pagina-02.jpg`…

1. No Canva: **Compartilhar → Baixar → JPG**, com todas as páginas.
2. Renomeie para `pagina-01.jpg`, `pagina-02.jpg`… mantendo **dois dígitos**.
3. Substitua os arquivos da pasta. Para tirar uma página, basta apagar a imagem e renumerar as seguintes.

**A posição do ecossistema** é definida por `DEPOIS_DA_PAGINA` em `src/components/Deck.tsx` (hoje entra depois da página 4). Se mudar, altere também `TOPO_PROPOSTA` em `scripts/pptx_ecossistema.py`.

### Cores → `src/styles.css`
As cores do kit da marca estão no topo do arquivo, em `:root` (ouro em degradê, ouro sólido, branco, grafite e preto).

---

## Gerar a apresentação depois de editar

### Opção A: pelo GitHub, sem instalar nada
1. Edite o arquivo no próprio site do GitHub (ícone de lápis) e clique em **Commit changes**.
2. Abra a aba **Actions**, entre na execução mais recente e, quando ficar verde, baixe **Apresentacao_Florim** em *Artifacts*.
3. Descompacte. O arquivo de dentro é a apresentação atualizada.

Se a execução ficar vermelha, tem algum erro de digitação, normalmente uma aspa ou vírgula faltando. O GitHub mostra a linha do erro.

### Opção B: no computador
Precisa do [Node.js](https://nodejs.org) (versão LTS). Na pasta do projeto:

```bash
npm install            # só na primeira vez
npm run dev            # abre em http://localhost:5180 e atualiza ao salvar (só a roda)
npm run apresentacao   # gera entregas/Apresentacao_Florim.html
```

Para ver a apresentação completa durante a edição: http://localhost:5180/?apresentacao

---

## Publicar na Vercel

O projeto já vem configurado (`vercel.json`). Depois que os arquivos estiverem no GitHub:

1. Entre em [vercel.com](https://vercel.com) com a conta do GitHub.
2. **Add New… → Project** e escolha o repositório `proposta_comercial_florim` → **Import**.
   Se ele não aparecer, clique em *Adjust GitHub App Permissions* e libere o repositório.
3. Não precisa mudar nada (Framework: Vite). Clique em **Deploy**.
4. Em cerca de 1 minuto sai o link, por exemplo `proposta-comercial-florim.vercel.app`.

A partir daí, **toda alteração enviada ao GitHub atualiza o site sozinha**.

| Endereço | Mostra |
|---|---|
| `/` | A apresentação completa (proposta + ecossistema) |
| `/?ecossistema` | Só a roda interativa |
| `/?poster` | O mapa completo para impressão |

Para usar um domínio próprio (ex.: `proposta.florimengenharia.com.br`): no projeto da Vercel, **Settings → Domains**, e siga as instruções de DNS.

---

## Outras entregas (opcionais)

| Comando | Gera em `entregas/` | Precisa de |
|---|---|---|
| `npm run imagens` | Mapa completo para impressão (PNG/PDF, escuro e claro) e uma imagem por área em `leques/` | Chrome ou Edge |
| `npm run video` | `Ecossistema_Florim_Animacao.mp4`, a roda em funcionamento | Chrome e [ffmpeg](https://ffmpeg.org) |
| `npm run pptx` | `Proposta_Comercial_Florim_Interativa.pptx`, o PowerPoint com a transição Transformar | Chrome e Python com `pip install python-pptx pillow lxml` |

Apenas `Apresentacao_Florim.html` vai para o repositório. Os outros arquivos são gerados quando precisar.

---

## Estrutura

```
src/
  data.ts              ← textos, contatos e áreas (o que mais se edita)
  styles.css           ← cores e visual
  assets/proposta/     ← páginas da proposta (JPG do Canva)
  assets/fonts/        ← Poppins usada na página
  components/
    Stage.tsx          ← a roda interativa
    Panel.tsx          ← cartão de descrição
    Deck.tsx           ← a apresentação (ordem dos slides)
    Mobile.tsx         ← versão para celular
    Poster.tsx         ← mapa completo para impressão
  geometry.ts, icons.tsx
scripts/               ← geradores de imagens, vídeo e PowerPoint
marca/
  logo/                ← logo original (.ai, .pdf, .png, .svg)
  fontes/              ← Poppins para instalar no computador
  paginas-removidas/   ← páginas tiradas da proposta (ex.: planos)
entregas/              ← arquivos prontos para enviar
```

**Fonte:** Poppins, do Google Fonts, com licença livre (`marca/fontes/LICENCA-Poppins-OFL.txt`).
