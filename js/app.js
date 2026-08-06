let historyStack = ["inicio"];
let tecnicaActualId = null;
let tecnicaParaSesion = "";
let filtroDiario = { texto: "", tema: "", emocion: "", necesidad: "", tecnica: "" };
let filtroBeneficios = { texto: "", area: "" };

document.addEventListener("DOMContentLoaded", init);

function init() {
  setupNavigation();
  setupGlobalClicks();
  fillSelects();
  setupForms();
  setupRangeLabels();
  setupFiltros();
  setupAjustes();
  setupRecordatorio();
  setupCita();
  renderView(getCurrentView());
}

function getCurrentView() {
  return historyStack[historyStack.length - 1] || "inicio";
}

function navigateTo(viewName, resetHistory = false) {
  if (resetHistory) {
    historyStack = ["inicio"];

    if (viewName !== "inicio") {
      historyStack.push(viewName);
    }
  } else if (getCurrentView() !== viewName) {
    historyStack.push(viewName);
  }

  renderView(getCurrentView());
}

function goBack() {
  if (historyStack.length > 1) {
    historyStack.pop();
  }

  renderView(getCurrentView());
}

function renderView(viewName) {
  const views = document.querySelectorAll(".view");

  views.forEach(function (view) {
    view.classList.remove("active");
  });

  const activeView = document.getElementById("view-" + viewName);

  if (activeView) {
    activeView.classList.add("active");
  }

  const backBar = document.getElementById("backBar");

  if (backBar) {
    backBar.classList.toggle("hidden", viewName === "inicio");
  }

  let navView = viewName;

  if (viewName === "ajustes") {
    navView = "inicio";
  }

  if (viewName === "tecnica-detalle" || viewName === "ejercicio-columnas" || viewName === "ejercicio-limpieza" || viewName === "ejercicio-miedo" || viewName === "ejercicio-culpa" || viewName === "ejercicio-resistencia" || viewName === "ejercicio-objetivos" || viewName === "ejercicio-habitos" || viewName === "ejercicio-dinero" || viewName === "ejercicio-relaciones" || viewName === "ejercicio-salud" || viewName === "ejercicio-trabajo" || viewName === "ejercicio-mundo" || viewName === "ejercicio-estados" || viewName === "ejercicio-serenidad" || viewName === "ejercicio-sumergir" || viewName === "ejercicio-problema" || viewName === "ejercicio-pasos" || viewName === "objetivo-formulacion" || viewName === "objetivo-determinar" || viewName === "objetivo-actuar" || viewName === "objetivo-visualizar") {
    navView = "tecnicas";
  }

  document.querySelectorAll(".bottom-nav button").forEach(function (button) {
    button.classList.toggle("active", button.dataset.view === navView);
  });

  if (viewName === "inicio") {
    renderCitaDelDia();
  }

  if (viewName === "diario") {
    renderEstadisticas();
    renderSesiones();
  }

  if (viewName === "beneficios") {
    renderBeneficios();
  }

  if (viewName === "ajustes") {
    renderAjustes();
  }

  if (viewName === "tecnicas") {
    renderTecnicas();
  }

  if (viewName === "tecnica-detalle") {
    renderTecnicaDetalle();
  }

  if (viewName === "ejercicio-columnas") {
    if (typeof renderEjercicio === "function") {
      renderEjercicio();
    }
  }

  if (viewName === "ejercicio-limpieza") {
    if (typeof renderLimpieza === "function") {
      renderLimpieza();
    }
  }

  if (viewName === "ejercicio-miedo") {
    if (typeof renderMiedo === "function") {
      renderMiedo();
    }
  }

  if (viewName === "ejercicio-culpa") {
    if (typeof renderCulpa === "function") {
      renderCulpa();
    }
  }

  if (viewName === "ejercicio-resistencia") {
    if (typeof renderResistencia === "function") {
      renderResistencia();
    }
  }

  if (viewName === "ejercicio-habitos") {
    if (typeof renderHabitos === "function") {
      renderHabitos();
    }
  }

  if (viewName === "ejercicio-dinero") {
    if (typeof renderDinero === "function") {
      renderDinero();
    }
  }

  if (viewName === "ejercicio-relaciones") {
    if (typeof renderRelaciones === "function") {
      renderRelaciones();
    }
  }

  if (viewName === "ejercicio-salud") {
    if (typeof renderSalud === "function") {
      renderSalud();
    }
  }

  if (viewName === "ejercicio-trabajo") {
    if (typeof renderTrabajo === "function") {
      renderTrabajo();
    }
  }

  if (viewName === "ejercicio-mundo") {
    if (typeof renderMundo === "function") {
      renderMundo();
    }
  }

  if (viewName === "ejercicio-estados") {
    if (typeof renderEstados === "function") {
      renderEstados();
    }
  }

  if (viewName === "ejercicio-serenidad") {
    if (typeof renderSerenidad === "function") {
      renderSerenidad();
    }
  }

  if (viewName === "ejercicio-sumergir") {
    if (typeof renderSumergir === "function") {
      renderSumergir();
    }
  }

  if (viewName === "ejercicio-problema") {
    if (typeof renderProblema === "function") {
      renderProblema();
    }
  }

  if (viewName === "ejercicio-pasos") {
    if (typeof renderPasos === "function") {
      renderPasos();
    }
  }

  if (viewName === "ejercicio-objetivos") {
    if (typeof renderObjetivosLista === "function") {
      renderObjetivosLista();
    }
  }

  if (viewName === "objetivo-formulacion") {
    if (typeof renderObjetivoFormulacion === "function") {
      renderObjetivoFormulacion();
    }
  }

  if (viewName === "objetivo-determinar") {
    if (typeof renderObjetivoDeterminar === "function") {
      renderObjetivoDeterminar();
    }
  }

  if (viewName === "objetivo-actuar") {
    if (typeof renderObjetivoActuar === "function") {
      renderObjetivoActuar();
    }
  }

  if (viewName === "objetivo-visualizar") {
    if (typeof renderObjetivoVisualizar === "function") {
      renderObjetivoVisualizar();
    }
  }

  window.scrollTo(0, 0);
}

