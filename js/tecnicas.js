const TECNICAS = [
  {
    id: "liberacion_basica",
    nombre: "Liberación básica",
    categoria: "Base",
    resumen: "Para soltar un sentimiento presente.",
    descripcion:
      "Reconoces lo que sientes, lo aceptas y te preguntas si puedes dejarlo ir.",
    cuando: [
      "Malestar emocional",
      "Ansiedad",
      "Enojo",
      "Tristeza",
      "Bloqueo"
    ],
    pasos: [
      "Reconoce qué sientes ahora.",
      "Acéptalo lo mejor que puedas.",
      "Pregúntate si podrías soltarlo.",
      "Pregúntate si lo harías.",
      "Pregúntate cuándo.",
      "Repite hasta sentir alivio."
    ],
    preguntas: [
      "¿Qué siento ahora?",
      "¿Puedo aceptar este sentimiento?",
      "¿Podría soltarlo?",
      "¿Lo soltaría?",
      "¿Cuándo?"
    ]
  },

  {
    id: "aceptar_sentimiento",
    nombre: "Aceptar el sentimiento",
    categoria: "Base",
    resumen: "Para cuando luchas contra una emoción.",
    descripcion:
      "Permites que el sentimiento exista sin pelear con él. Muchas veces, al aceptarlo, empieza a aflojarse.",
    cuando: [
      "No puedes soltar",
      "Resistes una emoción",
      "Quieres cambiar lo que sientes",
      "Sientes bloqueo emocional"
    ],
    pasos: [
      "Identifica el sentimiento.",
      "Pregúntate si puedes permitir que esté aquí.",
      "Pregúntate si puedes aceptarlo.",
      "Observa si cambia.",
      "Repite si es necesario."
    ],
    preguntas: [
      "¿Puedo permitir que esto esté aquí?",
      "¿Puedo aceptar este sentimiento?",
      "¿Qué pasa si dejo de pelear con esto?"
    ]
  },

  {
    id: "sumergirse",
    nombre: "Sumergirse",
    categoria: "Liberación profunda",
    ejercicio: "sumergir",
    resumen: "Adentrarte en el núcleo de un sentimiento fuerte hasta llegar a la paz.",
    descripcion:
      "Cuando un sentimiento es fuerte, sentate, cerrá los ojos y relajate ante él. Descendé más allá de cualquier imagen, sensación o historia: todos los sentimientos, excepto la paz, están en la superficie. Al llegar al núcleo, el espíritu queda tranquilo. Si el sentimiento sigue fuerte o se intensifica, no llegaste al núcleo: volvé a otra forma de liberación.",
    cuando: [
      "Un sentimiento fuerte que no afloja con las preguntas habituales",
      "Querer liberar a un nivel más profundo",
      "Sentir que solo arañás la superficie de una emoción",
      "Tomarte tiempo para estar con vos en silencio"
    ],
    pasos: [
      "Elegí el sentimiento fuerte a explorar y sentate en silencio.",
      "Preguntate qué hay en el núcleo de ese sentimiento.",
      "Permitite adentrarte, sumergirte y profundizar, pasando de largo imágenes e historias.",
      "Repetí '¿podrías profundizar aún más?' hasta llegar a la paz.",
      "Si te atascás o la emoción se mantiene, usá otra forma de liberación."
    ],
    preguntas: [
      "¿Qué hay en el núcleo de este sentimiento?",
      "¿Podrías permitirte adentrarte conscientemente en ese núcleo?",
      "¿Podrías permitirte sumergirte en él?",
      "¿Podrías profundizar aún más?"
    ]
  },

  {
    id: "resistencia",
    nombre: "Resistencia",
    categoria: "Acción",
    ejercicio: "resistencia",
    resumen: "Para soltar bloqueo, obligación o procrastinación.",
    descripcion:
      "Trabaja con la sensación de resistencia hacia hacer o no hacer algo.",
    cuando: [
      "Procrastinación",
      "Bloqueo",
      "Tareas pendientes",
      "Sensación de obligación",
      "Deberías"
    ],
    pasos: [
      "Identifica aquello a lo que te resistes.",
      "Reconoce la resistencia.",
      "Acepta la resistencia.",
      "Suelta la resistencia a hacerlo.",
      "Suelta la resistencia a no hacerlo.",
      "Observa el cambio."
    ],
    preguntas: [
      "¿Puedo aceptar esta resistencia?",
      "¿Podría soltar la resistencia a hacerlo?",
      "¿Podría soltar la resistencia a no hacerlo?"
    ]
  },

  {
    id: "querer_cambiar",
    nombre: "Querer cambiar",
    categoria: "Serenidad",
    resumen: "Para soltar el deseo de cambiar algo que está presente.",
    descripcion:
      "Ayuda a aceptar lo que hay y salir del estancamiento producido por querer cambiarlo todo.",
    cuando: [
      "Frustración",
      "Aceptación difícil",
      "Situaciones que no puedes modificar",
      "Emociones persistentes",
      "Estancamiento"
    ],
    pasos: [
      "Identifica qué quieres cambiar.",
      "Reconoce el deseo de cambiarlo.",
      "Acepta ese deseo.",
      "Suelta el deseo de cambiarlo.",
      "Observa si aparece aceptación o acción clara."
    ],
    preguntas: [
      "¿Quiero cambiar esto?",
      "¿Puedo aceptar este deseo de cambiarlo?",
      "¿Podría soltar el deseo de cambiarlo?"
    ]
  },

  {
    id: "necesidades_basicas",
    nombre: "Necesidades básicas",
    categoria: "Profundización",
    resumen: "Para identificar la necesidad oculta detrás de una emoción.",
    descripcion:
      "Busca si el sentimiento viene de aprobación, control, seguridad o separación.",
    cuando: [
      "Emociones repetitivas",
      "Reacciones fuertes",
      "Patrones personales",
      "Sensación de carencia"
    ],
    pasos: [
      "Identifica la emoción.",
      "Pregúntate si viene de aprobación, control, seguridad o separación.",
      "Acepta la necesidad.",
      "Suelta la necesidad.",
      "Repite si aparecen capas nuevas."
    ],
    preguntas: [
      "¿Esto viene de aprobación, control, seguridad o separación?",
      "¿Puedo aceptar esta necesidad?",
      "¿Podría soltar esta necesidad?"
    ]
  },

  {
    id: "objetivos",
    nombre: "Objetivos",
    categoria: "Objetivos",
    ejercicio: "objetivos",
    resumen: "Para definir metas y liberar los bloqueos que aparecen.",
    descripcion:
      "Escribes un objetivo, observas qué emociones aparecen y liberas las necesidades que lo bloquean.",
    cuando: [
      "Metas personales",
      "Metas laborales",
      "Metas económicas",
      "Metas de salud",
      "Metas de relaciones"
    ],
    pasos: [
      "Escribe el objetivo.",
      "Léelo y observa qué sientes.",
      "Identifica pensamientos o emociones que aparecen.",
      "Identifica la necesidad oculta.",
      "Libera esa necesidad.",
      "Repite hasta sentir coraje, aceptación o paz."
    ],
    preguntas: [
      "¿Qué siento al leer este objetivo?",
      "¿Qué necesidad aparece?",
      "¿Podría soltar esta necesidad?"
    ]
  },

  {
    id: "accion",
    nombre: "Acción",
    categoria: "Objetivos",
    ejercicio: "objetivos",
    resumen: "Para desbloquear las acciones necesarias para una meta.",
    descripcion:
      "Libera resistencia frente a las acciones que necesitas hacer para avanzar.",
    cuando: [
      "Procrastinación",
      "Miedo a actuar",
      "Tareas pendientes",
      "Objetivos bloqueados"
    ],
    pasos: [
      "Escribe tu objetivo.",
      "Lista acciones posibles.",
      "Para cada acción, identifica emoción.",
      "Identifica resistencia o necesidad.",
      "Libera.",
      "Elige una acción simple."
    ],
    preguntas: [
      "¿Qué siento frente a esta acción?",
      "¿Hay resistencia?",
      "¿Qué necesidad hay debajo?",
      "¿Podría soltarla?"
    ]
  },

  {
    id: "gustos_aversiones",
    nombre: "Gustos / Aversiones",
    categoria: "Decisiones",
    ejercicio: "gustos_aversiones",
    resumen: "Para soltar apegos y rechazos hacia una persona, lugar o situación.",
    descripcion:
      "Trabaja con aquello que te gusta y lo que no te gusta de un tema, liberando la necesidad oculta en cada punto.",
    cuando: [
      "Relaciones",
      "Trabajo",
      "Dinero",
      "Cuerpo",
      "Decisiones",
      "Lugares"
    ],
    pasos: [
      "Elige un tema.",
      "Escribe algo que te gusta.",
      "Identifica emoción y necesidad.",
      "Libera.",
      "Escribe algo que no te gusta.",
      "Identifica emoción y necesidad.",
      "Libera.",
      "Alterna varias veces."
    ],
    preguntas: [
      "¿Qué me gusta de esto?",
      "¿Qué no me gusta?",
      "¿Qué necesidad hay debajo?",
      "¿Podría soltarla?"
    ]
  },

  {
    id: "ventajas_inconvenientes",
    nombre: "Ventajas / Inconvenientes",
    categoria: "Decisiones",
    ejercicio: "ventajas_inconvenientes",
    resumen: "Para descubrir ganancias ocultas y bloqueos.",
    descripcion:
      "Explora qué ventajas e inconvenientes tiene una situación, decisión, hábito o problema.",
    cuando: [
      "Decisiones",
      "Problemas persistentes",
      "Hábitos",
      "Síntomas",
      "Creencias",
      "Objetivos"
    ],
    pasos: [
      "Elige un tema.",
      "Pregúntate qué ventaja te supone.",
      "Identifica necesidad.",
      "Libera.",
      "Pregúntate qué inconveniente te supone.",
      "Identifica necesidad.",
      "Libera.",
      "Alterna varias veces."
    ],
    preguntas: [
      "¿Qué ventaja me supone que esto esté así?",
      "¿Qué inconveniente me supone?",
      "¿Qué necesidad hay debajo?",
      "¿Podría soltarla?"
    ]
  },

  {
    id: "limpieza",
    nombre: "Procedimiento de limpieza",
    categoria: "Relaciones",
    ejercicio: "limpieza",
    resumen: "Para limpiar sentimientos pendientes respecto a una persona.",
    descripcion:
      "Trabaja control, aprobación, seguridad y separación/unidad en relación con otra persona.",
    cuando: [
      "Conflictos",
      "Reuniones difíciles",
      "Pareja",
      "Familia",
      "Trabajo",
      "Exparejas"
    ],
    pasos: [
      "Piensa en la persona.",
      "Revisa si hubo control.",
      "Revisa si hubo búsqueda de aprobación.",
      "Revisa si hubo amenaza o inseguridad.",
      "Revisa separación o unidad.",
      "Cierra permitiendo que la persona sea como es."
    ],
    preguntas: [
      "¿Intentó controlarme?",
      "¿Intenté controlarla?",
      "¿Puedo reconocerle el derecho de ser?",
      "¿Puedo sentir aceptación?",
      "¿Puedo sentir bienestar, seguridad y confianza?"
    ]
  },

  {
    id: "miedo",
    nombre: "Miedo",
    categoria: "Emociones",
    ejercicio: "miedo",
    resumen: "Para soltar miedo, preocupación o ansiedad.",
    descripcion:
      "Trabaja con aquello que temes que ocurra y suelta la expectativa negativa.",
    cuando: [
      "Ansiedad",
      "Preocupación",
      "Imágenes negativas",
      "Miedo al futuro",
      "Miedo social",
      "Miedo económico"
    ],
    pasos: [
      "Escribe qué temes.",
      "Identifica qué temes que ocurra.",
      "Acepta el miedo.",
      "Suelta la expectativa de que ocurra.",
      "Elige una imagen más constructiva.",
      "Mide cómo te sientes después."
    ],
    preguntas: [
      "¿Qué temo que ocurra?",
      "¿Puedo aceptar este miedo?",
      "¿Podría soltar la expectativa de que ocurra?",
      "¿Qué prefiero mantener en la mente?"
    ]
  },

  {
    id: "habitos",
    nombre: "Hábitos y adicciones",
    categoria: "Acción",
    ejercicio: "habitos",
    resumen: "Para soltar malos hábitos, impulsos repetitivos y adicciones.",
    descripcion:
      "Trabaja con el hábito liberando antes del impulso, durante y después, descubriendo las ventajas ocultas y reformulando el hábito como un recuerdo del pasado.",
    cuando: [
      "Fumar",
      "Comer en exceso",
      "Compras compulsivas",
      "Aplazamiento",
      "Televisión o redes sociales",
      "Adicciones emocionales",
      "Juzgar",
      "Necesidad de tener razón"
    ],
    pasos: [
      "Identificá el hábito y hacé el pacto: 'Si querés, podés, pero antes liberá'.",
      "Liberá antes del impulso: identificá sentimiento y necesidad.",
      "Revisá el momento de ceder: antes, durante y después.",
      "Reformulá el hábito como un recuerdo del pasado.",
      "Descubrí las ventajas e inconvenientes ocultos.",
      "Liberá los gustos y aversiones asociados.",
      "Medí cómo te sentís ahora."
    ],
    preguntas: [
      "¿Qué sentimiento hay antes del impulso?",
      "¿Qué necesidad hay debajo?",
      "¿Qué ventaja oculta me da mantener este hábito?",
      "¿Podría soltar el deseo de pensar que todavía tengo este hábito?"
    ]
  },

  {
    id: "dinero",
    nombre: "Dinero y abundancia",
    categoria: "Abundancia",
    ejercicio: "dinero",
    resumen: "Para liberar bloqueos, miedos y creencias heredadas sobre el dinero.",
    descripcion:
      "Trabaja con tus creencias heredadas de los padres, tus miedos al dinero, tu limpieza relacional con él, tus gustos/aversiones y tu visualización de la abundancia ideal.",
    cuando: [
      "Bloqueos económicos",
      "Miedo al dinero",
      "Miedo al éxito",
      "Creencias de escasez",
      "Deudas",
      "Inversiones emocionales",
      "Resistencia a cobrar lo que vales",
      "Patrón de pobreza heredado"
    ],
    pasos: [
      "Identifica las creencias heredadas de tus padres sobre el dinero.",
      "Libera tus miedos usando el atajo: 'soltar el deseo de que ocurra'.",
      "Haz una limpieza relacional con el dinero.",
      "Libera tus gustos y aversiones sobre tu situación económica actual.",
      "Descubre las ventajas e inconvenientes ocultos de la libertad económica.",
      "Visualiza tu situación económica ideal y libera las objeciones.",
      "Mide el cambio."
    ],
    preguntas: [
      "¿Qué creo heredé de mis padres sobre el dinero?",
      "¿Qué temo que ocurra si tengo dinero?",
      "¿Podría soltar el deseo de que eso ocurra?",
      "¿Le concedo al dinero el derecho de ser como es?",
      "¿Qué ventaja oculta me da mi situación económica actual?",
      "¿Puedo aceptar completamente la imagen de abundancia?"
    ]
  },

  {
    id: "culpa_verguenza",
    nombre: "Culpa y vergüenza",
    categoria: "Emociones",
    ejercicio: "culpa",
    resumen: "Para soltar autocastigo, culpa y vergüenza.",
    descripcion:
      "La culpa promete evitar el castigo, pero en realidad lo atrae. Este ejercicio te ayuda a reconocer el autocastigo, descubrir qué ganas con él y decidir libremente soltarlo.",
    cuando: [
      "Arrepentimiento",
      "Autocrítica fuerte",
      "Vergüenza",
      "Culpa persistente",
      "Sensación de haber hecho algo malo",
      "Sensación de ser defectuoso"
    ],
    pasos: [
      "Identifica la situación y el tipo (culpa, vergüenza o ambas).",
      "Descubre si estás usando la culpa para conseguir aprobación, control o seguridad.",
      "Pregúntate si ya te has castigado suficiente.",
      "Revisa ventajas e inconvenientes del autocastigo.",
      "Acepta tus verdaderos sentimientos sobre lo ocurrido.",
      "Mide cómo te sientes después."
    ],
    preguntas: [
      "¿Ya me he castigado suficiente?",
      "¿Podría decidir dejar de castigarme?",
      "¿Qué ventaja me dio castigarme?",
      "¿Qué inconveniente me dio castigarme?",
      "¿Puedo aceptar lo ocurrido y aprender?"
    ]
  },

  {
    id: "relaciones",
    nombre: "Relaciones y amor",
    categoria: "Relaciones",
    ejercicio: "relaciones",
    resumen: "Para mejorar tus relaciones, soltar apegos y pasar del miedo al amor.",
    descripcion:
      "Trabaja tu relación con tus padres, tus miedos, tus gustos y aversiones, quema tus listas internas de reproches y visualiza tu relación ideal.",
    cuando: [
      "Conflictos de pareja",
      "Miedo a la intimidad o al compromiso",
      "Patrones repetidos de relación",
      "Relación con los padres",
      "Relación estancada o del pasado",
      "Buscar una relación nueva"
    ],
    pasos: [
      "Trascendé a tus padres: soltá lo que querés cambiar de esas primeras relaciones.",
      "Pasá del miedo al amor: soltá el deseo de que ocurra lo que temés.",
      "Liberá gustos y aversiones de la relación.",
      "Hacé el procedimiento de limpieza (incluye separación/unidad).",
      "Quemá tu lista interna de reproches.",
      "Hacé el ejercicio de desacuerdo (adaptado para uso solo).",
      "Visualizá tu relación ideal y soltá las objeciones."
    ],
    preguntas: [
      "¿Qué hay en tu relación con tus padres que querés cambiar?",
      "¿Podrías soltar el deseo de cambiarlo?",
      "¿Qué te da miedo que ocurra en esta relación?",
      "¿Podrías soltar el deseo de que eso ocurra?",
      "¿Qué te gusta y qué no te gusta de la relación?",
      "¿Podrías aceptar a la persona tal como es?",
      "¿Podrías permitirte que tu relación ideal se haga realidad?"
    ]
  },

  {
    id: "salud",
    nombre: "Salud y cuerpo",
    categoria: "Salud",
    ejercicio: "salud",
    resumen: "Para soltar el sufrimiento emocional alrededor de tu salud y aceptar tu cuerpo.",
    descripcion:
      "Trabaja con los 5 pasos para afrontar la incomodidad, acepta tu cuerpo tal como es, libera la influencia de tus padres, tus miedos, gustos y aversiones, y visualiza tu cuerpo ideal.",
    cuando: [
      "Dolores o síntomas persistentes",
      "Angustia por la salud o el envejecimiento",
      "Dietas o dejar de fumar",
      "Diagnósticos que pesan",
      "Miedo a los médicos",
      "Desconexión con el propio cuerpo"
    ],
    pasos: [
      "Considerá la posibilidad de curarte y soltá el deseo detrás de la duda.",
      "Querete tal como estás: soltá la desaprobación de tu cuerpo.",
      "Dejá de preguntarte por qué y soltá el deseo de saber.",
      "Superá el diagnóstico tratándolo como un recuerdo.",
      "Soltá el dolor y los síntomas, alternando sentirlos con el espacio que los rodea.",
      "Aceptá tu cuerpo tal como es.",
      "Andá más allá de tus padres sobre el cuerpo.",
      "Liberá los miedos del cuerpo (soltar el deseo de que ocurran).",
      "Liberá gustos y aversiones de tu cuerpo.",
      "Hacé la limpieza con tu cuerpo.",
      "Liberá ventajas e inconvenientes del estado físico.",
      "Visualizá tu cuerpo ideal y soltá las objeciones."
    ],
    preguntas: [
      "¿Estás abierto a la posibilidad de que liberar tus emociones mejore tu salud física?",
      "¿Podrías soltar tu desaprobación de tu cuerpo?",
      "¿Preferís comprender por qué, o simplemente sentirte mejor?",
      "¿Podrías soltar el deseo de creer que padecés ese diagnóstico?",
      "¿Podrías aceptar tu cuerpo tal como es?",
      "¿Qué temes que le ocurra a tu cuerpo? ¿Podrías soltar el deseo de que ocurra?",
      "¿Podrías permitirte que tu cuerpo ideal se haga realidad?"
    ]
  },

  {
    id: "trabajo",
    nombre: "Libertad y eficacia en el trabajo",
    categoria: "Trabajo",
    ejercicio: "trabajo",
    resumen: "Para delegar sin controlar, soltar la resistencia y la presión y decidir con claridad en el trabajo.",
    descripcion:
      "Suelta el microcontrol y aprende a delegar, libera la resistencia a tareas repetitivas, la presión de los plazos, vende con eficacia, toma decisiones sólidas y limpia tus relaciones con gente difícil.",
    cuando: [
      "Dificultad para delegar o microcontrolar",
      "Tareas repetitivas que resistes",
      "Agobio por plazos",
      "Ventas o negociaciones",
      "Decisiones difíciles",
      "Jefes, colegas o clientes difíciles"
    ],
    pasos: [
      "Delegá y soltá el microcontrol.",
      "Soltá la resistencia a hacer y a no hacer las tareas repetitivas.",
      "Soltá la presión de los plazos: disponé de todo el tiempo del mundo.",
      "Vendé con eficacia viendo la interacción desde el punto del otro.",
      "Tomá decisiones sólidas con Ventajas/Inconvenientes.",
      "Hacé la limpieza con jefes, colegas y clientes difíciles."
    ],
    preguntas: [
      "¿Podrías soltar el deseo de microdirigir a los demás?",
      "¿Podrías soltar la resistencia a hacer esta tarea? ¿Y a no hacerla?",
      "¿Podrías soltar la presión y disponer de todo el tiempo del mundo?",
      "¿Podrías soltar el deseo de aprobación, control o seguridad en esa interacción?",
      "¿Cuál es la ventaja y el inconveniente de esta decisión?"
    ]
  },

  {
    id: "mundo",
    nombre: "Paz y serenidad con el mundo",
    categoria: "Mundo",
    ejercicio: "mundo",
    resumen: "Para liberar tus reacciones a las noticias, pensar en soluciones y ayudar sin esperar nada a cambio.",
    descripcion:
      "Libera tus reacciones al ver o leer noticias, pasá de estar en contra de algo a estar a favor de la solución, soltá el rechazo a tus dirigentes y ejercé la amabilidad sin esperar nada a cambio.",
    cuando: [
      "Estrés o enfado por las noticias",
      "Sentirte en contra de algo o alguien",
      "Rechazo hacia dirigentes o figuras públicas",
      "Querer ayudar al mundo o a tu comunidad"
    ],
    pasos: [
      "Liberá al ver o leer noticias: imaginá el mundo que querés y soltá lo que lo niegue.",
      "Aceptá el mundo tal como es, soltando el deseo de cambiarlo.",
      "Pensá en soluciones: pasá de estar en contra de algo a estar a favor de algo.",
      "Apoyá a tus dirigentes: soltá las reacciones al resultado.",
      "Ejercé la amabilidad y el cariño, dando sin esperar nada a cambio."
    ],
    preguntas: [
      "¿Podrías aceptar el mundo tal como es, soltando el deseo de cambiarlo?",
      "¿Podrías soltar la energía en contra y pasar a estar a favor de la solución?",
      "¿Podrías soltar el deseo de aprobación, control o seguridad con esa persona?",
      "¿Podrías soltar el deseo de reconocimiento o de recibir algo a cambio?"
    ]
  },

  {
    id: "estados",
    nombre: "Mapa de los 9 estados emocionales",
    categoria: "Estados emocionales",
    ejercicio: "estados",
    resumen: "Para identificar dónde estás en la escala de energía y liberar el estado que te frena.",
    descripcion:
      "Identificá cuál de los nueve estados emocionales estás sintiendo (apatía, pena, miedo, deseo, ira, orgullo, coraje, aceptación o paz), revisá las palabras asociadas y liberá con las cuatro preguntas hasta gravitar hacia el coraje, la aceptación y la paz.",
    cuando: [
      "No saber exactamente qué estás sintiendo",
      "Sentirte atascado, triste, asustado, apegado, enfadado o cerrado",
      "Querer reconocer tus estados de alta energía ocultos",
      "Hacer un chequeo emocional del día"
    ],
    pasos: [
      "Elegí el estado que estás sintiendo ahora o el que quieras trabajar.",
      "Revisá las palabras asociadas para conectar con el sentimiento.",
      "Recordá la última vez que lo sentiste y dejá que aflore.",
      "Respondé con honestidad las cuatro preguntas y repetilas hasta soltar.",
      "Registrá el cambio de intensidad y el beneficio notado."
    ],
    preguntas: [
      "¿Podrías aceptar este sentimiento lo mejor que puedas?",
      "¿Podrías soltarlo?",
      "¿Lo soltarías?",
      "¿Cuándo?"
    ]
  },
  {
    id: "serenidad",
    nombre: "Querer cambiar / Serenidad",
    categoria: "Estados emocionales",
    ejercicio: "serenidad",
    resumen: "La válvula de seguridad: soltar el deseo de cambiar lo que sientes ahora.",
    descripcion:
      "Cuando algo no te gusta y deseas que sea distinto, ese deseo de cambiarlo mantiene el problema presente en tu mente. Soltar el deseo de cambiar 'lo' es la clave para lograr la serenidad: si no podés cambiarlo, lo aceptás sin esfuerzo; si debe cambiar, soltar te da la claridad para actuar. Úsala también cuando te atascas en cualquier otro ejercicio.",
    cuando: [
      "Querer cambiar algo que no podés cambiar",
      "Sentirte atascado en un sentimiento o en otro ejercicio",
      "Revivir el pasado y querer modificarlo",
      "Buscar aceptar lo que es tal como es"
    ],
    pasos: [
      "Escribí qué te gustaría que fuera distinto.",
      "Preguntate si te gustaría cambiarlo (casi siempre la respuesta es sí).",
      "Respondé con honestidad las preguntas del proceso.",
      "Repetí rondas hasta que el deseo de cambiar se afloje.",
      "Registrá el cambio de intensidad y el beneficio notado."
    ],
    preguntas: [
      "¿Podrías permitirte aceptar este sentimiento de atasco lo mejor que sepas?",
      "¿Podrías permitirte tener el deseo de cambiar esta situación?",
      "¿Podrías soltar el deseo de cambiar esta situación?",
      "¿Lo harías?",
      "¿Cuándo?"
    ]
  },
  {
    id: "no-problema",
    nombre: "No hay ningún problema",
    categoria: "Liberación profunda",
    ejercicio: "problema",
    resumen: "Reformular todo problema como un recuerdo y soltar el apego a él.",
    descripcion:
      "En el momento actual no hay ningún problema: todo lo que creés tener es un recuerdo. Pensá el problema en pasado y preguntate si podés recordar cómo solías pensar que lo tenías. Luego soltá el deseo de cambiar eso del pasado y el deseo de creer que el problema vuelve. Considerá pasado todo lo que no ocurre AHORA.",
    cuando: [
      "Problemas que parecen eternos y persistentes",
      "Sentirte identificado con tus problemas",
      "Querer cambiar el pasado",
      "Cultivar la idea de que en el presente no hay ningún problema"
    ],
    pasos: [
      "Escribí el problema en pasado: 'solía pensar que tenía...'.",
      "Recordá cómo solías pensar que tenías ese problema.",
      "Preguntate si te gustaría cambiar eso del pasado; si es sí, soltá ese deseo.",
      "Soltá el deseo de creer que el problema vuelve a plantearse.",
      "Repetí hasta soltar del todo."
    ],
    preguntas: [
      "¿Podrías permitirte recordar cómo solías pensar que tenías ese problema?",
      "¿Te gustaría cambiar eso que proviene del pasado?",
      "¿Podrías soltar el deseo de cambiar eso que proviene del pasado?",
      "¿Podrías soltar el deseo de creer que tenés de nuevo ese problema?"
    ]
  },
  {
    id: "seis-pasos",
    nombre: "Los Seis Pasos",
    categoria: "Referencia",
    ejercicio: "pasos",
    resumen: "La síntesis de la esencia del Método, para tener siempre a mano.",
    descripcion:
      "Los Seis Pasos son el núcleo de todo el Método. Tenelos ante los ojos cuando liberes: queré más la libertad que los cuatro deseos, decidí que podés liberar, sentí que todo culmina en aprobación/control/seguridad/separación y soltalos, sé constante, soltá el deseo de control si te atascás, y recordá que soltar te hace más ligero y feliz.",
    cuando: [
      "Tener a mano la referencia del método durante el día",
      "Quedarte atascado en otro ejercicio",
      "Recordar los cuatro deseos (aprobación, control, seguridad, separación)",
      "Reafirmar el objetivo de la libertad"
    ],
    pasos: [
      "Queré más la libertad que los cuatro deseos.",
      "Decidí que podés liberar.",
      "Sentí los cuatro deseos y soltalos.",
      "Sé constante, a solas o con otros.",
      "Si te atascás, soltá el deseo de cambiar o controlar.",
      "Soltar te hace más ligero, más feliz y más eficiente."
    ],
    preguntas: [
      "¿Prefiero este estancamiento, o prefiero ser libre?"
    ]
  }
];
