# FotoFácil no JECET 2026 · apresentação em site

Apresentação do **FotoFácil** (JECET Inovação 2026, IFSP Campus Jacareí) publicada como site
navegável em vez de arquivo de slides. Serve para apresentar no navegador, com navegação por
teclado e trechos interativos, e para exportar em PDF como reserva.

**Título oficial:** FotoFácil: um editor de imagens por nós para automatizar edições em lote sem programar
**Autoria:** Nathan Henrique Guimarães de Oliveira · Ana Paula Abrantes de Castro Shiguemori (IFSP)
**Formato:** capa + 12 slides (≈ 12 a 13 minutos)

## Como apresentar

Abra `index.html` (ou a URL do GitHub Pages) e use:

| Tecla | Ação |
| --- | --- |
| `→` `↓` `Espaço` `PageDown` | próximo slide |
| `←` `↑` `PageUp` | slide anterior |
| `Home` / `End` | primeiro / último slide |
| `1`–`9` | vai direto ao slide |
| `o` | visão geral em miniaturas (clique para pular) |
| `f` | tela cheia (recomendado antes de começar) |
| `t` | cronômetro discreto com o slide atual (ajuda a controlar os 10 a 15 min) |
| `p` | versão de impressão, para salvar em PDF |
| arrastar o dedo | próximo / anterior no celular ou no tablet |

O slide tem 1280×720 fixos e o site ajusta à janela, então nada rola e o desenho não quebra em
projetores diferentes. A URL carrega o número do slide (`#9`), dá para recarregar no mesmo ponto.

### Onde estão as interações

- **Slide 9, cor e realce:** arraste sobre a imagem para comparar original e equalizada.
- **Slide 10, bordas e limiar:** clique nos botões para trocar a operação; cada um mostra a fórmula
  aplicada e a leitura do resultado.
- **Slide 7, catálogo:** clique numa categoria para ver quais nós ela reúne (nomes reais do sistema).
- **Slide 8, verificação:** escolha um dos dois testes e veja o código Go real do projeto.
- **Slide 5, grafo:** a trilha animada mostra o percurso da imagem pelo fluxo.

## Roteiro sugerido (≈ 12 min 45 s)

| # | Slide | Tempo | Observação |
| --- | --- | --- | --- |
| 1 | Capa | 0:30 | título, autoria, instituição e logo do evento |
| 2 | Uma imagem é uma matriz de números | 1:00 | contexto e relevância |
| 3 | Automatizar em lote exige programar | 1:00 | problema e justificativa |
| 4 | O que o trabalho se propôs a fazer | 0:45 | objetivo geral e os quatro específicos |
| 5 | O desenho é a receita | 1:00 | grafo acíclico dirigido, com diagrama animado |
| 6 | Duas camadas em tempo real | 0:45 | arquitetura e a ferramenta em uso |
| 7 | 28 tipos de nó, em 8 categorias | 0:45 | catálogo interativo |
| 8 | Antes de codar, o resultado esperado | 0:45 | verificação pixel a pixel, com teste real |
| 9 | Escala de cinza e equalização | 1:15 | comparador arrastável e números |
| 10 | Encontrar contornos e separar o objeto | 1:15 | explorador de nós |
| 11 | Da pasta de fotos ao conjunto de treino | 1:00 | augmentação, ruído/mediana e pastas train/val/test |
| 12 | Objetivo por objetivo, e o que ainda falta | 1:15 | conclusão, limites e próximos passos |
| 13 | Referências e encerramento | 0:30 | bases e onde encontrar o projeto |

Se o tempo apertar: os slides 7 e 8 podem virar um só, falado por cima, e no 11 dá para pular a
parte de ruído e mediana.

## Publicar no GitHub Pages

```bash
git init -b main
git add .
git commit -m "Apresentação do FotoFácil no JECET 2026"
gh repo create fotofacil-jecet --public --source=. --push
gh api -X POST repos/nathanhgo/fotofacil-jecet/pages \
  -f "source[branch]=main" -f "source[path]=/"
```