function setupNavigation() {
  document.querySelectorAll("[data-view]").forEach(function (button) {
    button.addEventListener("click", function () {
      const view = button.dataset.view;

      if (view === "liberar") {
        tecnicaParaSesion = "";
      }

      navigateTo(view, true);
    });
  });
}

function setupGlobalClicks() {
  document.addEventListener("click", function (event) {
    const backButton = event.target.closest('[data-action="back"]');

    if (backButton) {
      goBack();
      return;
    }

    const useTechniqueButton = event.target.closest('[data-action="usar-tecnica"]');

    if (useTechniqueButton) {
      usarTecnicaEnLiberar();
      return;
    }

    const techniqueCard = event.target.closest("[data-tecnica]");

    if (techniqueCard) {
      openTecnica(techniqueCard.dataset.tecnica);
      return;
    }

    const sessionButton = event.target.closest("[data-borrar-sesion]");

    if (sessionButton) {
      const id = sessionButton.dataset.borrarSesion;

      if (confirm("¿Borrar esta sesión?")) {
        eliminarSesion(id);
        renderSesiones();
      }

      return;
    }

    const benefitButton = event.target.closest("[data-borrar-beneficio]");

    if (benefitButton) {
      const id = benefitButton.dataset.borrarBeneficio;

      if (confirm("¿Borrar este beneficio?")) {
        eliminarBeneficio(id);
        renderBeneficios();
      }

      return;
    }

    const modoOscuroBtn = event.target.closest('[data-action="toggle-modo-oscuro"]');
    if (modoOscuroBtn) {
      toggleModoOscuro();
      return;
    }

    const recordatorioBtn = event.target.closest('[data-action="toggle-recordatorio"]');
    if (recordatorioBtn) {
      toggleRecordatorio();
      return;
    }

    const importarBtn = event.target.closest('[data-action="importar-datos"]');
    if (importarBtn) {
      const input = document.getElementById("importarDatosInput");
      if (input) input.click();
      return;
    }

    const borrarTodoBtn = event.target.closest('[data-action="borrar-todos-datos"]');
    if (borrarTodoBtn) {
      borrarTodosLosDatos();
      return;
    }

    const limpiarDiarioBtn = event.target.closest('[data-action="limpiar-filtros-diario"]');
    if (limpiarDiarioBtn) {
      limpiarFiltrosDiario();
      return;
    }

    const limpiarBeneficiosBtn = event.target.closest('[data-action="limpiar-filtros-beneficios"]');
    if (limpiarBeneficiosBtn) {
      limpiarFiltrosBeneficios();
      return;
    }
  });
}

