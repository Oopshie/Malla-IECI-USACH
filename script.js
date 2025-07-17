document.addEventListener("DOMContentLoaded", () => {
  function obtenerBotones() {
    return document.querySelectorAll(".ramo");
  }

  function guardarEstado() {
    const estado = {};
    obtenerBotones().forEach(boton => {
      estado[boton.dataset.id] = boton.classList.contains("aprobado");
    });
    localStorage.setItem("estadoRamos", JSON.stringify(estado));
  }

  function cargarEstado() {
    const estadoGuardado = localStorage.getItem("estadoRamos");
    if (!estadoGuardado) return;
    const estado = JSON.parse(estadoGuardado);
    obtenerBotones().forEach(boton => {
      if (estado[boton.dataset.id]) {
        boton.classList.add("aprobado");
      }
    });
  }

  function actualizarEstadoRequisitos() {
    obtenerBotones().forEach(boton => {
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
    const total = obtenerBotones().length;
    const aprobados = document.querySelectorAll(".ramo.aprobado").length;
    const porcentaje = Math.round((aprobados / total) * 100);
    const barra = document.getElementById("barra-progreso");
    barra.style.width = `${porcentaje}%`;
    document.getElementById("porcentaje-progreso").textContent = `${porcentaje}%`;
  }

  function desmarcarDependientes(ramoId) {
    obtenerBotones().forEach(boton => {
      const requisitos = boton.dataset.requisitos?.split(",") || [];
      if (requisitos.includes(ramoId) && boton.classList.contains("aprobado")) {
        boton.classList.remove("aprobado");
        desmarcarDependientes(boton.dataset.id); // llamada recursiva
      }
    });
  }

  obtenerBotones().forEach(boton => {
    boton.addEventListener("click", () => {
      if (boton.classList.contains("aprobado")) {
        boton.classList.remove("aprobado");
        desmarcarDependientes(boton.dataset.id);
      } else {
        boton.classList.add("aprobado");
      }
      guardarEstado();
      actualizarEstadoRequisitos();
      actualizarBarraProgreso();
    });
  });
  
  // Inicializar
  cargarEstado();
  actualizarEstadoRequisitos();
  actualizarBarraProgreso();
});
