const EJERCICIOS_CONFIG = {
  gustos_aversiones: {
    titulo: "Gustos / Aversiones",
    descripcion: "Escribe lo que te gusta y no te gusta del tema. Para cada elemento, identifica la necesidad subyacente (aprobación, control o seguridad) y libérala.",
    columnaIzquierda: "Gustos",
    columnaDerecha: "Aversiones",
    placeholderIzquierda: "¿Qué te gusta?",
    placeholderDerecha: "¿Qué no te gusta?",
    clave: "soltar_ejercicio_gustos_aversiones_v1"
  },
  ventajas_inconvenientes: {
    titulo: "Ventajas / Inconvenientes",
    descripcion: "Escribe las ventajas e inconvenientes que tiene el tema para ti. Para cada elemento, identifica la necesidad subyacente y libérala.",
    columnaIzquierda: "Ventajas",
    columnaDerecha: "Inconvenientes",
    placeholderIzquierda: "¿Qué ventajas tiene?",
    placeholderDerecha: "¿Qué inconvenientes tiene?",
    clave: "soltar_ejercicio_ventajas_inconvenientes_v1"
  },
  limpieza: {
    titulo: "Procedimiento de Limpieza",
    descripcion: "Limpia sentimientos pendientes respecto a una persona. Responde cada serie de preguntas hasta sentir aceptación y cariño.",
    clave: "soltar_ejercicio_limpieza_v1"
  }
};

const DESEOS_EJERCICIO = [
  { id: "no_se", nombre: "No identificado" },
  { id: "aprobacion", nombre: "Aprobación" },
  { id: "control", nombre: "Control" },
  { id: "seguridad", nombre: "Seguridad" },
  { id: "separacion", nombre: "Separación" }
];

let ejercicioActivo = null;

const LIMPIEZA_FASES = [
  {
    id: "control",
    titulo: "Control",
    preguntas: [
      { texto: "¿Esa persona intentó controlarte?", tipo: "si_no" },
      { texto: "¿Intentaste tú controlar a esa persona?", tipo: "si_no" },
      { texto: "¿Le concedes ahora a esta persona el derecho de ser como es?", tipo: "decision" }
    ]
  },
  {
    id: "aprobacion",
    titulo: "Aprobación",
    preguntas: [
      { texto: "¿Te disgustaba o desaprobabas algo de esa persona?", tipo: "si_no" },
      { texto: "¿A esa persona le disgustaba o desaprobaba algo de ti?", tipo: "si_no" },
      { texto: "¿Sólo tienes sentimientos de cariño/aceptación hacia esa persona?", tipo: "decision" }
    ]
  },
  {
    id: "seguridad",
    titulo: "Seguridad",
    preguntas: [
      { texto: "¿Esa persona te desafió, te amenazó o se enfrentó a ti?", tipo: "si_no" },
      { texto: "¿Desafiaste, amenazaste o te enfrentaste tú a esa persona?", tipo: "si_no" },
      { texto: "¿Tienes ante esa persona únicamente un sentimiento de bienestar, seguridad y confianza?", tipo: "decision" }
    ]
  },
  {
    id: "separacion",
    titulo: "Separación / Unidad",
    preguntas: [
      { texto: "¿Esa persona te rechazó, se alejó de ti o intentó separarse?", tipo: "si_no" },
      { texto: "¿Rechazaste tú a esa persona o intentaste separarte?", tipo: "si_no" },
      { texto: "¿Tienes únicamente un sentimiento de unidad (\"tú eres yo\") con esta persona?", tipo: "decision" }
    ]
  }
];

function abrirEjercicio(tipo) {
  const config = EJERCICIOS_CONFIG[tipo];
  if (!config) return;

  ejercicioActivo = cargarEjercicio(tipo) || {
    tipo: tipo,
    tema: "",
    entradas: []
  };

  renderEjercicio();
  navigateTo("ejercicio-columnas");
}