function fillSelects() {
  if (typeof TEMAS !== "undefined") {
    fillSelect("tema", TEMAS);
    fillSelect("beneficioArea", TEMAS);
  }

  if (typeof EMOCIONES !== "undefined") {
    fillSelect("emocionInicial", EMOCIONES);
    fillSelect("emocionFinal", EMOCIONES);
  }

  if (typeof NECESIDADES !== "undefined") {
    fillSelect("necesidad", NECESIDADES);
  }

  setDefaultFinalEmotion();
}

function fillSelect(id, items) {
  const select = document.getElementById(id);

  if (!select || !Array.isArray(items)) {
    return;
  }

  select.innerHTML = items
    .map(function (item) {
      return `<option value="${item.id}">${item.nombre}</option>`;
    })
    .join("");
}

function setDefaultFinalEmotion() {
  const emocionFinal = document.getElementById("emocionFinal");

  if (emocionFinal) {
    emocionFinal.value = "paz";
  }
}

function setupForms() {
  const formSesion = document.getElementById("formSesion");

  if (formSesion) {
    formSesion.addEventListener("submit", onGuardarSesion);
  }

  const formBeneficio = document.getElementById("formBeneficio");

  if (formBeneficio) {
    formBeneficio.addEventListener("submit", onGuardarBeneficio);
  }

  const exportButton = document.getElementById("exportarDatos");

  if (exportButton) {
    exportButton.addEventListener("click", function () {
      if (typeof exportarDatos === "function") {
        exportarDatos();
      }
    });
  }
}

function setupRangeLabels() {
  const pairs = [
    ["intensidadInicial", "intensidadInicialTexto"],
    ["intensidadFinal", "intensidadFinalTexto"]
  ];

  pairs.forEach(function (pair) {
    const inputId = pair[0];
    const labelId = pair[1];

    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);

    if (!input || !label) {
      return;
    }

    input.addEventListener("input", function () {
      label.textContent = input.value;
    });

    label.textContent = input.value;
  });
}

function updateRangeLabels() {
  const pairs = [
    ["intensidadInicial", "intensidadInicialTexto"],
    ["intensidadFinal", "intensidadFinalTexto"]
  ];

  pairs.forEach(function (pair) {
    const inputId = pair[0];
    const labelId = pair[1];

    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);

    if (input && label) {
      label.textContent = input.value;
    }
  });
}

function onGuardarSesion(event) {
  event.preventDefault();

  const sesion = {
    tema: document.getElementById("tema").value,
    descripcion: document.getElementById("descripcion").value.trim(),
    emocionInicial: document.getElementById("emocionInicial").value,
    intensidadInicial: Number(document.getElementById("intensidadInicial").value),
    necesidad: document.getElementById("necesidad").value,
    emocionFinal: document.getElementById("emocionFinal").value,
    intensidadFinal: Number(document.getElementById("intensidadFinal").value),
    beneficio: document.getElementById("beneficioSesion").value.trim(),
    tecnica: tecnicaParaSesion || "liberacion_basica"
  };

  guardarSesion(sesion);

  event.target.reset();
  setDefaultFinalEmotion();
  updateRangeLabels();

  tecnicaParaSesion = "";

  renderSesiones();
  navigateTo("diario", true);
}

function onGuardarBeneficio(event) {
  event.preventDefault();

  const beneficio = {
    texto: document.getElementById("beneficioTexto").value.trim(),
    area: document.getElementById("beneficioArea").value
  };

  guardarBeneficio(beneficio);

  event.target.reset();
  renderBeneficios();
}

