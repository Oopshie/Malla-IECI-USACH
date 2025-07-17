document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".ramo");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      if (boton.classList.contains("aprobado")) {
        boton.classList.remove("aprobado");
      } else {
        boton.classList.add("aprobado");
      }
      guardarEstado();
      actualizarEstadoRequisitos();
      actualizarBarraProgreso();
    });
  });

  function guardarEstado() {
    const estado = {};
    botones.forEach(boton => {
      estado[boton.dataset.id] = boton.classList.contains("aprobado");
    });
    localStorage.setItem("estadoRamos", JSON.stringify(estado));
  }

  function cargarEstado() {
    const estadoGuardado = localStorage.getItem("estadoRamos");
    if (!estadoGuardado) return;
    const estado = JSON.parse(estadoGuardado);
    botones.forEach(boton => {
      if (estado[boton.dataset.id]) {
        boton.classList.add("aprobado");
      }
    });
  }

  function actualizarEstadoRequisitos() {
    botones.forEach(boton => {
      const requisitos = boton.dataset.requisitos;
      if (requisitos) {
        const cumplido = requisitos.split(",").every(id => {
          const req = document.querySelector(`[data-id="${id}"]`);
          return req && req.classList.contains("aprobado");
        });
        boton.disabled = !cumplido;
      }
    });
  }

  function actualizarBarraProgreso() {
    const total = botones.length;
    const aprobados = document.querySelectorAll(".ramo.aprobado").length;
    const porcentaje = (aprobados / total) * 100;
    document.getElementById("barra-progreso").style.width = `${porcentaje}%`;
  }

  function actualizarEstadoBotones() {
    botones.forEach((boton) => {
      const requisitos = boton.dataset.requisitos?.split(",") || [];
      const aprobados = requisitos.every((id) => localStorage.getItem(id) === "aprobado");

      if (requisitos.length === 0 || aprobados) {
        boton.disabled = false;
      } else {
        boton.disabled = true;
      }
    });
  }

  function desmarcarDependientes(id) {
    botones.forEach((boton) => {
      const requisitos = boton.dataset.requisitos?.split(",") || [];

      if (requisitos.includes(id) && localStorage.getItem(boton.dataset.id) === "aprobado") {
        // Desmarcar el botón dependiente
        localStorage.removeItem(boton.dataset.id);
        boton.classList.remove("aprobado");
        boton.disabled = true;

        // Llamada recursiva para desmarcar más abajo en la cadena
        desmarcarDependientes(boton.dataset.id);
      }
    });
  }

    botones.forEach((boton) => {
    const id = boton.dataset.id;

    // Restaurar estado desde localStorage
    if (localStorage.getItem(id) === "aprobado") {
      boton.classList.add("aprobado");
    }

    boton.addEventListener("click", () => {
      if (boton.classList.contains("aprobado")) {
        // Desmarcar
        boton.classList.remove("aprobado");
        localStorage.removeItem(id);

        // Desmarcar dependientes si los hay
        desmarcarDependientes(id);
      } else {
        // Marcar como aprobado
        boton.classList.add("aprobado");
        localStorage.setItem(id, "aprobado");
      }

      actualizarEstadoBotones();
    });
  });

  

  // Inicializar
  cargarEstado();
  actualizarEstadoRequisitos();
  actualizarBarraProgreso();
  actualizarEstadoBotones();
});
