(function () {
  const D = window.CATU_IERF;
  const STORE = "catu-monitor-ierf-v2";
  const state = { answers: new Array(15).fill(null), stage: 1, hideLegal: false, screen: "home" };
  const $ = (id) => document.getElementById(id);

  function load() {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (Array.isArray(s.answers) && s.answers.length === 15) state.answers = s.answers;
      if (s.hideLegal) state.hideLegal = true;
      if (s.stage >= 1 && s.stage <= 5) state.stage = s.stage;
    } catch (_) {}
  }
  function persist() {
    localStorage.setItem(STORE, JSON.stringify({ answers: state.answers, hideLegal: state.hideLegal, stage: state.stage }));
  }
  function answeredCount() { return state.answers.filter(Boolean).length; }
  function stageScore(stageId) {
    const qs = D.questions.filter((q) => q.stage === stageId);
    const vals = qs.map((q) => state.answers[q.id - 1]).filter(Boolean);
    if (!vals.length) return null;
    return (vals.reduce((a, b) => a + b.pts, 0) / (qs.length * 10)) * 100;
  }
  function ierf() {
    let acc = 0;
    D.stages.forEach((st) => {
      const s = stageScore(st.id);
      acc += (s === null ? 0 : s) * D.weights[st.id];
    });
    return Math.round(acc);
  }
  function bandOf(score, n) {
    if (n < D.minAnswersToInterpret) return D.bands.pending;
    if (score <= 25) return D.bands.low;
    if (score <= 60) return D.bands.mid;
    return D.bands.high;
  }
  function tone(score, n) {
    if (n < D.minAnswersToInterpret) return "pending";
    if (score <= 25) return "ok";
    if (score <= 60) return "warn";
    return "crit";
  }
  function findings() {
    return D.questions.map((q, i) => {
      const a = state.answers[i];
      if (!a) return null;
      return { q, a, pts: a.pts };
    }).filter(Boolean).sort((x, y) => y.pts - x.pts || y.q.stage - x.q.stage).filter((x) => x.pts > 0).slice(0, 3);
  }
  function setScreen(name, hash) {
    state.screen = name;
    document.querySelectorAll(".screen").forEach((el) => el.classList.toggle("active", el.id === "screen-" + name));
    $("sticky").classList.toggle("show", name !== "home");
    if (hash) history.replaceState(null, "", hash);
    updateSticky();
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  function updateSticky() {
    const n = answeredCount();
    const score = ierf();
    const t = tone(score, n);
    $("sticky-count").textContent = n + " / 15";
    $("sticky-score").textContent = n === 0 ? "\u2014" : String(score);
    $("sticky-hint").textContent = n < D.minAnswersToInterpret ? "Semáforo a partir de 8 reactivos" : bandOf(score, n).badge;
    const bar = $("sticky-bar");
    bar.className = "bar " + t;
    bar.querySelector("span").style.width = (n === 0 ? 0 : score) + "%";
  }
  function renderHome() {
    const n = answeredCount();
    $("home-resume").style.display = n ? "inline-flex" : "none";
    $("home-resume").textContent = n === 15 ? "Ver dictamen" : "Reanudar diagnóstico (" + n + "/15)";
  }
  function renderStage() {
    const st = D.stages[state.stage - 1];
    $("legal").classList.toggle("collapsed", state.hideLegal);
    $("toggle-legal").textContent = state.hideLegal ? "Mostrar marco legal" : "Ocultar marco";
    $("legal-law").textContent = st.law;
    $("legal-title").textContent = "Etapa " + st.id + " \u00b7 " + st.title;
    $("legal-desc").textContent = st.desc;
    $("legal-items").innerHTML = st.items.map((it) => "<li>" + it + "</li>").join("");
    document.querySelectorAll(".pipe").forEach((el) => {
      const id = Number(el.dataset.stage);
      const done = D.questions.filter((q) => q.stage === id).every((q) => state.answers[q.id - 1]);
      el.classList.toggle("active", id === state.stage);
      el.classList.toggle("done", done && id !== state.stage);
    });
    const qs = D.questions.filter((q) => q.stage === st.id);
    $("questions").innerHTML = qs.map((q) => {
      const sel = state.answers[q.id - 1];
      const opts = q.options.map((op) => {
        let cls = "opt";
        if (sel && sel.key === op.key) cls += op.pts === 0 ? " sel-low" : op.pts === 5 ? " sel-mid" : " sel-high";
        return "<button type=\"button\" class=\"" + cls + "\" data-qid=\"" + q.id + "\" data-key=\"" + op.key + "\" data-pts=\"" + op.pts + "\"><span class=\"key\">" + op.key + "</span><span class=\"txt\">" + op.text + "</span></button>";
      }).join("");
      return "<article class=\"q-card\"><div class=\"q-meta\"><span class=\"q-id\">Reactivo " + String(q.id).padStart(2, "0") + "</span><span class=\"q-law\">" + q.law + "</span></div><h4>" + q.text + "</h4><div class=\"options\">" + opts + "</div></article>";
    }).join("");
    $("btn-prev").disabled = state.stage === 1;
    $("btn-next").textContent = state.stage === 5 ? "Ver dictamen" : "Siguiente etapa";
    $("btn-next").disabled = state.stage < 5 && !qs.every((q) => state.answers[q.id - 1]);
    $("stage-progress").textContent = "Etapa " + st.id + " de 5 \u00b7 peso " + st.weight + "% del IERF";
  }
  function renderResult() {
    const n = answeredCount();
    const score = ierf();
    const band = bandOf(score, n);
    const t = tone(score, n);
    $("ring").style.setProperty("--p", n === 0 ? 0 : score);
    $("ring-val").textContent = n === 0 ? "\u2014" : String(score);
    $("verdict-badge").textContent = band.badge;
    $("verdict-badge").className = "chip " + (t === "pending" ? "" : t);
    $("verdict-title").textContent = band.title;
    $("verdict-desc").textContent = band.desc;
    $("chip-risk").textContent = band.risk;
    $("chip-action").textContent = band.action;
    $("chip-n").textContent = n + " de 15 reactivos";
    $("stage-bars").innerHTML = D.stages.map((st) => {
      const s = stageScore(st.id);
      const empty = s === null;
      const w = empty ? 0 : s;
      const col = empty ? "var(--border)" : s <= 25 ? "var(--ok)" : s <= 60 ? "var(--warn)" : "var(--crit)";
      return "<div class=\"sbar\"><div class=\"top\"><strong>E" + st.id + " " + st.short + " \u00b7 " + st.weight + "%</strong><span>" + (empty ? "Sin datos" : Math.round(s) + " / 100") + "</span></div><div class=\"track\"><i style=\"width:" + w + "%;background:" + col + "\"></i></div></div>";
    }).join("");
    const f = findings();
    $("findings").innerHTML = f.length ? f.map((x) => {
      const opt = x.q.options.find((o) => o.key === x.a.key);
      return "<article class=\"find\"><div class=\"tag\">E" + x.q.stage + " \u00b7 " + (x.pts === 10 ? "Crítico" : "Atención") + " \u00b7 " + x.q.law + "</div><h4>" + x.q.text + "</h4><p>Estado declarado: " + x.a.key + ") " + (opt ? opt.text : "") + "</p></article>";
    }).join("") : "<article class=\"find\"><div class=\"tag\">Sin hallazgos graves</div><h4>No hay opciones B o C registradas</h4><p>Complete el diagnóstico o revise etapas en blanco.</p></article>";
    $("form-score").value = n < D.minAnswersToInterpret ? "Parcial " + score : String(score);
    $("form-level").value = band.badge;
    $("asf-bars").innerHTML = D.asf.bars.map((b) => "<div class=\"inc-bar" + (b.pct >= 55 ? " hot" : "") + "\"><span>" + b.label + "</span><div class=\"track\"><i style=\"width:" + b.pct + "%\"></i></div><strong>" + b.pct + "%</strong></div>").join("");
  }
  function choose(qid, key, pts) {
    state.answers[qid - 1] = { key, pts: Number(pts) };
    persist(); renderStage(); updateSticky();
  }
  function goStage(n) {
    state.stage = Math.min(5, Math.max(1, n));
    persist(); renderStage(); setScreen("stage", "#ciclo-informativo");
  }
  function routeFromHash() {
    const h = (location.hash || "").replace("#", "");
    if (h === "ciclo-informativo" || h === "diagnostico" || h === "seccion-evaluacion") { renderStage(); setScreen("stage", "#ciclo-informativo"); return; }
    if (h === "resultado" || h === "hero-ierf") { renderResult(); setScreen("resultado", "#resultado"); return; }
    if (h === "hallazgos-asf") { renderResult(); setScreen("resultado", "#hallazgos-asf"); return; }
    if (h === "lead-form-section" || h === "dictamen") { renderResult(); setScreen("lead", "#lead-form-section"); return; }
    renderHome(); setScreen("home", "#inicio");
  }
  function handleSubmit(ev) {
    ev.preventDefault();
    const form = $("lead-form");
    const data = new FormData(form);
    data.set("ierf", $("form-score").value);
    data.set("nivel", $("form-level").value);
    fetch(D.formspree, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then((res) => { if (!res.ok) throw new Error("fail"); form.style.display = "none"; $("lead-ok").classList.add("show"); })
      .catch(() => { form.style.display = "none"; $("lead-ok").classList.add("show"); });
  }
  document.addEventListener("click", (e) => {
    const opt = e.target.closest(".opt");
    if (opt) choose(Number(opt.dataset.qid), opt.dataset.key, opt.dataset.pts);
    const pipe = e.target.closest(".pipe");
    if (pipe) goStage(Number(pipe.dataset.stage));
  });
  $("btn-start").addEventListener("click", () => { state.stage = 1; goStage(1); });
  $("home-resume").addEventListener("click", () => {
    if (answeredCount() === 15) { renderResult(); setScreen("resultado", "#resultado"); }
    else goStage(state.stage || 1);
  });
  $("btn-skip-legal-home").addEventListener("click", () => { state.hideLegal = true; persist(); goStage(state.stage || 1); });
  $("toggle-legal").addEventListener("click", () => { state.hideLegal = !state.hideLegal; persist(); renderStage(); });
  $("btn-prev").addEventListener("click", () => goStage(state.stage - 1));
  $("btn-next").addEventListener("click", () => {
    if (state.stage === 5) { renderResult(); setScreen("resultado", "#resultado"); }
    else goStage(state.stage + 1);
  });
  $("btn-to-lead").addEventListener("click", () => setScreen("lead", "#lead-form-section"));
  $("btn-print").addEventListener("click", () => window.print());
  $("btn-share").addEventListener("click", () => {
    navigator.clipboard.writeText(location.origin + location.pathname).then(() => {
      $("btn-share").textContent = "Enlace copiado";
      setTimeout(() => { $("btn-share").textContent = "Compartir herramienta"; }, 1600);
    });
  });
  $("btn-reset").addEventListener("click", () => {
    if (!confirm("¿Borrar las respuestas de este navegador y empezar de cero?")) return;
    state.answers = new Array(15).fill(null); state.stage = 1; persist();
    renderHome(); setScreen("home", "#inicio");
  });
  $("lead-back").addEventListener("click", () => { renderResult(); setScreen("resultado", "#resultado"); });
  $("lead-form").addEventListener("submit", handleSubmit);
  $("privacy-toggle").addEventListener("click", (e) => { e.preventDefault(); $("privacy").classList.toggle("show"); });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
  window.addEventListener("offline", () => $("offline-badge").classList.add("show"));
  window.addEventListener("online", () => $("offline-badge").classList.remove("show"));
  if (!navigator.onLine) $("offline-badge").classList.add("show");
  window.addEventListener("hashchange", routeFromHash);
  load(); routeFromHash(); renderHome(); updateSticky();
})();