function renderSesiones() {
  const container = document.getElementById("listaSesiones");

  if (!container || typeof getSesiones !== "function") {
    return;
  }

  const sesiones = sesionesFiltradas();

  if (!sesiones.length) {
    container.innerHTML =
      '<p class="empty">No hay sesiones que coincidan con los filtros.</p>';
    return;
  }

  container.innerHTML = sesiones
    .map(function (sesion) {
      const fecha = formatFecha(sesion.fecha);
      const tema = nombreTema(sesion.tema);
      const emocionInicial = nombreEmocion(sesion.emocionInicial);
      const emocionFinal = nombreEmocion(sesion.emocionFinal);
      const necesidad = nombreNecesidad(sesion.necesidad);
      const tecnica = nombreTecnica(sesion.tecnica);

      return `
        <article class="session-item">
          <div class="small">${fecha}</div>
          <strong>${escapeHTML(tema)}</strong>

          ${
            sesion.descripcion
              ? `<p>${escapeHTML(sesion.descripcion)}</p>`
              : ""
          }

          <p>
            De ${escapeHTML(emocionInicial)} ${sesion.intensidadInicial}/10
            a ${escapeHTML(emocionFinal)} ${sesion.intensidadFinal}/10
          </p>

          <p>Necesidad: ${escapeHTML(necesidad)}</p>
          <p>Técnica: ${escapeHTML(tecnica)}</p>

          ${
            sesion.beneficio
              ? `<p><strong>Beneficio:</strong> ${escapeHTML(sesion.beneficio)}</p>`
              : ""
          }

          <button type="button" class="delete-button" data-borrar-sesion="${sesion.id}">
            Borrar
          </button>
        </article>
      `;
    })
    .join("");
}

function renderBeneficios() {
  const container = document.getElementById("listaBeneficios");

  if (!container || typeof getBeneficios !== "function") {
    return;
  }

  const beneficios = beneficiosFiltrados();

  if (!beneficios.length) {
    container.innerHTML = '<p class="empty">No hay beneficios que coincidan con los filtros.</p>';
    return;
  }

  container.innerHTML = beneficios
    .map(function (beneficio) {
      const fecha = formatFecha(beneficio.fecha);
      const area = nombreTema(beneficio.area);

      return `
        <article class="benefit-item">
          <div class="small">${fecha}</div>
          <p>${escapeHTML(beneficio.texto)}</p>
          <p class="small">Área: ${escapeHTML(area)}</p>

          <button type="button" class="delete-button" data-borrar-beneficio="${beneficio.id}">
            Borrar
          </button>
        </article>
      `;
    })
    .join("");
}

// ===== BÚSQUEDA Y FILTROS =====

function sesionesFiltradas() {
  const texto = filtroDiario.texto.trim().toLowerCase();
  const sesiones = getSesiones();

  return sesiones.filter(function (sesion) {
    const campos = [
      nombreTema(sesion.tema),
      sesion.descripcion || "",
      nombreEmocion(sesion.emocionInicial),
      nombreEmocion(sesion.emocionFinal),
      nombreNecesidad(sesion.necesidad),
      nombreTecnica(sesion.tecnica),
      sesion.beneficio || "",
      formatFecha(sesion.fecha)
    ]
      .join(" ")
      .toLowerCase();

    if (texto && campos.indexOf(texto) === -1) {
      return false;
    }
    if (filtroDiario.tema && sesion.tema !== filtroDiario.tema) {
      return false;
    }
    if (filtroDiario.emocion && sesion.emocionInicial !== filtroDiario.emocion) {
      return false;
    }
    if (filtroDiario.necesidad && sesion.necesidad !== filtroDiario.necesidad) {
      return false;
    }
    if (filtroDiario.tecnica && sesion.tecnica !== filtroDiario.tecnica) {
      return false;
    }

    return true;
  });
}

function beneficiosFiltrados() {
  const texto = filtroBeneficios.texto.trim().toLowerCase();
  const beneficios = getBeneficios();

  return beneficios.filter(function (beneficio) {
    const campos = [
      beneficio.texto || "",
      nombreTema(beneficio.area),
      formatFecha(beneficio.fecha)
    ]
      .join(" ")
      .toLowerCase();

    if (texto && campos.indexOf(texto) === -1) {
      return false;
    }
    if (filtroBeneficios.area && beneficio.area !== filtroBeneficios.area) {
      return false;
    }

    return true;
  });
}

