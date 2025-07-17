document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".ramo");

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
        localStorage.removeItem(boton.dataset.id);
        boton.classList.remove("aprobado");
        boton.disabled = true;
        desmarcarDependientes(boton.dataset.id); // recursivo
      }
    });
  }

  function actualizarProgreso() {
    const total = botones.length;
    const aprobados = Array.from(botones).filter(b => b.classList.contains("aprobado")).length;
    const porcentaje = Math.round((aprobados / total) * 100);

    const barra = document.getElementById("progreso-barra");
    const texto = document.getElementById("progreso-texto");

    if (barra && texto) {
      barra.style.width = `${porcentaje}%`;
      texto.textContent = `${porcentaje}% completado`;
    }
  }

  botones.forEach((boton) => {
    const id = boton.dataset.id;

    // Restaurar estado desde localStorage
    if (localStorage.getItem(id) === "aprobado") {
      boton.classList.add("aprobado");
    }

    boton.addEventListener("click", () => {
      if (boton.classList.contains("aprobado")) {
        boton.classList.remove("aprobado");
        localStorage.removeItem(id);
        desmarcarDependientes(id);
      } else {
        boton.classList.add("aprobado");
        localStorage.setItem(id, "aprobado");
      }

      actualizarEstadoBotones();
      actualizarProgreso();
    });
  });

  actualizarEstadoBotones();
  actualizarProgreso();
});
