document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".ramo");

  botones.forEach(boton => {
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
    const porcentaje = Math.round((aprobados / total) * 10);
    const barra = document.getElementById("barra-progreso");
    barra.style.width = `${porcentaje}%`;
    document.getElementById("porcentaje-progreso").textContent = `${porcentaje}%`;
  }

  function desmarcarDependientes(ramoId) {
    botones.forEach(boton => {
      const requisitos = boton.dataset.requisitos?.split(",") || [];
      if (requisitos.includes(ramoId) && boton.classList.contains("aprobado")) {
        boton.classList.remove("aprobado");
        desmarcarDependientes(boton.dataset.id); // llamada recursiva
      }
    });
  }

  // Inicializar
  cargarEstado();
  actualizarEstadoRequisitos();
  actualizarBarraProgreso();
});
