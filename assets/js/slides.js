/* FotoFácil · JECET 2026
   Navegação de slides, escala do palco, visão geral, cronômetro e as duas
   interações da apresentação (comparador antes/depois e explorador de nós). */

(() => {
  "use strict";

  const LARGURA = 1280;
  const ALTURA = 720;

  const quadro = document.getElementById("quadro");
  const palco = document.getElementById("palco");
  const visao = document.getElementById("visao");
  const progresso = document.getElementById("progresso");
  const contador = document.getElementById("contador");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const total = slides.length;

  let atual = 0;
  let cronometroLigado = false;
  let inicio = null;

  /* ---------- escala: 1280x720 sempre inteiro na janela ------------------- */
  function ajustarEscala() {
    // folga maior embaixo: a barra de navegação não encosta no slide
    const folgaX = 64;
    const folgaY = 132;
    const escala = Math.min(
      (window.innerWidth - folgaX) / LARGURA,
      (window.innerHeight - folgaY) / ALTURA
    );
    quadro.style.transform = `scale(${escala})`;
  }
  window.addEventListener("resize", ajustarEscala);

  /* ---------- navegação --------------------------------------------------- */
  function irPara(i, semHistorico) {
    if (i < 0 || i >= total || i === atual) return;
    const anterior = slides[atual];
    anterior.classList.remove("ativa");

    atual = i;
    const alvo = slides[atual];
    // reinicia as animações de entrada: remove e devolve a classe no próximo quadro
    alvo.querySelectorAll(".aparece").forEach((el) => {
      el.style.animation = "none";
      void el.offsetWidth;
      el.style.animation = "";
    });
    alvo.classList.add("ativa");

    if (inicio === null) inicio = Date.now();
    atualizar();
    if (!semHistorico) history.replaceState(null, "", "#" + (atual + 1));
  }

  function proximo() { irPara(atual + 1); }
  function anterior() { irPara(atual - 1); }

  function atualizar() {
    const preenchimento = progresso.querySelector(".valor");
    if (preenchimento) preenchimento.style.height = `${((atual + 1) / total) * 100}%`;
    contador.textContent = `${String(atual + 1).padStart(2, "0")} / ${total}`;
  }

  /* ---------- visão geral (tecla o) --------------------------------------- */
  let geralAberta = false;

  function montarVisao() {
    if (visao.dataset.pronta === "1") return;
    slides.forEach((s, i) => {
      const mini = document.createElement("button");
      mini.className = "mini";
      mini.type = "button";
      mini.dataset.indice = String(i);
      mini.innerHTML =
        `<span class="topo"><b>${String(i + 1).padStart(2, "0")}</b> ${s.dataset.titulo || ""}</span>` +
        `<span class="quadro"></span>`;
      const copia = s.cloneNode(true);
      copia.classList.add("ativa");
      copia.removeAttribute("id");
      mini.querySelector(".quadro").appendChild(copia);
      mini.addEventListener("click", () => {
        alternarVisao(false);
        irPara(i);
      });
      visao.appendChild(mini);
    });
    visao.dataset.pronta = "1";
    escalarVisao();
    requestAnimationFrame(escalarVisao);
    window.addEventListener("resize", escalarVisao);
  }

  function escalarVisao() {
    visao.querySelectorAll(".mini").forEach((mini) => {
      const cx = mini.querySelector(".quadro");
      // enquanto o grid não mediu, o cliente devolve 0 e a miniatura ficaria invisível
      const escala = (cx.clientWidth || 268) / LARGURA;
      cx.querySelector(".slide").style.transform = `scale(${escala})`;
    });
  }

  function alternarVisao(forcar) {
    const abrir = typeof forcar === "boolean" ? forcar : !geralAberta;
    if (abrir) montarVisao();
    geralAberta = abrir;
    document.body.classList.toggle("geral", abrir);
    visao.setAttribute("aria-hidden", abrir ? "false" : "true");
    if (abrir) {
      // mede depois que o grid existe de fato, em dois quadros de animação
      escalarVisao();
      requestAnimationFrame(() => { escalarVisao(); requestAnimationFrame(escalarVisao); });
    }
  }

  /* ---------- tela cheia -------------------------------------------------- */
  function alternarTelaCheia() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  /* ---------- cronômetro discreto (tecla t) ------------------------------- */
  let relogio;
  function alternarCronometro() {
    cronometroLigado = !cronometroLigado;
    if (cronometroLigado) {
      if (inicio === null) inicio = Date.now();
      relogio = document.createElement("div");
      relogio.id = "relogio";
      Object.assign(relogio.style, {
        position: "fixed", left: "18px", bottom: "42px", zIndex: "30",
        font: "12px/1.4 var(--mono)", color: "var(--lav-text)",
        background: "rgba(255,255,255,.92)", border: "1px solid var(--lav-line2)",
        borderRadius: "999px", padding: "5px 12px", letterSpacing: ".06em",
      });
      document.body.appendChild(relogio);
      const marcar = () => {
        const s = Math.floor((Date.now() - inicio) / 1000);
        relogio.textContent =
          `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}` +
          ` · slide ${atual + 1}/${total}`;
      };
      marcar();
      relogio.dataset.timer = setInterval(marcar, 1000);
    } else if (relogio) {
      clearInterval(relogio.dataset.timer);
      relogio.remove();
      relogio = null;
    }
  }

  /* ---------- teclado ----------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case "ArrowRight": case "ArrowDown": case "PageDown": case " ": case "Enter":
        e.preventDefault(); proximo(); break;
      case "ArrowLeft": case "ArrowUp": case "PageUp": case "Backspace":
        e.preventDefault(); anterior(); break;
      case "Home": e.preventDefault(); irPara(0); break;
      case "End": e.preventDefault(); irPara(total - 1); break;
      case "o": case "O": case "Escape": alternarVisao(); break;
      case "f": case "F": alternarTelaCheia(); break;
      case "p": case "P": window.print(); break;
      case "t": case "T": alternarCronometro(); break;
      default:
        if (/^[0-9]$/.test(e.key)) {
          const n = parseInt(e.key, 10);
          const i = n === 0 ? 9 : n - 1;
          if (i < total) irPara(i);
        }
    }
  });

  document.getElementById("btn-prox").addEventListener("click", proximo);
  document.getElementById("btn-ant").addEventListener("click", anterior);
  document.getElementById("btn-geral").addEventListener("click", () => alternarVisao());
  document.getElementById("btn-tela").addEventListener("click", alternarTelaCheia);
  document.getElementById("btn-print").addEventListener("click", () => window.print());

  /* ---------- toque: arrastar o dedo -------------------------------------- */
  let x0 = null;
  palco.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  palco.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) (dx < 0 ? proximo : anterior)();
    x0 = null;
  }, { passive: true });

  /* ---------- comparador antes/depois (arrastar) -------------------------- */
  document.querySelectorAll(".slider").forEach((sl) => {
    const depois = sl.querySelector(".depois");
    const pino = sl.querySelector(".pino");
    let ativo = false;
    const posicionar = (clientX) => {
      const r = sl.getBoundingClientRect();
      const p = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
      depois.style.clipPath = `inset(0 0 0 ${p}%)`;
      pino.style.left = `${p}%`;
    };
    sl.addEventListener("pointerdown", (e) => {
      ativo = true;
      // setPointerCapture pode falhar em navegadores/eventos sintéticos: não deixe quebrar o arrasto
      try { sl.setPointerCapture(e.pointerId); } catch (_) {}
      posicionar(e.clientX);
    });
    sl.addEventListener("pointermove", (e) => { if (ativo) posicionar(e.clientX); });
    sl.addEventListener("pointerup", () => { ativo = false; });
    sl.addEventListener("pointercancel", () => { ativo = false; });
    // teclado: setas movem a divisória quando o comparador está visível
    sl.tabIndex = 0;
    sl.addEventListener("keydown", (e) => {
      const p = parseFloat(pino.style.left) || 50;
      if (e.key === "ArrowRight") { posicionar(sl.getBoundingClientRect().left + (sl.clientWidth * (p + 5)) / 100); e.preventDefault(); }
      if (e.key === "ArrowLeft") { posicionar(sl.getBoundingClientRect().left + (sl.clientWidth * (p - 5)) / 100); e.preventDefault(); }
    });
  });

  /* ---------- explorador de nós (galeria) --------------------------------- */
  document.querySelectorAll('[data-galeria]').forEach((gal) => {
    const img = gal.querySelector(".visor img");
    const formula = gal.querySelector(".formula");
    const legenda = gal.querySelector(".legenda");
    gal.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        gal.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-selected", "false"));
        chip.setAttribute("aria-selected", "true");
        if (img.src.endsWith(chip.dataset.img)) return;
        img.style.opacity = "0.25";
        const nova = new Image();
        nova.src = chip.dataset.img;
        nova.onload = () => { img.src = chip.dataset.img; img.style.opacity = "1"; };
        if (formula) formula.textContent = chip.dataset.formula || "";
        if (legenda) legenda.textContent = chip.dataset.legenda || "";
      });
    });
  });

  /* ---------- explorador do catálogo (categoria -> nós) ------------------- */
  document.querySelectorAll("[data-catalogo]").forEach((cat) => {
    const alvo = cat.querySelector("#cat-nos");
    const rotulo = cat.querySelector("#cat-rotulo");
    const pintar = (botao) => {
      const nomes = (botao.dataset.nos || "").split(" · ").filter(Boolean);
      const icone = botao.dataset.icone || "brilho";
      const cor = botao.dataset.cor || "#4a3aa6";
      const porNome = [
        [/color space|cor\b/i, "drop"],
        [/fourier|fft|frequ/i, "onda"],
        [/convolu|kernel/i, "malha"],
        [/borda|sobel|laplac|limiar|threshold/i, "angulo"],
        [/ru[ií]do|sal e pimenta/i, "pontos"],
        [/blur|suaviza|mediana|gauss/i, "drop"],
        [/equaliza|histograma/i, "barras"],
        [/morfol|dilata|eros/i, "pilha"],
        [/crop|recorte|resize|rotate|flip|rota/i, "recorte"],
        [/banda|ndvi|nbr|savi|ndwi|empilha|registro|mudan/i, "camadas"],
        [/augmenta|normaliza/i, "brilho"],
        [/export|input|output|sa[íi]da|entrada/i, "caixa"],
        [/machine|learning|ia\b/i, "chip"],
        [/brilho|contrast|brightness/i, "sol"],
        [/estat|matriz|pixel|compara|an[áa]lise/i, "grade"],
      ];
      const iconeDe = (nome) => {
        for (const [re, ic] of porNome) if (re.test(nome)) return ic;
        return icone;
      };
      alvo.innerHTML = nomes
        .map((n) => `<span class="no"><svg aria-hidden="true" style="color:${cor}"><use href="#ic-${iconeDe(n)}"/></svg>${n}</span>`)
        .join("");
      rotulo.textContent = `${botao.textContent.replace(/\s*\d+$/, "").trim()} · ${nomes.length} ${nomes.length === 1 ? "nó" : "nós"}`;
    };
    cat.querySelectorAll(".cat").forEach((botao) => {
      botao.addEventListener("click", () => {
        cat.querySelectorAll(".cat").forEach((b) => b.setAttribute("aria-selected", "false"));
        botao.setAttribute("aria-selected", "true");
        pintar(botao);
      });
    });
    const primeiro = cat.querySelector(".cat");
    if (primeiro) pintar(primeiro);
  });

  /* ---------- testes reais do projeto (slide de verificação) -------------- */
  const CODIGOS = {
    uniforme: [
      "func TestBlurNodeMeanOnUniformImageStaysUniform(t *testing.T) {",
      "    img := solidColorImage(5, 5, 100, 100, 100)",
      "    ctx := &ProcessContext{Images: []image.Image{img}}",
      "    node := &BlurNode{ID: \"blur1\", Method: \"mean\", KernelSize: 3}",
      "",
      "    if err := node.Process(ctx); err != nil {",
      "        t.Fatalf(\"BlurNode failed: %v\", err)",
      "    }",
      "    r, _, _, _ := ctx.Images[0].At(2, 2).RGBA()",
      "    if r>>8 != 100 { // o miolo tem que continuar 100",
      "        t.Errorf(\"expected uniform image to remain uniform after mean blur, got %d\", r>>8)",
      "    }",
      "}",
    ].join("\n"),
    mediana: [
      "func TestBlurNodeMedianRemovesSaltNoise(t *testing.T) {",
      "    img := solidColorImage(5, 5, 50, 50, 50)",
      "    // um unico pixel \"sal\" no meio da matriz",
      "    img.Set(2, 2, color.RGBA{255, 255, 255, 255})",
      "",
      "    ctx := &ProcessContext{Images: []image.Image{img}}",
      "    node := &BlurNode{ID: \"blur2\", Method: \"median\", KernelSize: 3}",
      "",
      "    if err := node.Process(ctx); err != nil {",
      "        t.Fatalf(\"BlurNode failed: %v\", err)",
      "    }",
      "    r, _, _, _ := ctx.Images[0].At(2, 2).RGBA()",
      "    if r>>8 != 50 { // a mediana descarta o ponto fora do padrao",
      "        t.Errorf(\"expected median filter to remove the salt-noise outlier, got %d\", r>>8)",
      "    }",
      "}",
    ].join("\n"),
  };
  document.querySelectorAll("[data-teste]").forEach((bloco) => {
    const pre = bloco.querySelector("#codigo-teste");
    const pintar = (chave) => { if (pre && CODIGOS[chave]) pre.textContent = CODIGOS[chave]; };
    bloco.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        bloco.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-selected", "false"));
        chip.setAttribute("aria-selected", "true");
        pintar(chip.dataset.teste);
      });
    });
    pintar("uniforme");
  });

  /* ---------- início ------------------------------------------------------ */
  const hash = parseInt((location.hash || "").replace("#", ""), 10);
  const inicial = Number.isFinite(hash) && hash >= 1 && hash <= total ? hash - 1 : 0;
  slides.forEach((s) => s.classList.remove("ativa"));
  adjustInicial();

  function adjustInicial() {
    atual = inicial;
    slides[atual].classList.add("ativa");
    ajustarEscala();
    atualizar();
    // mantém os serviços de escala e visão prontos desde o começo
    if (document.body.dataset.pronto !== "1") document.body.dataset.pronto = "1";
  }

  // recarregar a página com #n mantém o slide; F5 volta para o mesmo lugar
  window.addEventListener("hashchange", () => {
    const h = parseInt((location.hash || "").replace("#", ""), 10);
    if (Number.isFinite(h) && h >= 1 && h <= total && h - 1 !== atual) irPara(h - 1, true);
  });
})();

/* ---------- imagem ampliada: clique abre, clique fora fecha ---------------- */
(() => {
  const caixa = document.createElement("div");
  caixa.id = "caixa-imagem";
  const alvo = document.createElement("img");
  alvo.alt = "";
  caixa.appendChild(alvo);
  document.body.appendChild(caixa);

  const aberta = () => caixa.classList.contains("aberta");
  const fechar = () => {
    caixa.classList.remove("aberta");
    alvo.removeAttribute("src");
  };

  document.addEventListener("click", (evento) => {
    if (aberta()) {
      if (alvo.contains(evento.target)) return;   // clique na própria imagem não fecha
      fechar();
      return;
    }
    const imagem = evento.target.closest(".slide img");
    if (!imagem || evento.target.closest(".slider")) return;
    alvo.src = imagem.currentSrc || imagem.src;
    alvo.alt = imagem.alt || "";
    caixa.classList.add("aberta");
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key !== "Escape" || !aberta()) return;
    evento.stopPropagation();   // Esc fecha só a imagem, não mexe na visão geral
    evento.preventDefault();
    fechar();
  }, true);
})();