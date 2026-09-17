const VICIOS = [
  { id: "extemporaneidad", nombre: "Extemporaneidad", peso: 0.20, descripcion: "Registros desfasados detectables por timestamps en BESOP.", color: "#B91C1C" },
  { id: "ambiguedad", nombre: "Ambigüedad de redacción", peso: 0.20, descripcion: "Notas genéricas que impiden comprobar la ejecución real.", color: "#C45C26" },
  { id: "acreditacion", nombre: "Falta de acreditación", peso: 0.18, descripcion: "Instrucciones giradas por personal no facultado.", color: "#D97706" },
  { id: "anticipos", nombre: "Omisión / descalce de anticipos", peso: 0.15, descripcion: "Descalces en amortizaciones de anticipo.", color: "#CA8A04" },
  { id: "calidad", nombre: "Descalce de calidad", peso: 0.15, descripcion: "Estimaciones sin folio de laboratorio.", color: "#A16207" },
  { id: "cierre", nombre: "Cierre inexistente", peso: 0.12, descripcion: "Finiquito con bitácora abierta (Art. 126 RLOPSRM).", color: "#854D0E" }
];
const OPCIONES = [
  { value: 0, label: "Siempre / Casi siempre", corto: "Siempre" },
  { value: 50, label: "A veces", corto: "A veces" },
  { value: 100, label: "Rara vez / Nunca", corto: "Rara vez" },
  { value: 70, label: "No aplica / No sé", corto: "No sé" }
];
const PREGUNTAS = [
  { id: "q1", vicio: "extemporaneidad", texto: "¿Las notas de bitácora se registran el mismo día en que ocurre el hecho o la instrucción?", ayuda: "Los timestamps de BESOP son evidencia objetiva para la ASF." },
  { id: "q2", vicio: "extemporaneidad", texto: "¿Existe un control interno que verifique que no haya desfase entre la fecha del hecho y el registro digital?", ayuda: "Un checklist de conciliación reduce observaciones por extemporaneidad." },
  { id: "q3", vicio: "extemporaneidad", texto: "Cuando hay retrasos en el registro, ¿se documenta la causa en la propia bitácora?", ayuda: "La justificación no elimina el desfase, pero demuestra diligencia." },
  { id: "q4", vicio: "ambiguedad", texto: "¿Las notas incluyen tramo, cantidades físicas y referencia a planos o conceptos?", ayuda: "S.T.A.R.T. exige que un tercero pueda reconstruir la ejecución." },
  { id: "q5", vicio: "ambiguedad", texto: "¿Se evitan frases genéricas del tipo “se avanzó conforme a programa”?", ayuda: "Las frases genéricas generan presunción de pagos en exceso." },
  { id: "q6", vicio: "ambiguedad", texto: "¿Las notas permiten reconstruir qué se ejecutó, dónde, con qué resultado y bajo qué instrucción?", ayuda: "Si no supera la prueba de terceros ajenos, el riesgo es alto." },
  { id: "q7", vicio: "acreditacion", texto: "¿Todas las instrucciones las emite personal acreditado desde la nota de apertura?", ayuda: "Personal no facultado puede invalidar actos." },
  { id: "q8", vicio: "acreditacion", texto: "¿Hay control que impida que personal no facultado gire instrucciones o apruebe estimaciones?", ayuda: "La nota de apertura ancla la cadena de facultades." },
  { id: "q9", vicio: "anticipos", texto: "¿Las amortizaciones de anticipo se registran concurrentes con las estimaciones?", ayuda: "Hallazgo recurrente en informes de la ASF." },
  { id: "q10", vicio: "anticipos", texto: "¿Se documenta el saldo pendiente de amortizar y su vínculo con el avance físico?", ayuda: "La trazabilidad del anticipo debe vivir en la bitácora." },
  { id: "q11", vicio: "calidad", texto: "¿Antes de aprobar una estimación se verifica el folio del reporte de laboratorio?", ayuda: "Estimación sin soporte de calidad es de las observaciones más costosas." },
  { id: "q12", vicio: "calidad", texto: "¿Las notas hacen referencia explícita a resultados de laboratorio cuando aplica?", ayuda: "La vinculación nota-laboratorio cierra la trazabilidad técnica." },
  { id: "q13", vicio: "calidad", texto: "¿Existe un procedimiento que impida aprobar conceptos sin soporte de calidad?", ayuda: "El control preventivo evita la corrección posterior." },
  { id: "q14", vicio: "cierre", texto: "¿Al firmar el finiquito la bitácora está cerrada conforme al Art. 126 RLOPSRM o equivalente?", ayuda: "Finiquito con bitácora abierta es un vicio formal detectable." },
  { id: "q15", vicio: "cierre", texto: "¿Se verifica que no queden notas abiertas antes del finiquito?", ayuda: "El cierre ordenado es el último escudo preventivo." }
];
function calcularIVPP(respuestas) {
  const scoresPorVicio = {};
  VICIOS.forEach(v => { scoresPorVicio[v.id] = { suma: 0, count: 0 }; });
  PREGUNTAS.forEach(p => {
    const valor = respuestas[p.id];
    if (valor !== undefined && valor !== null) {
      scoresPorVicio[p.vicio].suma += Number(valor);
      scoresPorVicio[p.vicio].count += 1;
    }
  });
  let ivpp = 0;
  const desglose = VICIOS.map(v => {
    const data = scoresPorVicio[v.id];
    const score = data.count > 0 ? Math.round(data.suma / data.count) : 70;
    const ponderado = score * v.peso;
    ivpp += ponderado;
    return { id: v.id, nombre: v.nombre, score, peso: v.peso, ponderado: Math.round(ponderado * 10) / 10, color: v.color, descripcion: v.descripcion };
  });
  ivpp = Math.round(ivpp);
  let nivel, color, interpretacion;
  if (ivpp <= 29) { nivel = "Verde"; color = "#3D7A5A"; interpretacion = "Riesgo bajo. Control preventivo razonable."; }
  else if (ivpp <= 59) { nivel = "Amarillo"; color = "#D97706"; interpretacion = "Riesgo medio. Hay vulnerabilidades detectables."; }
  else { nivel = "Rojo"; color = "#B91C1C"; interpretacion = "Riesgo alto. Alta probabilidad de observaciones o PRAS."; }
  return { ivpp, nivel, color, interpretacion, vicios: desglose };
}