function fillSelectConTodo(id, items) {
  const select = document.getElementById(id);

  if (!select || !Array.isArray(items)) {
    return;
  }

  select.innerHTML =
    '<option value="">Todas</option>' +
    items
      .map(function (item) {
        return `<option value="${item.id}">${item.nombre}</option>`;
      })
      .join("");
}

function setupFiltros() {
  if (typeof TEMAS !== "undefined") {
    fillSelectConTodo("filtroDiarioTema", TEMAS);
    fillSelectConTodo("filtroBeneficiosArea", TEMAS);
  }

  if (typeof EMOCIONES !== "undefined") {
    fillSelectConTodo("filtroDiarioEmocion", EMOCIONES);
  }

  if (typeof NECESIDADES !== "undefined") {
    fillSelectConTodo("filtroDiarioNecesidad", NECESIDADES);
  }

  if (typeof TECNICAS !== "undefined") {
    fillSelectConTodo("filtroDiarioTecnica", TECNICAS);
  }
}

function limpiarFiltrosDiario() {
  filtroDiario = { texto: "", tema: "", emocion: "", necesidad: "", tecnica: "" };
  const ids = [
    "filtroDiarioTexto",
    "filtroDiarioTema",
    "filtroDiarioEmocion",
    "filtroDiarioNecesidad",
    "filtroDiarioTecnica"
  ];

  ids.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  renderEstadisticas();
  renderSesiones();
}

function limpiarFiltrosBeneficios() {
  filtroBeneficios = { texto: "", area: "" };
  const texto = document.getElementById("filtroBeneficiosTexto");
  if (texto) texto.value = "";
  const area = document.getElementById("filtroBeneficiosArea");
  if (area) area.value = "";
  renderBeneficios();
}

function setupFiltrosEventos() {
  const filtroTexto = document.getElementById("filtroDiarioTexto");
  if (filtroTexto) {
    filtroTexto.addEventListener("input", function () {
      filtroDiario.texto = filtroTexto.value;
      renderSesiones();
    });
  }

  const selectsDiario = ["filtroDiarioTema", "filtroDiarioEmocion", "filtroDiarioNecesidad", "filtroDiarioTecnica"];

  selectsDiario.forEach(function (id) {
    const select = document.getElementById(id);
    if (select) {
      select.addEventListener("change", function () {
        if (id === "filtroDiarioTema") filtroDiario.tema = select.value;
        if (id === "filtroDiarioEmocion") filtroDiario.emocion = select.value;
        if (id === "filtroDiarioNecesidad") filtroDiario.necesidad = select.value;
        if (id === "filtroDiarioTecnica") filtroDiario.tecnica = select.value;
        renderSesiones();
      });
    }
  });

  const filtroBeneficioTexto = document.getElementById("filtroBeneficiosTexto");
  if (filtroBeneficioTexto) {
    filtroBeneficioTexto.addEventListener("input", function () {
      filtroBeneficios.texto = filtroBeneficioTexto.value;
      renderBeneficios();
    });
  }

  const filtroBeneficioArea = document.getElementById("filtroBeneficiosArea");
  if (filtroBeneficioArea) {
    filtroBeneficioArea.addEventListener("change", function () {
      filtroBeneficios.area = filtroBeneficioArea.value;
      renderBeneficios();
    });
  }
}

// ===== ESTADÍSTICAS =====

