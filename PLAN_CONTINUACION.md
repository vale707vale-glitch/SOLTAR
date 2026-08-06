# Plan de continuidad - App Soltar

Fecha de hoy: 2026-08-06
Próxima sesión: 2026-08-07

---

## Estado actual de la app

Lo que ya está funcionando en tu carpeta `soltar/`:

- `index.html` con navegación y botón **Volver**.
- `css/styles.css` con estilos base + componentes interactivos.
- `js/data.js` con temas, emociones y necesidades básicas.
- `js/tecnicas.js` con biblioteca de 20 técnicas.
- `js/ejercicios.js` con los ejercicios interactivos:
  - Liberación básica
  - Miedo (atajo + 5 pasos)
  - Culpa/Vergüenza (6 pasos)
  - Procedimiento de limpieza (4 fases: control, aprobación, seguridad, separación/unidad)
  - Gustos / Aversiones (dos columnas)
  - Ventajas / Inconvenientes (dos columnas)
  - Resistencia
  - Objetivos
  - Hábitos
  - Dinero / Abundancia
  - Relaciones
  - Salud
  - Trabajo
  - Mundo
  - Estados emocionales (mapa de los 9 estados)
- `js/storage.js` con guardado en `localStorage` y exportación JSON.
- `js/app.js` con router, historial interno y renderizado.

---

## Qué falta hacer

### Bloque 1 — Módulos interactivos pendientes (prioridad alta)

1. **Resistencia** (cap. 4 del libro)
   - Hoja "Cosas que tengo que hacer" + sentimiento actual.
   - Resistencia a hacer y a no hacer (los dos lados).
   - Ejercicio físico de empujar con las manos (versión solo).
   - Resistencia a los propios sentimientos.

2. **Objetivos** (cap. 8)
   - Formulación guiada (positivo, presente, propio, sin "querer", sin medios).
   - Proceso de Determinar Objetivos (leer objetivo → sentimiento → deseo → liberar).
   - Proceso de Actuar (acciones → sentimiento → deseo → liberar).
   - Visualización + liberación de objeciones.
   - Biblioteca de objetivos guardados.

3. **Hábitos** (cap. 15) ✅ COMPLETADO
   - Pacto "si querés podés, pero antes liberá".
   - Liberación antes / durante / después del impulso.
   - Recordatorio de memoria del mal hábito como pasado.
   - Gustos/Aversiones y Ventajas/Inconvenientes aplicados al hábito.

4. **Dinero / Abundancia** (cap. 16) ✅ COMPLETADO
   - Creencias heredadas de los padres.
   - Miedos al dinero (atajo "soltar el deseo de que ocurra").
   - Gustos/Aversiones sobre tu situación económica.
   - Limpieza relacional con el dinero.
   - Ventajas/Inconvenientes de la libertad económica.
   - Visualización de tu situación económica ideal.

5. **Relaciones** (cap. 17)
   - Trascender a los padres.
   - Pasar del miedo al amor.
   - Gustos/Aversiones de la relación.
   - Procedimiento de limpieza con separación/unidad (ya existe parcialmente).
   - Quemar listas internas.
   - Ejercicio de desacuerdo (adaptado para uso solo: defender el punto de vista del otro por escrito).
   - Visualización de la relación ideal.

6. **Salud y cuerpo** (cap. 18) ✅ COMPLETADO
   - 5 pasos: posibilidad de curación, quererte tal como estás, dejar de preguntar por qué, superar el diagnóstico, soltar el dolor.
   - Aceptar las cosas como son.
   - Ir más allá de los padres sobre el cuerpo.
   - Miedos relacionados con el cuerpo.
   - Gustos/Aversiones del cuerpo.
   - Limpieza con el cuerpo.
   - Ventajas/Inconvenientes del estado físico.
   - Visualización del cuerpo ideal.

7. **Trabajo y organizaciones** (cap. 19) ✅ COMPLETADO
   - Delegar y soltar microcontrol.
   - Resistencia a tareas repetitivas (a hacerla / a no hacerla).
   - Presión de plazos ("disponer de todo el tiempo del mundo").
   - Vender con eficacia.
   - Decisiones sólidas (con Ventajas/Inconvenientes).
   - Limpieza con jefes / compañeros / clientes.

8. **Mundo** (cap. 20) ✅ COMPLETADO
   - Liberación al ver/leer noticias.
   - Aceptar el mundo tal como es.
   - Pasar de "anti algo" a "a favor de".
   - Apoyar a los dirigentes (limpieza).
   - Amabilidad sin esperar nada a cambio.

### Bloque 2 — Enriquecimiento del contenido

9. **Mapa de los 9 estados emocionales** (cap. 3) ✅ COMPLETADO
   - Listas de palabras asociadas a cada estado.
   - Selector de estado (6 de baja energía + 3 de alta energía).
   - Detalle con descripción, nivel de energía y palabras.
   - Check-in "recordá la última vez que sentiste este estado".
   - Las cuatro preguntas de liberación (aceptar / soltar / soltarías / cuándo).
   - Registro en el diario con la emoción del estado trabajado.

