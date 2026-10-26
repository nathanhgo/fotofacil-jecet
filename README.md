# FotoFácil no JECET 2026 — apresentação em site

Apresentação do **FotoFácil** (JECET Inovação 2026, IFSP Campus Jacareí) publicada como site
navegável em vez de arquivo de slides. Serve para apresentar no navegador, com navegação por
teclado, e para exportar em PDF como reserva.

**Título oficial:** FotoFácil: um editor de imagens por nós para automatizar edições em lote sem programar
**Autoria:** Nathan Henrique Guimarães de Oliveira · Ana Paula Abrantes de Castro Shiguemori (IFSP)

## Como apresentar

Abra `index.html` (ou a URL do GitHub Pages) e use:

| Tecla | Ação |
| --- | --- |
| `→` `↓` `Espaço` `PageDown` | próximo slide |
| `←` `↑` `PageUp` | slide anterior |
| `Home` / `End` | primeiro / último slide |
| `1`–`9` | vai direto ao slide (1 a 9) |
| `o` | visão geral em miniaturas (clique para pular) |
| `f` | tela cheia (recomendado antes de começar) |
| `t` | cronômetro discreto com o slide atual (ajuda a controlar os 10 a 15 min) |
| `p` | versão de impressão, para salvar em PDF |
| arrastar o dedo (toque) | próximo / anterior no celular |

A escala é automática: o slide tem 1280×720 fixos e o site ajusta ao tamanho da janela, então
nada precisa rolar e o desenho não quebra em projetores diferentes. A URL carrega o número do
slide (`#12`), então dá para recarregar ou compartilhar um ponto específico.

No slide do comparador (resultado 1) arraste sobre a imagem para comparar original e equalizada.
No slide de bordas, clique nos botões para trocar a operação e ver a fórmula e a legenda de cada uma.

## Roteiro sugerido (≈ 13 min)

Alguns slides são de apoio e podem ser pulados se o tempo apertar (marcados como opcionais).

| # | Slide | Tempo | Observação |
| --- | --- | --- | --- |
| 1 | Capa | 0:30 | título, autoria, instituição e logo do evento |
| 2 | Roteiro | 0:30 | (opcional) anuncia os cinco blocos |
| 3 | Divisor I | 0:10 | |
| 4 | Contexto | 1:00 | a imagem como matriz de números |
| 5 | Problema e justificativa | 1:00 | o que existe hoje e o que isso custa |
| 6 | Objetivos | 0:45 | geral + quatro específicos |
| 7 | Divisor II | 0:10 | |
| 8 | Fluxo como grafo | 1:00 | diagrama animado do grafo acíclico dirigido |
| 9 | Arquitetura | 0:45 | duas camadas e comunicação em tempo real |
| 10 | Como um nó processa | 1:00 | (opcional) contrato do nó e painel de propriedades |
| 11 | Catálogo | 0:45 | 28 nós em 8 categorias |
| 12 | Testes antes do código | 0:45 | (opcional) verificação pixel a pixel |
| 13 | Divisor III | 0:10 | |
| 14 | O sistema em execução | 1:00 | captura real da ferramenta |
| 15 | Resultado 1: realce | 1:00 | comparador arrastável + números |
| 16 | Resultado 2: bordas | 1:15 | explorador de nós clicável |
| 17 | Resultado 3: frequência | 0:45 | (opcional) FFT e filtros |
| 18 | Resultado 4: ruído | 0:45 | (opcional) mediana recupera a imagem |
| 19 | Resultado 5: dados para IA | 1:00 | augmentação e pastas train/val/test |
| 20 | Divisor IV | 0:10 | |
| 21 | Objetivos respondidos | 1:00 | objetivo por objetivo, com ressalvas |
| 22 | Limites e próximos passos | 0:45 | inclui o problema de persistência encontrado |
| 23 | Referências | 0:20 | bases do trabalho |
| 24 | Encerramento | 0:30 | contato e repositório |

## Publicar no GitHub Pages

O site é estático e não precisa de build. Para publicar:

```bash
# a partir da pasta do projeto
git init -b main
git add .
git commit -m "Apresentação do FotoFácil no JECET 2026"
gh repo create fotofacil-jecet --public --source=. --push
gh api -X POST repos/nathanhgo/fotofacil-jecet/pages -f "source[branch]=main" -f "source[path]=/"
```

