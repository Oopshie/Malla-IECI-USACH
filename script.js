document.querySelectorAll('.ramo').forEach(boton => {
  const id = boton.dataset.id;
  const requisitos = boton.dataset.requisitos ? boton.dataset.requisitos.split(',') : [];

  // Estado inicial
  const estadoGuardado = localStorage.getItem(id);
  if (estadoGuardado === 'aprobado') {
    boton.classList.add('aprobado');
    boton.disabled = true;
  }

  // Desactivar si no cumple requisitos
  const cumpleRequisitos = requisitos.every(req => localStorage.getItem(req) === 'aprobado');
  if (!cumpleRequisitos) {
    boton.disabled = true;
  }

  // Al hacer clic
  boton.addEventListener('click', () => {
    boton.classList.add('aprobado');
    boton.disabled = true;
    localStorage.setItem(id, 'aprobado');

    // Reactivar otros botones que dependan de este
    document.querySelectorAll('.ramo').forEach(otro => {
      const otrosRequisitos = otro.dataset.requisitos ? otro.dataset.requisitos.split(',') : [];
      if (otrosRequisitos.includes(id)) {
        const todosCumplidos = otrosRequisitos.every(req => localStorage.getItem(req) === 'aprobado');
        if (todosCumplidos && !otro.classList.contains('aprobado')) {
          otro.disabled = false;
        }
      }
    });
  });
});