10. **Querer cambiar / Serenidad** (cap. 5) como técnica con su propia pantalla interactiva (válvula de seguridad del método). ✅ COMPLETADO
    - Vista `ejercicio-serenidad`: qué querés cambiar, intensidad inicial, las 5 preguntas del proceso (aceptar el atasco / tener el deseo / soltar el deseo / lo harías / cuándo).
    - Rondas de liberación repetibles (botón "Terminé esta ronda" que limpia las preguntas y suma una ronda).
    - Observación de cómo te sentís tras cada ronda, intensidad final y beneficio.
    - Registro en el diario con el tema "Serenidad".

11. **Sumergirse** (cap. 1) como técnica profunda con advertencia y guía. ✅ COMPLETADO
    - Vista `ejercicio-sumergir` con tarjeta de advertencia (no hacer mientras otra cosa; si el sentimiento se mantiene fuerte, no llegaste al núcleo).
    - Selector de emoción a explorar (9 estados), sentimiento, núcleo del sentimiento, intensidad inicial.
    - Preguntas de inmersión (adentrarse / sumergirte / profundizar) con rondas de profundidad acumulables.
    - Resultado: paz interior + intensidad final + beneficio. Registro en el diario (emoción inicial → paz si baja).

12. **Exploración del presente / "no hay ningún problema"** (cap. 12) — reformular todo problema como recuerdo. ✅ COMPLETADO
    - Vista `ejercicio-problema`: idea central (en el momento actual no hay ningún problema) + historia de Henry resumida.
    - Campo del problema formulado en pasado, con la nota de que pasado = todo lo que no ocurre AHORA.
    - 4 preguntas: recordar el problema / querer cambiarlo / soltar el deseo de cambiar lo del pasado / soltar el deseo de creer que vuelve.
    - Pasadas de liberación repetibles + intensidades + beneficio. Registro en el diario.

13. **Los Seis Pasos** (cap. 12) como tarjeta de referencia accesible desde cualquier pantalla. ✅ COMPLETADO
    - Vista `ejercicio-pasos` con las 6 tarjetas de referencia (incluida la pregunta "¿Prefiero este estancamiento, o prefiero ser libre?").
    - Botón "Seis Pasos" en la barra superior, visible en cualquier pantalla.
    - Sesión de hoy: qué trabajaste, paso en el que te detuviste, intensidades y beneficio. Registro en el diario.

### Bloque 3 — Mejoras técnicas

14. **Estadísticas simples** en el diario: ✅ COMPLETADO
    - Sesiones totales / esta semana (7 días).
    - Emoción inicial más frecuente.
    - Necesidad más frecuente.
    - Reducción promedio de intensidad.

15. **Importar datos** (para cuando exportes y quieras restaurar). ✅ COMPLETADO
    - Botón "Importar datos" en Ajustes + `<input type="file">` oculto.
    - Valida formato, confirma el reemplazo y restaura sesiones y beneficios.

16. **Búsqueda y filtros** en el diario y en beneficios (por técnica, emoción, necesidad, tema, fecha). ✅ COMPLETADO
    - Diario: buscador de texto + filtros por tema, emoción, necesidad y técnica + botón limpiar.
    - Beneficios: buscador de texto + filtro por área + botón limpiar.
    - La búsqueda cubre texto, nombres de tema/emoción/necesidad/técnica, beneficio y fecha.

17. **Recordatorios opcionales** (notificaciones del navegador tipo "¿Cómo te sientes ahora?"). ✅ COMPLETADO
    - Toggle en Ajustes; pide permiso de notificaciones y avisa cada 30 minutos mientras la app está abierta.

18. **Modo oscuro** (toggle en ajustes). ✅ COMPLETADO
    - Toggle en Ajustes; variables CSS `[data-theme="dark"]` + persistencia en localStorage.

19. **Borrar todos los datos** (en ajustes, con confirmación). ✅ COMPLETADO
    - Doble confirmación; elimina todas las claves `soltar_*` del localStorage (sesiones, beneficios y ejercicios).

20. **Notas rápidas / aforismos del libro** parafraseados por ti, como citas del día en Inicio (sin copiar texto literal del libro). ✅ COMPLETADO
    - Array `AFORISMOS` en `data.js` (16 citas originales) + tarjeta "Cita del día" en Inicio que rota según el día del año.

---

## Orden sugerido para mañana

Empezamos por los dos que más te sirven y luego seguimos en orden:

1. **Resistencia** (bloque 1, ítem 1)
2. **Objetivos** (bloque 1, ítem 2)
3. **Hábitos** (bloque 1, ítem 3)
4. **Dinero** (bloque 1, ítem 4) ✅
5. **Relaciones** (bloque 1, ítem 5) ✅
6. **Salud** (bloque 1, ítem 6) ✅
7. **Trabajo** (bloque 1, ítem 7) ✅
8. **Mundo** (bloque 1, ítem 8) ✅

**Bloque 1 completado.** Siguientes bloques:
9. **9 estados emocionales + mapa** (bloque 2) ✅
10. **Querer cambiar + Sumergirse + No hay problema + Seis Pasos** (bloque 2) ✅ COMPLETADO
11. **Estadísticas, filtros, import, borrado, modo oscuro, recordatorios** (bloque 3) ✅ COMPLETADO

**Plan completo: Bloque 1, Bloque 2 y Bloque 3 terminados.** La app queda funcional de punta a punta. Si se te ocurren mejoras nuevas, las sumamos al plan como ítems futuros.

---

## Principios que vamos a respetar

- **Uso personal**: la app es solo para ti.
- **Sin copiar texto largo del libro**: todo el contenido dentro de la app va parafraseado, resumido o escrito por vos.
- **Privacidad total**: datos locales en `localStorage`, sin servidores, sin login.
- **Aviso de salud**: módulos de salud, hábitos y adicciones incluirán nota recordando que la app no reemplaza ayuda profesional.
- **Nombres originales** para la app y los módulos (evitar usar "Método Sedona" como marca visible).

---

## Antes de mañana — Checklist

- [ ] Abrí `index.html` y navegá por todas las secciones actuales.
- [ ] Probá una sesión de liberación básica y guardala.
- [ ] Probá una sesión de miedo interactiva.
- [ ] Probá una sesión de culpa/vergüenza interactiva.
- [ ] Probá una sesión de limpieza con una persona real.
- [ ] Probá Gustos/Aversiones con un tema concreto.
- [ ] Probá Ventajas/Inconvenientes con una decisión.
- [ ] Exportá los datos desde Inicio y revisá el JSON descargado.

Si algo no funciona, anotámelo y mañana lo arreglamos antes de seguir.

---

## Publicarla en un link (fuera de localhost)

La app es **100% estática** (HTML + CSS + JS, todo con rutas relativas), así que cualquier
hosting de archivos estáticos la sirve sin tocar una sola línea de código.

### Opción A — Netlify Drop (la más fácil, sin instalar nada)

1. Andá a https://app.netlify.com/drop
2. Arrastrá la carpeta `C:\Users\roros\Documents\soltar` **entera** a la página.
3. Al toque te da un link tipo `https://algo-aleatorio.netlify.app`.
4. Para ponerle nombre propio: *Site settings → Change site name*.
5. Cuando cambies código, arrastrá la carpeta de nuevo (reemplaza la versión).

### Opción B — GitHub Pages (gratis, con link permanente)

1. Creá un repo en github.com (puede ser privado).
2. En la terminal:

```powershell
cd C:\Users\roros\Documents\soltar
git init
git add .
git commit -m "App Soltar"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

3. En GitHub: *Settings → Pages → Build and deployment → Source: Deploy from a branch → main / root → Save*.
4. Link: `https://TU_USUARIO.github.io/TU_REPO/`

### Opción C — Vercel o Cloudflare Pages

- Vercel: https://vercel.com → *New Project → Import* (o `npm i -g vercel` y `vercel` en la carpeta). Framework: *Other*, sin build.
- Cloudflare Pages: https://pages.cloudflare.com → *Create project → Direct upload* de la carpeta.

### Cosas importantes antes de publicar

- **Los datos siguen en `localStorage`**: son por navegador y por dispositivo. Cada persona
  que abra el link tiene sus propios datos; **no se sincronizan entre dispositivos**.
- **El link es nuevo y arranca vacío**: en el link no vas a ver tus sesiones actuales. Para
  migrarlas: abrí la versión local (`file://`), *Exportar datos* desde Inicio, abrí el link,
  y *Ajustes → Importar datos*.
- **Privacidad**: si el repo es privado, el link de Pages igual es público (cualquiera con el
  link puede abrirla). Si la querés solo para vos, no lo compartas.
- Antes de publicar, probá en el link: abrir, guardar una sesión, filtrar, modo oscuro.
  (En el navegador, `localStorage` de `file://` y del link son distintos y no se pisan.)

---

## Cómo seguir mañana

Cuando quieras continuar, abrime un chat nuevo y escribime:

> "Continuamos con el plan de Soltar. Arrancamos con **Resistencia**."

Yo leo este archivo `PLAN_CONTINUACION.md` de tu carpeta y seguimos justo donde lo dejamos, modificando o creando los archivos que hagan falta en `C:\Users\roros\Documents\soltar`.

---

*Nota: este plan es para una app de uso personal inspirada en principios de liberación emocional. No es un producto oficial del Método Sedona.*