A URL fica `https://nathanhgo.github.io/fotofacil-jecet/`. O arquivo `.nojekyll` está incluído
para o Pages servir as pastas como estão, sem processamento de Jekyll.

## Estrutura

```
index.html              24 slides, conteúdo e figuras
assets/css/style.css    paleta, tipografia, grades, diagramas e navegação
assets/js/slides.js     escala do palco, navegação, visão geral, cronômetro, interações
assets/fontes.css       declaração das fontes locais
assets/fonts/           Inter, Lora e IBM Plex Mono em woff2 (latin), para funcionar offline
assets/img/app/         capturas reais da ferramenta em execução
assets/img/pdi/         resultados reais de processamento, gerados pelos nós do próprio sistema
assets/img/logos/       faixa e marca do JECET, CNPq e MCTI, extraídos do modelo oficial do evento
```

## De onde veio cada figura

- **Capturas do app** (`assets/img/app/`): execução real do FotoFácil na máquina do autor, com um
  fluxo de processamento montado (entrada, escala de cinza, histograma, detecção de bordas,
  comparação visual, saída).
- **Resultados de processamento** (`assets/img/pdi/`): produzidos pelos **nós reais do backend Go**
  do FotoFácil, sobre a foto de exemplo, e salvos como PNG/JPEG para a apresentação. Cada número
  citado nos slides (média, mediana, desvio padrão, MSE, PSNR, fração de área acesa, proporções
  treino/validação/teste) sai dessas execuções, não de estimativa.
- **Augmentação e exportação rotulada** (`20-augmentada-*.jpg` e a árvore `train/val/test`): saída
  real dos nós de augmentação (semente 42) e de exportação rotulada (60% treino, 20% validação,
  restante teste), obtida rodando o programa auxiliar descrito abaixo.
- **Logos** (`assets/img/logos/`): extraídos do modelo oficial de apresentação do evento
  (`Modelo_Apresentação_2026`, Google Slides, pasta da faculdade). O logo do evento é exigência do
  modelo; os de CNPq e MCTI acompanham a faixa oficial.
- **Foto de exemplo**: imagem de demonstração usada nos testes do projeto (um drone em voo). Para
  trocar, substitua `assets/img/pdi/00-original.jpg` e os arquivos `01-` a `14-` gerados a partir
  dela.

## Regerar as figuras de processamento

As figuras saem do próprio backend, o que garante que a apresentação mostre a saída do sistema e
não uma ilustração. O programa auxiliar usado para gerar está em
`../foto-facil/backend/cmd/dumpdemo/main.go` (não faz parte do produto: é um utilitário de captura).
Ele carrega uma imagem, aplica os nós e grava os resultados:

```bash
cd ../foto-facil/backend
MODE=imagens OUT_DIR=/caminho/para/fotofacil-jecet/assets/img/pdi SRC=/caminho/foto.jpg \
  go run ./cmd/dumpdemo        # cinza, equalização, histograma, bordas, otsu, morfologia, FFT, ruído, mediana, matriz de pixels
MODE=dataset OUT_DIR=... SRC=... DATASET_DIR=/tmp/ff-dataset-demo \
  go run ./cmd/dumpdemo        # augmentação com semente fixa e árvore train/val/test
```

Depois de gerar, reduza o peso dos arquivos antes de publicar (as capturas saem grandes):

```bash
python3 - <<'EOF'
from PIL import Image
from pathlib import Path
for p in Path("assets/img/app").glob("*.png"):
    im = Image.open(p)
    if im.width > 1500:
        im.resize((1500, round(im.height * 1500 / im.width)), Image.LANCZOS).save(p, optimize=True)
EOF
```

## Reserva para o dia da apresentação

Antes de apresentar, gere um PDF com todos os slides (uma página por slide), para o caso de o
projetor ou o navegador da sala falhar:

```bash
chromium --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=apresentacao-fotofacil-jecet.pdf \
  "file://$PWD/index.html?print"
```

O CSS já trata a impressão: os 24 slides saem empilhados, um por página, em 1280×720.

## Estado e pendências

- Conteúdo conferido contra o repositório do projeto: 28 nós em 8 categorias, 94 testes
  automatizados, resultados numéricos medidos na saída dos nós.
- O QR do encerramento aponta para `github.com/nathanhgo/foto-facil` (repositório do projeto).
  Se o endereço mudar, gere outro: `python3 -c "import segno; segno.make('URL').save('assets/img/qr-repo.png', scale=8)"`.
- Nada aqui depende de internet, exceto a publicação no Pages.