A URL fica `https://nathanhgo.github.io/fotofacil-jecet/`. O `.nojekyll` já está incluído.

## Estrutura

```
index.html              capa + 12 slides, conteúdo e figuras
assets/css/style.css    paleta, tipografia, grades, diagramas e navegação
assets/js/slides.js     escala do palco, navegação, visão geral, cronômetro e interações
assets/fontes.css       declaração das fontes locais
assets/fonts/           Inter, Lora e IBM Plex Mono em woff2 (latin), para funcionar offline
assets/img/app/         capturas reais da ferramenta
assets/img/pdi/         resultados reais de processamento, gerados pelos nós do sistema
assets/img/logos/       faixa e marca do JECET, CNPq e MCTI, do modelo oficial do evento
```

## De onde veio cada figura

- **Capturas do app** (`assets/img/app/`): execução real do FotoFácil na máquina do autor, com um
  fluxo de processamento montado (entrada, escala de cinza, histograma, detecção de bordas,
  comparação visual, saída).
- **Resultados de processamento** (`assets/img/pdi/`): produzidos pelos **nós reais do backend Go**
  do FotoFácil, sobre a foto de exemplo. Todo número citado nos slides (média, mediana, desvio
  padrão, MSE, PSNR, fração de área acesa, proporções treino/validação/teste) sai dessas execuções,
  não de estimativa.
- **Augmentação e exportação rotulada**: saída real dos nós de augmentação (semente 42) e de
  exportação rotulada (60% treino, 20% validação, restante teste).
- **Logos**: extraídos do modelo oficial de apresentação do evento (`Modelo_Apresentação_2026`).
  O logo do evento é exigência do modelo; CNPq e MCTI acompanham a faixa oficial.
- **Foto de exemplo**: imagem de demonstração do projeto (um drone em voo). Para trocar, substitua
  `assets/img/pdi/00-original.jpg` e regenere os arquivos derivados.

## Regerar as figuras de processamento

O utilitário que produz as figuras a partir dos nós reais está em
`../foto-facil/backend/cmd/dumpdemo/main.go` (não faz parte do produto: é captura de material).

```bash
cd ../foto-facil/backend
MODE=imagens OUT_DIR=/caminho/fotofacil-jecet/assets/img/pdi SRC=/caminho/foto.jpg go run ./cmd/dumpdemo
MODE=dataset OUT_DIR=/caminho/... SRC=/caminho/foto.jpg DATASET_DIR=/tmp/ff-dataset-demo go run ./cmd/dumpdemo
```

O primeiro comando gera cinza, equalização, histograma, bordas (Sobel e Laplaciano), Otsu,
morfologia, FFT, ruído, mediana e matriz de pixels. O segundo gera a augmentação e a árvore
train/val/test. Depois disso, reduza o peso dos arquivos antes de publicar.

Figuras que existem no acervo mas não estão em nenhum slide: `08-fft-espectro.jpg`,
`09-fft-passabaixa.jpg` e `10-fft-passaalta.jpg` (domínio da frequência). Servem caso queira voltar
com um slide sobre FFT.

## Reserva para o dia da apresentação

```bash
chromium --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=apresentacao-fotofacil-jecet.pdf "file://$PWD/index.html"
```

O CSS de impressão empilha os 13 slides, um por página, em 1280×720.

## Histórico do arquivo

A primeira versão tinha 24 slides: roteiro, divisores de seção e um slide de frequência. Foi
enxugada a pedido do autor para capa + 12 slides. A versão longa continua no histórico do git
(commit `b799b7c`).

## Pendências e observações

- Conteúdo conferido contra o repositório: 28 nós em 8 categorias, 94 testes automatizados,
  resultados numéricos medidos na saída dos nós.
- O QR do encerramento aponta para `github.com/nathanhgo/foto-facil`. Se mudar, regenere:
  `python3 -c "import segno; segno.make('URL').save('assets/img/qr-repo.png', scale=8)"`.
- Nada aqui depende de internet, exceto a publicação no Pages.