function cargarEjercicio(tipo) {
  const config = EJERCICIOS_CONFIG[tipo];
  if (!config) return null;

  try {
    return JSON.parse(localStorage.getItem(config.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarEjercicioActual() {
  if (!ejercicioActivo) return;

  const config = EJERCICIOS_CONFIG[ejercicioActivo.tipo];
  if (!config) return;

  localStorage.setItem(config.clave, JSON.stringify(ejercicioActivo));
}

function renderEjercicio() {
  if (!ejercicioActivo) return;

  const config = EJERCICIOS_CONFIG[ejercicioActivo.tipo];
  if (!config) return;

  setText("ejercicioTitulo", config.titulo);
  setText("ejercicioDescripcion", config.descripcion);
  setText("columnaIzqTitulo", config.columnaIzquierda);
  setText("columnaDerTitulo", config.columnaDerecha);

  const temaInput = document.getElementById("ejercicioTema");
  if (temaInput) temaInput.value = ejercicioActivo.tema;

  const izqInput = document.getElementById("columnaIzqInput");
  if (izqInput) izqInput.placeholder = config.placeholderIzquierda;

  const derInput = document.getElementById("columnaDerInput");
  if (derInput) derInput.placeholder = config.placeholderDerecha;

  renderColumna("izquierda");
  renderColumna("derecha");
}

function renderColumna(lado) {
  const listaId = lado === "izquierda" ? "listaIzquierda" : "listaDerecha";
  const container = document.getElementById(listaId);

  if (!container || !ejercicioActivo) return;

  const entradas = ejercicioActivo.entradas.filter(e => e.lado === lado);

  if (!entradas.length) {
    container.innerHTML = '<p class="empty">Todavía no hay elementos.</p>';
    return;
  }

  container.innerHTML = entradas.map(entradaHTML).join("");
}

function entradaHTML(entrada) {
  const opciones = DESEOS_EJERCICIO.map(d =>
    `<option value="${d.id}" ${d.id === entrada.deseo ? "selected" : ""}>${d.nombre}</option>`
  ).join("");

  return `
    <article class="entrada-item ${entrada.liberado ? "liberado" : ""}">
      <p class="entrada-texto">${escapeHTML(entrada.texto)}</p>
      <label class="entrada-deseo-label">
        Necesidad
        <select data-entrada-deseo="${entrada.id}">${opciones}</select>
      </label>
      <div class="entrada-acciones">
        <button type="button" class="button small ${entrada.liberado ? "secondary" : ""}" data-action="toggle-liberado" data-entrada-id="${entrada.id}">
          ${entrada.liberado ? "Liberado ✓" : "Marcar liberado"}
        </button>
        <button type="button" class="delete-button" data-action="borrar-entrada" data-entrada-id="${entrada.id}">
          Borrar
        </button>
      </div>
    </article>
  `;
}

function agregarEntrada(lado) {
  const inputId = lado === "izquierda" ? "columnaIzqInput" : "columnaDerInput";
  const input = document.getElementById(inputId);

  if (!input) return;

  const texto = (input.value || "").trim();
  if (!texto) return;

  ejercicioActivo.entradas.push({
    id: "ent_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    lado: lado,
    texto: texto,
    deseo: "no_se",
    liberado: false
  });

  input.value = "";
  guardarEjercicioActual();
  renderColumna(lado);
}

function toggleLiberado(entradaId) {
  if (!ejercicioActivo) return;

  const entrada = ejercicioActivo.entradas.find(e => e.id === entradaId);
  if (!entrada) return;

  entrada.liberado = !entrada.liberado;
  guardarEjercicioActual();
  renderColumna(entrada.lado);
}

function borrarEntrada(entradaId) {
  if (!ejercicioActivo) return;

  const entrada = ejercicioActivo.entradas.find(e => e.id === entradaId);
  if (!entrada) return;

  if (!confirm("¿Borrar este elemento?")) return;

  ejercicioActivo.entradas = ejercicioActivo.entradas.filter(e => e.id !== entradaId);
  guardarEjercicioActual();
  renderColumna(entrada.lado);
}

function cambiarDeseoEntrada(entradaId, nuevoDeseo) {
  if (!ejercicioActivo) return;

  const entrada = ejercicioActivo.entradas.find(e => e.id === entradaId);
  if (!entrada) return;

  entrada.deseo = nuevoDeseo;
  guardarEjercicioActual();
}

function actualizarTema(nuevoTema) {
  if (!ejercicioActivo) return;

  ejercicioActivo.tema = nuevoTema;
  guardarEjercicioActual();
}

function reiniciarEjercicio() {
  if (!ejercicioActivo) return;

  if (!confirm("¿Reiniciar este ejercicio? Se borrarán todos los elementos.")) return;

  ejercicioActivo.entradas = [];
  ejercicioActivo.tema = "";
  guardarEjercicioActual();
  renderEjercicio();
}

// ===== LIMPIEZA =====

let limpiezaActiva = null;

function abrirLimpieza() {
  const config = EJERCICIOS_CONFIG.limpieza;
  if (!config) return;

  limpiezaActiva = cargarLimpieza() || {
    persona: "",
    fases: LIMPIEZA_FASES.map(f => ({
      id: f.id,
      respuestas: f.preguntas.map(p => ({
        texto: p.texto,
        tipo: p.tipo,
        respuesta: null,
        notas: ""
      })),
      completada: false
    })),
    notas_finales: ""
  };

  renderLimpieza();
  navigateTo("ejercicio-limpieza");
}

function cargarLimpieza() {
  const config = EJERCICIOS_CONFIG.limpieza;
  if (!config) return null;

  try {
    return JSON.parse(localStorage.getItem(config.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarLimpiezaActual() {
  if (!limpiezaActiva) return;

  const config = EJERCICIOS_CONFIG.limpieza;
  if (!config) return;

  localStorage.setItem(config.clave, JSON.stringify(limpiezaActiva));
}

function renderLimpieza() {
  if (!limpiezaActiva) return;

  const personaInput = document.getElementById("limpiezaPersona");
  if (personaInput) personaInput.value = limpiezaActiva.persona;

  const notasFinales = document.getElementById("limpiezaNotasFinales");
  if (notasFinales) notasFinales.value = limpiezaActiva.notas_finales;

  const container = document.getElementById("limpiezaFases");
  if (!container) return;

  container.innerHTML = limpiezaActiva.fases.map(renderFaseLimpieza).join("");
}

function renderFaseLimpieza(fase, index) {
  const preguntasHTML = fase.respuestas.map((resp, pIndex) => {
    let inputHTML = "";

    if (resp.tipo === "si_no") {
      inputHTML = `
        <div class="limpieza-respuesta">
          <button type="button" class="button small ${resp.respuesta === 'si' ? '' : 'secondary'}" 
                  data-action="limpieza-respuesta" data-fase="${index}" data-pregunta="${pIndex}" data-valor="si">
            Sí
          </button>
          <button type="button" class="button small ${resp.respuesta === 'no' ? '' : 'secondary'}" 
                  data-action="limpieza-respuesta" data-fase="${index}" data-pregunta="${pIndex}" data-valor="no">
            No
          </button>
          <button type="button" class="button small ${resp.respuesta === 'todavia_no' ? '' : 'secondary'}" 
                  data-action="limpieza-respuesta" data-fase="${index}" data-pregunta="${pIndex}" data-valor="todavia_no">
            Todavía no
          </button>
        </div>
      `;
    } else if (resp.tipo === "decision") {
      inputHTML = `
        <div class="limpieza-respuesta">
          <button type="button" class="button small ${resp.respuesta === 'si' ? '' : 'secondary'}" 
                  data-action="limpieza-respuesta" data-fase="${index}" data-pregunta="${pIndex}" data-valor="si">
            Sí (decisión tomada)
          </button>
          <button type="button" class="button small ${resp.respuesta === 'no' ? '' : 'secondary'}" 
                  data-action="limpieza-respuesta" data-fase="${index}" data-pregunta="${pIndex}" data-valor="no">
            Todavía no
          </button>
        </div>
      `;
    }

    const notaValue = resp.notas || "";

    return `
      <div class="limpieza-pregunta-card ${resp.respuesta === 'si' && resp.tipo === 'decision' ? 'completada' : ''}">
        <p class="limpieza-pregunta-texto">${escapeHTML(resp.texto)}</p>
        ${inputHTML}
        <label class="limpieza-nota-label">
          Notas (opcional)
          <textarea class="limpieza-nota" 
                    data-fase="${index}" data-pregunta="${pIndex}"
                    placeholder="Anota aquí lo que surja al liberar..."
          >${escapeHTML(notaValue)}</textarea>
        </label>
      </div>
    `;
  }).join("");

  const completadaCheck = fase.completada ? "checked" : "";

  return `
    <div class="card limpieza-fase ${fase.completada ? 'fase-completada' : ''}">
      <h3>${escapeHTML(LIMPIEZA_FASES[index].titulo)}</h3>
      ${preguntasHTML}
      <label class="limpieza-completada-label">
        <input type="checkbox" data-action="limpieza-completar-fase" data-fase="${index}" ${completadaCheck} />
        Marcar fase como completada
      </label>
    </div>
  `;
}

function setLimpiezaRespuesta(faseIndex, preguntaIndex, valor) {
  if (!limpiezaActiva) return;

  limpiezaActiva.fases[faseIndex].respuestas[preguntaIndex].respuesta = valor;
  guardarLimpiezaActual();
  renderLimpieza();
}

function setLimpiezaNota(faseIndex, preguntaIndex, nota) {
  if (!limpiezaActiva) return;

  limpiezaActiva.fases[faseIndex].respuestas[preguntaIndex].notas = nota;
  guardarLimpiezaActual();
}

function toggleFaseCompletada(faseIndex) {
  if (!limpiezaActiva) return;

  limpiezaActiva.fases[faseIndex].completada = !limpiezaActiva.fases[faseIndex].completada;
  guardarLimpiezaActual();
  renderLimpieza();
}

function setLimpiPersona(valor) {
  if (!limpiezaActiva) return;

  limpiezaActiva.persona = valor;
  guardarLimpiezaActual();
}

function setLimpiNotasFinales(valor) {
  if (!limpiezaActiva) return;

  limpiezaActiva.notas_finales = valor;
  guardarLimpiezaActual();
}

function reiniciarLimpieza() {
  if (!limpiezaActiva) return;

  if (!confirm("¿Reiniciar este ejercicio de limpieza? Se borrarán todas las respuestas.")) return;

  const config = EJERCICIOS_CONFIG.limpieza;
  localStorage.removeItem(config.clave);
  abrirLimpieza();
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

// ===== MÓDULO DE MIEDO =====

const RESISTENCIA_CONFIG = {
  titulo: "Liberar la Resistencia",
  descripcion: "La resistencia es como querer avanzar pisando el freno. Este ejercicio te ayuda a identificarla y soltarla en sus distintas formas.",
  clave: "soltar_ejercicio_resistencia_v1"
};

let resistenciaActiva = null;

function abrirResistencia() {
  resistenciaActiva = cargarResistencia() || {
    tareas: [],
    resistoHacer: "",
    soltariaHacer: null,
    soltariaNoHacer: null,
    ejercicioFisicoHecho: false,
    sentimientoResistido: "",
    soltariaSentimiento: null,
    intensidadInicial: 5,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderResistencia();
  navigateTo("ejercicio-resistencia");
}

function cargarResistencia() {
  try {
    return JSON.parse(localStorage.getItem(RESISTENCIA_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarResistenciaActual() {
  if (!resistenciaActiva) return;
  localStorage.setItem(RESISTENCIA_CONFIG.clave, JSON.stringify(resistenciaActiva));
}

function renderResistencia() {
  if (!resistenciaActiva) return;

  // Inicial
  const intInicial = document.getElementById("resistenciaIntensidadInicial");
  if (intInicial) intInicial.value = resistenciaActiva.intensidadInicial;
  const intInicialTxt = document.getElementById("resistenciaIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = resistenciaActiva.intensidadInicial;

  // Tareas
  renderResistenciaTareas();

  // Paso 2
  const hacerInput = document.getElementById("resistenciaHacerInput");
  if (hacerInput) hacerInput.value = resistenciaActiva.resistoHacer || "";

  document.querySelectorAll("[data-resistencia-soltaria-hacer]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.resistenciaSoltariaHacer === resistenciaActiva.soltariaHacer);
  });

  document.querySelectorAll("[data-resistencia-soltaria-no-hacer]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.resistenciaSoltariaNoHacer === resistenciaActiva.soltariaNoHacer);
  });

  // Paso 3
  const fisCheck = document.getElementById("resistenciaEjercicioFisico");
  if (fisCheck) fisCheck.checked = resistenciaActiva.ejercicioFisicoHecho;

  // Paso 4
  const sentInput = document.getElementById("resistenciaSentimientoInput");
  if (sentInput) sentInput.value = resistenciaActiva.sentimientoResistido || "";

  document.querySelectorAll("[data-resistencia-soltaria-sentimiento]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.resistenciaSoltariaSentimiento === resistenciaActiva.soltariaSentimiento);
  });

  // Paso 5
  const intFinal = document.getElementById("resistenciaIntensidadFinal");
  if (intFinal) intFinal.value = resistenciaActiva.intensidadFinal;
  const intFinalTxt = document.getElementById("resistenciaIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = resistenciaActiva.intensidadFinal;

  const benInput = document.getElementById("resistenciaBeneficioInput");
  if (benInput) benInput.value = resistenciaActiva.beneficio || "";
}

function renderResistenciaTareas() {
  const container = document.getElementById("resistenciaTareasLista");
  if (!container) return;

  if (!resistenciaActiva.tareas.length) {
    container.innerHTML = '<p class="empty">Agrega al menos una tarea.</p>';
    return;
  }

  container.innerHTML = resistenciaActiva.tareas.map(tarea => resistenciaTareaHTML(tarea)).join("");
}

function resistenciaTareaHTML(tarea) {
  const opciones = DESEOS_EJERCICIO.map(d =>
    `<option value="${d.id}" ${d.id === tarea.deseo ? "selected" : ""}>${d.nombre}</option>`
  ).join("");

  return `
    <article class="entrada-item ${tarea.liberado ? "liberado" : ""}">
      <p class="entrada-texto">${escapeHTML(tarea.texto)}</p>
      <label>
        Sentimiento actual
        <input type="text" class="resistencia-tarea-sentimiento" data-resistencia-tarea-id="${tarea.id}" value="${escapeHTML(tarea.sentimiento || "")}" placeholder="Ej: enfado, cansancio..." />
      </label>
      <label class="entrada-deseo-label">
        Necesidad
        <select data-resistencia-tarea-deseo="${tarea.id}">${opciones}</select>
      </label>
      <div class="entrada-acciones">
        <button type="button" class="button small ${tarea.liberado ? "secondary" : ""}" data-action="resistencia-toggle-liberado" data-resistencia-tarea-id="${tarea.id}">
          ${tarea.liberado ? "Liberado ✓" : "Marcar liberado"}
        </button>
        <button type="button" class="delete-button" data-action="resistencia-borrar-tarea" data-resistencia-tarea-id="${tarea.id}">
          Borrar
        </button>
      </div>
    </article>
  `;
}

function agregarResistenciaTarea() {
  if (!resistenciaActiva) return;
  const input = document.getElementById("resistenciaTareaInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  resistenciaActiva.tareas.push({
    id: "res_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    sentimiento: "",
    deseo: "no_se",
    liberado: false
  });

  input.value = "";
  guardarResistenciaActual();
  renderResistenciaTareas();
}

function toggleResistenciaTareaLiberado(id) {
  if (!resistenciaActiva) return;
  const tarea = resistenciaActiva.tareas.find(t => t.id === id);
  if (!tarea) return;
  tarea.liberado = !tarea.liberado;
  guardarResistenciaActual();
  renderResistenciaTareas();
}

function borrarResistenciaTarea(id) {
  if (!resistenciaActiva) return;
  if (!confirm("¿Borrar esta tarea?")) return;
  resistenciaActiva.tareas = resistenciaActiva.tareas.filter(t => t.id !== id);
  guardarResistenciaActual();
  renderResistenciaTareas();
}

function setResistenciaTareaCampo(id, campo, valor) {
  if (!resistenciaActiva) return;
  const tarea = resistenciaActiva.tareas.find(t => t.id === id);
  if (!tarea) return;
  tarea[campo] = valor;
  guardarResistenciaActual();
}

function setResistenciaCampo(campo, valor) {
  if (!resistenciaActiva) return;
  resistenciaActiva[campo] = valor;
  guardarResistenciaActual();
}

function setResistenciaIntensidad(tipo, valor) {
  if (!resistenciaActiva) return;
  const num = Number(valor);
  if (tipo === "inicial") {
    resistenciaActiva.intensidadInicial = num;
    const txt = document.getElementById("resistenciaIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    resistenciaActiva.intensidadFinal = num;
    const txt = document.getElementById("resistenciaIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }
  guardarResistenciaActual();
}

function setResistenciaSoltaria(tipo, valor) {
  if (!resistenciaActiva) return;
  if (tipo === "hacer") resistenciaActiva.soltariaHacer = valor;
  else if (tipo === "no_hacer") resistenciaActiva.soltariaNoHacer = valor;
  else if (tipo === "sentimiento") resistenciaActiva.soltariaSentimiento = valor;
  guardarResistenciaActual();
  renderResistencia();
}

function guardarResistenciaEnDiario() {
  if (!resistenciaActiva) return;

  const descripcion = resistenciaActiva.resistoHacer ? "Resistencia a: " + resistenciaActiva.resistoHacer : "Ejercicio de resistencia";

  const sesion = {
    tema: "resistencia",
    descripcion: descripcion,
    emocionInicial: "apatia",
    intensidadInicial: resistenciaActiva.intensidadInicial,
    necesidad: "control",
    emocionFinal: resistenciaActiva.intensidadFinal <= 3 ? "coraje" : "apatia",
    intensidadFinal: resistenciaActiva.intensidadFinal,
    beneficio: resistenciaActiva.beneficio || "",
    tecnica: "resistencia"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(RESISTENCIA_CONFIG.clave);
  resistenciaActiva = null;
  navigateTo("diario", true);
}

function reiniciarResistencia() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(RESISTENCIA_CONFIG.clave);
  abrirResistencia();
}

const MIEDO_CONFIG = {
  titulo: "Liberación del miedo",
  descripcion: "Identifica lo que temes que ocurra y suelta la expectativa de que suceda. A veces, sin darnos cuenta, mantenemos en la mente aquello que tememos.",
  clave: "soltar_ejercicio_miedo_v1"
};

const CULPA_CONFIG = {
  titulo: "Culpa y vergüenza",
  descripcion: "La culpa promete evitar el castigo, pero en realidad lo atrae. Explorá el autocastigo, descubrí qué ganas con él y decidí libremente soltarlo.",
  clave: "soltar_ejercicio_culpa_v1"
};

let miedoActivo = null;

function abrirMiedo() {
  miedoActivo = cargarMiedo() || {
    miedo: "",
    queTemo: "",
    intensidadInicial: 5,
    aceptado: null,
    soltariaExpectativa: null,
    prefieroImaginar: "",
    imagenAlternativa: "",
    intensidadFinal: 5,
    beneficio: "",
    respuestasPreguntas: []
  };

  renderMiedo();
  navigateTo("ejercicio-miedo");
}

function cargarMiedo() {
  try {
    return JSON.parse(localStorage.getItem(MIEDO_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarMiedoActual() {
  if (!miedoActivo) return;
  localStorage.setItem(MIEDO_CONFIG.clave, JSON.stringify(miedoActivo));
}

function renderMiedo() {
  if (!miedoActivo) return;

  setText("miedoTitulo", MIEDO_CONFIG.titulo);
  setText("miedoDescripcion", MIEDO_CONFIG.descripcion);

  const miedoInput = document.getElementById("miedoInput");
  if (miedoInput) miedoInput.value = miedoActivo.miedo || "";

  const queTemoInput = document.getElementById("queTemoInput");
  if (queTemoInput) queTemoInput.value = miedoActivo.queTemo || "";

  const intensidadInicial = document.getElementById("miedoIntensidadInicial");
  if (intensidadInicial) intensidadInicial.value = miedoActivo.intensidadInicial;
  const intensidadInicialTexto = document.getElementById("miedoIntensidadInicialTexto");
  if (intensidadInicialTexto) intensidadInicialTexto.textContent = miedoActivo.intensidadInicial;

  const aceptadoGroup = document.getElementById("miedoAceptadoGroup");
  if (aceptadoGroup) {
    aceptadoGroup.querySelectorAll("[data-miedo-aceptado]").forEach(btn => {
      btn.classList.toggle("active-choice", btn.dataset.miedoAceptado === miedoActivo.aceptado);
    });
  }

  const soltariaGroup = document.getElementById("miedoSoltariaGroup");
  if (soltariaGroup) {
    soltariaGroup.querySelectorAll("[data-miedo-soltaria]").forEach(btn => {
      btn.classList.toggle("active-choice", btn.dataset.miedoSoltaria === miedoActivo.soltariaExpectativa);
    });
  }

  const prefieroInput = document.getElementById("miedoPrefieroInput");
  if (prefieroInput) prefieroInput.value = miedoActivo.prefieroImaginar || "";

  const imagenInput = document.getElementById("miedoImagenInput");
  if (imagenInput) imagenInput.value = miedoActivo.imagenAlternativa || "";

  const intensidadFinal = document.getElementById("miedoIntensidadFinal");
  if (intensidadFinal) intensidadFinal.value = miedoActivo.intensidadFinal;
  const intensidadFinalTexto = document.getElementById("miedoIntensidadFinalTexto");
  if (intensidadFinalTexto) intensidadFinalTexto.textContent = miedoActivo.intensidadFinal;

  const beneficioInput = document.getElementById("miedoBeneficioInput");
  if (beneficioInput) beneficioInput.value = miedoActivo.beneficio || "";
}

function setMiedoCampo(campo, valor) {
  if (!miedoActivo) return;
  miedoActivo[campo] = valor;
  guardarMiedoActual();
}

function setMiedoIntensidad(tipo, valor) {
  if (!miedoActivo) return;
  const num = Number(valor);
  if (tipo === "inicial") {
    miedoActivo.intensidadInicial = num;
    const txt = document.getElementById("miedoIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    miedoActivo.intensidadFinal = num;
    const txt = document.getElementById("miedoIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }
  guardarMiedoActual();
}

function setMiedoAceptado(valor) {
  if (!miedoActivo) return;
  miedoActivo.aceptado = valor;
  guardarMiedoActual();
  renderMiedo();
}

function setMiedoSoltaria(valor) {
  if (!miedoActivo) return;
  miedoActivo.soltariaExpectativa = valor;
  guardarMiedoActual();
  renderMiedo();
}

function guardarMiedoEnDiario() {
  if (!miedoActivo) return;

  const sesion = {
    tema: "miedo",
    descripcion: miedoActivo.miedo + (miedoActivo.queTemo ? " — Temo que: " + miedoActivo.queTemo : ""),
    emocionInicial: "miedo",
    intensidadInicial: miedoActivo.intensidadInicial,
    necesidad: "seguridad",
    emocionFinal: miedoActivo.intensidadFinal <= 3 ? "paz" : "miedo",
    intensidadFinal: miedoActivo.intensidadFinal,
    beneficio: miedoActivo.beneficio || "",
    tecnica: "miedo"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  // Limpiar el ejercicio
  const config = MIEDO_CONFIG;
  localStorage.removeItem(config.clave);
  miedoActivo = null;
  navigateTo("diario", true);
}

function reiniciarMiedo() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  const config = MIEDO_CONFIG;
  localStorage.removeItem(config.clave);
  abrirMiedo();
}

// ===== MÓDULO DE CULPA Y VERGÜENZA =====

let culpaActivo = null;

function abrirCulpa() {
  culpaActivo = cargarCulpa() || {
    situacion: "",
    tipo: "culpa", // culpa | verguenza | ambas
    intensidadInicial: 5,
    // Paso 2: Necesidad subyacente
    usandoPara: null, // aprobacion | control | seguridad | ninguna
    soltariaNecesidad: null,
    // Paso 3: Autocastigo
    castigadoSuficiente: null, // si | no | todavia_no
    decidiriaDejarCastigo: null,
    // Paso 4: Ventajas e inconvenientes del autocastigo
    ventajas: [],
    inconvenientes: [],
    // Paso 5: Verdaderos sentimientos
    enSecretoAlegra: null, // si | no | en_parte
    soltariaDeseoRepetir: null,
    notasAprendizaje: "",
    // Paso 6: Cierre
    intensidadFinal: 5,
    beneficio: ""
  };

  renderCulpa();
  navigateTo("ejercicio-culpa");
}

function cargarCulpa() {
  try {
    return JSON.parse(localStorage.getItem(CULPA_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarCulpaActual() {
  if (!culpaActivo) return;
  localStorage.setItem(CULPA_CONFIG.clave, JSON.stringify(culpaActivo));
}

function renderCulpa() {
  if (!culpaActivo) return;

  setText("culpaTitulo", CULPA_CONFIG.titulo);
  setText("culpaDescripcion", CULPA_CONFIG.descripcion);

  // Paso 1: Situación
  const sitInput = document.getElementById("culpaSituacionInput");
  if (sitInput) sitInput.value = culpaActivo.situacion || "";

  document.querySelectorAll("[data-culpa-tipo]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.culpaTipo === culpaActivo.tipo);
  });

  const intInicial = document.getElementById("culpaIntensidadInicial");
  if (intInicial) intInicial.value = culpaActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("culpaIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = culpaActivo.intensidadInicial;

  // Paso 2: Necesidad subyacente
  document.querySelectorAll("[data-culpa-usando]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.culpaUsando === culpaActivo.usandoPara);
  });

  document.querySelectorAll("[data-culpa-soltaria-nec]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.culpaSoltariaNec === culpaActivo.soltariaNecesidad);
  });

  // Paso 3: Autocastigo
  document.querySelectorAll("[data-culpa-castigado]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.culpaCastigado === culpaActivo.castigadoSuficiente);
  });

  document.querySelectorAll("[data-culpa-decidiria]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.culpaDecidiria === culpaActivo.decidiriaDejarCastigo);
  });

  // Paso 4: Ventajas / Inconvenientes
  renderCulpaListas();

  // Paso 5: Verdaderos sentimientos
  document.querySelectorAll("[data-culpa-secreto]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.culpaSecreto === culpaActivo.enSecretoAlegra);
  });

  document.querySelectorAll("[data-culpa-soltaria-repetir]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.culpaSoltariaRepetir === culpaActivo.soltariaDeseoRepetir);
  });

  const notasInput = document.getElementById("culpaNotasAprendizaje");
  if (notasInput) notasInput.value = culpaActivo.notasAprendizaje || "";

  // Paso 6: Cierre
  const intFinal = document.getElementById("culpaIntensidadFinal");
  if (intFinal) intFinal.value = culpaActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("culpaIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = culpaActivo.intensidadFinal;

  const benInput = document.getElementById("culpaBeneficioInput");
  if (benInput) benInput.value = culpaActivo.beneficio || "";
}

function renderCulpaListas() {
  const ventajasContainer = document.getElementById("culpaVentajasLista");
  const inconvenientesContainer = document.getElementById("culpaInconvenientesLista");

  if (ventajasContainer) {
    if (!culpaActivo.ventajas.length) {
      ventajasContainer.innerHTML = '<p class="empty">Agregá al menos una ventaja.</p>';
    } else {
      ventajasContainer.innerHTML = culpaActivo.ventajas.map(item => culpaItemHTML(item, "ventaja")).join("");
    }
  }

  if (inconvenientesContainer) {
    if (!culpaActivo.inconvenientes.length) {
      inconvenientesContainer.innerHTML = '<p class="empty">Agregá al menos un inconveniente.</p>';
    } else {
      inconvenientesContainer.innerHTML = culpaActivo.inconvenientes.map(item => culpaItemHTML(item, "inconveniente")).join("");
    }
  }
}

function culpaItemHTML(item, tipo) {
  const opciones = DESEOS_EJERCICIO.map(d =>
    `<option value="${d.id}" ${d.id === item.deseo ? "selected" : ""}>${d.nombre}</option>`
  ).join("");

  return `
    <article class="entrada-item ${item.liberado ? "liberado" : ""}">
      <p class="entrada-texto">${escapeHTML(item.texto)}</p>
      <label class="entrada-deseo-label">
        Necesidad detrás
        <select data-culpa-item-deseo="${item.id}" data-culpa-item-tipo="${tipo}">${opciones}</select>
      </label>
      <div class="entrada-acciones">
        <button type="button" class="button small ${item.liberado ? "secondary" : ""}" data-action="culpa-toggle-liberado" data-culpa-item-id="${item.id}" data-culpa-item-tipo="${tipo}">
          ${item.liberado ? "Liberado ✓" : "Marcar liberado"}
        </button>
        <button type="button" class="delete-button" data-action="culpa-borrar-item" data-culpa-item-id="${item.id}" data-culpa-item-tipo="${tipo}">
          Borrar
        </button>
      </div>
    </article>
  `;
}

function setCulpaCampo(campo, valor) {
  if (!culpaActivo) return;
  culpaActivo[campo] = valor;
  guardarCulpaActual();
}

function setCulpaIntensidad(tipo, valor) {
  if (!culpaActivo) return;
  const num = Number(valor);
  if (tipo === "inicial") {
    culpaActivo.intensidadInicial = num;
    const txt = document.getElementById("culpaIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    culpaActivo.intensidadFinal = num;
    const txt = document.getElementById("culpaIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }
  guardarCulpaActual();
}

function setCulpaTipo(valor) {
  if (!culpaActivo) return;
  culpaActivo.tipo = valor;
  guardarCulpaActual();
  renderCulpa();
}

function setCulpaUsando(valor) {
  if (!culpaActivo) return;
  culpaActivo.usandoPara = valor;
  guardarCulpaActual();
  renderCulpa();
}

function setCulpaSoltariaNecesidad(valor) {
  if (!culpaActivo) return;
  culpaActivo.soltariaNecesidad = valor;
  guardarCulpaActual();
  renderCulpa();
}

function setCulpaCastigado(valor) {
  if (!culpaActivo) return;
  culpaActivo.castigadoSuficiente = valor;
  guardarCulpaActual();
  renderCulpa();
}

function setCulpaDecidiria(valor) {
  if (!culpaActivo) return;
  culpaActivo.decidiriaDejarCastigo = valor;
  guardarCulpaActual();
  renderCulpa();
}

function setCulpaSecreto(valor) {
  if (!culpaActivo) return;
  culpaActivo.enSecretoAlegra = valor;
  guardarCulpaActual();
  renderCulpa();
}

function setCulpaSoltariaRepetir(valor) {
  if (!culpaActivo) return;
  culpaActivo.soltariaDeseoRepetir = valor;
  guardarCulpaActual();
  renderCulpa();
}

function agregarCulpaItem(tipo) {
  if (!culpaActivo) return;

  const inputId = tipo === "ventaja" ? "culpaVentajaInput" : "culpaInconvenienteInput";
  const input = document.getElementById(inputId);
  if (!input) return;

  const texto = (input.value || "").trim();
  if (!texto) return;

  const nuevo = {
    id: "culpa_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  };

  if (tipo === "ventaja") {
    culpaActivo.ventajas.push(nuevo);
  } else {
    culpaActivo.inconvenientes.push(nuevo);
  }

  input.value = "";
  guardarCulpaActual();
  renderCulpaListas();
}

function toggleCulpaItemLiberado(itemId, tipo) {
  if (!culpaActivo) return;
  const lista = tipo === "ventaja" ? culpaActivo.ventajas : culpaActivo.inconvenientes;
  const item = lista.find(i => i.id === itemId);
  if (!item) return;

  item.liberado = !item.liberado;
  guardarCulpaActual();
  renderCulpaListas();
}

function borrarCulpaItem(itemId, tipo) {
  if (!culpaActivo) return;
  if (!confirm("¿Borrar este elemento?")) return;

  if (tipo === "ventaja") {
    culpaActivo.ventajas = culpaActivo.ventajas.filter(i => i.id !== itemId);
  } else {
    culpaActivo.inconvenientes = culpaActivo.inconvenientes.filter(i => i.id !== itemId);
  }

  guardarCulpaActual();
  renderCulpaListas();
}

function setCulpaItemDeseo(itemId, tipo, nuevoDeseo) {
  if (!culpaActivo) return;
  const lista = tipo === "ventaja" ? culpaActivo.ventajas : culpaActivo.inconvenientes;
  const item = lista.find(i => i.id === itemId);
  if (!item) return;

  item.deseo = nuevoDeseo;
  guardarCulpaActual();
}

function guardarCulpaEnDiario() {
  if (!culpaActivo) return;

  const sesion = {
    tema: "culpa",
    descripcion: culpaActivo.situacion + (culpaActivo.tipo ? " (" + culpaActivo.tipo + ")" : ""),
    emocionInicial: "pena",
    intensidadInicial: culpaActivo.intensidadInicial,
    necesidad: culpaActivo.usandoPara || "no_se",
    emocionFinal: culpaActivo.intensidadFinal <= 3 ? "aceptacion" : "pena",
    intensidadFinal: culpaActivo.intensidadFinal,
    beneficio: culpaActivo.beneficio || "",
    tecnica: "culpa_verguenza"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(CULPA_CONFIG.clave);
  culpaActivo = null;
  navigateTo("diario", true);
}

function reiniciarCulpa() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(CULPA_CONFIG.clave);
  abrirCulpa();
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", handleEjerciciosClick);
  document.addEventListener("change", handleEjerciciosChange);
  document.addEventListener("input", handleEjerciciosInput);
});

function handleEjerciciosClick(event) {
  const abrirBtn = event.target.closest('[data-action="abrir-ejercicio"]');
  if (abrirBtn) {
    const tipo = abrirBtn.dataset.ejercicio;
    if (tipo === "limpieza") {
      abrirLimpieza();
    } else {
      abrirEjercicio(tipo);
    }
    return;
  }

  const agregarBtn = event.target.closest('[data-action="agregar-entrada"]');
  if (agregarBtn) {
    const lado = agregarBtn.dataset.lado;
    agregarEntrada(lado);
    return;
  }

  const toggleBtn = event.target.closest('[data-action="toggle-liberado"]');
  if (toggleBtn) {
    const entradaId = toggleBtn.dataset.entradaId;
    toggleLiberado(entradaId);
    return;
  }

  const borrarBtn = event.target.closest('[data-action="borrar-entrada"]');
  if (borrarBtn) {
    const entradaId = borrarBtn.dataset.entradaId;
    borrarEntrada(entradaId);
    return;
  }

  const reiniciarBtn = event.target.closest('[data-action="reiniciar-ejercicio"]');
  if (reiniciarBtn) {
    reiniciarEjercicio();
    return;
  }

  // Limpieza: respuestas a preguntas
  const limpiezaRespBtn = event.target.closest('[data-action="limpieza-respuesta"]');
  if (limpiezaRespBtn) {
    const fase = parseInt(limpiezaRespBtn.dataset.fase);
    const pregunta = parseInt(limpiezaRespBtn.dataset.pregunta);
    const valor = limpiezaRespBtn.dataset.valor;
    setLimpiezaRespuesta(fase, pregunta, valor);
    return;
  }

  // Limpieza: completar fase
  const limpiezaCompletarBtn = event.target.closest('[data-action="limpieza-completar-fase"]');
  if (limpiezaCompletarBtn) {
    const fase = parseInt(limpiezaCompletarBtn.dataset.fase);
    toggleFaseCompletada(fase);
    return;
  }

  const reiniciarLimpBtn = event.target.closest('[data-action="reiniciar-limpieza"]');
  if (reiniciarLimpBtn) {
    reiniciarLimpieza();
    return;
  }

  // Resistencia: abrir
  const abrirResistenciaBtn = event.target.closest('[data-action="abrir-resistencia"]');
  if (abrirResistenciaBtn) {
    abrirResistencia();
    return;
  }

  // Resistencia: agregar tarea
  const agregarResistenciaBtn = event.target.closest('[data-action="resistencia-agregar-tarea"]');
  if (agregarResistenciaBtn) {
    agregarResistenciaTarea();
    return;
  }

  // Resistencia: toggle liberado tarea
  const toggleResistenciaBtn = event.target.closest('[data-action="resistencia-toggle-liberado"]');
  if (toggleResistenciaBtn) {
    toggleResistenciaTareaLiberado(toggleResistenciaBtn.dataset.resistenciaTareaId);
    return;
  }

  // Resistencia: borrar tarea
  const borrarResistenciaBtn = event.target.closest('[data-action="resistencia-borrar-tarea"]');
  if (borrarResistenciaBtn) {
    borrarResistenciaTarea(borrarResistenciaBtn.dataset.resistenciaTareaId);
    return;
  }

  // Resistencia: ejercicio físico
  const resistenciaFisicoCheck = event.target.closest('[data-action="resistencia-ejercicio-fisico"]');
  if (resistenciaFisicoCheck) {
    setResistenciaCampo("ejercicioFisicoHecho", resistenciaFisicoCheck.checked);
    return;
  }

  // Resistencia: botones soltaria
  const resistenciaSoltariaHacerBtn = event.target.closest('[data-resistencia-soltaria-hacer]');
  if (resistenciaSoltariaHacerBtn) {
    setResistenciaSoltaria("hacer", resistenciaSoltariaHacerBtn.dataset.resistenciaSoltariaHacer);
    return;
  }

  const resistenciaSoltariaNoHacerBtn = event.target.closest('[data-resistencia-soltaria-no-hacer]');
  if (resistenciaSoltariaNoHacerBtn) {
    setResistenciaSoltaria("no_hacer", resistenciaSoltariaNoHacerBtn.dataset.resistenciaSoltariaNoHacer);
    return;
  }

  const resistenciaSoltariaSentimientoBtn = event.target.closest('[data-resistencia-soltaria-sentimiento]');
  if (resistenciaSoltariaSentimientoBtn) {
    setResistenciaSoltaria("sentimiento", resistenciaSoltariaSentimientoBtn.dataset.resistenciaSoltariaSentimiento);
    return;
  }

  // Resistencia: guardar en diario
  const guardarResistenciaBtn = event.target.closest('[data-action="guardar-resistencia-diario"]');
  if (guardarResistenciaBtn) {
    guardarResistenciaEnDiario();
    return;
  }

  // Resistencia: reiniciar
  const reiniciarResistenciaBtn = event.target.closest('[data-action="reiniciar-resistencia"]');
  if (reiniciarResistenciaBtn) {
    reiniciarResistencia();
    return;
  }

  // Miedo: abrir
  const abrirMiedoBtn = event.target.closest('[data-action="abrir-miedo"]');
  if (abrirMiedoBtn) {
    abrirMiedo();
    return;
  }

  // Culpa: abrir
  const abrirCulpaBtn = event.target.closest('[data-action="abrir-culpa"]');
  if (abrirCulpaBtn) {
    abrirCulpa();
    return;
  }

  // Culpa: botones de opción
  const culpaTipoBtn = event.target.closest('[data-culpa-tipo]');
  if (culpaTipoBtn) {
    setCulpaTipo(culpaTipoBtn.dataset.culpaTipo);
    return;
  }

  const culpaUsandoBtn = event.target.closest('[data-culpa-usando]');
  if (culpaUsandoBtn) {
    setCulpaUsando(culpaUsandoBtn.dataset.culpaUsando);
    return;
  }

  const culpaSoltariaNecBtn = event.target.closest('[data-culpa-soltaria-nec]');
  if (culpaSoltariaNecBtn) {
    setCulpaSoltariaNecesidad(culpaSoltariaNecBtn.dataset.culpaSoltariaNec);
    return;
  }

  const culpaCastigadoBtn = event.target.closest('[data-culpa-castigado]');
  if (culpaCastigadoBtn) {
    setCulpaCastigado(culpaCastigadoBtn.dataset.culpaCastigado);
    return;
  }

  const culpaDecidiriaBtn = event.target.closest('[data-culpa-decidiria]');
  if (culpaDecidiriaBtn) {
    setCulpaDecidiria(culpaDecidiriaBtn.dataset.culpaDecidiria);
    return;
  }

  const culpaSecretoBtn = event.target.closest('[data-culpa-secreto]');
  if (culpaSecretoBtn) {
    setCulpaSecreto(culpaSecretoBtn.dataset.culpaSecreto);
    return;
  }

  const culpaSoltariaRepetirBtn = event.target.closest('[data-culpa-soltaria-repetir]');
  if (culpaSoltariaRepetirBtn) {
    setCulpaSoltariaRepetir(culpaSoltariaRepetirBtn.dataset.culpaSoltariaRepetir);
    return;
  }

  // Culpa: agregar ventaja/inconveniente
  const agregarVentajaBtn = event.target.closest('[data-action="culpa-agregar-ventaja"]');
  if (agregarVentajaBtn) {
    agregarCulpaItem("ventaja");
    return;
  }

  const agregarInconvBtn = event.target.closest('[data-action="culpa-agregar-inconveniente"]');
  if (agregarInconvBtn) {
    agregarCulpaItem("inconveniente");
    return;
  }

  const culpaToggleBtn = event.target.closest('[data-action="culpa-toggle-liberado"]');
  if (culpaToggleBtn) {
    toggleCulpaItemLiberado(culpaToggleBtn.dataset.culpaItemId, culpaToggleBtn.dataset.culpaItemTipo);
    return;
  }

  const culpaBorrarBtn = event.target.closest('[data-action="culpa-borrar-item"]');
  if (culpaBorrarBtn) {
    borrarCulpaItem(culpaBorrarBtn.dataset.culpaItemId, culpaBorrarBtn.dataset.culpaItemTipo);
    return;
  }

  const guardarCulpaBtn = event.target.closest('[data-action="guardar-culpa-diario"]');
  if (guardarCulpaBtn) {
    guardarCulpaEnDiario();
    return;
  }

  const reiniciarCulpaBtn = event.target.closest('[data-action="reiniciar-culpa"]');
  if (reiniciarCulpaBtn) {
    reiniciarCulpa();
    return;
  }

  // Miedo: respuestas a preguntas
  const miedoAceptadoBtn = event.target.closest('[data-miedo-aceptado]');
  if (miedoAceptadoBtn) {
    setMiedoAceptado(miedoAceptadoBtn.dataset.miedoAceptado);
    return;
  }

  const miedoSoltariaBtn = event.target.closest('[data-miedo-soltaria]');
  if (miedoSoltariaBtn) {
    setMiedoSoltaria(miedoSoltariaBtn.dataset.miedoSoltaria);
    return;
  }

  // Miedo: guardar en diario
  const guardarMiedoBtn = event.target.closest('[data-action="guardar-miedo-diario"]');
  if (guardarMiedoBtn) {
    guardarMiedoEnDiario();
    return;
  }

  // Miedo: reiniciar
  const reiniciarMiedoBtn = event.target.closest('[data-action="reiniciar-miedo"]');
  if (reiniciarMiedoBtn) {
    reiniciarMiedo();
    return;
  }

  // ===== OBJETIVOS: event handlers =====

  // Abrir desde técnica
  const abrirObjetivosBtn = event.target.closest('[data-action="abrir-objetivos"]');
  if (abrirObjetivosBtn) {
    abrirObjetivos();
    return;
  }

  // Nuevo objetivo
  const nuevoObjBtn = event.target.closest('[data-action="objetivos-nuevo"]');
  if (nuevoObjBtn) {
    nuevoObjetivo();
    return;
  }

  // Editar objetivo
  const editarObjBtn = event.target.closest('[data-action="objetivo-editar"]');
  if (editarObjBtn) {
    editarObjetivo(editarObjBtn.dataset.objetivoId);
    return;
  }

  // Eliminar objetivo
  const eliminarObjBtn = event.target.closest('[data-action="objetivo-eliminar"]');
  if (eliminarObjBtn) {
    eliminarObjetivo(eliminarObjBtn.dataset.objetivoId);
    return;
  }

  // Paso 1: siguiente → determinar
  const siguienteDeterminarBtn = event.target.closest('[data-action="objetivo-siguiente-determinar"]');
  if (siguienteDeterminarBtn) {
    if (objetivoActivo && !objetivoActivo.texto) {
      alert("Escribí primero el objetivo.");
      return;
    }
    navigateTo("objetivo-determinar");
    return;
  }

  // Volver a lista
  const volverListaBtn = event.target.closest('[data-action="objetivo-volver-lista"]');
  if (volverListaBtn) {
    objetivoActivo = null;
    navigateTo("ejercicio-objetivos");
    return;
  }

  // Paso 2: agregar liberación
  const agregarLibBtn = event.target.closest('[data-action="objetivo-agregar-liberacion"]');
  if (agregarLibBtn) {
    agregarLiberacionObjetivo();
    return;
  }

  // Paso 2: toggle liberación
  const toggleLibBtn = event.target.closest('[data-action="objetivo-toggle-liberacion"]');
  if (toggleLibBtn) {
    toggleLiberacionObjetivo(toggleLibBtn.dataset.libId);
    return;
  }

  // Paso 2: borrar liberación
  const borrarLibBtn = event.target.closest('[data-action="objetivo-borrar-liberacion"]');
  if (borrarLibBtn) {
    borrarLiberacionObjetivo(borrarLibBtn.dataset.libId);
    return;
  }

  // Paso 2: estado final
  const estadoBtn = event.target.closest('[data-objetivo-estado]');
  if (estadoBtn) {
    setObjetivoEstado(estadoBtn.dataset.objetivoEstado);
    return;
  }

  // Paso 2: siguiente → actuar
  const siguienteActuarBtn = event.target.closest('[data-action="objetivo-siguiente-actuar"]');
  if (siguienteActuarBtn) {
    navigateTo("objetivo-actuar");
    return;
  }

  // Paso 2: volver → formulación
  const volverFormulacionBtn = event.target.closest('[data-action="objetivo-volver-formulacion"]');
  if (volverFormulacionBtn) {
    navigateTo("objetivo-formulacion");
    return;
  }

  // Paso 3: agregar acción
  const agregarAccBtn = event.target.closest('[data-action="objetivo-agregar-accion"]');
  if (agregarAccBtn) {
    agregarAccionObjetivo();
    return;
  }

  // Paso 3: toggle acción
  const toggleAccBtn = event.target.closest('[data-action="objetivo-toggle-accion"]');
  if (toggleAccBtn) {
    toggleAccionObjetivo(toggleAccBtn.dataset.accionId);
    return;
  }

  // Paso 3: borrar acción
  const borrarAccBtn = event.target.closest('[data-action="objetivo-borrar-accion"]');
  if (borrarAccBtn) {
    borrarAccionObjetivo(borrarAccBtn.dataset.accionId);
    return;
  }

  // Paso 3: siguiente → visualizar
  const siguienteVisualBtn = event.target.closest('[data-action="objetivo-siguiente-visualizar"]');
  if (siguienteVisualBtn) {
    navigateTo("objetivo-visualizar");
    return;
  }

  // Paso 3: volver → determinar
  const volverDeterminarBtn = event.target.closest('[data-action="objetivo-volver-determinar"]');
  if (volverDeterminarBtn) {
    navigateTo("objetivo-determinar");
    return;
  }

  // Paso 4: agregar objeción
  const agregarObjBtn = event.target.closest('[data-action="objetivo-agregar-objecion"]');
  if (agregarObjBtn) {
    agregarObjecionObjetivo();
    return;
  }

  // Paso 4: toggle objeción
  const toggleObjBtn = event.target.closest('[data-action="objetivo-toggle-objecion"]');
  if (toggleObjBtn) {
    toggleObjecionObjetivo(toggleObjBtn.dataset.objecionId);
    return;
  }

  // Paso 4: borrar objeción
  const borrarObjBtn = event.target.closest('[data-action="objetivo-borrar-objecion"]');
  if (borrarObjBtn) {
    borrarObjecionObjetivo(borrarObjBtn.dataset.objecionId);
    return;
  }

  // Paso 4: acepta visualización
  const aceptaVisBtn = event.target.closest('[data-objetivo-acepta-visualizacion]');
  if (aceptaVisBtn) {
    setObjetivoAceptaVisualizacion(aceptaVisBtn.dataset.objetivoAceptaVisualizacion);
    return;
  }

  // Paso 4: guardar completo
  const guardarCompBtn = event.target.closest('[data-action="objetivo-guardar-completo"]');
  if (guardarCompBtn) {
    guardarObjetivoCompleto();
    return;
  }

  // Paso 4: volver → actuar
  const volverActuarBtn = event.target.closest('[data-action="objetivo-volver-actuar"]');
  if (volverActuarBtn) {
    navigateTo("objetivo-actuar");
    return;
  }

  // ===== HÁBITOS: event handlers =====

  // Abrir desde técnica
  const abrirHabitosBtn = event.target.closest('[data-action="abrir-habitos"]');
  if (abrirHabitosBtn) {
    abrirHabitos();
    return;
  }

  // ===== DINERO / ABUNDANCIA: event handlers =====

  // Abrir desde técnica
  const abrirDineroBtn = event.target.closest('[data-action="abrir-dinero"]');
  if (abrirDineroBtn) {
    abrirDinero();
    return;
  }

  // Paso 1: botones soltaria
  const dineroSoltariaPadresBtn = event.target.closest('[data-dinero-soltaria-padres]');
  if (dineroSoltariaPadresBtn) {
    setDineroSoltaria("padres", dineroSoltariaPadresBtn.dataset.dineroSoltariaPadres);
    return;
  }

  const dineroSoltariaImitarBtn = event.target.closest('[data-dinero-soltaria-imitar]');
  if (dineroSoltariaImitarBtn) {
    setDineroSoltaria("imitar", dineroSoltariaImitarBtn.dataset.dineroSoltariaImitar);
    return;
  }

  // Paso 2: agregar miedo
  const agregarDineroMiedoBtn = event.target.closest('[data-action="dinero-agregar-miedo"]');
  if (agregarDineroMiedoBtn) {
    agregarDineroMiedo();
    return;
  }

  // Paso 2: toggle miedo
  const toggleDineroMiedoBtn = event.target.closest('[data-action="dinero-toggle-miedo"]');
  if (toggleDineroMiedoBtn) {
    toggleDineroMiedo(toggleDineroMiedoBtn.dataset.dineroMiedoId);
    return;
  }

  // Paso 2: borrar miedo
  const borrarDineroMiedoBtn = event.target.closest('[data-action="dinero-borrar-miedo"]');
  if (borrarDineroMiedoBtn) {
    borrarDineroMiedo(borrarDineroMiedoBtn.dataset.dineroMiedoId);
    return;
  }

  // Paso 3: limpieza respuestas
  const dineroLimpiezaRespBtn = event.target.closest('[data-action="dinero-limpieza-respuesta"]');
  if (dineroLimpiezaRespBtn) {
    const fase = parseInt(dineroLimpiezaRespBtn.dataset.fase);
    const pregunta = parseInt(dineroLimpiezaRespBtn.dataset.pregunta);
    const valor = dineroLimpiezaRespBtn.dataset.valor;
    setDineroLimpiezaRespuesta(fase, pregunta, valor);
    return;
  }

  // Paso 4: agregar gusto
  const agregarDineroGustoBtn = event.target.closest('[data-action="dinero-agregar-gusto"]');
  if (agregarDineroGustoBtn) {
    agregarDineroItem("gusto");
    return;
  }

  // Paso 4: agregar aversión
  const agregarDineroAversionBtn = event.target.closest('[data-action="dinero-agregar-aversion"]');
  if (agregarDineroAversionBtn) {
    agregarDineroItem("aversion");
    return;
  }

  // Paso 5: agregar ventaja
  const agregarDineroVentajaBtn = event.target.closest('[data-action="dinero-agregar-ventaja"]');
  if (agregarDineroVentajaBtn) {
    agregarDineroItem("ventaja");
    return;
  }

  // Paso 5: agregar inconveniente
  const agregarDineroInconvenienteBtn = event.target.closest('[data-action="dinero-agregar-inconveniente"]');
  if (agregarDineroInconvenienteBtn) {
    agregarDineroItem("inconveniente");
    return;
  }

  // Paso 4 y 5: toggle item
  const toggleDineroItemBtn = event.target.closest('[data-action="dinero-toggle-item"]');
  if (toggleDineroItemBtn) {
    toggleDineroItem(toggleDineroItemBtn.dataset.dineroItemId, toggleDineroItemBtn.dataset.dineroItemTipo);
    return;
  }

  // Paso 4 y 5: borrar item
  const borrarDineroItemBtn = event.target.closest('[data-action="dinero-borrar-item"]');
  if (borrarDineroItemBtn) {
    borrarDineroItem(borrarDineroItemBtn.dataset.dineroItemId, borrarDineroItemBtn.dataset.dineroItemTipo);
    return;
  }

  // Paso 6: agregar objeción
  const agregarDineroObjecionBtn = event.target.closest('[data-action="dinero-agregar-objecion"]');
  if (agregarDineroObjecionBtn) {
    agregarDineroObjecion();
    return;
  }

  // Paso 6: toggle objeción
  const toggleDineroObjecionBtn = event.target.closest('[data-action="dinero-toggle-objecion"]');
  if (toggleDineroObjecionBtn) {
    toggleDineroObjecion(toggleDineroObjecionBtn.dataset.dineroObjecionId);
    return;
  }

  // Paso 6: borrar objeción
  const borrarDineroObjecionBtn = event.target.closest('[data-action="dinero-borrar-objecion"]');
  if (borrarDineroObjecionBtn) {
    borrarDineroObjecion(borrarDineroObjecionBtn.dataset.dineroObjecionId);
    return;
  }

  // Paso 6: acepta abundancia
  const dineroAceptaAbundanciaBtn = event.target.closest('[data-dinero-acepta-abundancia]');
  if (dineroAceptaAbundanciaBtn) {
    setDineroAceptaAbundancia(dineroAceptaAbundanciaBtn.dataset.dineroAceptaAbundancia);
    return;
  }

  // Paso 7: guardar en diario
  const guardarDineroBtn = event.target.closest('[data-action="guardar-dinero-diario"]');
  if (guardarDineroBtn) {
    guardarDineroEnDiario();
    return;
  }

  // Paso 7: reiniciar
  const reiniciarDineroBtn = event.target.closest('[data-action="reiniciar-dinero"]');
  if (reiniciarDineroBtn) {
    reiniciarDinero();
    return;
  }

  // ===== RELACIONES: event handlers =====

  // Abrir desde técnica
  const abrirRelacionesBtn = event.target.closest('[data-action="abrir-relaciones"]');
  if (abrirRelacionesBtn) {
    abrirRelaciones();
    return;
  }

  // Paso 4: abrir procedimiento de limpieza (reutiliza el ejercicio de limpieza)
  const relacionesAbrirLimpiezaBtn = event.target.closest('[data-action="relaciones-abrir-limpieza"]');
  if (relacionesAbrirLimpiezaBtn) {
    abrirRelacionesLimpieza();
    return;
  }

  // Paso 1: deseo de aprobación/control/seguridad con los padres
  const relacionesDeseoPadresBtn = event.target.closest('[data-relaciones-deseo-padres]');
  if (relacionesDeseoPadresBtn) {
    setRelacionesDeseoPadres(relacionesDeseoPadresBtn.dataset.relacionesDeseoPadres);
    return;
  }

  // Paso 1: soltaría cambiarlo
  const relacionesSoltariaPadresBtn = event.target.closest('[data-relaciones-soltaria-padres]');
  if (relacionesSoltariaPadresBtn) {
    setRelacionesSoltariaPadres(relacionesSoltariaPadresBtn.dataset.relacionesSoltariaPadres);
    return;
  }

  // Paso 6: soltaría lo del desacuerdo
  const relacionesSoltariaDesacuerdoBtn = event.target.closest('[data-relaciones-soltaria-desacuerdo]');
  if (relacionesSoltariaDesacuerdoBtn) {
    setRelacionesSoltariaDesacuerdo(relacionesSoltariaDesacuerdoBtn.dataset.relacionesSoltariaDesacuerdo);
    return;
  }

  // Paso 7: acepta relación ideal
  const relacionesAceptaIdealBtn = event.target.closest('[data-relaciones-acepta-ideal]');
  if (relacionesAceptaIdealBtn) {
    setRelacionesAceptaIdeal(relacionesAceptaIdealBtn.dataset.relacionesAceptaIdeal);
    return;
  }

  // Paso 2: agregar miedo
  const agregarRelacionesMiedoBtn = event.target.closest('[data-action="relaciones-agregar-miedo"]');
  if (agregarRelacionesMiedoBtn) {
    agregarRelacionesMiedo();
    return;
  }

  // Paso 2: toggle miedo
  const toggleRelacionesMiedoBtn = event.target.closest('[data-action="relaciones-toggle-miedo"]');
  if (toggleRelacionesMiedoBtn) {
    toggleRelacionesMiedo(toggleRelacionesMiedoBtn.dataset.relacionesMiedoId);
    return;
  }

  // Paso 2: borrar miedo
  const borrarRelacionesMiedoBtn = event.target.closest('[data-action="relaciones-borrar-miedo"]');
  if (borrarRelacionesMiedoBtn) {
    borrarRelacionesMiedo(borrarRelacionesMiedoBtn.dataset.relacionesMiedoId);
    return;
  }

  // Paso 3: agregar gusto / aversión
  const agregarRelacionesGustoBtn = event.target.closest('[data-action="relaciones-agregar-gusto"]');
  if (agregarRelacionesGustoBtn) {
    agregarRelacionesItem("gusto");
    return;
  }

  const agregarRelacionesAversionBtn = event.target.closest('[data-action="relaciones-agregar-aversion"]');
  if (agregarRelacionesAversionBtn) {
    agregarRelacionesItem("aversion");
    return;
  }

  // Paso 3: toggle / borrar item
  const toggleRelacionesItemBtn = event.target.closest('[data-action="relaciones-toggle-item"]');
  if (toggleRelacionesItemBtn) {
    toggleRelacionesItem(toggleRelacionesItemBtn.dataset.relacionesItemId, toggleRelacionesItemBtn.dataset.relacionesItemTipo);
    return;
  }

  const borrarRelacionesItemBtn = event.target.closest('[data-action="relaciones-borrar-item"]');
  if (borrarRelacionesItemBtn) {
    borrarRelacionesItem(borrarRelacionesItemBtn.dataset.relacionesItemId, borrarRelacionesItemBtn.dataset.relacionesItemTipo);
    return;
  }

  // Paso 5: lista interna
  const agregarRelacionesListaBtn = event.target.closest('[data-action="relaciones-agregar-lista"]');
  if (agregarRelacionesListaBtn) {
    agregarRelacionesLista();
    return;
  }

  const toggleRelacionesListaBtn = event.target.closest('[data-action="relaciones-toggle-lista"]');
  if (toggleRelacionesListaBtn) {
    toggleRelacionesLista(toggleRelacionesListaBtn.dataset.relacionesListaId);
    return;
  }

  const borrarRelacionesListaBtn = event.target.closest('[data-action="relaciones-borrar-lista"]');
  if (borrarRelacionesListaBtn) {
    borrarRelacionesLista(borrarRelacionesListaBtn.dataset.relacionesListaId);
    return;
  }

  // Paso 7: objeciones
  const agregarRelacionesObjecionBtn = event.target.closest('[data-action="relaciones-agregar-objecion"]');
  if (agregarRelacionesObjecionBtn) {
    agregarRelacionesObjecion();
    return;
  }

  const toggleRelacionesObjecionBtn = event.target.closest('[data-action="relaciones-toggle-objecion"]');
  if (toggleRelacionesObjecionBtn) {
    toggleRelacionesObjecion(toggleRelacionesObjecionBtn.dataset.relacionesObjecionId);
    return;
  }

  const borrarRelacionesObjecionBtn = event.target.closest('[data-action="relaciones-borrar-objecion"]');
  if (borrarRelacionesObjecionBtn) {
    borrarRelacionesObjecion(borrarRelacionesObjecionBtn.dataset.relacionesObjecionId);
    return;
  }

  // Paso 8: guardar en diario
  const guardarRelacionesBtn = event.target.closest('[data-action="guardar-relaciones-diario"]');
  if (guardarRelacionesBtn) {
    guardarRelacionesEnDiario();
    return;
  }

  // Paso 8: reiniciar
  const reiniciarRelacionesBtn = event.target.closest('[data-action="reiniciar-relaciones"]');
  if (reiniciarRelacionesBtn) {
    reiniciarRelaciones();
    return;
  }

  // ===== SALUD: event handlers =====

  // Abrir desde técnica
  const abrirSaludBtn = event.target.closest('[data-action="abrir-salud"]');
  if (abrirSaludBtn) {
    abrirSalud();
    return;
  }

  // Paso 6: abrir procedimiento de limpieza (reutiliza el ejercicio de limpieza)
  const saludAbrirLimpiezaBtn = event.target.closest('[data-action="salud-abrir-limpieza"]');
  if (saludAbrirLimpiezaBtn) {
    abrirSaludLimpieza();
    return;
  }

  // Botones de elección (pasos, aceptaciones, soltarías)
  for (const c of SALUD_CHOICES) {
    const btn = event.target.closest("[" + c.attr + "]");
    if (btn) {
      setSaludChoice(c.campo, btn.getAttribute(c.attr));
      return;
    }
  }

  // Paso 1: agregar miedo
  const agregarSaludMiedoBtn = event.target.closest('[data-action="salud-agregar-miedo"]');
  if (agregarSaludMiedoBtn) {
    agregarSaludMiedo();
    return;
  }

  // Paso 1: toggle / borrar miedo
  const toggleSaludMiedoBtn = event.target.closest('[data-action="salud-toggle-miedo"]');
  if (toggleSaludMiedoBtn) {
    toggleSaludMiedo(toggleSaludMiedoBtn.dataset.saludMiedoId);
    return;
  }

  const borrarSaludMiedoBtn = event.target.closest('[data-action="salud-borrar-miedo"]');
  if (borrarSaludMiedoBtn) {
    borrarSaludMiedo(borrarSaludMiedoBtn.dataset.saludMiedoId);
    return;
  }

  // Paso 5 y 7: agregar items
  const agregarSaludGustoBtn = event.target.closest('[data-action="salud-agregar-gusto"]');
  if (agregarSaludGustoBtn) {
    agregarSaludItem("gusto");
    return;
  }

  const agregarSaludAversionBtn = event.target.closest('[data-action="salud-agregar-aversion"]');
  if (agregarSaludAversionBtn) {
    agregarSaludItem("aversion");
    return;
  }

  const agregarSaludVentajaBtn = event.target.closest('[data-action="salud-agregar-ventaja"]');
  if (agregarSaludVentajaBtn) {
    agregarSaludItem("ventaja");
    return;
  }

  const agregarSaludInconvenienteBtn = event.target.closest('[data-action="salud-agregar-inconveniente"]');
  if (agregarSaludInconvenienteBtn) {
    agregarSaludItem("inconveniente");
    return;
  }

  // Paso 5 y 7: toggle / borrar item
  const toggleSaludItemBtn = event.target.closest('[data-action="salud-toggle-item"]');
  if (toggleSaludItemBtn) {
    toggleSaludItem(toggleSaludItemBtn.dataset.saludItemId, toggleSaludItemBtn.dataset.saludItemTipo);
    return;
  }

  const borrarSaludItemBtn = event.target.closest('[data-action="salud-borrar-item"]');
  if (borrarSaludItemBtn) {
    borrarSaludItem(borrarSaludItemBtn.dataset.saludItemId, borrarSaludItemBtn.dataset.saludItemTipo);
    return;
  }

  // Paso 8: objeciones
  const agregarSaludObjecionBtn = event.target.closest('[data-action="salud-agregar-objecion"]');
  if (agregarSaludObjecionBtn) {
    agregarSaludObjecion();
    return;
  }

  const toggleSaludObjecionBtn = event.target.closest('[data-action="salud-toggle-objecion"]');
  if (toggleSaludObjecionBtn) {
    toggleSaludObjecion(toggleSaludObjecionBtn.dataset.saludObjecionId);
    return;
  }

  const borrarSaludObjecionBtn = event.target.closest('[data-action="salud-borrar-objecion"]');
  if (borrarSaludObjecionBtn) {
    borrarSaludObjecion(borrarSaludObjecionBtn.dataset.saludObjecionId);
    return;
  }

  // Paso 9: guardar en diario
  const guardarSaludBtn = event.target.closest('[data-action="guardar-salud-diario"]');
  if (guardarSaludBtn) {
    guardarSaludEnDiario();
    return;
  }

  // Paso 9: reiniciar
  const reiniciarSaludBtn = event.target.closest('[data-action="reiniciar-salud"]');
  if (reiniciarSaludBtn) {
    reiniciarSalud();
    return;
  }

  // ===== TRABAJO: event handlers =====

  // Abrir desde técnica
  const abrirTrabajoBtn = event.target.closest('[data-action="abrir-trabajo"]');
  if (abrirTrabajoBtn) {
    abrirTrabajo();
    return;
  }

  // Paso 6: abrir procedimiento de limpieza
  const trabajoAbrirLimpiezaBtn = event.target.closest('[data-action="trabajo-abrir-limpieza"]');
  if (trabajoAbrirLimpiezaBtn) {
    abrirTrabajoLimpieza();
    return;
  }

  // Botones de elección
  for (const c of TRABAJO_CHOICES) {
    const btn = event.target.closest("[" + c.attr + "]");
    if (btn) {
      setTrabajoChoice(c.campo, btn.getAttribute(c.attr));
      return;
    }
  }

  // Paso 2: tareas
  const agregarTrabajoTareaBtn = event.target.closest('[data-action="trabajo-agregar-tarea"]');
  if (agregarTrabajoTareaBtn) {
    agregarTrabajoTarea();
    return;
  }

  const toggleTrabajoHacerBtn = event.target.closest('[data-action="trabajo-toggle-hacer"]');
  if (toggleTrabajoHacerBtn) {
    toggleTrabajoTarea(toggleTrabajoHacerBtn.dataset.trabajoTareaId, "soltariaHacer");
    return;
  }

  const toggleTrabajoNoHacerBtn = event.target.closest('[data-action="trabajo-toggle-no-hacer"]');
  if (toggleTrabajoNoHacerBtn) {
    toggleTrabajoTarea(toggleTrabajoNoHacerBtn.dataset.trabajoTareaId, "soltariaNoHacer");
    return;
  }

  const borrarTrabajoTareaBtn = event.target.closest('[data-action="trabajo-borrar-tarea"]');
  if (borrarTrabajoTareaBtn) {
    borrarTrabajoTarea(borrarTrabajoTareaBtn.dataset.trabajoTareaId);
    return;
  }

  // Paso 5: ventajas / inconvenientes
  const agregarTrabajoVentajaBtn = event.target.closest('[data-action="trabajo-agregar-ventaja"]');
  if (agregarTrabajoVentajaBtn) {
    agregarTrabajoItem("ventaja");
    return;
  }

  const agregarTrabajoInconvenienteBtn = event.target.closest('[data-action="trabajo-agregar-inconveniente"]');
  if (agregarTrabajoInconvenienteBtn) {
    agregarTrabajoItem("inconveniente");
    return;
  }

  const toggleTrabajoItemBtn = event.target.closest('[data-action="trabajo-toggle-item"]');
  if (toggleTrabajoItemBtn) {
    toggleTrabajoItem(toggleTrabajoItemBtn.dataset.trabajoItemId, toggleTrabajoItemBtn.dataset.trabajoItemTipo);
    return;
  }

  const borrarTrabajoItemBtn = event.target.closest('[data-action="trabajo-borrar-item"]');
  if (borrarTrabajoItemBtn) {
    borrarTrabajoItem(borrarTrabajoItemBtn.dataset.trabajoItemId, borrarTrabajoItemBtn.dataset.trabajoItemTipo);
    return;
  }

  // Paso 7: guardar en diario
  const guardarTrabajoBtn = event.target.closest('[data-action="guardar-trabajo-diario"]');
  if (guardarTrabajoBtn) {
    guardarTrabajoEnDiario();
    return;
  }

  // Paso 7: reiniciar
  const reiniciarTrabajoBtn = event.target.closest('[data-action="reiniciar-trabajo"]');
  if (reiniciarTrabajoBtn) {
    reiniciarTrabajo();
    return;
  }

  // ===== MUNDO: event handlers =====

  // Abrir desde técnica
  const abrirMundoBtn = event.target.closest('[data-action="abrir-mundo"]');
  if (abrirMundoBtn) {
    abrirMundo();
    return;
  }

  // Paso 3: abrir procedimiento de limpieza
  const mundoAbrirLimpiezaBtn = event.target.closest('[data-action="mundo-abrir-limpieza"]');
  if (mundoAbrirLimpiezaBtn) {
    abrirMundoLimpieza();
    return;
  }

  // Botones de elección
  for (const c of MUNDO_CHOICES) {
    const btn = event.target.closest("[" + c.attr + "]");
    if (btn) {
      setMundoChoice(c.campo, btn.getAttribute(c.attr));
      return;
    }
  }

  // Paso 1: objeciones
  const agregarMundoObjecionBtn = event.target.closest('[data-action="mundo-agregar-objecion"]');
  if (agregarMundoObjecionBtn) {
    agregarMundoObjecion();
    return;
  }

  const toggleMundoObjecionBtn = event.target.closest('[data-action="mundo-toggle-objecion"]');
  if (toggleMundoObjecionBtn) {
    toggleMundoObjecion(toggleMundoObjecionBtn.dataset.mundoObjecionId);
    return;
  }

  const borrarMundoObjecionBtn = event.target.closest('[data-action="mundo-borrar-objecion"]');
  if (borrarMundoObjecionBtn) {
    borrarMundoObjecion(borrarMundoObjecionBtn.dataset.mundoObjecionId);
    return;
  }

  // Paso 5: guardar en diario
  const guardarMundoBtn = event.target.closest('[data-action="guardar-mundo-diario"]');
  if (guardarMundoBtn) {
    guardarMundoEnDiario();
    return;
  }

  // Paso 5: reiniciar
  const reiniciarMundoBtn = event.target.closest('[data-action="reiniciar-mundo"]');
  if (reiniciarMundoBtn) {
    reiniciarMundo();
    return;
  }

  // ===== ESTADOS: event handlers =====

  const abrirEstadosBtn = event.target.closest('[data-action="abrir-estados"]');
  if (abrirEstadosBtn) {
    abrirEstados();
    return;
  }

  const estadosEstadoBtn = event.target.closest("[data-estados-estado]");
  if (estadosEstadoBtn) {
    setEstadosEstado(estadosEstadoBtn.dataset.estadosEstado);
    return;
  }

  for (const c of ESTADOS_CHOICES) {
    const btn = event.target.closest("[" + c.attr + "]");
    if (btn) {
      setEstadosCampo(c.campo, btn.getAttribute(c.attr));
      return;
    }
  }

  const guardarEstadosBtn = event.target.closest('[data-action="guardar-estados-diario"]');
  if (guardarEstadosBtn) {
    guardarEstadosEnDiario();
    return;
  }

  const reiniciarEstadosBtn = event.target.closest('[data-action="reiniciar-estados"]');
  if (reiniciarEstadosBtn) {
    reiniciarEstados();
    return;
  }

  // ===== SERENIDAD: event handlers =====

  const abrirSerenidadBtn = event.target.closest('[data-action="abrir-serenidad"]');
  if (abrirSerenidadBtn) {
    abrirSerenidad();
    return;
  }

  for (const c of SERENIDAD_CHOICES) {
    const btn = event.target.closest("[" + c.attr + "]");
    if (btn) {
      setSerenidadCampo(c.campo, btn.getAttribute(c.attr));
      return;
    }
  }

  const repetirSerenidadBtn = event.target.closest('[data-action="serenidad-repetir"]');
  if (repetirSerenidadBtn) {
    repetirSerenidad();
    return;
  }

  const guardarSerenidadBtn = event.target.closest('[data-action="guardar-serenidad-diario"]');
  if (guardarSerenidadBtn) {
    guardarSerenidadEnDiario();
    return;
  }

  const reiniciarSerenidadBtn = event.target.closest('[data-action="reiniciar-serenidad"]');
  if (reiniciarSerenidadBtn) {
    reiniciarSerenidad();
    return;
  }

  // ===== SUMERGIR: event handlers =====

  const abrirSumergirBtn = event.target.closest('[data-action="abrir-sumergir"]');
  if (abrirSumergirBtn) {
    abrirSumergir();
    return;
  }

  for (const c of SUMERGIR_CHOICES) {
    const btn = event.target.closest("[" + c.attr + "]");
    if (btn) {
      setSumergirCampo(c.campo, btn.getAttribute(c.attr));
      return;
    }
  }

  const seguirSumergirBtn = event.target.closest('[data-action="sumergir-seguir"]');
  if (seguirSumergirBtn) {
    seguirSumergiendo();
    return;
  }

  const guardarSumergirBtn = event.target.closest('[data-action="guardar-sumergir-diario"]');
  if (guardarSumergirBtn) {
    guardarSumergirEnDiario();
    return;
  }

  const reiniciarSumergirBtn = event.target.closest('[data-action="reiniciar-sumergir"]');
  if (reiniciarSumergirBtn) {
    reiniciarSumergir();
    return;
  }

  // ===== NO HAY NINGÚN PROBLEMA: event handlers =====

  const abrirProblemaBtn = event.target.closest('[data-action="abrir-problema"]');
  if (abrirProblemaBtn) {
    abrirProblema();
    return;
  }

  for (const c of PROBLEMA_CHOICES) {
    const btn = event.target.closest("[" + c.attr + "]");
    if (btn) {
      setProblemaCampo(c.campo, btn.getAttribute(c.attr));
      return;
    }
  }

  const repetirProblemaBtn = event.target.closest('[data-action="problema-repetir"]');
  if (repetirProblemaBtn) {
    repetirProblema();
    return;
  }

  const guardarProblemaBtn = event.target.closest('[data-action="guardar-problema-diario"]');
  if (guardarProblemaBtn) {
    guardarProblemaEnDiario();
    return;
  }

  const reiniciarProblemaBtn = event.target.closest('[data-action="reiniciar-problema"]');
  if (reiniciarProblemaBtn) {
    reiniciarProblema();
    return;
  }

  // ===== LOS SEIS PASOS: event handlers =====

  const abrirPasosBtn = event.target.closest('[data-action="abrir-pasos"]');
  if (abrirPasosBtn) {
    abrirPasos();
    return;
  }

  const pasoBtn = event.target.closest("[data-pasos-paso]");
  if (pasoBtn) {
    setPasosPaso(pasoBtn.getAttribute("data-pasos-paso"));
    return;
  }

  const guardarPasosBtn = event.target.closest('[data-action="guardar-pasos-diario"]');
  if (guardarPasosBtn) {
    guardarPasosEnDiario();
    return;
  }

  const reiniciarPasosBtn = event.target.closest('[data-action="reiniciar-pasos"]');
  if (reiniciarPasosBtn) {
    reiniciarPasos();
    return;
  }

  // Pacto (checkbox)
  const pactoCheck = event.target.closest('[data-action="habito-pacto"]');
  if (pactoCheck && pactoCheck.id === "habitoPactoAceptado") {
    setHabitoCampo("pactoAceptado", pactoCheck.checked);
    return;
  }

  // Botones soltaria
  const habitoSoltariaAntesBtn = event.target.closest('[data-habito-soltaria-antes]');
  if (habitoSoltariaAntesBtn) {
    setHabitoSoltaria("antes", habitoSoltariaAntesBtn.dataset.habitoSoltariaAntes);
    return;
  }

  const habitoSoltariaCederBtn = event.target.closest('[data-habito-soltaria-ceder]');
  if (habitoSoltariaCederBtn) {
    setHabitoSoltaria("ceder", habitoSoltariaCederBtn.dataset.habitoSoltariaCeder);
    return;
  }

  const habitoRecordarBtn = event.target.closest('[data-habito-recordar]');
  if (habitoRecordarBtn) {
    setHabitoSoltaria("recordar", habitoRecordarBtn.dataset.habitoRecordar);
    return;
  }

  const habitoCambiarPasadoBtn = event.target.closest('[data-habito-cambiar-pasado]');
  if (habitoCambiarPasadoBtn) {
    setHabitoSoltaria("cambiarPasado", habitoCambiarPasadoBtn.dataset.habitoCambiarPasado);
    return;
  }

  const habitoSoltariaIdentidadBtn = event.target.closest('[data-habito-soltaria-identidad]');
  if (habitoSoltariaIdentidadBtn) {
    setHabitoSoltaria("identidad", habitoSoltariaIdentidadBtn.dataset.habitoSoltariaIdentidad);
    return;
  }

  // Agregar items
  const agregarVentajaHabBtn = event.target.closest('[data-action="habito-agregar-ventaja"]');
  if (agregarVentajaHabBtn) {
    agregarHabitoItem("ventaja");
    return;
  }

  const agregarInconvHabBtn = event.target.closest('[data-action="habito-agregar-inconveniente"]');
  if (agregarInconvHabBtn) {
    agregarHabitoItem("inconveniente");
    return;
  }

  const agregarGustoHabBtn = event.target.closest('[data-action="habito-agregar-gusto"]');
  if (agregarGustoHabBtn) {
    agregarHabitoItem("gusto");
    return;
  }

  const agregarAversionHabBtn = event.target.closest('[data-action="habito-agregar-aversion"]');
  if (agregarAversionHabBtn) {
    agregarHabitoItem("aversion");
    return;
  }

  // Toggle / borrar items
  const toggleHabBtn = event.target.closest('[data-action="habito-toggle-item"]');
  if (toggleHabBtn) {
    toggleHabitoItem(toggleHabBtn.dataset.habitoItemId, toggleHabBtn.dataset.habitoItemTipo);
    return;
  }

  const borrarHabBtn = event.target.closest('[data-action="habito-borrar-item"]');
  if (borrarHabBtn) {
    borrarHabitoItem(borrarHabBtn.dataset.habitoItemId, borrarHabBtn.dataset.habitoItemTipo);
    return;
  }

  // Guardar en diario
  const guardarHabitoBtn = event.target.closest('[data-action="guardar-habito-diario"]');
  if (guardarHabitoBtn) {
    guardarHabitoEnDiario();
    return;
  }

  // Reiniciar
  const reiniciarHabitoBtn = event.target.closest('[data-action="reiniciar-habito"]');
  if (reiniciarHabitoBtn) {
    reiniciarHabito();
    return;
  }
}

function handleEjerciciosChange(event) {
  const select = event.target.closest('[data-entrada-deseo]');
  if (select) {
    const entradaId = select.dataset.entradaDeseo;
    const nuevoDeseo = select.value;
    cambiarDeseoEntrada(entradaId, nuevoDeseo);
    return;
  }

  const resistenciaTareaSelect = event.target.closest('[data-resistencia-tarea-deseo]');
  if (resistenciaTareaSelect) {
    setResistenciaTareaCampo(resistenciaTareaSelect.dataset.resistenciaTareaId, "deseo", resistenciaTareaSelect.value);
    return;
  }

  const culpaSelect = event.target.closest('[data-culpa-item-deseo]');
  if (culpaSelect) {
    const itemId = culpaSelect.dataset.culpaItemId;
    const tipo = culpaSelect.dataset.culpaItemTipo;
    setCulpaItemDeseo(itemId, tipo, culpaSelect.value);
  }

  // Objetivos: acción deseo
  const objetivoAccionDeseo = event.target.closest('[data-objetivo-accion-deseo]');
  if (objetivoAccionDeseo) {
    setAccionDeseo(objetivoAccionDeseo.dataset.accionId, objetivoAccionDeseo.value);
    return;
  }

  // Objetivos: objeción deseo
  const objetivoObjecionDeseo = event.target.closest('[data-objetivo-objecion-deseo]');
  if (objetivoObjecionDeseo) {
    setObjecionDeseo(objetivoObjecionDeseo.dataset.objecionId, objetivoObjecionDeseo.value);
    return;
  }

  // Objetivos: área en la formulación
  if (event.target.id === "objetivoAreaSelect") {
    setObjetivoCampo("area", event.target.value);
    return;
  }

  // Hábitos: select de necesidad antes del impulso
  if (event.target.id === "habitoNecesidadAntesSelect") {
    setHabitoCampo("necesidadAntes", event.target.value);
    return;
  }

  // Hábitos: select de necesidad en los items
  const habitoItemSelect = event.target.closest('[data-habito-item-deseo]');
  if (habitoItemSelect) {
    const itemId = habitoItemSelect.dataset.habitoItemId;
    const tipo = habitoItemSelect.dataset.habitoItemTipo;
    setHabitoItemDeseo(itemId, tipo, habitoItemSelect.value);
    return;
  }

  // Dinero: select de necesidad en los items (gustos, aversiones, ventajas, inconvenientes)
  const dineroItemSelect = event.target.closest('[data-dinero-item-deseo]');
  if (dineroItemSelect) {
    const itemId = dineroItemSelect.dataset.dineroItemId;
    const tipo = dineroItemSelect.dataset.dineroItemTipo;
    setDineroItemDeseo(itemId, tipo, dineroItemSelect.value);
    return;
  }

  // Dinero: select de necesidad en las objeciones
  const dineroObjecionSelect = event.target.closest('[data-dinero-objecion-deseo]');
  if (dineroObjecionSelect) {
    setDineroObjecionDeseo(dineroObjecionSelect.dataset.dineroObjecionId, dineroObjecionSelect.value);
    return;
  }

  // Relaciones: select de necesidad en los items (gustos, aversiones)
  const relacionesItemSelect = event.target.closest('[data-relaciones-item-deseo]');
  if (relacionesItemSelect) {
    const itemId = relacionesItemSelect.dataset.relacionesItemId;
    const tipo = relacionesItemSelect.dataset.relacionesItemTipo;
    setRelacionesItemDeseo(itemId, tipo, relacionesItemSelect.value);
    return;
  }

  // Relaciones: select de necesidad en las objeciones
  const relacionesObjecionSelect = event.target.closest('[data-relaciones-objecion-deseo]');
  if (relacionesObjecionSelect) {
    setRelacionesObjecionDeseo(relacionesObjecionSelect.dataset.relacionesObjecionId, relacionesObjecionSelect.value);
    return;
  }

  // Salud: select de necesidad en los items (gustos, aversiones, ventajas, inconvenientes)
  const saludItemSelect = event.target.closest('[data-salud-item-deseo]');
  if (saludItemSelect) {
    const itemId = saludItemSelect.dataset.saludItemId;
    const tipo = saludItemSelect.dataset.saludItemTipo;
    setSaludItemDeseo(itemId, tipo, saludItemSelect.value);
    return;
  }

  // Salud: select de necesidad en las objeciones
  const saludObjecionSelect = event.target.closest('[data-salud-objecion-deseo]');
  if (saludObjecionSelect) {
    setSaludObjecionDeseo(saludObjecionSelect.dataset.saludObjecionId, saludObjecionSelect.value);
    return;
  }

  // Trabajo: select de necesidad en ventajas e inconvenientes
  const trabajoItemSelect = event.target.closest('[data-trabajo-item-deseo]');
  if (trabajoItemSelect) {
    const itemId = trabajoItemSelect.dataset.trabajoItemId;
    const tipo = trabajoItemSelect.dataset.trabajoItemTipo;
    setTrabajoItemDeseo(itemId, tipo, trabajoItemSelect.value);
    return;
  }

  // Mundo: select de necesidad en las objeciones
  const mundoObjecionSelect = event.target.closest('[data-mundo-objecion-deseo]');
  if (mundoObjecionSelect) {
    setMundoObjecionDeseo(mundoObjecionSelect.dataset.mundoObjecionId, mundoObjecionSelect.value);
    return;
  }

  // Sumergirse: emoción elegida
  if (event.target.id === "sumergirEmocion") {
    setSumergirCampo("emocion", event.target.value);
    return;
  }
}

function handleEjerciciosInput(event) {
  if (event.target.id === "ejercicioTema") {
    actualizarTema(event.target.value);
  }

  if (event.target.id === "limpiezaPersona") {
    setLimpiPersona(event.target.value);
  }

  if (event.target.id === "limpiezaNotasFinales") {
    setLimpiNotasFinales(event.target.value);
  }

  if (event.target.classList.contains("limpieza-nota")) {
    const fase = parseInt(event.target.dataset.fase);
    const pregunta = parseInt(event.target.dataset.pregunta);
    setLimpiezaNota(fase, pregunta, event.target.value);
  }

  // Miedo: inputs de texto
  if (event.target.id === "miedoInput") {
    setMiedoCampo("miedo", event.target.value);
  }

  if (event.target.id === "queTemoInput") {
    setMiedoCampo("queTemo", event.target.value);
  }

  if (event.target.id === "miedoPrefieroInput") {
    setMiedoCampo("prefieroImaginar", event.target.value);
  }

  if (event.target.id === "miedoImagenInput") {
    setMiedoCampo("imagenAlternativa", event.target.value);
  }

  if (event.target.id === "miedoBeneficioInput") {
    setMiedoCampo("beneficio", event.target.value);
  }

  // Culpa: inputs de texto
  // Resistencia: inputs
  if (event.target.classList.contains("resistencia-tarea-sentimiento")) {
    setResistenciaTareaCampo(event.target.dataset.resistenciaTareaId, "sentimiento", event.target.value);
  }

  if (event.target.id === "resistenciaHacerInput") {
    setResistenciaCampo("resistoHacer", event.target.value);
  }

  if (event.target.id === "resistenciaSentimientoInput") {
    setResistenciaCampo("sentimientoResistido", event.target.value);
  }

  if (event.target.id === "resistenciaBeneficioInput") {
    setResistenciaCampo("beneficio", event.target.value);
  }

  if (event.target.id === "resistenciaIntensidadInicial") {
    setResistenciaIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "resistenciaIntensidadFinal") {
    setResistenciaIntensidad("final", event.target.value);
  }

  if (event.target.id === "culpaSituacionInput") {
    setCulpaCampo("situacion", event.target.value);
  }

  if (event.target.id === "culpaNotasAprendizaje") {
    setCulpaCampo("notasAprendizaje", event.target.value);
  }

  if (event.target.id === "culpaBeneficioInput") {
    setCulpaCampo("beneficio", event.target.value);
  }

  // Culpa: ranges
  if (event.target.id === "culpaIntensidadInicial") {
    setCulpaIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "culpaIntensidadFinal") {
    setCulpaIntensidad("final", event.target.value);
  }

  // Miedo: ranges
  if (event.target.id === "miedoIntensidadInicial") {
    setMiedoIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "miedoIntensidadFinal") {
    setMiedoIntensidad("final", event.target.value);
  }

  // ===== OBJETIVOS: inputs de texto =====
  if (event.target.id === "objetivoFormulacionInput") {
    setObjetivoCampo("texto", event.target.value);
    actualizarCheckFormulacion();
    return;
  }

  if (event.target.id === "objetivoVisualizacionInput") {
    setObjetivoCampo("visualizacion", event.target.value);
    return;
  }

  // Sentimiento de acción en el paso 3 (actuar)
  if (event.target.classList.contains("objetivo-accion-sentimiento")) {
    const accionId = event.target.dataset.accionId;
    setAccionSentimiento(accionId, event.target.value);
    return;
  }

  // ===== HÁBITOS: inputs de texto y ranges =====
  if (event.target.id === "habitoNombreInput") {
    setHabitoCampo("nombre", event.target.value);
  }

  if (event.target.id === "habitoSentimientoAntesInput") {
    setHabitoCampo("sentimientoAntes", event.target.value);
  }

  if (event.target.id === "habitoAntesCederInput") {
    setHabitoCampo("antesCeder", event.target.value);
  }

  if (event.target.id === "habitoDuranteInput") {
    setHabitoCampo("durante", event.target.value);
  }

  if (event.target.id === "habitoDespuesInput") {
    setHabitoCampo("despues", event.target.value);
  }

  if (event.target.id === "habitoBeneficioInput") {
    setHabitoCampo("beneficio", event.target.value);
  }

  if (event.target.id === "habitoIntensidadInicial") {
    setHabitoIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "habitoIntensidadFinal") {
    setHabitoIntensidad("final", event.target.value);
  }

  // ===== DINERO / ABUNDANCIA: inputs de texto y ranges =====
  if (event.target.id === "dineroPadresActitudInput") {
    setDineroCampo("padresActitud", event.target.value);
  }

  if (event.target.id === "dineroPatronInput") {
    setDineroCampo("patron", event.target.value);
  }

  if (event.target.id === "dineroPropiaActitudInput") {
    setDineroCampo("propiaActitud", event.target.value);
  }

  if (event.target.id === "dineroVisualizacionInput") {
    setDineroCampo("visualizacion", event.target.value);
  }

  if (event.target.id === "dineroBeneficioInput") {
    setDineroCampo("beneficio", event.target.value);
  }

  if (event.target.id === "dineroIntensidadInicial") {
    setDineroIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "dineroIntensidadFinal") {
    setDineroIntensidad("final", event.target.value);
  }

  // Dinero: notas de limpieza
  if (event.target.classList.contains("dinero-limpieza-nota")) {
    const fase = parseInt(event.target.dataset.fase);
    const pregunta = parseInt(event.target.dataset.pregunta);
    setDineroLimpiezaNota(fase, pregunta, event.target.value);
  }

  // ===== RELACIONES: inputs de texto y ranges =====
  if (event.target.id === "relacionesPersonaInput") {
    setRelacionesCampo("persona", event.target.value);
  }

  if (event.target.id === "relacionesPadresInput") {
    setRelacionesCampo("padres", event.target.value);
  }

  if (event.target.id === "relacionesAmigosInput") {
    setRelacionesCampo("amigos", event.target.value);
  }

  if (event.target.id === "relacionesDesacuerdoTemaInput") {
    setRelacionesCampo("desacuerdoTema", event.target.value);
  }

  if (event.target.id === "relacionesDesacuerdoMiVistaInput") {
    setRelacionesCampo("desacuerdoMiVista", event.target.value);
  }

  if (event.target.id === "relacionesDesacuerdoOtroVistaInput") {
    setRelacionesCampo("desacuerdoOtroVista", event.target.value);
  }

  if (event.target.id === "relacionesVisualizacionInput") {
    setRelacionesCampo("visualizacion", event.target.value);
  }

  if (event.target.id === "relacionesBeneficioInput") {
    setRelacionesCampo("beneficio", event.target.value);
  }

  if (event.target.id === "relacionesIntensidadInicial") {
    setRelacionesIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "relacionesIntensidadFinal") {
    setRelacionesIntensidad("final", event.target.value);
  }

  // ===== SALUD: inputs de texto y ranges =====
  if (event.target.id === "saludPreocupacionInput") {
    setSaludCampo("preocupacion", event.target.value);
  }

  if (event.target.id === "saludDesaprobacionInput") {
    setSaludCampo("desaprobacion", event.target.value);
  }

  if (event.target.id === "saludMiedoMedicosInput") {
    setSaludCampo("miedoMedicos", event.target.value);
  }

  if (event.target.id === "saludDiagnosticoInput") {
    setSaludCampo("diagnostico", event.target.value);
  }

  if (event.target.id === "saludSintomaInput") {
    setSaludCampo("sintoma", event.target.value);
  }

  if (event.target.id === "saludActitudPadresInput") {
    setSaludCampo("actitudPadres", event.target.value);
  }

  if (event.target.id === "saludVisualizacionInput") {
    setSaludCampo("visualizacion", event.target.value);
  }

  if (event.target.id === "saludBeneficioInput") {
    setSaludCampo("beneficio", event.target.value);
  }

  if (event.target.id === "saludIntensidadInicial") {
    setSaludIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "saludIntensidadFinal") {
    setSaludIntensidad("final", event.target.value);
  }

  // ===== TRABAJO: inputs de texto y ranges =====
  if (event.target.id === "trabajoTemaInput") {
    setTrabajoCampo("tema", event.target.value);
  }

  if (event.target.id === "trabajoDelegarTareaInput") {
    setTrabajoCampo("delegarTarea", event.target.value);
  }

  if (event.target.id === "trabajoDelegarDudasInput") {
    setTrabajoCampo("delegarDudas", event.target.value);
  }

  if (event.target.id === "trabajoPresionPlazoInput") {
    setTrabajoCampo("presionPlazo", event.target.value);
  }

  if (event.target.id === "trabajoSentimientoTiempoInput") {
    setTrabajoCampo("sentimientoTiempo", event.target.value);
  }

  if (event.target.id === "trabajoSituacionVentaInput") {
    setTrabajoCampo("situacionVenta", event.target.value);
  }

  if (event.target.id === "trabajoDecisionInput") {
    setTrabajoCampo("decision", event.target.value);
  }

  if (event.target.id === "trabajoPersonaDificilInput") {
    setTrabajoCampo("personaDificil", event.target.value);
  }

  if (event.target.id === "trabajoBeneficioInput") {
    setTrabajoCampo("beneficio", event.target.value);
  }

  if (event.target.id === "trabajoIntensidadInicial") {
    setTrabajoIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "trabajoIntensidadFinal") {
    setTrabajoIntensidad("final", event.target.value);
  }

  // ===== MUNDO: inputs de texto y ranges =====
  if (event.target.id === "mundoNoticiaInput") {
    setMundoCampo("noticia", event.target.value);
  }

  if (event.target.id === "mundoVisualizacionInput") {
    setMundoCampo("visualizacionMundo", event.target.value);
  }

  if (event.target.id === "mundoContraQueInput") {
    setMundoCampo("contraQue", event.target.value);
  }

  if (event.target.id === "mundoAFavorInput") {
    setMundoCampo("aFavorDe", event.target.value);
  }

  if (event.target.id === "mundoLiderInput") {
    setMundoCampo("lider", event.target.value);
  }

  if (event.target.id === "mundoAmabilidadInput") {
    setMundoCampo("amabilidad", event.target.value);
  }

  if (event.target.id === "mundoBeneficioInput") {
    setMundoCampo("beneficio", event.target.value);
  }

  if (event.target.id === "mundoIntensidadInicial") {
    setMundoIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "mundoIntensidadFinal") {
    setMundoIntensidad("final", event.target.value);
  }

  if (event.target.id === "estadosRecuerdoInput") {
    setEstadosCampo("recuerdo", event.target.value);
  }

  if (event.target.id === "estadosBeneficioInput") {
    setEstadosCampo("beneficio", event.target.value);
  }

  if (event.target.id === "estadosIntensidadInicial") {
    setEstadosIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "estadosIntensidadFinal") {
    setEstadosIntensidad("final", event.target.value);
  }

  if (event.target.id === "serenidadQueInput") {
    setSerenidadCampo("que", event.target.value);
  }

  if (event.target.id === "serenidadObservacionInput") {
    setSerenidadCampo("observacion", event.target.value);
  }

  if (event.target.id === "serenidadBeneficioInput") {
    setSerenidadCampo("beneficio", event.target.value);
  }

  if (event.target.id === "serenidadIntensidadInicial") {
    setSerenidadIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "serenidadIntensidadFinal") {
    setSerenidadIntensidad("final", event.target.value);
  }

  if (event.target.id === "sumergirSentimientoInput") {
    setSumergirCampo("sentimiento", event.target.value);
  }

  if (event.target.id === "sumergirNucleoInput") {
    setSumergirCampo("nucleo", event.target.value);
  }

  if (event.target.id === "sumergirBeneficioInput") {
    setSumergirCampo("beneficio", event.target.value);
  }

  if (event.target.id === "sumergirIntensidadInicial") {
    setSumergirIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "sumergirIntensidadFinal") {
    setSumergirIntensidad("final", event.target.value);
  }

  if (event.target.id === "problemaQueInput") {
    setProblemaCampo("que", event.target.value);
  }

  if (event.target.id === "problemaBeneficioInput") {
    setProblemaCampo("beneficio", event.target.value);
  }

  if (event.target.id === "problemaIntensidadInicial") {
    setProblemaIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "problemaIntensidadFinal") {
    setProblemaIntensidad("final", event.target.value);
  }

  if (event.target.id === "pasosQueInput") {
    setPasosCampo("que", event.target.value);
  }

  if (event.target.id === "pasosBeneficioInput") {
    setPasosCampo("beneficio", event.target.value);
  }

  if (event.target.id === "pasosIntensidadInicial") {
    setPasosIntensidad("inicial", event.target.value);
  }

  if (event.target.id === "pasosIntensidadFinal") {
    setPasosIntensidad("final", event.target.value);
  }
}

// ===== MÓDULO DE OBJETIVOS =====

const OBJETIVOS_CONFIG = {
  clave: "soltar_objetivos_v1"
};

let objetivoActivo = null;
let objetivoEditandoId = null;

function getObjetivosGuardados() {
  try {
    return JSON.parse(localStorage.getItem(OBJETIVOS_CONFIG.clave)) || [];
  } catch (error) {
    return [];
  }
}

function guardarObjetivosLista(lista) {
  localStorage.setItem(OBJETIVOS_CONFIG.clave, JSON.stringify(lista));
}

function nuevoObjetivo() {
  objetivoActivo = {
    id: null,
    texto: "",
    area: "general",
    liberaciones: [],
    estadoFinal: null,
    acciones: [],
    visualizacion: "",
    objeciones: [],
    aceptaVisualizacion: null,
    fechaCreacion: new Date().toISOString()
  };
  objetivoEditandoId = null;
  navigateTo("objetivo-formulacion");
}

function editarObjetivo(id) {
  const lista = getObjetivosGuardados();
  const obj = lista.find(o => o.id === id);
  if (!obj) return;

  objetivoActivo = JSON.parse(JSON.stringify(obj));
  objetivoEditandoId = id;
  navigateTo("objetivo-formulacion");
}

function eliminarObjetivo(id) {
  if (!confirm("¿Borrar este objetivo?")) return;

  let lista = getObjetivosGuardados();
  lista = lista.filter(o => o.id !== id);
  guardarObjetivosLista(lista);
  renderObjetivosLista();
}

function renderObjetivosLista() {
  const container = document.getElementById("objetivosListaGuardados");
  if (!container) return;

  const lista = getObjetivosGuardados();

  if (!lista.length) {
    container.innerHTML = '<p class="empty">Todavía no hay objetivos guardados.</p>';
    return;
  }

  container.innerHTML = lista.map(obj => {
    const area = nombreTema(obj.area);
    const fecha = formatFecha(obj.fechaCreacion);
    const estadoChip = obj.estadoFinal ? `<span class="chip">${escapeHTML(obj.estadoFinal)}</span>` : "";
    const liberadas = obj.liberaciones ? obj.liberaciones.filter(l => l.liberado).length : 0;
    const totalLib = obj.liberaciones ? obj.liberaciones.length : 0;
    const acciones = obj.acciones ? obj.acciones.length : 0;

    return `
      <article class="session-item">
        <div class="small">${fecha} — ${escapeHTML(area)}</div>
        <strong>${escapeHTML(obj.texto)}</strong>
        <p class="small">
          Liberaciones: ${liberadas}/${totalLib} · Acciones: ${acciones}
          ${estadoChip}
        </p>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button type="button" class="button small" data-action="objetivo-editar" data-objetivo-id="${obj.id}">Abrir</button>
          <button type="button" class="delete-button" data-action="objetivo-eliminar" data-objetivo-id="${obj.id}">Borrar</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderObjetivoFormulacion() {
  if (!objetivoActivo) return;

  // Cargar áreas en el select
  const select = document.getElementById("objetivoAreaSelect");
  if (select && typeof TEMAS !== "undefined") {
    select.innerHTML = TEMAS.map(t =>
      `<option value="${t.id}" ${t.id === objetivoActivo.area ? "selected" : ""}>${escapeHTML(t.nombre)}</option>`
    ).join("");
  }

  const input = document.getElementById("objetivoFormulacionInput");
  if (input) input.value = objetivoActivo.texto || "";

  actualizarCheckFormulacion();
}

function actualizarCheckFormulacion() {
  const lista = document.getElementById("objetivoFormulacionLista");
  if (!lista || !objetivoActivo) return;

  const texto = (objetivoActivo.texto || "").toLowerCase();

  const checks = [
    { ok: !/\b(quiero|querer|deseo|desear)\b/.test(texto), texto: "No incluye 'querer' ni 'desear'" },
    { ok: !/\b(no|nunca|dejar de|eliminar)\b/.test(texto), texto: "Está formulado en positivo (sin 'no', 'nunca', 'dejar de')" },
    { ok: /\b(me permito|puedo|acepto|soy|tengo|disfruto)\b/.test(texto), texto: "Te incluye a vos (usa 'Me permito', 'Puedo', 'Acepto'...)" },
    { ok: !/\b(haré|voy a|mañana|próximo año)\b/.test(texto), texto: "Está en presente (no en futuro)" },
    { ok: texto.length > 10 && texto.length < 200, texto: "Longitud adecuada (ni muy corto ni muy largo)" }
  ];

  lista.innerHTML = checks.map(c =>
    `<li>${c.ok ? "✅" : "⚠️"} ${escapeHTML(c.texto)}</li>`
  ).join("");
}

function renderObjetivoDeterminar() {
  if (!objetivoActivo) return;

  setText("objetivoDeterminarTexto", objetivoActivo.texto || "");

  document.querySelectorAll("[data-objetivo-estado]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.objetivoEstado === objetivoActivo.estadoFinal);
  });

  const lista = document.getElementById("objetivoLiberacionesLista");
  if (!lista) return;

  if (!objetivoActivo.liberaciones.length) {
    lista.innerHTML = '<p class="empty">Todavía no hay liberaciones registradas.</p>';
    return;
  }

  lista.innerHTML = objetivoActivo.liberaciones.map(lib => {
    const deseoNombre = nombreNecesidad(lib.deseo);
    return `
      <article class="entrada-item ${lib.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(lib.sentimiento)}</p>
        <p class="small">Necesidad: ${escapeHTML(deseoNombre)}</p>
        <div class="entrada-acciones">
          <button type="button" class="button small ${lib.liberado ? "secondary" : ""}" data-action="objetivo-toggle-liberacion" data-lib-id="${lib.id}">
            ${lib.liberado ? "Liberado ✓" : "Marcar liberado"}
          </button>
          <button type="button" class="delete-button" data-action="objetivo-borrar-liberacion" data-lib-id="${lib.id}">Borrar</button>
        </div>
      </article>
    `;
  }).join("");
}

function agregarLiberacionObjetivo() {
  if (!objetivoActivo) return;

  const sentInput = document.getElementById("objetivoSentimientoInput");
  const necSelect = document.getElementById("objetivoNecesidadSelect");

  if (!sentInput || !necSelect) return;

  const sentimiento = (sentInput.value || "").trim();
  if (!sentimiento) {
    alert("Escribí el pensamiento o emoción que aparece.");
    return;
  }

  objetivoActivo.liberaciones.push({
    id: "lib_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    sentimiento: sentimiento,
    deseo: necSelect.value,
    liberado: false
  });

  sentInput.value = "";
  necSelect.value = "no_se";
  renderObjetivoDeterminar();
}

function toggleLiberacionObjetivo(libId) {
  if (!objetivoActivo) return;
  const lib = objetivoActivo.liberaciones.find(l => l.id === libId);
  if (!lib) return;
  lib.liberado = !lib.liberado;
  renderObjetivoDeterminar();
}

function borrarLiberacionObjetivo(libId) {
  if (!objetivoActivo) return;
  if (!confirm("¿Borrar esta liberación?")) return;
  objetivoActivo.liberaciones = objetivoActivo.liberaciones.filter(l => l.id !== libId);
  renderObjetivoDeterminar();
}

function setObjetivoEstado(estado) {
  if (!objetivoActivo) return;
  objetivoActivo.estadoFinal = estado;
  renderObjetivoDeterminar();
}

function renderObjetivoActuar() {
  if (!objetivoActivo) return;

  setText("objetivoActuarTexto", objetivoActivo.texto || "");

  const lista = document.getElementById("objetivoAccionesLista");
  if (!lista) return;

  if (!objetivoActivo.acciones.length) {
    lista.innerHTML = '<p class="empty">Todavía no hay acciones.</p>';
    return;
  }

  lista.innerHTML = objetivoActivo.acciones.map(accion => {
    const opciones = DESEOS_EJERCICIO.map(d =>
      `<option value="${d.id}" ${d.id === accion.deseo ? "selected" : ""}>${d.nombre}</option>`
    ).join("");

    return `
      <article class="entrada-item ${accion.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(accion.texto)}</p>
        <label>
          Sentimiento frente a esta acción
          <input type="text" class="objetivo-accion-sentimiento" data-accion-id="${accion.id}" value="${escapeHTML(accion.sentimiento || "")}" placeholder="Ej: miedo, resistencia, pereza..." />
        </label>
        <label class="entrada-deseo-label">
          Necesidad
          <select data-objetivo-accion-deseo="${accion.id}">${opciones}</select>
        </label>
        <div class="entrada-acciones">
          <button type="button" class="button small ${accion.liberado ? "secondary" : ""}" data-action="objetivo-toggle-accion" data-accion-id="${accion.id}">
            ${accion.liberado ? "Liberado ✓" : "Marcar liberado"}
          </button>
          <button type="button" class="delete-button" data-action="objetivo-borrar-accion" data-accion-id="${accion.id}">Borrar</button>
        </div>
      </article>
    `;
  }).join("");
}

function agregarAccionObjetivo() {
  if (!objetivoActivo) return;
  const input = document.getElementById("objetivoAccionInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  objetivoActivo.acciones.push({
    id: "acc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    sentimiento: "",
    deseo: "no_se",
    liberado: false
  });

  input.value = "";
  renderObjetivoActuar();
}

function toggleAccionObjetivo(accionId) {
  if (!objetivoActivo) return;
  const acc = objetivoActivo.acciones.find(a => a.id === accionId);
  if (!acc) return;
  acc.liberado = !acc.liberado;
  renderObjetivoActuar();
}

function borrarAccionObjetivo(accionId) {
  if (!objetivoActivo) return;
  if (!confirm("¿Borrar esta acción?")) return;
  objetivoActivo.acciones = objetivoActivo.acciones.filter(a => a.id !== accionId);
  renderObjetivoActuar();
}

function setAccionCampo(accionId, campo, valor) {
  if (!objetivoActivo) return;
  const acc = objetivoActivo.acciones.find(a => a.id === accionId);
  if (!acc) return;
  acc[campo] = valor;
}

function renderObjetivoVisualizar() {
  if (!objetivoActivo) return;

  setText("objetivoVisualizarTexto", objetivoActivo.texto || "");

  const visInput = document.getElementById("objetivoVisualizacionInput");
  if (visInput) visInput.value = objetivoActivo.visualizacion || "";

  document.querySelectorAll("[data-objetivo-acepta-visualizacion]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.objetivoAceptaVisualizacion === objetivoActivo.aceptaVisualizacion);
  });

  renderObjetivoObjeciones();
}

function renderObjetivoObjeciones() {
  const lista = document.getElementById("objetivoObjecionesLista");
  if (!lista || !objetivoActivo) return;

  if (!objetivoActivo.objeciones.length) {
    lista.innerHTML = '<p class="empty">No hay objeciones registradas.</p>';
    return;
  }

  lista.innerHTML = objetivoActivo.objeciones.map(obj => {
    const opciones = DESEOS_EJERCICIO.map(d =>
      `<option value="${d.id}" ${d.id === obj.deseo ? "selected" : ""}>${d.nombre}</option>`
    ).join("");

    return `
      <article class="entrada-item ${obj.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(obj.texto)}</p>
        <label class="entrada-deseo-label">
          Necesidad detrás de la objeción
          <select data-objetivo-objecion-deseo="${obj.id}">${opciones}</select>
        </label>
        <div class="entrada-acciones">
          <button type="button" class="button small ${obj.liberado ? "secondary" : ""}" data-action="objetivo-toggle-objecion" data-objecion-id="${obj.id}">
            ${obj.liberado ? "Liberado ✓" : "Marcar liberado"}
          </button>
          <button type="button" class="delete-button" data-action="objetivo-borrar-objecion" data-objecion-id="${obj.id}">Borrar</button>
        </div>
      </article>
    `;
  }).join("");
}

function agregarObjecionObjetivo() {
  if (!objetivoActivo) return;
  const input = document.getElementById("objetivoObjecionInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  objetivoActivo.objeciones.push({
    id: "obj_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  });

  input.value = "";
  renderObjetivoObjeciones();
}

function toggleObjecionObjetivo(objId) {
  if (!objetivoActivo) return;
  const obj = objetivoActivo.objeciones.find(o => o.id === objId);
  if (!obj) return;
  obj.liberado = !obj.liberado;
  renderObjetivoObjeciones();
}

function borrarObjecionObjetivo(objId) {
  if (!objetivoActivo) return;
  if (!confirm("¿Borrar esta objeción?")) return;
  objetivoActivo.objeciones = objetivoActivo.objeciones.filter(o => o.id !== objId);
  renderObjetivoObjeciones();
}

function setObjecionDeseo(objId, nuevoDeseo) {
  if (!objetivoActivo) return;
  const obj = objetivoActivo.objeciones.find(o => o.id === objId);
  if (!obj) return;
  obj.deseo = nuevoDeseo;
}

function setAccionDeseo(accionId, nuevoDeseo) {
  if (!objetivoActivo) return;
  const acc = objetivoActivo.acciones.find(a => a.id === accionId);
  if (!acc) return;
  acc.deseo = nuevoDeseo;
}

function setObjetivoAceptaVisualizacion(valor) {
  if (!objetivoActivo) return;
  objetivoActivo.aceptaVisualizacion = valor;
  renderObjetivoVisualizar();
}

function setObjetivoCampo(campo, valor) {
  if (!objetivoActivo) return;
  objetivoActivo[campo] = valor;
}

function setAccionSentimiento(accionId, valor) {
  if (!objetivoActivo) return;
  const acc = objetivoActivo.acciones.find(a => a.id === accionId);
  if (!acc) return;
  acc.sentimiento = valor;
}

function guardarObjetivoCompleto() {
  if (!objetivoActivo) return;

  const texto = (objetivoActivo.texto || "").trim();
  if (!texto) {
    alert("El objetivo no puede estar vacío.");
    return;
  }

  let lista = getObjetivosGuardados();

  if (objetivoEditandoId) {
    const index = lista.findIndex(o => o.id === objetivoEditandoId);
    if (index !== -1) {
      lista[index] = { ...objetivoActivo, id: objetivoEditandoId };
    }
  } else {
    objetivoActivo.id = "obj_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    lista.unshift(objetivoActivo);
  }

  guardarObjetivosLista(lista);

  // También guardar en el diario
  const sesion = {
    tema: objetivoActivo.area || "objetivos",
    descripcion: "Objetivo: " + texto,
    emocionInicial: "deseo",
    intensidadInicial: 5,
    necesidad: objetivoActivo.liberaciones.length ? objetivoActivo.liberaciones[0].deseo : "no_se",
    emocionFinal: objetivoActivo.estadoFinal === "paz" ? "paz" : objetivoActivo.estadoFinal === "aceptacion" ? "aceptacion" : "coraje",
    intensidadFinal: objetivoActivo.aceptaVisualizacion === "si" ? 2 : 5,
    beneficio: objetivoActivo.visualizacion ? "Visualización completada" : "",
    tecnica: "objetivos"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Objetivo guardado en tu biblioteca y en el diario.");

  objetivoActivo = null;
  objetivoEditandoId = null;
  navigateTo("ejercicio-objetivos", true);
}

function abrirObjetivos() {
  objetivoActivo = null;
  objetivoEditandoId = null;
  navigateTo("ejercicio-objetivos");
}

// ===== MÓDULO DE HÁBITOS =====

const HABITOS_CONFIG = {
  titulo: "Liberar un mal hábito",
  descripcion: "Trabaja con el hábito liberando antes del impulso, durante y después, descubriendo las ventajas ocultas y reformulando el hábito como un recuerdo del pasado.",
  clave: "soltar_ejercicio_habitos_v1"
};

let habitoActivo = null;

function abrirHabitos() {
  habitoActivo = cargarHabitos() || {
    nombre: "",
    intensidadInicial: 5,
    pactoAceptado: false,
    sentimientoAntes: "",
    necesidadAntes: "no_se",
    soltariaAntes: null,
    antesCeder: "",
    durante: "",
    despues: "",
    soltariaCeder: null,
    recordar: null,
    cambiarPasado: null,
    soltariaIdentidad: null,
    ventajas: [],
    inconvenientes: [],
    gustos: [],
    aversiones: [],
    intensidadFinal: 5,
    beneficio: ""
  };

  renderHabitos();
  navigateTo("ejercicio-habitos");
}

function cargarHabitos() {
  try {
    return JSON.parse(localStorage.getItem(HABITOS_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarHabitoActual() {
  if (!habitoActivo) return;
  localStorage.setItem(HABITOS_CONFIG.clave, JSON.stringify(habitoActivo));
}

function renderHabitos() {
  if (!habitoActivo) return;

  // Paso 1: hábito y pacto
  const nombreInput = document.getElementById("habitoNombreInput");
  if (nombreInput) nombreInput.value = habitoActivo.nombre || "";

  const pactoCheck = document.getElementById("habitoPactoAceptado");
  if (pactoCheck) pactoCheck.checked = !!habitoActivo.pactoAceptado;

  // Intensidad inicial
  const intInicial = document.getElementById("habitoIntensidadInicial");
  if (intInicial) intInicial.value = habitoActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("habitoIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = habitoActivo.intensidadInicial;

  // Paso 2: antes del impulso
  const sentAntes = document.getElementById("habitoSentimientoAntesInput");
  if (sentAntes) sentAntes.value = habitoActivo.sentimientoAntes || "";
  const necAntes = document.getElementById("habitoNecesidadAntesSelect");
  if (necAntes) necAntes.value = habitoActivo.necesidadAntes || "no_se";

  document.querySelectorAll("[data-habito-soltaria-antes]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.habitoSoltariaAntes === habitoActivo.soltariaAntes);
  });

  // Paso 3: momento de ceder
  const antesCeder = document.getElementById("habitoAntesCederInput");
  if (antesCeder) antesCeder.value = habitoActivo.antesCeder || "";
  const duranteInput = document.getElementById("habitoDuranteInput");
  if (duranteInput) duranteInput.value = habitoActivo.durante || "";
  const despuesInput = document.getElementById("habitoDespuesInput");
  if (despuesInput) despuesInput.value = habitoActivo.despues || "";

  document.querySelectorAll("[data-habito-soltaria-ceder]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.habitoSoltariaCeder === habitoActivo.soltariaCeder);
  });

  // Paso 4: recuerdo
  document.querySelectorAll("[data-habito-recordar]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.habitoRecordar === habitoActivo.recordar);
  });

  document.querySelectorAll("[data-habito-cambiar-pasado]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.habitoCambiarPasado === habitoActivo.cambiarPasado);
  });

  document.querySelectorAll("[data-habito-soltaria-identidad]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.habitoSoltariaIdentidad === habitoActivo.soltariaIdentidad);
  });

  // Paso 5 y 6: listas
  renderHabitoListas();

  // Paso 7: cierre
  const intFinal = document.getElementById("habitoIntensidadFinal");
  if (intFinal) intFinal.value = habitoActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("habitoIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = habitoActivo.intensidadFinal;

  const benInput = document.getElementById("habitoBeneficioInput");
  if (benInput) benInput.value = habitoActivo.beneficio || "";
}

function renderHabitoListas() {
  renderHabitoListaTipo("habitoVentajasLista", habitoActivo.ventajas, "ventaja");
  renderHabitoListaTipo("habitoInconvenientesLista", habitoActivo.inconvenientes, "inconveniente");
  renderHabitoListaTipo("habitoGustosLista", habitoActivo.gustos, "gusto");
  renderHabitoListaTipo("habitoAversionesLista", habitoActivo.aversiones, "aversion");
}

function renderHabitoListaTipo(containerId, lista, tipo) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!lista.length) {
    container.innerHTML = '<p class="empty">Agregá al menos un elemento.</p>';
    return;
  }

  container.innerHTML = lista.map(item => habitoItemHTML(item, tipo)).join("");
}

function habitoItemHTML(item, tipo) {
  const opciones = DESEOS_EJERCICIO.map(d =>
    `<option value="${d.id}" ${d.id === item.deseo ? "selected" : ""}>${d.nombre}</option>`
  ).join("");

  return `
    <article class="entrada-item ${item.liberado ? "liberado" : ""}">
      <p class="entrada-texto">${escapeHTML(item.texto)}</p>
      <label class="entrada-deseo-label">
        Necesidad detrás
        <select data-habito-item-deseo="${item.id}" data-habito-item-tipo="${tipo}">${opciones}</select>
      </label>
      <div class="entrada-acciones">
        <button type="button" class="button small ${item.liberado ? "secondary" : ""}" data-action="habito-toggle-item" data-habito-item-id="${item.id}" data-habito-item-tipo="${tipo}">
          ${item.liberado ? "Liberado ✓" : "Marcar liberado"}
        </button>
        <button type="button" class="delete-button" data-action="habito-borrar-item" data-habito-item-id="${item.id}" data-habito-item-tipo="${tipo}">
          Borrar
        </button>
      </div>
    </article>
  `;
}

function setHabitoCampo(campo, valor) {
  if (!habitoActivo) return;
  habitoActivo[campo] = valor;
  guardarHabitoActual();
}

function setHabitoIntensidad(tipo, valor) {
  if (!habitoActivo) return;
  const num = Number(valor);
  if (tipo === "inicial") {
    habitoActivo.intensidadInicial = num;
    const txt = document.getElementById("habitoIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    habitoActivo.intensidadFinal = num;
    const txt = document.getElementById("habitoIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }
  guardarHabitoActual();
}

function setHabitoSoltaria(tipo, valor) {
  if (!habitoActivo) return;
  if (tipo === "antes") habitoActivo.soltariaAntes = valor;
  else if (tipo === "ceder") habitoActivo.soltariaCeder = valor;
  else if (tipo === "recordar") habitoActivo.recordar = valor;
  else if (tipo === "cambiarPasado") habitoActivo.cambiarPasado = valor;
  else if (tipo === "identidad") habitoActivo.soltariaIdentidad = valor;
  guardarHabitoActual();
  renderHabitos();
}

function agregarHabitoItem(tipo) {
  if (!habitoActivo) return;

  const mapInputs = {
    ventaja: "habitoVentajaInput",
    inconveniente: "habitoInconvenienteInput",
    gusto: "habitoGustoInput",
    aversion: "habitoAversionInput"
  };

  const input = document.getElementById(mapInputs[tipo]);
  if (!input) return;

  const texto = (input.value || "").trim();
  if (!texto) return;

  const nuevo = {
    id: "hab_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  };

  const listas = {
    ventaja: "ventajas",
    inconveniente: "inconvenientes",
    gusto: "gustos",
    aversion: "aversiones"
  };

  habitoActivo[listas[tipo]].push(nuevo);
  input.value = "";
  guardarHabitoActual();
  renderHabitoListas();
}

function toggleHabitoItem(itemId, tipo) {
  if (!habitoActivo) return;

  const listas = {
    ventaja: "ventajas",
    inconveniente: "inconvenientes",
    gusto: "gustos",
    aversion: "aversiones"
  };

  const lista = habitoActivo[listas[tipo]];
  const item = lista.find(i => i.id === itemId);
  if (!item) return;

  item.liberado = !item.liberado;
  guardarHabitoActual();
  renderHabitoListas();
}

function borrarHabitoItem(itemId, tipo) {
  if (!habitoActivo) return;
  if (!confirm("¿Borrar este elemento?")) return;

  const listas = {
    ventaja: "ventajas",
    inconveniente: "inconvenientes",
    gusto: "gustos",
    aversion: "aversiones"
  };

  habitoActivo[listas[tipo]] = habitoActivo[listas[tipo]].filter(i => i.id !== itemId);
  guardarHabitoActual();
  renderHabitoListas();
}

function setHabitoItemDeseo(itemId, tipo, nuevoDeseo) {
  if (!habitoActivo) return;

  const listas = {
    ventaja: "ventajas",
    inconveniente: "inconvenientes",
    gusto: "gustos",
    aversion: "aversiones"
  };

  const lista = habitoActivo[listas[tipo]];
  const item = lista.find(i => i.id === itemId);
  if (!item) return;

  item.deseo = nuevoDeseo;
  guardarHabitoActual();
}

function guardarHabitoEnDiario() {
  if (!habitoActivo) return;

  const descripcion = habitoActivo.nombre
    ? "Hábito: " + habitoActivo.nombre
    : "Ejercicio de hábitos";

  const sesion = {
    tema: "habitos",
    descripcion: descripcion,
    emocionInicial: "deseo",
    intensidadInicial: habitoActivo.intensidadInicial,
    necesidad: habitoActivo.necesidadAntes || "no_se",
    emocionFinal: habitoActivo.intensidadFinal <= 3 ? "coraje" : "deseo",
    intensidadFinal: habitoActivo.intensidadFinal,
    beneficio: habitoActivo.beneficio || "",
    tecnica: "habitos"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(HABITOS_CONFIG.clave);
  habitoActivo = null;
  navigateTo("diario", true);
}

function reiniciarHabito() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(HABITOS_CONFIG.clave);
  abrirHabitos();
}

// ===== MÓDULO DE DINERO / ABUNDANCIA =====

const DINERO_CONFIG = {
  titulo: "Liberar tu relación con el dinero",
  descripcion: "Trabaja con tus creencias heredadas, tus miedos, tu relación con el dinero y tu visualización de abundancia.",
  clave: "soltar_ejercicio_dinero_v1"
};

const DINERO_LIMPIEZA_FASES = [
  {
    id: "control",
    containerId: "dineroLimpiezaControl",
    preguntas: [
      { texto: "¿Alguna vez sentiste que el dinero intentaba controlarte?", tipo: "si_no" },
      { texto: "¿Intentaste tú controlar el dinero?", tipo: "si_no" },
      { texto: "¿Le concedes ahora al dinero el derecho de ser como es?", tipo: "decision" }
    ]
  },
  {
    id: "aprobacion",
    containerId: "dineroLimpiezaAprobacion",
    preguntas: [
      { texto: "¿Te disgustaba o desaprobabas algo del dinero?", tipo: "si_no" },
      { texto: "¿Sentías que al dinero no le gustabas o te desaprobaba?", tipo: "si_no" },
      { texto: "¿Tenés únicamente un sentimiento de amor y aceptación hacia el dinero?", tipo: "decision" }
    ]
  },
  {
    id: "seguridad",
    containerId: "dineroLimpiezaSeguridad",
    preguntas: [
      { texto: "¿El dinero te desafió, te amenazó o se te opuso?", tipo: "si_no" },
      { texto: "¿Desafiaste, amenazaste o te opusiste al dinero?", tipo: "si_no" },
      { texto: "¿Tenés únicamente un sentimiento de bienestar, seguridad y confianza con el dinero?", tipo: "decision" }
    ]
  }
];

let dineroActivo = null;

function abrirDinero() {
  dineroActivo = cargarDinero() || {
    intensidadInicial: 5,
    padresActitud: "",
    patron: "",
    soltariaPadres: null,
    soltariaImitar: null,
    propiaActitud: "",
    miedos: [],
    limpieza: DINERO_LIMPIEZA_FASES.map(f => ({
      id: f.id,
      respuestas: f.preguntas.map(p => ({
        texto: p.texto,
        tipo: p.tipo,
        respuesta: null,
        notas: ""
      }))
    })),
    gustos: [],
    aversiones: [],
    ventajas: [],
    inconvenientes: [],
    visualizacion: "",
    objeciones: [],
    aceptaAbundancia: null,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderDinero();
  navigateTo("ejercicio-dinero");
}

function cargarDinero() {
  try {
    return JSON.parse(localStorage.getItem(DINERO_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarDineroActual() {
  if (!dineroActivo) return;
  localStorage.setItem(DINERO_CONFIG.clave, JSON.stringify(dineroActivo));
}

function renderDinero() {
  if (!dineroActivo) return;

  // Intensidad inicial
  const intInicial = document.getElementById("dineroIntensidadInicial");
  if (intInicial) intInicial.value = dineroActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("dineroIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = dineroActivo.intensidadInicial;

  // Paso 1: Padres
  const padresInput = document.getElementById("dineroPadresActitudInput");
  if (padresInput) padresInput.value = dineroActivo.padresActitud || "";
  const patronInput = document.getElementById("dineroPatronInput");
  if (patronInput) patronInput.value = dineroActivo.patron || "";
  const propiaInput = document.getElementById("dineroPropiaActitudInput");
  if (propiaInput) propiaInput.value = dineroActivo.propiaActitud || "";

  document.querySelectorAll("[data-dinero-soltaria-padres]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.dineroSoltariaPadres === dineroActivo.soltariaPadres);
  });

  document.querySelectorAll("[data-dinero-soltaria-imitar]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.dineroSoltariaImitar === dineroActivo.soltariaImitar);
  });

  // Paso 2: Miedos
  renderDineroMiedos();

  // Paso 3: Limpieza
  renderDineroLimpieza();

  // Paso 4 y 5: Listas
  renderDineroListas();

  // Paso 6: Visualización
  const visInput = document.getElementById("dineroVisualizacionInput");
  if (visInput) visInput.value = dineroActivo.visualizacion || "";
  renderDineroObjeciones();

  document.querySelectorAll("[data-dinero-acepta-abundancia]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.dineroAceptaAbundancia === dineroActivo.aceptaAbundancia);
  });

  // Paso 7: Cierre
  const intFinal = document.getElementById("dineroIntensidadFinal");
  if (intFinal) intFinal.value = dineroActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("dineroIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = dineroActivo.intensidadFinal;

  const benInput = document.getElementById("dineroBeneficioInput");
  if (benInput) benInput.value = dineroActivo.beneficio || "";
}

function renderDineroMiedos() {
  const container = document.getElementById("dineroMiedosLista");
  if (!container) return;

  if (!dineroActivo.miedos.length) {
    container.innerHTML = '<p class="empty">Agregá al menos un miedo para trabajar.</p>';
    return;
  }

  container.innerHTML = dineroActivo.miedos.map(miedo => {
    return `
      <article class="entrada-item ${miedo.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(miedo.texto)}</p>
        <div class="mini-card" style="margin: 8px 0;">
          <p class="small"><strong>Preguntate:</strong> ¿Podría soltar el deseo de que esto ocurra?</p>
        </div>
        <div class="entrada-acciones">
          <button type="button" class="button small ${miedo.liberado ? "secondary" : ""}" data-action="dinero-toggle-miedo" data-dinero-miedo-id="${miedo.id}">
            ${miedo.liberado ? "Soltado ✓" : "Marcar como soltado"}
          </button>
          <button type="button" class="delete-button" data-action="dinero-borrar-miedo" data-dinero-miedo-id="${miedo.id}">
            Borrar
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderDineroLimpieza() {
  DINERO_LIMPIEZA_FASES.forEach((faseDef, fIndex) => {
    const container = document.getElementById(faseDef.containerId);
    if (!container) return;

    const fase = dineroActivo.limpieza[fIndex];
    if (!fase) return;

    container.innerHTML = fase.respuestas.map((resp, pIndex) => {
      let inputHTML = "";

      if (resp.tipo === "si_no") {
        inputHTML = `
          <div class="limpieza-respuesta">
            <button type="button" class="button small ${resp.respuesta === 'si' ? '' : 'secondary'}" 
                    data-action="dinero-limpieza-respuesta" data-fase="${fIndex}" data-pregunta="${pIndex}" data-valor="si">
              Sí
            </button>
            <button type="button" class="button small ${resp.respuesta === 'no' ? '' : 'secondary'}" 
                    data-action="dinero-limpieza-respuesta" data-fase="${fIndex}" data-pregunta="${pIndex}" data-valor="no">
              No
            </button>
            <button type="button" class="button small ${resp.respuesta === 'todavia_no' ? '' : 'secondary'}" 
                    data-action="dinero-limpieza-respuesta" data-fase="${fIndex}" data-pregunta="${pIndex}" data-valor="todavia_no">
              Todavía no
            </button>
          </div>
        `;
      } else if (resp.tipo === "decision") {
        inputHTML = `
          <div class="limpieza-respuesta">
            <button type="button" class="button small ${resp.respuesta === 'si' ? '' : 'secondary'}" 
                    data-action="dinero-limpieza-respuesta" data-fase="${fIndex}" data-pregunta="${pIndex}" data-valor="si">
              Sí (decisión tomada)
            </button>
            <button type="button" class="button small ${resp.respuesta === 'no' ? '' : 'secondary'}" 
                    data-action="dinero-limpieza-respuesta" data-fase="${fIndex}" data-pregunta="${pIndex}" data-valor="no">
              Todavía no
            </button>
          </div>
        `;
      }

      const notaValue = resp.notas || "";

      return `
        <div class="limpieza-pregunta-card ${resp.respuesta === 'si' && resp.tipo === 'decision' ? 'completada' : ''}">
          <p class="limpieza-pregunta-texto">${escapeHTML(resp.texto)}</p>
          ${inputHTML}
          <label class="limpieza-nota-label">
            Notas (opcional)
            <textarea class="limpieza-nota dinero-limpieza-nota" 
                      data-fase="${fIndex}" data-pregunta="${pIndex}"
                      placeholder="Anota lo que surja al liberar..."
            >${escapeHTML(notaValue)}</textarea>
          </label>
        </div>
      `;
    }).join("");
  });
}

function renderDineroListas() {
  renderDineroListaTipo("dineroGustosLista", dineroActivo.gustos, "gusto");
  renderDineroListaTipo("dineroAversionesLista", dineroActivo.aversiones, "aversion");
  renderDineroListaTipo("dineroVentajasLista", dineroActivo.ventajas, "ventaja");
  renderDineroListaTipo("dineroInconvenientesLista", dineroActivo.inconvenientes, "inconveniente");
}

function renderDineroListaTipo(containerId, lista, tipo) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!lista.length) {
    container.innerHTML = '<p class="empty">Agregá al menos un elemento.</p>';
    return;
  }

  container.innerHTML = lista.map(item => dineroItemHTML(item, tipo)).join("");
}

function dineroItemHTML(item, tipo) {
  const opciones = DESEOS_EJERCICIO.map(d =>
    `<option value="${d.id}" ${d.id === item.deseo ? "selected" : ""}>${d.nombre}</option>`
  ).join("");

  return `
    <article class="entrada-item ${item.liberado ? "liberado" : ""}">
      <p class="entrada-texto">${escapeHTML(item.texto)}</p>
      <label class="entrada-deseo-label">
        Necesidad detrás
        <select data-dinero-item-deseo="${item.id}" data-dinero-item-tipo="${tipo}">${opciones}</select>
      </label>
      <div class="entrada-acciones">
        <button type="button" class="button small ${item.liberado ? "secondary" : ""}" data-action="dinero-toggle-item" data-dinero-item-id="${item.id}" data-dinero-item-tipo="${tipo}">
          ${item.liberado ? "Liberado ✓" : "Marcar liberado"}
        </button>
        <button type="button" class="delete-button" data-action="dinero-borrar-item" data-dinero-item-id="${item.id}" data-dinero-item-tipo="${tipo}">
          Borrar
        </button>
      </div>
    </article>
  `;
}

function renderDineroObjeciones() {
  const container = document.getElementById("dineroObjecionesLista");
  if (!container) return;

  if (!dineroActivo.objeciones.length) {
    container.innerHTML = '<p class="empty">No hay objeciones registradas.</p>';
    return;
  }

  container.innerHTML = dineroActivo.objeciones.map(obj => {
    const opciones = DESEOS_EJERCICIO.map(d =>
      `<option value="${d.id}" ${d.id === obj.deseo ? "selected" : ""}>${d.nombre}</option>`
    ).join("");

    return `
      <article class="entrada-item ${obj.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(obj.texto)}</p>
        <label class="entrada-deseo-label">
          Necesidad detrás
          <select data-dinero-objecion-deseo="${obj.id}">${opciones}</select>
        </label>
        <div class="entrada-acciones">
          <button type="button" class="button small ${obj.liberado ? "secondary" : ""}" data-action="dinero-toggle-objecion" data-dinero-objecion-id="${obj.id}">
            ${obj.liberado ? "Liberado ✓" : "Marcar liberado"}
          </button>
          <button type="button" class="delete-button" data-action="dinero-borrar-objecion" data-dinero-objecion-id="${obj.id}">
            Borrar
          </button>
        </div>
      </article>
    `;
  }).join("");
}

// Setters
function setDineroCampo(campo, valor) {
  if (!dineroActivo) return;
  dineroActivo[campo] = valor;
  guardarDineroActual();
}

function setDineroIntensidad(tipo, valor) {
  if (!dineroActivo) return;
  const num = Number(valor);
  if (tipo === "inicial") {
    dineroActivo.intensidadInicial = num;
    const txt = document.getElementById("dineroIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    dineroActivo.intensidadFinal = num;
    const txt = document.getElementById("dineroIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }
  guardarDineroActual();
}

function setDineroSoltaria(tipo, valor) {
  if (!dineroActivo) return;
  if (tipo === "padres") dineroActivo.soltariaPadres = valor;
  else if (tipo === "imitar") dineroActivo.soltariaImitar = valor;
  guardarDineroActual();
  renderDinero();
}

function setDineroAceptaAbundancia(valor) {
  if (!dineroActivo) return;
  dineroActivo.aceptaAbundancia = valor;
  guardarDineroActual();
  renderDinero();
}

function agregarDineroMiedo() {
  if (!dineroActivo) return;
  const input = document.getElementById("dineroMiedoInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  dineroActivo.miedos.push({
    id: "dmi_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    liberado: false
  });

  input.value = "";
  guardarDineroActual();
  renderDineroMiedos();
}

function toggleDineroMiedo(id) {
  if (!dineroActivo) return;
  const miedo = dineroActivo.miedos.find(m => m.id === id);
  if (!miedo) return;
  miedo.liberado = !miedo.liberado;
  guardarDineroActual();
  renderDineroMiedos();
}

function borrarDineroMiedo(id) {
  if (!dineroActivo) return;
  if (!confirm("¿Borrar este miedo?")) return;
  dineroActivo.miedos = dineroActivo.miedos.filter(m => m.id !== id);
  guardarDineroActual();
  renderDineroMiedos();
}

function setDineroLimpiezaRespuesta(faseIndex, preguntaIndex, valor) {
  if (!dineroActivo) return;
  dineroActivo.limpieza[faseIndex].respuestas[preguntaIndex].respuesta = valor;
  guardarDineroActual();
  renderDineroLimpieza();
}

function setDineroLimpiezaNota(faseIndex, preguntaIndex, nota) {
  if (!dineroActivo) return;
  dineroActivo.limpieza[faseIndex].respuestas[preguntaIndex].notas = nota;
  guardarDineroActual();
}

function agregarDineroItem(tipo) {
  if (!dineroActivo) return;

  const mapInputs = {
    gusto: "dineroGustoInput",
    aversion: "dineroAversionInput",
    ventaja: "dineroVentajaInput",
    inconveniente: "dineroInconvenienteInput"
  };

  const input = document.getElementById(mapInputs[tipo]);
  if (!input) return;

  const texto = (input.value || "").trim();
  if (!texto) return;

  const nuevo = {
    id: "din_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  };

  const listas = {
    gusto: "gustos",
    aversion: "aversiones",
    ventaja: "ventajas",
    inconveniente: "inconvenientes"
  };

  dineroActivo[listas[tipo]].push(nuevo);
  input.value = "";
  guardarDineroActual();
  renderDineroListas();
}

function toggleDineroItem(itemId, tipo) {
  if (!dineroActivo) return;

  const listas = {
    gusto: "gustos",
    aversion: "aversiones",
    ventaja: "ventajas",
    inconveniente: "inconvenientes"
  };

  const lista = dineroActivo[listas[tipo]];
  const item = lista.find(i => i.id === itemId);
  if (!item) return;

  item.liberado = !item.liberado;
  guardarDineroActual();
  renderDineroListas();
}

function borrarDineroItem(itemId, tipo) {
  if (!dineroActivo) return;
  if (!confirm("¿Borrar este elemento?")) return;

  const listas = {
    gusto: "gustos",
    aversion: "aversiones",
    ventaja: "ventajas",
    inconveniente: "inconvenientes"
  };

  dineroActivo[listas[tipo]] = dineroActivo[listas[tipo]].filter(i => i.id !== itemId);
  guardarDineroActual();
  renderDineroListas();
}

function setDineroItemDeseo(itemId, tipo, nuevoDeseo) {
  if (!dineroActivo) return;

  const listas = {
    gusto: "gustos",
    aversion: "aversiones",
    ventaja: "ventajas",
    inconveniente: "inconvenientes"
  };

  const lista = dineroActivo[listas[tipo]];
  const item = lista.find(i => i.id === itemId);
  if (!item) return;

  item.deseo = nuevoDeseo;
  guardarDineroActual();
}

function agregarDineroObjecion() {
  if (!dineroActivo) return;
  const input = document.getElementById("dineroObjecionInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  dineroActivo.objeciones.push({
    id: "dobj_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  });

  input.value = "";
  guardarDineroActual();
  renderDineroObjeciones();
}

function toggleDineroObjecion(id) {
  if (!dineroActivo) return;
  const obj = dineroActivo.objeciones.find(o => o.id === id);
  if (!obj) return;
  obj.liberado = !obj.liberado;
  guardarDineroActual();
  renderDineroObjeciones();
}

function borrarDineroObjecion(id) {
  if (!dineroActivo) return;
  if (!confirm("¿Borrar esta objeción?")) return;
  dineroActivo.objeciones = dineroActivo.objeciones.filter(o => o.id !== id);
  guardarDineroActual();
  renderDineroObjeciones();
}

function setDineroObjecionDeseo(id, nuevoDeseo) {
  if (!dineroActivo) return;
  const obj = dineroActivo.objeciones.find(o => o.id === id);
  if (!obj) return;
  obj.deseo = nuevoDeseo;
  guardarDineroActual();
}

function guardarDineroEnDiario() {
  if (!dineroActivo) return;

  const descripcion = dineroActivo.padresActitud
    ? "Liberación de relación con el dinero. Patrón familiar: " + dineroActivo.padresActitud.substring(0, 100)
    : "Ejercicio de liberación de relación con el dinero";

  const sesion = {
    tema: "dinero",
    descripcion: descripcion,
    emocionInicial: "miedo",
    intensidadInicial: dineroActivo.intensidadInicial,
    necesidad: "seguridad",
    emocionFinal: dineroActivo.intensidadFinal <= 3 ? "aceptacion" : "miedo",
    intensidadFinal: dineroActivo.intensidadFinal,
    beneficio: dineroActivo.beneficio || "",
    tecnica: "dinero"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(DINERO_CONFIG.clave);
  dineroActivo = null;
  navigateTo("diario", true);
}

function reiniciarDinero() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(DINERO_CONFIG.clave);
  abrirDinero();
}

// ===== MÓDULO DE RELACIONES =====

const RELACIONES_CONFIG = {
  titulo: "Liberar tu relación",
  descripcion: "Trabaja tu relación con tus padres, tus miedos, tus gustos y aversiones, quema tus listas internas de reproches y visualiza tu relación ideal.",
  clave: "soltar_ejercicio_relaciones_v1"
};

let relacionesActivo = null;

function abrirRelaciones() {
  relacionesActivo = cargarRelaciones() || {
    persona: "",
    intensidadInicial: 5,
    padres: "",
    amigos: "",
    deseoPadres: null,
    soltariaPadres: null,
    miedos: [],
    gustos: [],
    aversiones: [],
    listaInterna: [],
    desacuerdoTema: "",
    desacuerdoMiVista: "",
    desacuerdoOtroVista: "",
    soltariaDesacuerdo: null,
    visualizacion: "",
    objeciones: [],
    aceptaRelacionIdeal: null,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderRelaciones();
  navigateTo("ejercicio-relaciones");
}

function abrirRelacionesLimpieza() {
  abrirLimpieza();
  if (!limpiezaActiva || !relacionesActivo || !relacionesActivo.persona) return;
  setLimpiPersona(relacionesActivo.persona);
  const input = document.getElementById("limpiezaPersona");
  if (input) input.value = relacionesActivo.persona;
}

function cargarRelaciones() {
  try {
    return JSON.parse(localStorage.getItem(RELACIONES_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarRelacionesActual() {
  if (!relacionesActivo) return;
  localStorage.setItem(RELACIONES_CONFIG.clave, JSON.stringify(relacionesActivo));
}

function renderRelaciones() {
  if (!relacionesActivo) return;

  const personaInput = document.getElementById("relacionesPersonaInput");
  if (personaInput) personaInput.value = relacionesActivo.persona || "";

  const intInicial = document.getElementById("relacionesIntensidadInicial");
  if (intInicial) intInicial.value = relacionesActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("relacionesIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = relacionesActivo.intensidadInicial;

  // Paso 1: Padres
  const padresInput = document.getElementById("relacionesPadresInput");
  if (padresInput) padresInput.value = relacionesActivo.padres || "";

  const amigosInput = document.getElementById("relacionesAmigosInput");
  if (amigosInput) amigosInput.value = relacionesActivo.amigos || "";

  document.querySelectorAll("[data-relaciones-deseo-padres]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.relacionesDeseoPadres === relacionesActivo.deseoPadres);
  });

  document.querySelectorAll("[data-relaciones-soltaria-padres]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.relacionesSoltariaPadres === relacionesActivo.soltariaPadres);
  });

  // Paso 2: Miedos
  renderRelacionesMiedos();

  // Paso 3: Listas de gustos/aversiones
  renderRelacionesListas();

  // Paso 5: Lista interna
  renderRelacionesListaInterna();

  // Paso 6: Desacuerdo
  const temaDesac = document.getElementById("relacionesDesacuerdoTemaInput");
  if (temaDesac) temaDesac.value = relacionesActivo.desacuerdoTema || "";

  const miVista = document.getElementById("relacionesDesacuerdoMiVistaInput");
  if (miVista) miVista.value = relacionesActivo.desacuerdoMiVista || "";

  const otroVista = document.getElementById("relacionesDesacuerdoOtroVistaInput");
  if (otroVista) otroVista.value = relacionesActivo.desacuerdoOtroVista || "";

  document.querySelectorAll("[data-relaciones-soltaria-desacuerdo]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.relacionesSoltariaDesacuerdo === relacionesActivo.soltariaDesacuerdo);
  });

  // Paso 7: Visualización
  const visInput = document.getElementById("relacionesVisualizacionInput");
  if (visInput) visInput.value = relacionesActivo.visualizacion || "";
  renderRelacionesObjeciones();

  document.querySelectorAll("[data-relaciones-acepta-ideal]").forEach(btn => {
    btn.classList.toggle("active-choice", btn.dataset.relacionesAceptaIdeal === relacionesActivo.aceptaRelacionIdeal);
  });

  // Paso 8: Cierre
  const intFinal = document.getElementById("relacionesIntensidadFinal");
  if (intFinal) intFinal.value = relacionesActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("relacionesIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = relacionesActivo.intensidadFinal;

  const benInput = document.getElementById("relacionesBeneficioInput");
  if (benInput) benInput.value = relacionesActivo.beneficio || "";
}

function renderRelacionesMiedos() {
  const container = document.getElementById("relacionesMiedosLista");
  if (!container) return;

  if (!relacionesActivo.miedos.length) {
    container.innerHTML = '<p class="empty">Agregá al menos un miedo para trabajar.</p>';
    return;
  }

  container.innerHTML = relacionesActivo.miedos.map(miedo => {
    return `
      <article class="entrada-item ${miedo.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(miedo.texto)}</p>
        <div class="mini-card" style="margin: 8px 0;">
          <p class="small"><strong>Preguntate:</strong> ¿Podría soltar el deseo de que esto ocurra?</p>
        </div>
        <div class="entrada-acciones">
          <button type="button" class="button small ${miedo.liberado ? "secondary" : ""}" data-action="relaciones-toggle-miedo" data-relaciones-miedo-id="${miedo.id}">
            ${miedo.liberado ? "Soltado ✓" : "Marcar como soltado"}
          </button>
          <button type="button" class="delete-button" data-action="relaciones-borrar-miedo" data-relaciones-miedo-id="${miedo.id}">
            Borrar
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderRelacionesListas() {
  renderRelacionesListaTipo("relacionesGustosLista", relacionesActivo.gustos, "gusto");
  renderRelacionesListaTipo("relacionesAversionesLista", relacionesActivo.aversiones, "aversion");
}

function renderRelacionesListaTipo(containerId, lista, tipo) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!lista.length) {
    container.innerHTML = '<p class="empty">Agregá al menos un elemento.</p>';
    return;
  }

  container.innerHTML = lista.map(item => relacionesItemHTML(item, tipo)).join("");
}

function relacionesItemHTML(item, tipo) {
  const opciones = DESEOS_EJERCICIO.map(d =>
    `<option value="${d.id}" ${d.id === item.deseo ? "selected" : ""}>${d.nombre}</option>`
  ).join("");

  return `
    <article class="entrada-item ${item.liberado ? "liberado" : ""}">
      <p class="entrada-texto">${escapeHTML(item.texto)}</p>
      <label class="entrada-deseo-label">
        Necesidad detrás
        <select data-relaciones-item-deseo="${item.id}" data-relaciones-item-tipo="${tipo}">${opciones}</select>
      </label>
      <div class="entrada-acciones">
        <button type="button" class="button small ${item.liberado ? "secondary" : ""}" data-action="relaciones-toggle-item" data-relaciones-item-id="${item.id}" data-relaciones-item-tipo="${tipo}">
          ${item.liberado ? "Liberado ✓" : "Marcar liberado"}
        </button>
        <button type="button" class="delete-button" data-action="relaciones-borrar-item" data-relaciones-item-id="${item.id}" data-relaciones-item-tipo="${tipo}">
          Borrar
        </button>
      </div>
    </article>
  `;
}

function renderRelacionesListaInterna() {
  const container = document.getElementById("relacionesListaInterna");
  if (!container) return;

  if (!relacionesActivo.listaInterna.length) {
    container.innerHTML = '<p class="empty">Agregá los reproches de tu lista interna para quemarlos.</p>';
    return;
  }

  container.innerHTML = relacionesActivo.listaInterna.map(item => {
    return `
      <article class="entrada-item ${item.quemado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(item.texto)}</p>
        <div class="entrada-acciones">
          <button type="button" class="button small ${item.quemado ? "secondary" : ""}" data-action="relaciones-toggle-lista" data-relaciones-lista-id="${item.id}">
            ${item.quemado ? "Quemado ✓" : "Quemar este reproche"}
          </button>
          <button type="button" class="delete-button" data-action="relaciones-borrar-lista" data-relaciones-lista-id="${item.id}">
            Borrar
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderRelacionesObjeciones() {
  const container = document.getElementById("relacionesObjecionesLista");
  if (!container) return;

  if (!relacionesActivo.objeciones.length) {
    container.innerHTML = '<p class="empty">No hay objeciones registradas.</p>';
    return;
  }

  container.innerHTML = relacionesActivo.objeciones.map(obj => {
    const opciones = DESEOS_EJERCICIO.map(d =>
      `<option value="${d.id}" ${d.id === obj.deseo ? "selected" : ""}>${d.nombre}</option>`
    ).join("");

    return `
      <article class="entrada-item ${obj.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(obj.texto)}</p>
        <label class="entrada-deseo-label">
          Necesidad detrás
          <select data-relaciones-objecion-deseo="${obj.id}">${opciones}</select>
        </label>
        <div class="entrada-acciones">
          <button type="button" class="button small ${obj.liberado ? "secondary" : ""}" data-action="relaciones-toggle-objecion" data-relaciones-objecion-id="${obj.id}">
            ${obj.liberado ? "Liberado ✓" : "Marcar liberado"}
          </button>
          <button type="button" class="delete-button" data-action="relaciones-borrar-objecion" data-relaciones-objecion-id="${obj.id}">Borrar</button>
        </div>
      </article>
    `;
  }).join("");
}

function setRelacionesCampo(campo, valor) {
  if (!relacionesActivo) return;
  relacionesActivo[campo] = valor;
  guardarRelacionesActual();
}

function setRelacionesIntensidad(tipo, valor) {
  if (!relacionesActivo) return;
  const num = Number(valor);
  if (tipo === "inicial") {
    relacionesActivo.intensidadInicial = num;
    const txt = document.getElementById("relacionesIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    relacionesActivo.intensidadFinal = num;
    const txt = document.getElementById("relacionesIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }
  guardarRelacionesActual();
}

function setRelacionesDeseoPadres(valor) {
  if (!relacionesActivo) return;
  relacionesActivo.deseoPadres = valor;
  guardarRelacionesActual();
  renderRelaciones();
}

function setRelacionesSoltariaPadres(valor) {
  if (!relacionesActivo) return;
  relacionesActivo.soltariaPadres = valor;
  guardarRelacionesActual();
  renderRelaciones();
}

function setRelacionesSoltariaDesacuerdo(valor) {
  if (!relacionesActivo) return;
  relacionesActivo.soltariaDesacuerdo = valor;
  guardarRelacionesActual();
  renderRelaciones();
}

function setRelacionesAceptaIdeal(valor) {
  if (!relacionesActivo) return;
  relacionesActivo.aceptaRelacionIdeal = valor;
  guardarRelacionesActual();
  renderRelaciones();
}

function agregarRelacionesMiedo() {
  if (!relacionesActivo) return;
  const input = document.getElementById("relacionesMiedoInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  relacionesActivo.miedos.push({
    id: "rel_m_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    liberado: false
  });

  input.value = "";
  guardarRelacionesActual();
  renderRelacionesMiedos();
}

function toggleRelacionesMiedo(id) {
  if (!relacionesActivo) return;
  const miedo = relacionesActivo.miedos.find(m => m.id === id);
  if (!miedo) return;
  miedo.liberado = !miedo.liberado;
  guardarRelacionesActual();
  renderRelacionesMiedos();
}

function borrarRelacionesMiedo(id) {
  if (!relacionesActivo) return;
  if (!confirm("¿Borrar este miedo?")) return;
  relacionesActivo.miedos = relacionesActivo.miedos.filter(m => m.id !== id);
  guardarRelacionesActual();
  renderRelacionesMiedos();
}

function agregarRelacionesLista() {
  if (!relacionesActivo) return;
  const input = document.getElementById("relacionesListaInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  relacionesActivo.listaInterna.push({
    id: "rel_l_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    quemado: false
  });

  input.value = "";
  guardarRelacionesActual();
  renderRelacionesListaInterna();
}

function toggleRelacionesLista(id) {
  if (!relacionesActivo) return;
  const item = relacionesActivo.listaInterna.find(i => i.id === id);
  if (!item) return;
  item.quemado = !item.quemado;
  guardarRelacionesActual();
  renderRelacionesListaInterna();
}

function borrarRelacionesLista(id) {
  if (!relacionesActivo) return;
  if (!confirm("¿Borrar este reproche?")) return;
  relacionesActivo.listaInterna = relacionesActivo.listaInterna.filter(i => i.id !== id);
  guardarRelacionesActual();
  renderRelacionesListaInterna();
}

function agregarRelacionesItem(tipo) {
  if (!relacionesActivo) return;

  const mapInputs = {
    gusto: "relacionesGustoInput",
    aversion: "relacionesAversionInput"
  };

  const input = document.getElementById(mapInputs[tipo]);
  if (!input) return;

  const texto = (input.value || "").trim();
  if (!texto) return;

  const nuevo = {
    id: "rel_i_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  };

  const listas = {
    gusto: "gustos",
    aversion: "aversiones"
  };

  relacionesActivo[listas[tipo]].push(nuevo);
  input.value = "";
  guardarRelacionesActual();
  renderRelacionesListas();
}

function toggleRelacionesItem(itemId, tipo) {
  if (!relacionesActivo) return;

  const listas = {
    gusto: "gustos",
    aversion: "aversiones"
  };

  const lista = relacionesActivo[listas[tipo]];
  const item = lista.find(i => i.id === itemId);
  if (!item) return;

  item.liberado = !item.liberado;
  guardarRelacionesActual();
  renderRelacionesListas();
}

function borrarRelacionesItem(itemId, tipo) {
  if (!relacionesActivo) return;
  if (!confirm("¿Borrar este elemento?")) return;

  const listas = {
    gusto: "gustos",
    aversion: "aversiones"
  };

  relacionesActivo[listas[tipo]] = relacionesActivo[listas[tipo]].filter(i => i.id !== itemId);
  guardarRelacionesActual();
  renderRelacionesListas();
}

function setRelacionesItemDeseo(itemId, tipo, nuevoDeseo) {
  if (!relacionesActivo) return;

  const listas = {
    gusto: "gustos",
    aversion: "aversiones"
  };

  const lista = relacionesActivo[listas[tipo]];
  const item = lista.find(i => i.id === itemId);
  if (!item) return;

  item.deseo = nuevoDeseo;
  guardarRelacionesActual();
}

function agregarRelacionesObjecion() {
  if (!relacionesActivo) return;
  const input = document.getElementById("relacionesObjecionInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  relacionesActivo.objeciones.push({
    id: "rel_o_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  });

  input.value = "";
  guardarRelacionesActual();
  renderRelacionesObjeciones();
}

function toggleRelacionesObjecion(id) {
  if (!relacionesActivo) return;
  const obj = relacionesActivo.objeciones.find(o => o.id === id);
  if (!obj) return;
  obj.liberado = !obj.liberado;
  guardarRelacionesActual();
  renderRelacionesObjeciones();
}

function borrarRelacionesObjecion(id) {
  if (!relacionesActivo) return;
  if (!confirm("¿Borrar esta objeción?")) return;
  relacionesActivo.objeciones = relacionesActivo.objeciones.filter(o => o.id !== id);
  guardarRelacionesActual();
  renderRelacionesObjeciones();
}

function setRelacionesObjecionDeseo(id, nuevoDeseo) {
  if (!relacionesActivo) return;
  const obj = relacionesActivo.objeciones.find(o => o.id === id);
  if (!obj) return;
  obj.deseo = nuevoDeseo;
  guardarRelacionesActual();
}

function guardarRelacionesEnDiario() {
  if (!relacionesActivo) return;

  const descripcion = relacionesActivo.persona
    ? "Relación: " + relacionesActivo.persona
    : "Ejercicio de relaciones";

  const sesion = {
    tema: "relaciones",
    descripcion: descripcion,
    emocionInicial: "deseo",
    intensidadInicial: relacionesActivo.intensidadInicial,
    necesidad: relacionesActivo.deseoPadres || "aprobacion",
    emocionFinal: relacionesActivo.intensidadFinal <= 3 ? "paz" : "deseo",
    intensidadFinal: relacionesActivo.intensidadFinal,
    beneficio: relacionesActivo.beneficio || "",
    tecnica: "relaciones"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(RELACIONES_CONFIG.clave);
  relacionesActivo = null;
  navigateTo("diario", true);
}

function reiniciarRelaciones() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(RELACIONES_CONFIG.clave);
  abrirRelaciones();
}

// ===== MÓDULO DE SALUD =====

const SALUD_CONFIG = {
  titulo: "Salud y cuerpo",
  descripcion: "Trabaja con los 5 pasos para afrontar la incomodidad, los miedos al cuerpo, tus gustos y aversiones, la limpieza con tu cuerpo y la visualización de tu cuerpo ideal.",
  clave: "soltar_ejercicio_salud_v1"
};

const SALUD_CHOICES = [
  { attr: "data-salud-abierto-cura", campo: "abiertoCura" },
  { attr: "data-salud-deseo-cura", campo: "deseoCura" },
  { attr: "data-salud-soltaria-cura", campo: "soltariaCura" },
  { attr: "data-salud-soltaria-desaprobacion", campo: "soltariaDesaprobacion" },
  { attr: "data-salud-prefiere", campo: "prefiere" },
  { attr: "data-salud-soltaria-saber", campo: "soltariaSaberPorque" },
  { attr: "data-salud-soltaria-pasado", campo: "soltariaCambiarPasado" },
  { attr: "data-salud-soltaria-creer", campo: "soltariaCreerDiagnostico" },
  { attr: "data-salud-soltaria-sintoma", campo: "soltariaSintoma" },
  { attr: "data-salud-acepta-cuerpo", campo: "aceptaCuerpo" },
  { attr: "data-salud-soltaria-padres", campo: "soltariaPadres" },
  { attr: "data-salud-soltaria-resistencia", campo: "soltariaResistencia" },
  { attr: "data-salud-acepta-ideal", campo: "aceptaCuerpoIdeal" }
];

const SALUD_ITEMS_TIPOS = [
  { tipo: "gusto", estado: "gustos", container: "saludGustosLista", input: "saludGustoInput", label: "gusto" },
  { tipo: "aversion", estado: "aversiones", container: "saludAversionesLista", input: "saludAversionInput", label: "aversión" },
  { tipo: "ventaja", estado: "ventajas", container: "saludVentajasLista", input: "saludVentajaInput", label: "ventaja" },
  { tipo: "inconveniente", estado: "inconvenientes", container: "saludInconvenientesLista", input: "saludInconvenienteInput", label: "inconveniente" }
];

let saludActivo = null;

function abrirSalud() {
  saludActivo = cargarSalud() || {
    preocupacion: "",
    intensidadInicial: 5,
    abiertoCura: null,
    deseoCura: null,
    soltariaCura: null,
    desaprobacion: "",
    soltariaDesaprobacion: null,
    prefiere: null,
    soltariaSaberPorque: null,
    miedoMedicos: "",
    diagnostico: "",
    soltariaCambiarPasado: null,
    soltariaCreerDiagnostico: null,
    sintoma: "",
    soltariaSintoma: null,
    aceptaCuerpo: null,
    actitudPadres: "",
    soltariaPadres: null,
    soltariaResistencia: null,
    miedos: [],
    gustos: [],
    aversiones: [],
    ventajas: [],
    inconvenientes: [],
    visualizacion: "",
    objeciones: [],
    aceptaCuerpoIdeal: null,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderSalud();
  navigateTo("ejercicio-salud");
}

function abrirSaludLimpieza() {
  abrirLimpieza();
  if (!limpiezaActiva) return;
  const persona = (saludActivo && saludActivo.preocupacion) || "mi cuerpo";
  setLimpiPersona(persona);
  const input = document.getElementById("limpiezaPersona");
  if (input) input.value = persona;
}

function cargarSalud() {
  try {
    return JSON.parse(localStorage.getItem(SALUD_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarSaludActual() {
  if (!saludActivo) return;
  localStorage.setItem(SALUD_CONFIG.clave, JSON.stringify(saludActivo));
}

function renderSalud() {
  if (!saludActivo) return;

  const preocupacionInput = document.getElementById("saludPreocupacionInput");
  if (preocupacionInput) preocupacionInput.value = saludActivo.preocupacion || "";

  const intInicial = document.getElementById("saludIntensidadInicial");
  if (intInicial) intInicial.value = saludActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("saludIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = saludActivo.intensidadInicial;

  const desaprobacionInput = document.getElementById("saludDesaprobacionInput");
  if (desaprobacionInput) desaprobacionInput.value = saludActivo.desaprobacion || "";

  const miedoMedicosInput = document.getElementById("saludMiedoMedicosInput");
  if (miedoMedicosInput) miedoMedicosInput.value = saludActivo.miedoMedicos || "";

  const diagnosticoInput = document.getElementById("saludDiagnosticoInput");
  if (diagnosticoInput) diagnosticoInput.value = saludActivo.diagnostico || "";

  const sintomaInput = document.getElementById("saludSintomaInput");
  if (sintomaInput) sintomaInput.value = saludActivo.sintoma || "";

  const actitudPadresInput = document.getElementById("saludActitudPadresInput");
  if (actitudPadresInput) actitudPadresInput.value = saludActivo.actitudPadres || "";

  const visualizacionInput = document.getElementById("saludVisualizacionInput");
  if (visualizacionInput) visualizacionInput.value = saludActivo.visualizacion || "";

  const intFinal = document.getElementById("saludIntensidadFinal");
  if (intFinal) intFinal.value = saludActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("saludIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = saludActivo.intensidadFinal;

  const benInput = document.getElementById("saludBeneficioInput");
  if (benInput) benInput.value = saludActivo.beneficio || "";

  for (const c of SALUD_CHOICES) {
    const valor = saludActivo[c.campo];
    document.querySelectorAll("[" + c.attr + "]").forEach(btn => {
      btn.classList.toggle("active-choice", btn.getAttribute(c.attr) === valor);
    });
  }

  renderSaludMiedos();
  renderSaludItems();
  renderSaludObjeciones();
}

function renderSaludMiedos() {
  const container = document.getElementById("saludMiedosLista");
  if (!container) return;

  if (!saludActivo.miedos.length) {
    container.innerHTML = '<p class="empty">Agregá al menos un miedo para trabajar.</p>';
    return;
  }

  container.innerHTML = saludActivo.miedos.map(miedo => {
    return `
      <article class="entrada-item ${miedo.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(miedo.texto)}</p>
        <div class="mini-card" style="margin: 8px 0;">
          <p class="small"><strong>Preguntate:</strong> ¿Podría soltar el deseo de que esto ocurra?</p>
        </div>
        <div class="entrada-acciones">
          <button type="button" class="button small ${miedo.liberado ? "secondary" : ""}" data-action="salud-toggle-miedo" data-salud-miedo-id="${miedo.id}">
            ${miedo.liberado ? "Soltado ✓" : "Marcar como soltado"}
          </button>
          <button type="button" class="delete-button" data-action="salud-borrar-miedo" data-salud-miedo-id="${miedo.id}">
            Borrar
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderSaludItems() {
  for (const t of SALUD_ITEMS_TIPOS) {
    const container = document.getElementById(t.container);
    if (!container) continue;
    const lista = saludActivo[t.estado];

    if (!lista.length) {
      container.innerHTML = '<p class="empty">Agregá al menos un elemento.</p>';
      continue;
    }

    container.innerHTML = lista.map(item => {
      const opciones = DESEOS_EJERCICIO.map(d =>
        `<option value="${d.id}" ${d.id === item.deseo ? "selected" : ""}>${d.nombre}</option>`
      ).join("");

      return `
        <article class="entrada-item ${item.liberado ? "liberado" : ""}">
          <p class="entrada-texto">${escapeHTML(item.texto)}</p>
          <label class="entrada-deseo-label">
            Necesidad detrás
            <select data-salud-item-deseo="${item.id}" data-salud-item-tipo="${t.tipo}">${opciones}</select>
          </label>
          <div class="entrada-acciones">
            <button type="button" class="button small ${item.liberado ? "secondary" : ""}" data-action="salud-toggle-item" data-salud-item-id="${item.id}" data-salud-item-tipo="${t.tipo}">
              ${item.liberado ? "Liberado ✓" : "Marcar liberado"}
            </button>
            <button type="button" class="delete-button" data-action="salud-borrar-item" data-salud-item-id="${item.id}" data-salud-item-tipo="${t.tipo}">
              Borrar
            </button>
          </div>
        </article>
      `;
    }).join("");
  }
}

function renderSaludObjeciones() {
  const container = document.getElementById("saludObjecionesLista");
  if (!container) return;

  if (!saludActivo.objeciones.length) {
    container.innerHTML = '<p class="empty">No hay objeciones registradas.</p>';
    return;
  }

  container.innerHTML = saludActivo.objeciones.map(obj => {
    const opciones = DESEOS_EJERCICIO.map(d =>
      `<option value="${d.id}" ${d.id === obj.deseo ? "selected" : ""}>${d.nombre}</option>`
    ).join("");

    return `
      <article class="entrada-item ${obj.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(obj.texto)}</p>
        <label class="entrada-deseo-label">
          Necesidad detrás
          <select data-salud-objecion-deseo="${obj.id}">${opciones}</select>
        </label>
        <div class="entrada-acciones">
          <button type="button" class="button small ${obj.liberado ? "secondary" : ""}" data-action="salud-toggle-objecion" data-salud-objecion-id="${obj.id}">
            ${obj.liberado ? "Liberado ✓" : "Marcar liberado"}
          </button>
          <button type="button" class="delete-button" data-action="salud-borrar-objecion" data-salud-objecion-id="${obj.id}">Borrar</button>
        </div>
      </article>
    `;
  }).join("");
}

function setSaludCampo(campo, valor) {
  if (!saludActivo) return;
  saludActivo[campo] = valor;
  guardarSaludActual();
}

function setSaludIntensidad(tipo, valor) {
  if (!saludActivo) return;
  const num = Number(valor);
  if (tipo === "inicial") {
    saludActivo.intensidadInicial = num;
    const txt = document.getElementById("saludIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    saludActivo.intensidadFinal = num;
    const txt = document.getElementById("saludIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }
  guardarSaludActual();
}

function setSaludChoice(campo, valor) {
  if (!saludActivo) return;
  saludActivo[campo] = valor;
  guardarSaludActual();
  renderSalud();
}

function agregarSaludMiedo() {
  if (!saludActivo) return;
  const input = document.getElementById("saludMiedoInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  saludActivo.miedos.push({
    id: "sal_m_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    liberado: false
  });

  input.value = "";
  guardarSaludActual();
  renderSaludMiedos();
}

function toggleSaludMiedo(id) {
  if (!saludActivo) return;
  const miedo = saludActivo.miedos.find(m => m.id === id);
  if (!miedo) return;
  miedo.liberado = !miedo.liberado;
  guardarSaludActual();
  renderSaludMiedos();
}

function borrarSaludMiedo(id) {
  if (!saludActivo) return;
  if (!confirm("¿Borrar este miedo?")) return;
  saludActivo.miedos = saludActivo.miedos.filter(m => m.id !== id);
  guardarSaludActual();
  renderSaludMiedos();
}

function agregarSaludItem(tipo) {
  if (!saludActivo) return;

  const conf = SALUD_ITEMS_TIPOS.find(t => t.tipo === tipo);
  if (!conf) return;

  const input = document.getElementById(conf.input);
  if (!input) return;

  const texto = (input.value || "").trim();
  if (!texto) return;

  saludActivo[conf.estado].push({
    id: "sal_i_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  });

  input.value = "";
  guardarSaludActual();
  renderSaludItems();
}

function toggleSaludItem(itemId, tipo) {
  if (!saludActivo) return;
  const conf = SALUD_ITEMS_TIPOS.find(t => t.tipo === tipo);
  if (!conf) return;

  const lista = saludActivo[conf.estado];
  const item = lista.find(i => i.id === itemId);
  if (!item) return;

  item.liberado = !item.liberado;
  guardarSaludActual();
  renderSaludItems();
}

function borrarSaludItem(itemId, tipo) {
  if (!saludActivo) return;
  if (!confirm("¿Borrar este elemento?")) return;

  const conf = SALUD_ITEMS_TIPOS.find(t => t.tipo === tipo);
  if (!conf) return;

  saludActivo[conf.estado] = saludActivo[conf.estado].filter(i => i.id !== itemId);
  guardarSaludActual();
  renderSaludItems();
}

function setSaludItemDeseo(itemId, tipo, nuevoDeseo) {
  if (!saludActivo) return;
  const conf = SALUD_ITEMS_TIPOS.find(t => t.tipo === tipo);
  if (!conf) return;

  const item = saludActivo[conf.estado].find(i => i.id === itemId);
  if (!item) return;

  item.deseo = nuevoDeseo;
  guardarSaludActual();
}

function agregarSaludObjecion() {
  if (!saludActivo) return;
  const input = document.getElementById("saludObjecionInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  saludActivo.objeciones.push({
    id: "sal_o_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  });

  input.value = "";
  guardarSaludActual();
  renderSaludObjeciones();
}

function toggleSaludObjecion(id) {
  if (!saludActivo) return;
  const obj = saludActivo.objeciones.find(o => o.id === id);
  if (!obj) return;
  obj.liberado = !obj.liberado;
  guardarSaludActual();
  renderSaludObjeciones();
}

function borrarSaludObjecion(id) {
  if (!saludActivo) return;
  if (!confirm("¿Borrar esta objeción?")) return;
  saludActivo.objeciones = saludActivo.objeciones.filter(o => o.id !== id);
  guardarSaludActual();
  renderSaludObjeciones();
}

function setSaludObjecionDeseo(id, nuevoDeseo) {
  if (!saludActivo) return;
  const obj = saludActivo.objeciones.find(o => o.id === id);
  if (!obj) return;
  obj.deseo = nuevoDeseo;
  guardarSaludActual();
}

function guardarSaludEnDiario() {
  if (!saludActivo) return;

  const descripcion = saludActivo.preocupacion
    ? "Salud: " + saludActivo.preocupacion
    : "Ejercicio de salud";

  const sesion = {
    tema: "salud",
    descripcion: descripcion,
    emocionInicial: "deseo",
    intensidadInicial: saludActivo.intensidadInicial,
    necesidad: saludActivo.deseoCura || "seguridad",
    emocionFinal: saludActivo.intensidadFinal <= 3 ? "paz" : "deseo",
    intensidadFinal: saludActivo.intensidadFinal,
    beneficio: saludActivo.beneficio || "",
    tecnica: "salud"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(SALUD_CONFIG.clave);
  saludActivo = null;
  navigateTo("diario", true);
}

function reiniciarSalud() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(SALUD_CONFIG.clave);
  abrirSalud();
}

// ===== MÓDULO DE TRABAJO =====

const TRABAJO_CONFIG = {
  titulo: "Libertad y eficacia en el trabajo",
  descripcion: "Trabaja con la delegación y el microcontrol, la resistencia a tareas repetitivas, la presión de los plazos, vender con eficacia, decisiones sólidas y la limpieza con gente difícil.",
  clave: "soltar_ejercicio_trabajo_v1"
};

const TRABAJO_CHOICES = [
  { attr: "data-trabajo-delegar-deseo", campo: "delegarDeseo" },
  { attr: "data-trabajo-delegar-soltaria-deseo", campo: "delegarSoltariaDeseo" },
  { attr: "data-trabajo-delegar-soltaria-dudas", campo: "delegarSoltariaDudas" },
  { attr: "data-trabajo-plazo-suelta", campo: "sueltaPresionPlazo" },
  { attr: "data-trabajo-tiempo-suelta", campo: "sueltaSentimientoTiempo" },
  { attr: "data-trabajo-venta-suelta", campo: "sueltaVentaDeseo" },
  { attr: "data-trabajo-persona-suelta", campo: "sueltaPersonaDeseo" }
];

let trabajoActivo = null;

function abrirTrabajo() {
  trabajoActivo = cargarTrabajo() || {
    tema: "",
    intensidadInicial: 5,
    delegarTarea: "",
    delegarDeseo: null,
    delegarSoltariaDeseo: null,
    delegarDudas: "",
    delegarSoltariaDudas: null,
    tareas: [],
    presionPlazo: "",
    sueltaPresionPlazo: null,
    sentimientoTiempo: "",
    sueltaSentimientoTiempo: null,
    situacionVenta: "",
    sueltaVentaDeseo: null,
    decision: "",
    ventajas: [],
    inconvenientes: [],
    personaDificil: "",
    sueltaPersonaDeseo: null,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderTrabajo();
  navigateTo("ejercicio-trabajo");
}

function abrirTrabajoLimpieza() {
  abrirLimpieza();
  if (!limpiezaActiva) return;
  const persona = (trabajoActivo && trabajoActivo.personaDificil) || "la persona con la que trabajo";
  setLimpiPersona(persona);
  const input = document.getElementById("limpiezaPersona");
  if (input) input.value = persona;
}

function cargarTrabajo() {
  try {
    return JSON.parse(localStorage.getItem(TRABAJO_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarTrabajoActual() {
  if (!trabajoActivo) return;
  localStorage.setItem(TRABAJO_CONFIG.clave, JSON.stringify(trabajoActivo));
}

function renderTrabajo() {
  if (!trabajoActivo) return;

  const temaInput = document.getElementById("trabajoTemaInput");
  if (temaInput) temaInput.value = trabajoActivo.tema || "";

  const intInicial = document.getElementById("trabajoIntensidadInicial");
  if (intInicial) intInicial.value = trabajoActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("trabajoIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = trabajoActivo.intensidadInicial;

  const delegarTareaInput = document.getElementById("trabajoDelegarTareaInput");
  if (delegarTareaInput) delegarTareaInput.value = trabajoActivo.delegarTarea || "";

  const delegarDudasInput = document.getElementById("trabajoDelegarDudasInput");
  if (delegarDudasInput) delegarDudasInput.value = trabajoActivo.delegarDudas || "";

  const presionPlazoInput = document.getElementById("trabajoPresionPlazoInput");
  if (presionPlazoInput) presionPlazoInput.value = trabajoActivo.presionPlazo || "";

  const sentimientoTiempoInput = document.getElementById("trabajoSentimientoTiempoInput");
  if (sentimientoTiempoInput) sentimientoTiempoInput.value = trabajoActivo.sentimientoTiempo || "";

  const situacionVentaInput = document.getElementById("trabajoSituacionVentaInput");
  if (situacionVentaInput) situacionVentaInput.value = trabajoActivo.situacionVenta || "";

  const decisionInput = document.getElementById("trabajoDecisionInput");
  if (decisionInput) decisionInput.value = trabajoActivo.decision || "";

  const personaDificilInput = document.getElementById("trabajoPersonaDificilInput");
  if (personaDificilInput) personaDificilInput.value = trabajoActivo.personaDificil || "";

  const intFinal = document.getElementById("trabajoIntensidadFinal");
  if (intFinal) intFinal.value = trabajoActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("trabajoIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = trabajoActivo.intensidadFinal;

  const benInput = document.getElementById("trabajoBeneficioInput");
  if (benInput) benInput.value = trabajoActivo.beneficio || "";

  for (const c of TRABAJO_CHOICES) {
    const valor = trabajoActivo[c.campo];
    document.querySelectorAll("[" + c.attr + "]").forEach(btn => {
      btn.classList.toggle("active-choice", btn.getAttribute(c.attr) === valor);
    });
  }

  renderTrabajoTareas();
  renderTrabajoDecisiones();
}

function renderTrabajoTareas() {
  const container = document.getElementById("trabajoTareasLista");
  if (!container) return;

  if (!trabajoActivo.tareas.length) {
    container.innerHTML = '<p class="empty">Agregá al menos una tarea que te resulte repetitiva o resistida.</p>';
    return;
  }

  container.innerHTML = trabajoActivo.tareas.map(tarea => {
    return `
      <article class="entrada-item">
        <p class="entrada-texto">${escapeHTML(tarea.texto)}</p>
        <div class="entrada-acciones">
          <button type="button" class="button small ${tarea.soltariaHacer ? "secondary" : ""}" data-action="trabajo-toggle-hacer" data-trabajo-tarea-id="${tarea.id}">
            ${tarea.soltariaHacer ? "Resistencia a hacerla soltada ✓" : "Soltar resistencia a hacerla"}
          </button>
          <button type="button" class="button small ${tarea.soltariaNoHacer ? "secondary" : ""}" data-action="trabajo-toggle-no-hacer" data-trabajo-tarea-id="${tarea.id}">
            ${tarea.soltariaNoHacer ? "Resistencia a no hacerla soltada ✓" : "Soltar resistencia a no hacerla"}
          </button>
          <button type="button" class="delete-button" data-action="trabajo-borrar-tarea" data-trabajo-tarea-id="${tarea.id}">
            Borrar
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function renderTrabajoDecisiones() {
  renderTrabajoDecisionLista("trabajoVentajasLista", trabajoActivo.ventajas, "ventaja");
  renderTrabajoDecisionLista("trabajoInconvenientesLista", trabajoActivo.inconvenientes, "inconveniente");
}

function renderTrabajoDecisionLista(containerId, lista, tipo) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!lista.length) {
    container.innerHTML = '<p class="empty">Agregá al menos un elemento.</p>';
    return;
  }

  container.innerHTML = lista.map(item => {
    const opciones = DESEOS_EJERCICIO.map(d =>
      `<option value="${d.id}" ${d.id === item.deseo ? "selected" : ""}>${d.nombre}</option>`
    ).join("");

    return `
      <article class="entrada-item ${item.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(item.texto)}</p>
        <label class="entrada-deseo-label">
          Necesidad detrás
          <select data-trabajo-item-deseo="${item.id}" data-trabajo-item-tipo="${tipo}">${opciones}</select>
        </label>
        <div class="entrada-acciones">
          <button type="button" class="button small ${item.liberado ? "secondary" : ""}" data-action="trabajo-toggle-item" data-trabajo-item-id="${item.id}" data-trabajo-item-tipo="${tipo}">
            ${item.liberado ? "Liberado ✓" : "Marcar liberado"}
          </button>
          <button type="button" class="delete-button" data-action="trabajo-borrar-item" data-trabajo-item-id="${item.id}" data-trabajo-item-tipo="${tipo}">
            Borrar
          </button>
        </div>
      </article>
    `;
  }).join("");
}

function setTrabajoCampo(campo, valor) {
  if (!trabajoActivo) return;
  trabajoActivo[campo] = valor;
  guardarTrabajoActual();
}

function setTrabajoIntensidad(tipo, valor) {
  if (!trabajoActivo) return;
  const num = Number(valor);
  if (tipo === "inicial") {
    trabajoActivo.intensidadInicial = num;
    const txt = document.getElementById("trabajoIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    trabajoActivo.intensidadFinal = num;
    const txt = document.getElementById("trabajoIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }
  guardarTrabajoActual();
}

function setTrabajoChoice(campo, valor) {
  if (!trabajoActivo) return;
  trabajoActivo[campo] = valor;
  guardarTrabajoActual();
  renderTrabajo();
}

function agregarTrabajoTarea() {
  if (!trabajoActivo) return;
  const input = document.getElementById("trabajoTareaInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  trabajoActivo.tareas.push({
    id: "tra_t_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    soltariaHacer: false,
    soltariaNoHacer: false
  });

  input.value = "";
  guardarTrabajoActual();
  renderTrabajoTareas();
}

function toggleTrabajoTarea(id, lado) {
  if (!trabajoActivo) return;
  const tarea = trabajoActivo.tareas.find(t => t.id === id);
  if (!tarea) return;
  tarea[lado] = !tarea[lado];
  guardarTrabajoActual();
  renderTrabajoTareas();
}

function borrarTrabajoTarea(id) {
  if (!trabajoActivo) return;
  if (!confirm("¿Borrar esta tarea?")) return;
  trabajoActivo.tareas = trabajoActivo.tareas.filter(t => t.id !== id);
  guardarTrabajoActual();
  renderTrabajoTareas();
}

function agregarTrabajoItem(tipo) {
  if (!trabajoActivo) return;

  const mapInputs = {
    ventaja: "trabajoVentajaInput",
    inconveniente: "trabajoInconvenienteInput"
  };

  const mapListas = {
    ventaja: "ventajas",
    inconveniente: "inconvenientes"
  };

  const input = document.getElementById(mapInputs[tipo]);
  if (!input) return;

  const texto = (input.value || "").trim();
  if (!texto) return;

  trabajoActivo[mapListas[tipo]].push({
    id: "tra_i_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  });

  input.value = "";
  guardarTrabajoActual();
  renderTrabajoDecisiones();
}

function toggleTrabajoItem(itemId, tipo) {
  if (!trabajoActivo) return;

  const mapListas = {
    ventaja: "ventajas",
    inconveniente: "inconvenientes"
  };

  const item = trabajoActivo[mapListas[tipo]].find(i => i.id === itemId);
  if (!item) return;

  item.liberado = !item.liberado;
  guardarTrabajoActual();
  renderTrabajoDecisiones();
}

function borrarTrabajoItem(itemId, tipo) {
  if (!trabajoActivo) return;
  if (!confirm("¿Borrar este elemento?")) return;

  const mapListas = {
    ventaja: "ventajas",
    inconveniente: "inconvenientes"
  };

  trabajoActivo[mapListas[tipo]] = trabajoActivo[mapListas[tipo]].filter(i => i.id !== itemId);
  guardarTrabajoActual();
  renderTrabajoDecisiones();
}

function setTrabajoItemDeseo(itemId, tipo, nuevoDeseo) {
  if (!trabajoActivo) return;

  const mapListas = {
    ventaja: "ventajas",
    inconveniente: "inconvenientes"
  };

  const item = trabajoActivo[mapListas[tipo]].find(i => i.id === itemId);
  if (!item) return;

  item.deseo = nuevoDeseo;
  guardarTrabajoActual();
}

function guardarTrabajoEnDiario() {
  if (!trabajoActivo) return;

  const descripcion = trabajoActivo.tema
    ? "Trabajo: " + trabajoActivo.tema
    : "Ejercicio de trabajo";

  const sesion = {
    tema: "trabajo",
    descripcion: descripcion,
    emocionInicial: "deseo",
    intensidadInicial: trabajoActivo.intensidadInicial,
    necesidad: trabajoActivo.delegarDeseo || "control",
    emocionFinal: trabajoActivo.intensidadFinal <= 3 ? "paz" : "deseo",
    intensidadFinal: trabajoActivo.intensidadFinal,
    beneficio: trabajoActivo.beneficio || "",
    tecnica: "trabajo"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(TRABAJO_CONFIG.clave);
  trabajoActivo = null;
  navigateTo("diario", true);
}

function reiniciarTrabajo() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(TRABAJO_CONFIG.clave);
  abrirTrabajo();
}

// ===== MÓDULO DE MUNDO =====

const MUNDO_CONFIG = {
  titulo: "Paz y serenidad con el mundo",
  descripcion: "Libera tus reacciones a las noticias, pasa de estar en contra de algo a estar a favor de la solución, suelta el rechazo a tus dirigentes y ejercé la amabilidad sin esperar nada a cambio.",
  clave: "soltar_ejercicio_mundo_v1"
};

const MUNDO_CHOICES = [
  { attr: "data-mundo-acepta", campo: "aceptaMundo" },
  { attr: "data-mundo-suelta-anti", campo: "sueltaAnti" },
  { attr: "data-mundo-suelta-lider", campo: "sueltaLiderDeseo" },
  { attr: "data-mundo-suelta-reconocimiento", campo: "sueltaReconocimiento" }
];

let mundoActivo = null;

function abrirMundo() {
  mundoActivo = cargarMundo() || {
    noticia: "",
    visualizacionMundo: "",
    objeciones: [],
    aceptaMundo: null,
    contraQue: "",
    aFavorDe: "",
    sueltaAnti: null,
    lider: "",
    sueltaLiderDeseo: null,
    amabilidad: "",
    sueltaReconocimiento: null,
    intensidadInicial: 5,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderMundo();
  navigateTo("ejercicio-mundo");
}

function abrirMundoLimpieza() {
  abrirLimpieza();
  if (!limpiezaActiva) return;
  const persona = (mundoActivo && mundoActivo.lider) || "la persona con la que estoy en desacuerdo";
  setLimpiPersona(persona);
  const input = document.getElementById("limpiezaPersona");
  if (input) input.value = persona;
}

function cargarMundo() {
  try {
    return JSON.parse(localStorage.getItem(MUNDO_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarMundoActual() {
  if (!mundoActivo) return;
  localStorage.setItem(MUNDO_CONFIG.clave, JSON.stringify(mundoActivo));
}

function renderMundo() {
  if (!mundoActivo) return;

  const intInicial = document.getElementById("mundoIntensidadInicial");
  if (intInicial) intInicial.value = mundoActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("mundoIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = mundoActivo.intensidadInicial;

  const noticiaInput = document.getElementById("mundoNoticiaInput");
  if (noticiaInput) noticiaInput.value = mundoActivo.noticia || "";

  const visInput = document.getElementById("mundoVisualizacionInput");
  if (visInput) visInput.value = mundoActivo.visualizacionMundo || "";

  const contraQueInput = document.getElementById("mundoContraQueInput");
  if (contraQueInput) contraQueInput.value = mundoActivo.contraQue || "";

  const aFavorInput = document.getElementById("mundoAFavorInput");
  if (aFavorInput) aFavorInput.value = mundoActivo.aFavorDe || "";

  const liderInput = document.getElementById("mundoLiderInput");
  if (liderInput) liderInput.value = mundoActivo.lider || "";

  const amabilidadInput = document.getElementById("mundoAmabilidadInput");
  if (amabilidadInput) amabilidadInput.value = mundoActivo.amabilidad || "";

  const intFinal = document.getElementById("mundoIntensidadFinal");
  if (intFinal) intFinal.value = mundoActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("mundoIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = mundoActivo.intensidadFinal;

  const benInput = document.getElementById("mundoBeneficioInput");
  if (benInput) benInput.value = mundoActivo.beneficio || "";

  for (const c of MUNDO_CHOICES) {
    const valor = mundoActivo[c.campo];
    document.querySelectorAll("[" + c.attr + "]").forEach(btn => {
      btn.classList.toggle("active-choice", btn.getAttribute(c.attr) === valor);
    });
  }

  renderMundoObjeciones();
}

function renderMundoObjeciones() {
  const container = document.getElementById("mundoObjecionesLista");
  if (!container) return;

  if (!mundoActivo.objeciones.length) {
    container.innerHTML = '<p class="empty">No hay objeciones registradas.</p>';
    return;
  }

  container.innerHTML = mundoActivo.objeciones.map(obj => {
    const opciones = DESEOS_EJERCICIO.map(d =>
      `<option value="${d.id}" ${d.id === obj.deseo ? "selected" : ""}>${d.nombre}</option>`
    ).join("");

    return `
      <article class="entrada-item ${obj.liberado ? "liberado" : ""}">
        <p class="entrada-texto">${escapeHTML(obj.texto)}</p>
        <label class="entrada-deseo-label">
          Necesidad detrás
          <select data-mundo-objecion-deseo="${obj.id}">${opciones}</select>
        </label>
        <div class="entrada-acciones">
          <button type="button" class="button small ${obj.liberado ? "secondary" : ""}" data-action="mundo-toggle-objecion" data-mundo-objecion-id="${obj.id}">
            ${obj.liberado ? "Liberado ✓" : "Marcar liberado"}
          </button>
          <button type="button" class="delete-button" data-action="mundo-borrar-objecion" data-mundo-objecion-id="${obj.id}">Borrar</button>
        </div>
      </article>
    `;
  }).join("");
}

function setMundoCampo(campo, valor) {
  if (!mundoActivo) return;
  mundoActivo[campo] = valor;
  guardarMundoActual();
}

function setMundoIntensidad(tipo, valor) {
  if (!mundoActivo) return;
  const num = Number(valor);
  if (tipo === "inicial") {
    mundoActivo.intensidadInicial = num;
    const txt = document.getElementById("mundoIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    mundoActivo.intensidadFinal = num;
    const txt = document.getElementById("mundoIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }
  guardarMundoActual();
}

function setMundoChoice(campo, valor) {
  if (!mundoActivo) return;
  mundoActivo[campo] = valor;
  guardarMundoActual();
  renderMundo();
}

function agregarMundoObjecion() {
  if (!mundoActivo) return;
  const input = document.getElementById("mundoObjecionInput");
  if (!input) return;
  const texto = (input.value || "").trim();
  if (!texto) return;

  mundoActivo.objeciones.push({
    id: "mun_o_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
    texto: texto,
    deseo: "no_se",
    liberado: false
  });

  input.value = "";
  guardarMundoActual();
  renderMundoObjeciones();
}

function toggleMundoObjecion(id) {
  if (!mundoActivo) return;
  const obj = mundoActivo.objeciones.find(o => o.id === id);
  if (!obj) return;
  obj.liberado = !obj.liberado;
  guardarMundoActual();
  renderMundoObjeciones();
}

function borrarMundoObjecion(id) {
  if (!mundoActivo) return;
  if (!confirm("¿Borrar esta objeción?")) return;
  mundoActivo.objeciones = mundoActivo.objeciones.filter(o => o.id !== id);
  guardarMundoActual();
  renderMundoObjeciones();
}

function setMundoObjecionDeseo(id, nuevoDeseo) {
  if (!mundoActivo) return;
  const obj = mundoActivo.objeciones.find(o => o.id === id);
  if (!obj) return;
  obj.deseo = nuevoDeseo;
  guardarMundoActual();
}

function guardarMundoEnDiario() {
  if (!mundoActivo) return;

  const descripcion = mundoActivo.noticia
    ? "Mundo: " + mundoActivo.noticia
    : "Ejercicio de paz y serenidad con el mundo";

  const sesion = {
    tema: "mundo",
    descripcion: descripcion,
    emocionInicial: "deseo",
    intensidadInicial: mundoActivo.intensidadInicial,
    necesidad: "control",
    emocionFinal: mundoActivo.intensidadFinal <= 3 ? "paz" : "deseo",
    intensidadFinal: mundoActivo.intensidadFinal,
    beneficio: mundoActivo.beneficio || "",
    tecnica: "mundo"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(MUNDO_CONFIG.clave);
  mundoActivo = null;
  navigateTo("diario", true);
}

function reiniciarMundo() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(MUNDO_CONFIG.clave);
  abrirMundo();
}

// ===== MÓDULO: LOS 9 ESTADOS EMOCIONALES =====

const ESTADOS_CONFIG = {
  clave: "soltar_ejercicio_estados_v1"
};

const ESTADOS = [
  {
    id: "apatia",
    nombre: "Apatía",
    energia: "Casi ninguna",
    descripcion:
      "El deseo parece muerto y no sirve de nada. No sos capaz de hacer nada y nadie puede ayudarte. Te sentís abotargado, pesado, sin escapatoria posible. Solo pensás en el fracaso.",
    palabras: [
      "Abandonar", "Abrumado", "Aburrido", "Adormilado", "Agotado", "Aislado",
      "Aletargado", "Atascado", "Condenado al fracaso", "Shock nervioso",
      "Demasiado cansado", "Deprimido", "Derrotado", "Desalentado", "Descentrado",
      "Descuidado", "Desganado", "Desesperación", "Desilusionado", "Desmoralizado",
      "Desolado", "Desperdiciado", "Despreciable", "Distraído", "Empedernido",
      "Entumecido", "Es demasiado tarde", "Fracaso", "Frío", "Impotente",
      "Impreciso", "Incorregible", "Indeciso", "Indiferente", "Insensible",
      "Inútil", "Invisible", "Muerto", "Negativo", "No importo", "No me importa",
      "No puedo", "No puedo ganar", "Olvidadizo", "Perdedor", "Perdido",
      "Perezoso", "¿Por qué intentarlo?", "¿Qué sentido tiene?", "Resignado",
      "Sin gracia", "Vamos a esperar", "Vano"
    ]
  },
  {
    id: "pena",
    nombre: "Pena",
    energia: "Muy poca, duele",
    descripcion:
      "Querés que alguien te ayude porque pensás que solo no podés hacer nada. Implorás que alguien actúe por vos. El cuerpo tiene algo más de energía, pero está tan contraído que duele.",
    palabras: [
      "A nadie le importo", "Abandonado", "Abatido", "Acusado", "Angustiado",
      "Añoranza", "Apenado", "Atormentado", "Avergonzado", "Consternado",
      "Culpable", "Decepcionado", "Desatendido", "Desconsolado", "Desesperación",
      "Dolor", "Engañado", "Agotado", "Herido", "Ignorado", "Impotente",
      "Incomprendido", "Inconsolable", "Inepto", "Infeliz", "Lástima", "Lastimado",
      "Luto", "Lloroso", "Maltratado", "Marginado", "Melancolía", "Nadie me quiere",
      "No deseado", "No hay derecho", "No querido", "Nostalgia", "Olvidado",
      "Pena", "Pérdida", "Pesar", "Pobre de mí", "¿Por qué yo?", "Rechazado",
      "Relegado", "Remordimiento", "Si al menos...", "Torturado", "Traicionado",
      "Triste", "Tristeza", "Vulnerable"
    ]
  },
  {
    id: "miedo",
    nombre: "Miedo",
    energia: "Poca, sube y baja",
    descripcion:
      "Querés arremeter o escapar, pero no lo hacés porque pensás que el riesgo es demasiado grande. Los sentimientos suben y bajan con rapidez. Solo ves fatalidad, pérdida y la necesidad de protegerte.",
    palabras: [
      "Amenazado", "Aprensivo", "Asustado", "Aterrorizado", "Atrapado",
      "Avergonzado", "Cauto", "Cobardía", "Cohibido", "Desconfiado",
      "Deseos de escapar", "Desesperado", "Duda", "Escéptico", "Evasivo",
      "Histérico", "Horrorizado", "Huraño", "Incierto", "Inquieto", "Inseguro",
      "Irracional", "Mal presentimiento", "Miedo escénico", "Náusea", "Nervioso",
      "Obsesionado", "Pánico", "Paralizado", "Paranoico", "Precavido",
      "Preocupado", "Receloso", "Reservado", "Sudoroso", "Supersticioso",
      "Suspicaz", "Tembloroso", "Tenso", "Terror", "Tímido", "Vacilante",
      "Vulnerable"
    ]
  },
  {
    id: "deseo",
    nombre: "Deseo",
    energia: "Moderada, intensa",
    descripcion:
      "Querés poseer: dinero, poder, sexo, personas, lugares y cosas, pero vacilás. Por mucho que consigas, nunca te sentís satisfecho y raramente disfrutás de lo que tenés.",
    palabras: [
      "Acaparador", "Ajeno a lo que le rodea", "Ansias", "Compulsivo",
      "Consentidor en exceso", "Desenfreno", "Despiadado", "Egoísta", "Envidia",
      "Exigente", "Explosivo", "Frenesí", "Frustrado", "Glotón", "Hambre",
      "Impaciente", "Impulsivo", "Insaciable", "Insensible", "Lascivo",
      "Libidinoso", "Licencioso", "Manipulador", "Maquinador", "Mezquino",
      "No puedo esperar", "Nunca es suficiente", "Siempre insatisfecho",
      "Obsesionado", "Obseso", "Perverso", "Posesivo", "Prepotente", "Previsión",
      "Quiero", "Rapaz", "Taimado", "Temerario", "Tengo que poseerlo", "Voraz"
    ]
  },
  {
    id: "ira",
    nombre: "Ira",
    energia: "Alta, explosiva",
    descripcion:
      "Deseás embestir para herir y detener a los demás, pero vacilás. Pensás en la destrucción y en cómo conseguir que se te haga justicia. Esta fuerza te puede asustar.",
    palabras: [
      "Acalorado", "Agresivo", "Airado", "A punto de estallar", "Amargado",
      "Ardiente", "Beligerante", "Brusco", "Cáustico", "Celoso", "Colérico",
      "Desafiante", "Despiadado", "Destructivo", "Díscolo", "Discutidor", "Duro",
      "Enardecido", "Enfadado", "Exigente", "Explosivo", "Frustrado", "Furibundo",
      "Furioso", "Hostilidad", "Huraño", "Impaciencia", "Indignado",
      "Inmisericorde", "Instintos asesinos", "Iracundo", "Irritado", "Loco",
      "Maleducado", "Malicioso", "Mezquino", "Obstinado", "Odio", "Perverso",
      "Petulante", "Prepotente", "Rabia", "Rebelde", "Resentimiento", "Riguroso",
      "Salvaje", "Severo", "Soliviantado", "Testarudo", "Vengativo", "Vicioso",
      "Violento", "Volcánico"
    ]
  },
  {
    id: "orgullo",
    nombre: "Orgullo",
    energia: "Alta, pero bloqueada",
    descripcion:
      "Querés conservar tu estatus. No estás dispuesto a cambiar ni a moverte, y frenás a los demás para que no te adelanten. Tu mente es rígida y centrada en sí misma.",
    palabras: [
      "Absorto en sí mismo", "Aburrido", "Aferrado a sus ideas", "Aislado",
      "Altivo", "Arrogante", "Autoritario", "Cerrado", "Creído", "Crítico",
      "Desdén", "Despectivo", "Displicente", "Distante", "Dogmático", "Egoísta",
      "Engreído", "Esnob", "Especial", "Estoico", "Falsa dignidad",
      "Falsa humildad", "Falsa virtud", "Fanfarrón", "Frío", "Hipócrita",
      "Impertérrito", "Implacable", "Inexorable", "Inflexible", "Insensible",
      "Inteligente", "Intolerante", "Irreprochable", "Lleno de prejuicios",
      "Malcriado", "Mejor que tú", "Nunca se equivoca", "Obcecado", "Paternalista",
      "Petulante", "Presuntuoso", "Recto", "Regodearse", "Rígido", "Sabelotodo",
      "Santurrón", "Satisfecho de sí mismo", "Sentencioso", "Superior",
      "Testarudo", "Vano"
    ]
  },
  {
    id: "coraje",
    nombre: "Coraje",
    energia: "Abundante y clara",
    descripcion:
      "Estás dispuesto a actuar sin vacilar. Podés hacer, corregir y cambiar lo que sea necesario. Sos flexible, te recuperás rápido y sabés reírte, incluso de tus propios fallos.",
    palabras: [
      "Abierto", "Accesible", "Afectuoso", "Agudo", "Alegre", "Apasionado",
      "Atrevido", "Autosuficiente", "Capaz de recuperarse", "Centrado", "Claridad",
      "Compasión", "Competente", "Con visión de futuro", "Confiado", "Consciente",
      "Creativo", "Decidido", "Despierto", "Dinámico", "Dispuesto", "Entusiasta",
      "Espléndido", "Espontáneo", "Estable", "Estudioso", "Euforia", "Feliz",
      "Firme", "Flexible", "Fuerte", "Honrado", "Humor", "Impaciente",
      "Incansable", "Independiente", "Ingenioso", "Iniciativa", "Integridad",
      "Intrépido", "Invencible", "Lúcido", "Motivado", "Objetivos claros",
      "Optimista", "Perspectiva", "Positivo", "Puedo", "Receptivo", "Resuelto",
      "Seguro", "Sensible", "Solícito", "Vigoroso", "Vivo"
    ]
  },
  {
    id: "aceptacion",
    nombre: "Aceptación",
    energia: "En reposo, disponible",
    descripcion:
      "Tenés y disfrutás todo tal como es. No tenés necesidad de cambiar nada: las cosas son hermosas tal como están. Tu mente casi está en silencio y satisfecha. La vida es alegre.",
    palabras: [
      "Abierto", "Abundancia", "Afectuoso", "Agradecido", "Alegre", "Ardiente",
      "Armonía", "Armonioso", "Asombro", "Bienestar", "Cálido", "Compasión",
      "Compenetrado", "Comprensivo", "Considerado", "Cortés", "Deleite",
      "Educado", "Empatía", "Enriquecido", "Equilibrio", "Eufórico", "Hermoso",
      "Indulgente", "Ingenuo", "Integrador", "Intuitivo", "Lúdico", "Magnánimo",
      "Nada que cambiar", "Naturalidad", "Partícipe", "Plenitud", "Radiante",
      "Seguro", "Sensible", "Simpático", "Sosegado", "Tengo", "Tierno",
      "Todo va bien"
    ]
  },
  {
    id: "paz",
    nombre: "Paz",
    energia: "Total, en silencio",
    descripcion:
      "Sentís: Soy. Soy un todo, algo completo en mí mismo. Todos y todo forman parte de mí. Todo es perfecto. La mente está clara y vacía, pero plenamente consciente.",
    palabras: [
      "Ajeno al tiempo", "Calma", "Centrado", "Conciencia", "Entereza", "Espacio",
      "Eternamente joven", "Eterno", "Identidad", "Ilimitado", "Inagotable",
      "Libre", "Ligero", "Perfección", "Pleno", "Puro", "Realizado",
      "Resplandeciente", "Ser", "Serenidad", "Sosegado", "Soy", "Todo",
      "Tranquilo"
    ]
  }
];

const ESTADOS_BAJOS = ["apatia", "pena", "miedo", "deseo", "ira", "orgullo"];
const ESTADOS_ALTOS = ["coraje", "aceptacion", "paz"];

const ESTADOS_CHOICES = [
  { attr: "data-estados-acepta", campo: "acepta" },
  { attr: "data-estados-suelta", campo: "suelta" },
  { attr: "data-estados-soltarias", campo: "soltarias" },
  { attr: "data-estados-cuando", campo: "cuando" }
];

let estadosActivo = null;

function abrirEstados() {
  estadosActivo = cargarEstados() || {
    estado: "apatia",
    recuerdo: "",
    acepta: null,
    suelta: null,
    soltarias: null,
    cuando: null,
    intensidadInicial: 5,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderEstados();
  navigateTo("ejercicio-estados");
}

function cargarEstados() {
  try {
    return JSON.parse(localStorage.getItem(ESTADOS_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarEstadosActual() {
  if (!estadosActivo) return;
  localStorage.setItem(ESTADOS_CONFIG.clave, JSON.stringify(estadosActivo));
}

function estadoInfo(id) {
  return ESTADOS.find(function (e) {
    return e.id === id;
  }) || ESTADOS[0];
}

function renderEstados() {
  if (!estadosActivo) return;

  renderEstadosSelector();
  renderEstadosDetalle();

  const intInicial = document.getElementById("estadosIntensidadInicial");
  if (intInicial) intInicial.value = estadosActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("estadosIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = estadosActivo.intensidadInicial;

  const intFinal = document.getElementById("estadosIntensidadFinal");
  if (intFinal) intFinal.value = estadosActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("estadosIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = estadosActivo.intensidadFinal;

  const benInput = document.getElementById("estadosBeneficioInput");
  if (benInput) benInput.value = estadosActivo.beneficio || "";

  for (const c of ESTADOS_CHOICES) {
    const valor = estadosActivo[c.campo];
    document.querySelectorAll("[" + c.attr + "]").forEach(function (btn) {
      btn.classList.toggle("active-choice", btn.getAttribute(c.attr) === valor);
    });
  }
}

function renderEstadosSelector() {
  const container = document.getElementById("estadosSelector");
  if (!container) return;

  const btnEstado = function (id) {
    const e = estadoInfo(id);
    const active = estadosActivo.estado === id ? " active" : "";
    return (
      '<button type="button" class="button small estado-btn' + active +
      '" data-estados-estado="' + e.id + '">' + escapeHTML(e.nombre) + "</button>"
    );
  };

  container.innerHTML =
    '<p class="small" style="margin-bottom:4px;">Estados de baja energía (la corteza)</p>' +
    '<div class="estado-grid">' + ESTADOS_BAJOS.map(btnEstado).join("") + "</div>" +
    '<p class="small" style="margin:10px 0 4px;">Estados de alta energía (lo que realmente eres)</p>' +
    '<div class="estado-grid">' + ESTADOS_ALTOS.map(btnEstado).join("") + "</div>";
}

function renderEstadosDetalle() {
  if (!estadosActivo) return;

  const e = estadoInfo(estadosActivo.estado);
  const titulo = document.getElementById("estadosDetalleTitulo");
  if (titulo) titulo.textContent = e.nombre;

  const descripcion = document.getElementById("estadosDetalleDescripcion");
  if (descripcion) {
    descripcion.innerHTML =
      escapeHTML(e.descripcion) +
      ' <span class="chip">Energía: ' + escapeHTML(e.energia) + "</span>";
  }

  const palabras = document.getElementById("estadosPalabras");
  if (palabras) {
    palabras.innerHTML = e.palabras
      .map(function (p) {
        return '<span class="chip">' + escapeHTML(p) + "</span>";
      })
      .join("");
  }

  const recuerdo = document.getElementById("estadosRecuerdoInput");
  if (recuerdo) recuerdo.value = estadosActivo.recuerdo || "";
}

function setEstadosEstado(id) {
  if (!estadosActivo) return;
  estadosActivo.estado = id;
  guardarEstadosActual();
  renderEstados();
}

function setEstadosCampo(campo, valor) {
  if (!estadosActivo) return;
  estadosActivo[campo] = valor;
  guardarEstadosActual();
  renderEstados();
}

function setEstadosIntensidad(tipo, valor) {
  if (!estadosActivo) return;
  const num = Number(valor);

  if (tipo === "inicial") {
    estadosActivo.intensidadInicial = num;
    const txt = document.getElementById("estadosIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    estadosActivo.intensidadFinal = num;
    const txt = document.getElementById("estadosIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }

  guardarEstadosActual();
}

function guardarEstadosEnDiario() {
  if (!estadosActivo) return;

  const e = estadoInfo(estadosActivo.estado);

  const sesion = {
    tema: "estados",
    descripcion: "Estados: " + e.nombre + (estadosActivo.recuerdo ? " (" + estadosActivo.recuerdo + ")" : ""),
    emocionInicial: estadosActivo.estado,
    intensidadInicial: estadosActivo.intensidadInicial,
    necesidad: "no_se",
    emocionFinal: estadosActivo.intensidadFinal <= 3 ? "paz" : estadosActivo.estado,
    intensidadFinal: estadosActivo.intensidadFinal,
    beneficio: estadosActivo.beneficio || "",
    tecnica: "estados"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(ESTADOS_CONFIG.clave);
  estadosActivo = null;
  navigateTo("diario", true);
}

function reiniciarEstados() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(ESTADOS_CONFIG.clave);
  abrirEstados();
}

// ===== SERENIDAD / QUERER CAMBIAR =====

const SERENIDAD_CONFIG = {
  clave: "soltar_ejercicio_serenidad_v1"
};

const SERENIDAD_CHOICES = [
  { attr: "data-serenidad-quieres-cambiar", campo: "quieresCambiar" },
  { attr: "data-serenidad-acepta", campo: "acepta" },
  { attr: "data-serenidad-tener-deseo", campo: "tenerDeseo" },
  { attr: "data-serenidad-suelta", campo: "suelta" },
  { attr: "data-serenidad-harias", campo: "hariasm" },
  { attr: "data-serenidad-cuando", campo: "cuando" }
];

const SERENIDAD_ETIQUETAS = {
  si: "Sí",
  no_se: "No lo sé",
  un_poco: "Un poco",
  todavia_no: "Todavía no",
  ahora: "Ahora"
};

let serenidadActivo = null;

function abrirSerenidad() {
  serenidadActivo = cargarSerenidad() || {
    que: "",
    quieresCambiar: null,
    acepta: null,
    tenerDeseo: null,
    suelta: null,
    hariasm: null,
    cuando: null,
    observacion: "",
    rondas: 0,
    intensidadInicial: 5,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderSerenidad();
  navigateTo("ejercicio-serenidad");
}

function cargarSerenidad() {
  try {
    return JSON.parse(localStorage.getItem(SERENIDAD_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarSerenidadActual() {
  if (!serenidadActivo) return;
  localStorage.setItem(SERENIDAD_CONFIG.clave, JSON.stringify(serenidadActivo));
}

function renderSerenidad() {
  if (!serenidadActivo) return;

  const queInput = document.getElementById("serenidadQueInput");
  if (queInput) queInput.value = serenidadActivo.que || "";

  const observacion = document.getElementById("serenidadObservacionInput");
  if (observacion) observacion.value = serenidadActivo.observacion || "";

  const rondasTxt = document.getElementById("serenidadRondasTexto");
  if (rondasTxt) rondasTxt.textContent = serenidadActivo.rondas;

  const intInicial = document.getElementById("serenidadIntensidadInicial");
  if (intInicial) intInicial.value = serenidadActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("serenidadIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = serenidadActivo.intensidadInicial;

  const intFinal = document.getElementById("serenidadIntensidadFinal");
  if (intFinal) intFinal.value = serenidadActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("serenidadIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = serenidadActivo.intensidadFinal;

  const benInput = document.getElementById("serenidadBeneficioInput");
  if (benInput) benInput.value = serenidadActivo.beneficio || "";

  for (const c of SERENIDAD_CHOICES) {
    const valor = serenidadActivo[c.campo];
    document.querySelectorAll("[" + c.attr + "]").forEach(function (btn) {
      btn.classList.toggle("active-choice", btn.getAttribute(c.attr) === valor);
    });
  }
}

function setSerenidadCampo(campo, valor) {
  if (!serenidadActivo) return;
  serenidadActivo[campo] = valor;
  guardarSerenidadActual();
  renderSerenidad();
}

function setSerenidadIntensidad(tipo, valor) {
  if (!serenidadActivo) return;
  const num = Number(valor);

  if (tipo === "inicial") {
    serenidadActivo.intensidadInicial = num;
    const txt = document.getElementById("serenidadIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    serenidadActivo.intensidadFinal = num;
    const txt = document.getElementById("serenidadIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }

  guardarSerenidadActual();
}

function repetirSerenidad() {
  if (!serenidadActivo) return;
  serenidadActivo.rondas += 1;
  serenidadActivo.acepta = null;
  serenidadActivo.tenerDeseo = null;
  serenidadActivo.suelta = null;
  serenidadActivo.hariasm = null;
  serenidadActivo.cuando = null;
  guardarSerenidadActual();
  renderSerenidad();
}

function resumenSerenidadRespuestas() {
  const resumen = [];
  if (serenidadActivo.acepta) resumen.push("acepta: " + (SERENIDAD_ETIQUETAS[serenidadActivo.acepta] || serenidadActivo.acepta));
  if (serenidadActivo.tenerDeseo) resumen.push("tener el deseo: " + (SERENIDAD_ETIQUETAS[serenidadActivo.tenerDeseo] || serenidadActivo.tenerDeseo));
  if (serenidadActivo.suelta) resumen.push("soltar: " + (SERENIDAD_ETIQUETAS[serenidadActivo.suelta] || serenidadActivo.suelta));
  if (serenidadActivo.hariasm) resumen.push("lo harías: " + (SERENIDAD_ETIQUETAS[serenidadActivo.hariasm] || serenidadActivo.hariasm));
  if (serenidadActivo.cuando) resumen.push("cuándo: " + (SERENIDAD_ETIQUETAS[serenidadActivo.cuando] || serenidadActivo.cuando));
  return resumen.join(" · ");
}

function guardarSerenidadEnDiario() {
  if (!serenidadActivo) return;

  const resumen = resumenSerenidadRespuestas();

  const sesion = {
    tema: "serenidad",
    descripcion:
      "Serenidad: " +
      (serenidadActivo.que || "querer cambiar algo") +
      (serenidadActivo.rondas > 0 ? " · " + serenidadActivo.rondas + " ronda(s)" : "") +
      (resumen ? " · " + resumen : ""),
    emocionInicial: "deseo",
    intensidadInicial: serenidadActivo.intensidadInicial,
    necesidad: "no_se",
    emocionFinal: serenidadActivo.intensidadFinal <= 3 ? "aceptacion" : "deseo",
    intensidadFinal: serenidadActivo.intensidadFinal,
    beneficio: serenidadActivo.beneficio || "",
    tecnica: "serenidad"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(SERENIDAD_CONFIG.clave);
  serenidadActivo = null;
  navigateTo("diario", true);
}

function reiniciarSerenidad() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(SERENIDAD_CONFIG.clave);
  abrirSerenidad();
}

// ===== SUMERGIRSE =====

const SUMERGIR_CONFIG = {
  clave: "soltar_ejercicio_sumergir_v1"
};

const SUMERGIR_CHOICES = [
  { attr: "data-sumergir-adentrarse", campo: "adentrarse" },
  { attr: "data-sumergir-sumergir", campo: "sumergir" },
  { attr: "data-sumergir-profundizar", campo: "profundizar" },
  { attr: "data-sumergir-paz", campo: "paz" }
];

let sumergirActivo = null;

function abrirSumergir() {
  sumergirActivo = cargarSumergir() || {
    emocion: "pena",
    sentimiento: "",
    nucleo: "",
    adentrarse: null,
    sumergir: null,
    profundizar: null,
    niveles: 0,
    paz: null,
    intensidadInicial: 5,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderSumergir();
  navigateTo("ejercicio-sumergir");
}

function cargarSumergir() {
  try {
    return JSON.parse(localStorage.getItem(SUMERGIR_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarSumergirActual() {
  if (!sumergirActivo) return;
  localStorage.setItem(SUMERGIR_CONFIG.clave, JSON.stringify(sumergirActivo));
}

function renderSumergir() {
  if (!sumergirActivo) return;

  if (typeof fillSelect === "function") {
    fillSelect("sumergirEmocion", EMOCIONES);
  }
  const emocionSel = document.getElementById("sumergirEmocion");
  if (emocionSel) emocionSel.value = sumergirActivo.emocion;

  const sentimiento = document.getElementById("sumergirSentimientoInput");
  if (sentimiento) sentimiento.value = sumergirActivo.sentimiento || "";

  const nucleo = document.getElementById("sumergirNucleoInput");
  if (nucleo) nucleo.value = sumergirActivo.nucleo || "";

  const nivelesTxt = document.getElementById("sumergirNivelesTexto");
  if (nivelesTxt) nivelesTxt.textContent = sumergirActivo.niveles;

  const intInicial = document.getElementById("sumergirIntensidadInicial");
  if (intInicial) intInicial.value = sumergirActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("sumergirIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = sumergirActivo.intensidadInicial;

  const intFinal = document.getElementById("sumergirIntensidadFinal");
  if (intFinal) intFinal.value = sumergirActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("sumergirIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = sumergirActivo.intensidadFinal;

  const benInput = document.getElementById("sumergirBeneficioInput");
  if (benInput) benInput.value = sumergirActivo.beneficio || "";

  for (const c of SUMERGIR_CHOICES) {
    const valor = sumergirActivo[c.campo];
    document.querySelectorAll("[" + c.attr + "]").forEach(function (btn) {
      btn.classList.toggle("active-choice", btn.getAttribute(c.attr) === valor);
    });
  }
}

function setSumergirCampo(campo, valor) {
  if (!sumergirActivo) return;
  sumergirActivo[campo] = valor;
  guardarSumergirActual();
  renderSumergir();
}

function setSumergirIntensidad(tipo, valor) {
  if (!sumergirActivo) return;
  const num = Number(valor);

  if (tipo === "inicial") {
    sumergirActivo.intensidadInicial = num;
    const txt = document.getElementById("sumergirIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    sumergirActivo.intensidadFinal = num;
    const txt = document.getElementById("sumergirIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }

  guardarSumergirActual();
}

function seguirSumergiendo() {
  if (!sumergirActivo) return;
  sumergirActivo.niveles += 1;
  sumergirActivo.adentrarse = null;
  sumergirActivo.sumergir = null;
  sumergirActivo.profundizar = null;
  guardarSumergirActual();
  renderSumergir();
}

function guardarSumergirEnDiario() {
  if (!sumergirActivo) return;

  const detalle = [];
  if (sumergirActivo.sentimiento) detalle.push(sumergirActivo.sentimiento);
  if (sumergirActivo.niveles > 0) detalle.push(sumergirActivo.niveles + " nivel(es)");
  if (sumergirActivo.paz) detalle.push(sumergirActivo.paz === "si" ? "llegó a la paz" : "todavía en la superficie");

  const sesion = {
    tema: "sumergir",
    descripcion:
      "Sumergirse: " +
      (detalle.length ? detalle.join(" · ") : "exploración del núcleo") +
      (sumergirActivo.nucleo ? " · núcleo: " + sumergirActivo.nucleo : ""),
    emocionInicial: sumergirActivo.emocion,
    intensidadInicial: sumergirActivo.intensidadInicial,
    necesidad: "no_se",
    emocionFinal: sumergirActivo.intensidadFinal <= 3 ? "paz" : sumergirActivo.emocion,
    intensidadFinal: sumergirActivo.intensidadFinal,
    beneficio: sumergirActivo.beneficio || "",
    tecnica: "sumergirse"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(SUMERGIR_CONFIG.clave);
  sumergirActivo = null;
  navigateTo("diario", true);
}

function reiniciarSumergir() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(SUMERGIR_CONFIG.clave);
  abrirSumergir();
}

// ===== NO HAY NINGÚN PROBLEMA =====

const PROBLEMA_CONFIG = {
  clave: "soltar_ejercicio_problema_v1"
};

const PROBLEMA_CHOICES = [
  { attr: "data-problema-recordar", campo: "recordar" },
  { attr: "data-problema-cambiar", campo: "cambiar" },
  { attr: "data-problema-soltar-cambio", campo: "soltarCambio" },
  { attr: "data-problema-soltar-creer", campo: "soltarCreer" }
];

let problemaActivo = null;

function abrirProblema() {
  problemaActivo = cargarProblema() || {
    que: "",
    recordar: null,
    cambiar: null,
    soltarCambio: null,
    soltarCreer: null,
    pasadas: 0,
    intensidadInicial: 5,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderProblema();
  navigateTo("ejercicio-problema");
}

function cargarProblema() {
  try {
    return JSON.parse(localStorage.getItem(PROBLEMA_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarProblemaActual() {
  if (!problemaActivo) return;
  localStorage.setItem(PROBLEMA_CONFIG.clave, JSON.stringify(problemaActivo));
}

function renderProblema() {
  if (!problemaActivo) return;

  const queInput = document.getElementById("problemaQueInput");
  if (queInput) queInput.value = problemaActivo.que || "";

  const pasadasTxt = document.getElementById("problemaPasadasTexto");
  if (pasadasTxt) pasadasTxt.textContent = problemaActivo.pasadas;

  const intInicial = document.getElementById("problemaIntensidadInicial");
  if (intInicial) intInicial.value = problemaActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("problemaIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = problemaActivo.intensidadInicial;

  const intFinal = document.getElementById("problemaIntensidadFinal");
  if (intFinal) intFinal.value = problemaActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("problemaIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = problemaActivo.intensidadFinal;

  const benInput = document.getElementById("problemaBeneficioInput");
  if (benInput) benInput.value = problemaActivo.beneficio || "";

  for (const c of PROBLEMA_CHOICES) {
    const valor = problemaActivo[c.campo];
    document.querySelectorAll("[" + c.attr + "]").forEach(function (btn) {
      btn.classList.toggle("active-choice", btn.getAttribute(c.attr) === valor);
    });
  }
}

function setProblemaCampo(campo, valor) {
  if (!problemaActivo) return;
  problemaActivo[campo] = valor;
  guardarProblemaActual();
  renderProblema();
}

function setProblemaIntensidad(tipo, valor) {
  if (!problemaActivo) return;
  const num = Number(valor);

  if (tipo === "inicial") {
    problemaActivo.intensidadInicial = num;
    const txt = document.getElementById("problemaIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    problemaActivo.intensidadFinal = num;
    const txt = document.getElementById("problemaIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }

  guardarProblemaActual();
}

function repetirProblema() {
  if (!problemaActivo) return;
  problemaActivo.pasadas += 1;
  problemaActivo.recordar = null;
  problemaActivo.cambiar = null;
  problemaActivo.soltarCambio = null;
  problemaActivo.soltarCreer = null;
  guardarProblemaActual();
  renderProblema();
}

function guardarProblemaEnDiario() {
  if (!problemaActivo) return;

  const detalle = [];
  if (problemaActivo.que) detalle.push(problemaActivo.que);
  if (problemaActivo.pasadas > 0) detalle.push(problemaActivo.pasadas + " pasada(s)");

  const sesion = {
    tema: "problema",
    descripcion:
      "No hay ningún problema: " +
      (detalle.length ? detalle.join(" · ") : "exploración del presente"),
    emocionInicial: "aceptacion",
    intensidadInicial: problemaActivo.intensidadInicial,
    necesidad: "no_se",
    emocionFinal: problemaActivo.intensidadFinal <= 3 ? "paz" : "aceptacion",
    intensidadFinal: problemaActivo.intensidadFinal,
    beneficio: problemaActivo.beneficio || "",
    tecnica: "no-problema"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(PROBLEMA_CONFIG.clave);
  problemaActivo = null;
  navigateTo("diario", true);
}

function reiniciarProblema() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(PROBLEMA_CONFIG.clave);
  abrirProblema();
}

// ===== LOS SEIS PASOS =====

const PASOS_CONFIG = {
  clave: "soltar_ejercicio_pasos_v1"
};

const PASOS_CHOICES = [
  { attr: "data-pasos-paso", campo: "paso" }
];

let pasosActivo = null;

function abrirPasos() {
  pasosActivo = cargarPasos() || {
    que: "",
    paso: null,
    intensidadInicial: 5,
    intensidadFinal: 5,
    beneficio: ""
  };

  renderPasos();
  navigateTo("ejercicio-pasos");
}

function cargarPasos() {
  try {
    return JSON.parse(localStorage.getItem(PASOS_CONFIG.clave)) || null;
  } catch (error) {
    return null;
  }
}

function guardarPasosActual() {
  if (!pasosActivo) return;
  localStorage.setItem(PASOS_CONFIG.clave, JSON.stringify(pasosActivo));
}

function renderPasos() {
  if (!pasosActivo) return;

  const queInput = document.getElementById("pasosQueInput");
  if (queInput) queInput.value = pasosActivo.que || "";

  const intInicial = document.getElementById("pasosIntensidadInicial");
  if (intInicial) intInicial.value = pasosActivo.intensidadInicial;
  const intInicialTxt = document.getElementById("pasosIntensidadInicialTexto");
  if (intInicialTxt) intInicialTxt.textContent = pasosActivo.intensidadInicial;

  const intFinal = document.getElementById("pasosIntensidadFinal");
  if (intFinal) intFinal.value = pasosActivo.intensidadFinal;
  const intFinalTxt = document.getElementById("pasosIntensidadFinalTexto");
  if (intFinalTxt) intFinalTxt.textContent = pasosActivo.intensidadFinal;

  const benInput = document.getElementById("pasosBeneficioInput");
  if (benInput) benInput.value = pasosActivo.beneficio || "";

  const pasoValor = pasosActivo.paso ? String(pasosActivo.paso) : null;
  document.querySelectorAll("[data-pasos-paso]").forEach(function (btn) {
    btn.classList.toggle("active-choice", btn.getAttribute("data-pasos-paso") === pasoValor);
  });
}

function setPasosCampo(campo, valor) {
  if (!pasosActivo) return;
  pasosActivo[campo] = valor;
  guardarPasosActual();
  renderPasos();
}

function setPasosPaso(valor) {
  if (!pasosActivo) return;
  pasosActivo.paso = valor;
  guardarPasosActual();
  renderPasos();
}

function setPasosIntensidad(tipo, valor) {
  if (!pasosActivo) return;
  const num = Number(valor);

  if (tipo === "inicial") {
    pasosActivo.intensidadInicial = num;
    const txt = document.getElementById("pasosIntensidadInicialTexto");
    if (txt) txt.textContent = num;
  } else {
    pasosActivo.intensidadFinal = num;
    const txt = document.getElementById("pasosIntensidadFinalTexto");
    if (txt) txt.textContent = num;
  }

  guardarPasosActual();
}

function guardarPasosEnDiario() {
  if (!pasosActivo) return;

  const sesion = {
    tema: "pasos",
    descripcion:
      "Seis Pasos: paso " +
      (pasosActivo.paso ? pasosActivo.paso : "?") +
      (pasosActivo.que ? " · " + pasosActivo.que : ""),
    emocionInicial: "deseo",
    intensidadInicial: pasosActivo.intensidadInicial,
    necesidad: "no_se",
    emocionFinal: pasosActivo.intensidadFinal <= 3 ? "paz" : "deseo",
    intensidadFinal: pasosActivo.intensidadFinal,
    beneficio: pasosActivo.beneficio || "",
    tecnica: "seis-pasos"
  };

  if (typeof guardarSesion === "function") {
    guardarSesion(sesion);
  }

  alert("Sesión guardada en el diario.");

  localStorage.removeItem(PASOS_CONFIG.clave);
  pasosActivo = null;
  navigateTo("diario", true);
}

function reiniciarPasos() {
  if (!confirm("¿Reiniciar este ejercicio? Se borrarán tus respuestas.")) return;
  localStorage.removeItem(PASOS_CONFIG.clave);
  abrirPasos();
}
