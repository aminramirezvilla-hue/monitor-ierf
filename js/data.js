/* Monitor IERF – CATU · datos del ciclo, reactivos y radiografía */
window.CATU_IERF = {
  weights: { 1: 0.15, 2: 0.15, 3: 0.15, 4: 0.40, 5: 0.15 },
  minAnswersToInterpret: 8,
  formspree: "https://formspree.io/f/mljebgql",
  contactEmail: "centro.catu@gmail.com",
  stages: [
    { id: 1, short: "Planeación", title: "Planeación y Proyecto Ejecutivo", weight: 15, law: "Arts. 18, 21 y 24 LOPSRM · Art. 23 RLOPSRM", desc: "Antes de licitar, el ente debe tener Proyecto Ejecutivo concluido, memorias, estudios de geotecnia y liberación legal del predio.", items: ["Dictamen de liberación de derecho de vía o escritura (Art. 19 LOPSRM).", "Estudios geotécnicos, topográficos e hidrológicos validados.", "MIA y licencias municipales vigentes.", "Análisis costo-beneficio en cartera de inversión."] },
    { id: 2, short: "Presupuesto", title: "Presupuestación y Programación (PAO)", weight: 15, law: "Arts. 21 y 23 LOPSRM · Cartera de inversión", desc: "Toda obra debe estar inscrita en el PAO con suficiencia presupuestal, para evitar suspensiones por falta de flujo.", items: ["Oficio de autorización presupuestal e integración al PAO.", "Catálogo con unidades de medida y volúmenes verificados.", "Calendario de ejecución y erogaciones programadas.", "Dictamen de factibilidad técnica y económica."] },
    { id: 3, short: "Contratación", title: "Licitación, adjudicación y contrato", weight: 15, law: "Arts. 27, 31, 38, 44 y 45 RLOPSRM", desc: "Imparcialidad en la adjudicación: requisitos técnicos (Art. 44), económicos (Art. 45-A/B) y fianzas alineadas al contrato.", items: ["Dictamen de excepción fundado si no hubo licitación pública.", "FASAR integrado con jornada impositiva.", "Carta de disponibilidad de maquinaria.", "Fianzas de anticipo, cumplimiento y vicios ocultos."] },
    { id: 4, short: "Ejecución", title: "Ejecución, supervisión y bitácora BESOP", weight: 40, law: "Arts. 24-III, 113 y 115 RLOPSRM", desc: "Fase con mayor incidencia resarcitoria. Exige residencia designada por escrito, BESOP al día y generadores con croquis.", items: ["Oficios de Residencia y Superintendencia.", "Bitácora electrónica continua, sin rezago.", "Estimaciones con generadores, croquis y fotografías.", "Laboratorio independiente acreditado."] },
    { id: 5, short: "Cierre", title: "Entrega-recepción y finiquito", weight: 15, law: "Art. 64 LOPSRM · Art. 164 RLOPSRM", desc: "Cierre del vínculo: acta de entrega-recepción en 10 días posteriores a la conclusión física y finiquito de saldos.", items: ["Aviso escrito de terminación física.", "Acta circunstanciada con Residencia, contratista y OIC.", "Finiquito que extingue derechos y obligaciones.", "Fianza de vicios ocultos vigente 12 meses."] }
  ],
  questions: [
    { id: 1, stage: 1, law: "Art. 23 RLOPSRM", text: "¿Cuenta con el Proyecto Ejecutivo 100% firmado por especialistas antes de licitar?", options: [
      { key: "A", text: "Proyecto completo con memorias y planos firmados", pts: 0 },
      { key: "B", text: "Proyecto básico; se ajusta sobre la marcha", pts: 5 },
      { key: "C", text: "Sin proyecto formal; solo croquis de catálogo", pts: 10 }
    ]},
    { id: 2, stage: 1, law: "Art. 19 LOPSRM", text: "¿Posee acreditación jurídica del predio o liberación formal del derecho de vía?", options: [
      { key: "A", text: "Escrituras públicas o convenios formalizados", pts: 0 },
      { key: "B", text: "En trámite notarial o acuerdo verbal", pts: 5 },
      { key: "C", text: "Sin documentación o con conflicto ejidal activo", pts: 10 }
    ]},
    { id: 3, stage: 1, law: "Art. 21 LOPSRM", text: "¿Cuenta con Manifestación de Impacto Ambiental y licencias aprobadas?", options: [
      { key: "A", text: "Permisos y MIA autorizados antes del inicio", pts: 0 },
      { key: "B", text: "En trámite, con trabajos físicos ya iniciados", pts: 5 },
      { key: "C", text: "Sin trámites de impacto ambiental ni licencias", pts: 10 }
    ]},
    { id: 4, stage: 2, law: "Art. 21 LOPSRM", text: "¿La obra está autorizada e inscrita en el Programa Anual de Obras (PAO)?", options: [
      { key: "A", text: "Aprobada en PAO original con oficio financiero", pts: 0 },
      { key: "B", text: "Incluida por modificación al PAO sin dictamen", pts: 5 },
      { key: "C", text: "Obra emergente no registrada en el PAO", pts: 10 }
    ]},
    { id: 5, stage: 2, law: "Art. 24 RLOPSRM", text: "¿El catálogo de conceptos tiene volúmenes debidamente conciliados?", options: [
      { key: "A", text: "Levantamiento exacto con números generadores", pts: 0 },
      { key: "B", text: "Estimación aproximada; habrán volúmenes extra", pts: 5 },
      { key: "C", text: "Volúmenes alzados sin soporte de cálculo", pts: 10 }
    ]},
    { id: 6, stage: 2, law: "Art. 24 LOPSRM", text: "¿Se verificó la suficiencia presupuestal antes de emitir la convocatoria?", options: [
      { key: "A", text: "Suficiencia presupuestal total respaldada", pts: 0 },
      { key: "B", text: "Suficiencia parcial sujeta a ministraciones", pts: 5 },
      { key: "C", text: "Iniciada sin asignación presupuestal formal", pts: 10 }
    ]},
    { id: 7, stage: 3, law: "Art. 42 LOPSRM", text: "¿La adjudicación directa o invitación restringida tiene dictamen de excepción?", options: [
      { key: "A", text: "Licitación pública o excepción autorizada", pts: 0 },
      { key: "B", text: "Invitación restringida con firmas incompletas", pts: 5 },
      { key: "C", text: "Adjudicación directa sin fundamento de comité", pts: 10 }
    ]},
    { id: 8, stage: 3, law: "Art. 45-A RLOPSRM", text: "¿El FASAR se calculó conforme a la jornada impositiva legal?", options: [
      { key: "A", text: "FASAR con cuotas IMSS y tabulador legal", pts: 0 },
      { key: "B", text: "Discrepancias en días pagados vs. laborados", pts: 5 },
      { key: "C", text: "Factor global sin desglose ni memoria", pts: 10 }
    ]},
    { id: 9, stage: 3, law: "Art. 48 LOPSRM", text: "¿Las fianzas de anticipo y cumplimiento corresponden al contrato?", options: [
      { key: "A", text: "Fianzas emitidas, vigentes y montos correctos", pts: 0 },
      { key: "B", text: "Entregadas con desfase de fechas o nombres", pts: 5 },
      { key: "C", text: "Sin fianzas o montos inferiores a los legales", pts: 10 }
    ]},
    { id: 10, stage: 4, law: "Art. 113 RLOPSRM", text: "¿Cómo se administra el registro en la Bitácora Electrónica (BESOP)?", options: [
      { key: "A", text: "Notas de apertura, avance y cierre al día", pts: 0 },
      { key: "B", text: "Llenado quincenal o mensual acumulado", pts: 5 },
      { key: "C", text: "Inexistente, sin firmas o llena al final", pts: 10 }
    ]},
    { id: 11, stage: 4, law: "Art. 132 RLOPSRM", text: "¿Las estimaciones autorizadas tienen generadores, croquis y fotos?", options: [
      { key: "A", text: "Generadores con croquis y soporte fotográfico", pts: 0 },
      { key: "B", text: "Números sin croquis de ubicación", pts: 5 },
      { key: "C", text: "Pagos globales sin soporte técnico", pts: 10 }
    ]},
    { id: 12, stage: 4, law: "Normas SCT / ORFIS", text: "¿La calidad de materiales está respaldada por laboratorio independiente?", options: [
      { key: "A", text: "Pruebas de laboratorio acreditado por lote", pts: 0 },
      { key: "B", text: "Solo certificados del proveedor", pts: 5 },
      { key: "C", text: "Sin ensayos de resistencia concreto/asfalto", pts: 10 }
    ]},
    { id: 13, stage: 5, law: "Art. 164 RLOPSRM", text: "¿Se formalizó el acta de entrega-recepción en los 10 días posteriores a la conclusión?", options: [
      { key: "A", text: "Acta circunstanciada firmada en tiempo", pts: 0 },
      { key: "B", text: "Obra en uso; acta firmada extemporáneamente", pts: 5 },
      { key: "C", text: "Obra inconclusa o usada sin acta formal", pts: 10 }
    ]},
    { id: 14, stage: 5, law: "Art. 64 LOPSRM", text: "¿Se elaboró el finiquito extinguiendo derechos y obligaciones?", options: [
      { key: "A", text: "Finiquito formalizado con saldo en cero o devuelto", pts: 0 },
      { key: "B", text: "Acta de finiquito en borrador, sin firma", pts: 5 },
      { key: "C", text: "Sin finiquito tras más de 60 días de concluida", pts: 10 }
    ]},
    { id: 15, stage: 5, law: "Art. 66 LOPSRM", text: "¿Se exigió fianza de vicios ocultos vigente 12 meses antes del finiquito?", options: [
      { key: "A", text: "Fianza de vicios ocultos entregada y autorizada", pts: 0 },
      { key: "B", text: "Sustituida por carta de retención provisional", pts: 5 },
      { key: "C", text: "Sin fianza; obra desprotegida", pts: 10 }
    ]}
  ],
  asf: {
    bars: [
      { label: "E1 Proyecto incompleto", pct: 36 },
      { label: "E1 Predio no liberado", pct: 22 },
      { label: "E3 FASAR / APU mal integrado", pct: 45 },
      { label: "E4 Bitácora BESOP extemporánea", pct: 68 },
      { label: "E4 Estimaciones sin croquis", pct: 55 },
      { label: "E5 Retraso de finiquito", pct: 28 }
    ]
  },
  bands: {
    pending: { badge: "Dictamen pendiente", title: "Aún no hay base suficiente", desc: "Responda al menos 8 reactivos para emitir un semáforo. El 0 inicial no significa obra solvente.", risk: "Sin calificar", action: "Completar diagnóstico" },
    low: { badge: "Exposición baja", title: "Expediente sustancialmente alineado", desc: "El expediente técnico-financiero cumple en lo sustancial con LOPSRM y RLOPSRM. Mantenga custodia preventiva de bitácora y cierre.", risk: "Bajo · 0 a 25", action: "Custodia BESOP preventiva" },
    mid: { badge: "Alerta de pliego", title: "Vulnerabilidad por omisiones documentales", desc: "Hay deficiencias en generadores, FASAR, predio o bitácora. Alta probabilidad de pliego de observaciones o PRAS.", risk: "Medio · 26 a 60", action: "Auditoría preventiva CATU" },
    high: { badge: "Crítico / resarcitorio", title: "Alta exposición a presunto daño patrimonial", desc: "Faltan piezas graves: proyecto ejecutivo, predio, estimaciones o finiquito. Priorice solventación antes de la visita.", risk: "Alto · 61 a 100", action: "Solventación técnico-legal" }
  }
};
