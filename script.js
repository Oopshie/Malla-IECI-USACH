document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.ramo');

  const estado = {};

  botones.forEach(boton => {
    const id = boton.dataset.id;
    estado[id] = false;

    boton.addEventListener('click', () => {
      if (boton.disabled) return;

      const aprobado = boton.classList.toggle('aprobado');
      estado[id] = aprobado;

      actualizarEstado();
    });
  });

  function actualizarEstado() {
    // Desactivar ramos si algún prerrequisito no está aprobado
    botones.forEach(boton => {
      const id = boton.dataset.id;
      const prerqs = boton.dataset.prerqs ? boton.dataset.prerqs.split(',') : [];

      // Habilitar solo si todos los prerrequisitos están aprobados
      const habilitado = prerqs.every(pr => estado[pr]);

      if (prerqs.length > 0) {
        boton.disabled = !habilitado;
        if (!habilitado) {
          boton.classList.remove('aprobado');
          estado[id] = false;
        }
      }
    });

    actualizarProgreso();
  }

  function actualizarProgreso() {
    const total = Object.keys(estado).length;
    const completados = Object.values(estado).filter(v => v).length;
    const porcentaje = Math.round((completados / total) * 100);

    document.getElementById('barraProgreso').style.width = `${porcentaje}%`;
    document.getElementById('porcentaje').textContent = `${porcentaje}%`;
  }

  actualizarEstado();
});