function renderEstadisticas() {
  const container = document.getElementById("diarioEstadisticas");

  if (!container || typeof getSesiones !== "function") {
    return;
  }

  const sesiones = getSesiones();

  if (!sesiones.length) {
    container.innerHTML = "";
    return;
  }

  const ahora = Date.now();
  const semana = sesiones.filter(function (s) {
    return ahora - new Date(s.fecha).getTime() < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const emocionMasFrecuente = masFrecuente(
    sesiones.map(function (s) {
      return nombreEmocion(s.emocionInicial);
    })
  );

  const necesidadMasFrecuente = masFrecuente(
    sesiones.map(function (s) {
      return nombreNecesidad(s.necesidad);
    })
  );

  const conIntensidades = sesiones.filter(function (s) {
    return typeof s.intensidadInicial === "number" && typeof s.intensidadFinal === "number";
  });

  const reduccionPromedio = conIntensidades.length
    ? Math.round(
        conIntensidades.reduce(function (acc, s) {
          return acc + (s.intensidadInicial - s.intensidadFinal);
        }, 0) / conIntensidades.length
      )
    : 0;

  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><strong>${sesiones.length}</strong><span>Sesiones totales</span></div>
      <div class="stat-card"><strong>${semana}</strong><span>Esta semana</span></div>
      <div class="stat-card"><strong>${escapeHTML(emocionMasFrecuente)}</strong><span>Emoción frecuente</span></div>
      <div class="stat-card"><strong>${escapeHTML(necesidadMasFrecuente)}</strong><span>Necesidad frecuente</span></div>
      <div class="stat-card"><strong>-${reduccionPromedio}</strong><span>Reducción promedio</span></div>
    </div>
  `;
}

function masFrecuente(lista) {
  const conteo = {};
  let mejor = "";
  let maximo = 0;

  lista.forEach(function (item) {
    const clave = item || "—";
    conteo[clave] = (conteo[clave] || 0) + 1;
    if (conteo[clave] > maximo) {
      maximo = conteo[clave];
      mejor = clave;
    }
  });

  return mejor || "—";
}

// ===== CITA DEL DÍA =====

function setupCita() {
  renderCitaDelDia();
}

function renderCitaDelDia() {
  const el = document.getElementById("citaDelDia");

  if (!el || typeof AFORISMOS === "undefined" || !AFORISMOS.length) {
    return;
  }

  const ahora = new Date();
  const inicio = new Date(ahora.getFullYear(), 0, 0);
  const diaDelAnio = Math.floor((ahora - inicio) / (24 * 60 * 60 * 1000));
  const cita = AFORISMOS[diaDelAnio % AFORISMOS.length];

  el.textContent = '"' + cita + '"';
}

// ===== AJUSTES =====

const AJUSTES_KEYS = {
  MODO_OSCURO: "soltar_modo_oscuro",
  RECORDATORIO: "soltar_recordatorio"
};

let recordatorioIntervalo = null;

function setupAjustes() {
  setupFiltrosEventos();
  aplicarModoOscuro(localStorage.getItem(AJUSTES_KEYS.MODO_OSCURO) === "1");

  const importInput = document.getElementById("importarDatosInput");
  if (importInput) {
    importInput.addEventListener("change", function () {
      if (importInput.files && importInput.files[0]) {
        importarDatos(importInput.files[0]);
      }
      importInput.value = "";
    });
  }
}

function renderAjustes() {
  const modoEstado = document.getElementById("modoOscuroEstado");
  if (modoEstado) {
    modoEstado.textContent = esModoOscuro() ? "activado" : "apagado";
  }

  const recordatorioEstado = document.getElementById("recordatorioEstado");
  if (recordatorioEstado) {
    recordatorioEstado.textContent =
      localStorage.getItem(AJUSTES_KEYS.RECORDATORIO) === "1" ? "activado" : "apagado";
  }
}

function esModoOscuro() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function aplicarModoOscuro(activo) {
  if (activo) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  localStorage.setItem(AJUSTES_KEYS.MODO_OSCURO, activo ? "1" : "0");
  renderAjustes();
}

function toggleModoOscuro() {
  aplicarModoOscuro(!esModoOscuro());
}

function setupRecordatorio() {
  if (localStorage.getItem(AJUSTES_KEYS.RECORDATORIO) !== "1") {
    return;
  }

  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "granted") {
    iniciarRecordatorio();
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permiso) {
      if (permiso === "granted") {
        iniciarRecordatorio();
      }
    });
  }
}

function iniciarRecordatorio() {
  if (recordatorioIntervalo) {
    return;
  }

  function avisar() {
    if (Notification.permission === "granted") {
      new Notification("¿Cómo te sientes ahora?", {
        body: "Tómate un momento y soltá lo que sientas."
      });
    }
  }

  avisar();
  recordatorioIntervalo = setInterval(avisar, 30 * 60 * 1000);
}

function toggleRecordatorio() {
  const activo = localStorage.getItem(AJUSTES_KEYS.RECORDATORIO) === "1";

  if (activo) {
    if (recordatorioIntervalo) {
      clearInterval(recordatorioIntervalo);
      recordatorioIntervalo = null;
    }
    localStorage.setItem(AJUSTES_KEYS.RECORDATORIO, "0");
  } else {
    if ("Notification" in window) {
      Notification.requestPermission().then(function (permiso) {
        if (permiso === "granted") {
          localStorage.setItem(AJUSTES_KEYS.RECORDATORIO, "1");
          iniciarRecordatorio();
          renderAjustes();
        } else {
          alert("Para usar recordatorios, permití las notificaciones del navegador.");
        }
      });
    } else {
      alert("Tu navegador no soporta notificaciones.");
    }
  }

  renderAjustes();
}

// ===== IMPORTAR DATOS =====

function importarDatos(archivo) {
  const reader = new FileReader();

  reader.onload = function () {
    try {
      const data = JSON.parse(reader.result);

      if (!Array.isArray(data.sesiones) || !Array.isArray(data.beneficios)) {
        throw new Error("Formato inválido");
      }

      if (
        !confirm(
          "¿Importar " +
            data.sesiones.length +
            " sesiones y " +
            data.beneficios.length +
            " beneficios? Se reemplazarán los datos actuales."
        )
      ) {
        return;
      }

      localStorage.setItem(STORAGE_KEYS.SESIONES, JSON.stringify(data.sesiones));
      localStorage.setItem(STORAGE_KEYS.BENEFICIOS, JSON.stringify(data.beneficios));

      renderEstadisticas();
      renderSesiones();
      renderBeneficios();
      alert("Datos importados correctamente.");
    } catch (error) {
      alert("No se pudo importar: el archivo no parece válido.");
    }
  };

  reader.readAsText(archivo);
}

function borrarTodosLosDatos() {
  if (!confirm("¿Borrar TODOS los datos? Se perderán sesiones, beneficios y ejercicios.")) {
    return;
  }
  if (!confirm("Esto no se puede deshacer. ¿Confirmás?")) {
    return;
  }

  const claves = Object.keys(localStorage).filter(function (clave) {
    return clave.indexOf("soltar_") === 0;
  });

  claves.forEach(function (clave) {
    localStorage.removeItem(clave);
  });

  filtroDiario = { texto: "", tema: "", emocion: "", necesidad: "", tecnica: "" };
  filtroBeneficios = { texto: "", area: "" };
  limpiarFiltrosDiario();
  limpiarFiltrosBeneficios();
  renderEstadisticas();
  renderSesiones();
  renderBeneficios();
  alert("Todos los datos fueron borrados.");
}

function renderTecnicas() {
  const container = document.getElementById("listaTecnicas");

  if (!container) {
    return;
  }

  if (typeof TECNICAS === "undefined" || !TECNICAS.length) {
    container.innerHTML = '<p class="empty">No hay técnicas cargadas.</p>';
    return;
  }

  container.innerHTML = `
    <div class="technique-index">
      ${TECNICAS
        .map(function (tecnica) {
          return `
            <article class="technique-index-item" data-tecnica="${tecnica.id}">
              <h3 class="technique-index-nombre">${escapeHTML(tecnica.nombre)}</h3>
              <p class="technique-index-resumen">${escapeHTML(tecnica.resumen)}</p>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function openTecnica(id) {
  tecnicaActualId = id;
  navigateTo("tecnica-detalle");
}

function usarTecnicaEnLiberar() {
  tecnicaParaSesion = tecnicaActualId;
  navigateTo("liberar", true);
}

function renderTecnicaDetalle() {
  const container = document.getElementById("detalleTecnica");

  if (!container) {
    return;
  }

  const tecnica =
    typeof TECNICAS !== "undefined"
      ? TECNICAS.find(function (item) {
          return item.id === tecnicaActualId;
        })
      : null;

  if (!tecnica) {
    container.innerHTML = `
      <div class="card">
        <p>Técnica no encontrada.</p>
      </div>
    `;
    return;
  }

  const cuando = (tecnica.cuando || [])
    .map(function (item) {
      return `<li>${escapeHTML(item)}</li>`;
    })
    .join("");

  const pasos = (tecnica.pasos || [])
    .map(function (item) {
      return `<li>${escapeHTML(item)}</li>`;
    })
    .join("");

  const preguntas = (tecnica.preguntas || [])
    .map(function (item) {
      return `<li>${escapeHTML(item)}</li>`;
    })
    .join("");

  let actionEjercicio = "abrir-ejercicio";
  if (tecnica.ejercicio === "miedo") actionEjercicio = "abrir-miedo";
  if (tecnica.ejercicio === "culpa") actionEjercicio = "abrir-culpa";
  if (tecnica.ejercicio === "resistencia") actionEjercicio = "abrir-resistencia";
  if (tecnica.ejercicio === "objetivos") actionEjercicio = "abrir-objetivos";
  if (tecnica.ejercicio === "habitos") actionEjercicio = "abrir-habitos";
  if (tecnica.ejercicio === "dinero") actionEjercicio = "abrir-dinero";
  if (tecnica.ejercicio === "relaciones") actionEjercicio = "abrir-relaciones";
  if (tecnica.ejercicio === "salud") actionEjercicio = "abrir-salud";
  if (tecnica.ejercicio === "trabajo") actionEjercicio = "abrir-trabajo";
  if (tecnica.ejercicio === "mundo") actionEjercicio = "abrir-mundo";
  if (tecnica.ejercicio === "estados") actionEjercicio = "abrir-estados";
  if (tecnica.ejercicio === "serenidad") actionEjercicio = "abrir-serenidad";
  if (tecnica.ejercicio === "sumergir") actionEjercicio = "abrir-sumergir";
  if (tecnica.ejercicio === "problema") actionEjercicio = "abrir-problema";
  if (tecnica.ejercicio === "pasos") actionEjercicio = "abrir-pasos";

  const botonEjercicio = tecnica.ejercicio
    ? `
      <button type="button" class="button" data-action="${actionEjercicio}" data-ejercicio="${tecnica.ejercicio}">
        Abrir ejercicio interactivo
      </button>
    `
    : "";

  container.innerHTML = `
    <div class="card technique-detail">
      <h2>${escapeHTML(tecnica.nombre)}</h2>

      ${
        tecnica.categoria
          ? `<span class="chip">${escapeHTML(tecnica.categoria)}</span>`
          : ""
      }

      <p>${escapeHTML(tecnica.descripcion || tecnica.resumen || "")}</p>

      ${
        cuando
          ? `<h3>Cuándo usarla</h3><ul class="technique-list">${cuando}</ul>`
          : ""
      }

      ${
        pasos
          ? `<h3>Pasos</h3><ol class="technique-list">${pasos}</ol>`
          : ""
      }

      ${
        preguntas
          ? `<h3>Preguntas</h3><ul class="technique-list">${preguntas}</ul>`
          : ""
      }

      ${botonEjercicio}

      <button type="button" class="button ${tecnica.ejercicio ? "secondary" : ""}" data-action="usar-tecnica">
        Usar en Liberar
      </button>

      <button type="button" class="button secondary" data-action="back">
        Volver a técnicas
      </button>
    </div>
  `;
}

function nombreTema(id) {
  if (typeof TEMAS === "undefined") {
    return id;
  }

  const item = TEMAS.find(function (tema) {
    return tema.id === id;
  });

  return item ? item.nombre : id;
}

function nombreEmocion(id) {
  if (typeof EMOCIONES === "undefined") {
    return id;
  }

  const item = EMOCIONES.find(function (emocion) {
    return emocion.id === id;
  });

  return item ? item.nombre : id;
}

function nombreNecesidad(id) {
  if (typeof NECESIDADES === "undefined") {
    return id;
  }

  const item = NECESIDADES.find(function (necesidad) {
    return necesidad.id === id;
  });

  return item ? item.nombre : id;
}

function nombreTecnica(id) {
  if (typeof TECNICAS === "undefined") {
    return id || "General";
  }

  const item = TECNICAS.find(function (tecnica) {
    return tecnica.id === id;
  });

  return item ? item.nombre : id || "General";
}

function formatFecha(isoDate) {
  try {
    return new Date(isoDate).toLocaleString("es", {
      dateStyle: "short",
      timeStyle: "short"
    });
  } catch (error) {
    return isoDate;
  }
}

function escapeHTML(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
