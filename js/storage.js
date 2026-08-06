const STORAGE_KEYS = {
  SESIONES: "soltar_sesiones_v1",
  BENEFICIOS: "soltar_beneficios_v1"
};

function getSesiones() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESIONES)) || [];
  } catch (error) {
    return [];
  }
}

function guardarSesion(sesion) {
  const sesiones = getSesiones();

  sesion.id = "ses_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
  sesion.fecha = new Date().toISOString();

  sesiones.unshift(sesion);

  localStorage.setItem(STORAGE_KEYS.SESIONES, JSON.stringify(sesiones));

  return sesion;
}

function eliminarSesion(id) {
  const sesiones = getSesiones().filter(function (sesion) {
    return sesion.id !== id;
  });

  localStorage.setItem(STORAGE_KEYS.SESIONES, JSON.stringify(sesiones));
}

function getBeneficios() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BENEFICIOS)) || [];
  } catch (error) {
    return [];
  }
}

function guardarBeneficio(beneficio) {
  const beneficios = getBeneficios();

  beneficio.id = "ben_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
  beneficio.fecha = new Date().toISOString();

  beneficios.unshift(beneficio);

  localStorage.setItem(STORAGE_KEYS.BENEFICIOS, JSON.stringify(beneficios));

  return beneficio;
}

function eliminarBeneficio(id) {
  const beneficios = getBeneficios().filter(function (beneficio) {
    return beneficio.id !== id;
  });

  localStorage.setItem(STORAGE_KEYS.BENEFICIOS, JSON.stringify(beneficios));
}

function exportarDatos() {
  const data = {
    exportado: new Date().toISOString(),
    sesiones: getSesiones(),
    beneficios: getBeneficios()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "soltar-datos.json";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
