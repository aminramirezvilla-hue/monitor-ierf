(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const state = { currentQ: 0, respuestas: {}, lead: null, resultado: null };
  const screens = {
    landing: $("#screen-landing"),
    quiz: $("#screen-quiz"),
    gate: $("#screen-gate"),
    results: $("#screen-results")
  };
  function show(name) {
    Object.values(screens).forEach((el) => el && el.classList.remove("active"));
    if (screens[name]) screens[name].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function renderQuestion() {
    const q = PREGUNTAS[state.currentQ];
    const total = PREGUNTAS.length;
    $("#quiz-progress-bar").style.width = (state.currentQ / total) * 100 + "%";
    const counter = $("#quiz-counter");
    if (counter) {
      counter.style.display = "block";
      counter.textContent = "Pregunta " + (state.currentQ + 1) + " de " + total;
    }
    const vicio = VICIOS.find((v) => v.id === q.vicio);
    $("#question-meta").textContent = vicio ? vicio.nombre : "";
    $("#question-text").textContent = q.texto;
    $("#question-help").textContent = q.ayuda || "";
    const box = $("#options-container");
    box.innerHTML = "";
    OPCIONES.forEach((opt) => {
      const div = document.createElement("label");
      div.className = "option" + (state.respuestas[q.id] === opt.value ? " selected" : "");
      div.innerHTML = '<input type="radio" name="respuesta" value="' + opt.value + '"><span class="radio"></span><span>' + opt.label + "</span>";
      div.addEventListener("click", () => {
        $$("#options-container .option").forEach((o) => o.classList.remove("selected"));
        div.classList.add("selected");
        state.respuestas[q.id] = opt.value;
        $("#btn-next").disabled = false;
      });
      box.appendChild(div);
    });
    $("#btn-prev").style.visibility = state.currentQ === 0 ? "hidden" : "visible";
    $("#btn-next").textContent = state.currentQ === total - 1 ? "Ver resultados \u2192" : "Siguiente \u2192";
    $("#btn-next").disabled = state.respuestas[q.id] === undefined;
  }
  $("#btn-start").addEventListener("click", () => {
    state.currentQ = 0;
    state.respuestas = {};
    renderQuestion();
    show("quiz");
  });
  $("#btn-prev").addEventListener("click", () => {
    if (state.currentQ > 0) {
      state.currentQ--;
      renderQuestion();
    }
  });
  $("#btn-next").addEventListener("click", () => {
    if (state.respuestas[PREGUNTAS[state.currentQ].id] === undefined) return;
    if (state.currentQ < PREGUNTAS.length - 1) {
      state.currentQ++;
      renderQuestion();
    } else show("gate");
  });
  $("#gate-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#form-error");
    err.style.display = "none";
    const nombre = $("#f-nombre").value.trim();
    const correo = $("#f-correo").value.trim();
    if (!nombre || !correo) {
      err.textContent = "Nombre y correo institucional son obligatorios.";
      err.style.display = "block";
      return;
    }
    if (!$("#f-consent").checked) {
      err.textContent = "Debes aceptar el Aviso de Privacidad.";
      err.style.display = "block";
      return;
    }
    state.lead = {
      nombre,
      correo,
      cargo: $("#f-cargo").value.trim(),
      entidad: $("#f-entidad").value.trim(),
      telefono: $("#f-telefono").value.trim()
    };
    state.resultado = calcularIVPP(state.respuestas);
    renderResults();
    show("results");
  });
  function scoreColor(score) {
    if (score <= 29) return "#3D7A5A";
    if (score <= 59) return "#D97706";
    return "#B91C1C";
  }
  function renderResults() {
    const r = state.resultado;
    const lead = state.lead;
    $("#ivpp-number").textContent = r.ivpp;
    $("#ivpp-number").style.color = r.color;
    const nivel = $("#nivel-badge");
    nivel.textContent = r.nivel;
    nivel.style.background = r.color + "22";
    nivel.style.color = r.color;
    nivel.style.border = "1px solid " + r.color;
    $("#interpretacion").textContent = r.interpretacion;
    $("#user-greeting").textContent = lead.nombre ? "Hola, " + lead.nombre.split(" ")[0] : "Tu diagnóstico";
    const list = $("#vicios-list");
    list.innerHTML = "";
    r.vicios.forEach((v) => {
      const div = document.createElement("div");
      div.className = "vicio-item";
      div.innerHTML = '<div class="top"><span class="nombre">' + v.nombre + '</span><span class="score" style="color:' + scoreColor(v.score) + '">' + v.score + '/100</span></div><div class="vicio-bar"><div class="fill" style="width:' + v.score + "%;background:" + scoreColor(v.score) + '"></div></div>';
      list.appendChild(div);
    });
    const recs = $("#recomendaciones-list");
    recs.innerHTML = "";
    [...r.vicios].sort((a, b) => b.score - a.score).slice(0, 3).forEach((v) => {
      const li = document.createElement("li");
      li.textContent = "Prioriza \u201c" + v.nombre + "\u201d (" + v.score + "/100). " + v.descripcion;
      recs.appendChild(li);
    });
  }
  $("#link-privacy").addEventListener("click", (e) => {
    e.preventDefault();
    $("#privacy-modal").classList.add("open");
  });
  $("#btn-close-privacy").addEventListener("click", () => $("#privacy-modal").classList.remove("open"));
  $("#btn-pdf").addEventListener("click", () => window.print());
  show("landing");
})();
