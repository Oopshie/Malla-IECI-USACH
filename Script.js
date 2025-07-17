const ramos = {
  calculo1: { nombre: "Cálculo I", prerequisitos: [], semestre: 1 },
  algebra: { nombre: "Álgebra", prerequisitos: [], semestre: 1 },
  fisica: { nombre: "Física", prerequisitos: ["calculo1"], semestre: 2 },
  calculo2: { nombre: "Cálculo II", prerequisitos: ["calculo1"], semestre: 2 },
  ecuaciones: { nombre: "Ecuaciones Diferenciales", prerequisitos: ["calculo2", "algebra"], semestre: 3 }
};

let aprobados = new Set(JSON.parse(localStorage.getItem("aprobados") || "[]"));

function iniciarMalla() {
  for (const id in ramos) {
    const div = document.getElementById(id);
    div.addEventListener("click", () => aprobarRamo(id));

    if (aprobados.has(id)) {
      desactivarRamo(div);
    } else if (ramos[id].prerequisitos.every(req => aprobados.has(req))) {
      activarRamo(div);
    }
  }
  actualizarProgreso();
}

function activarRamo(div) {
  div.classList.add("activo");
  div.classList.remove("aprobado");
  div.style.cursor = "pointer";
}

function desactivarRamo(div) {
  div.classList.remove("activo");
  div.classList.add("aprobado");
  div.style.cursor = "default";
  div.style.opacity = "1";
}

function aprobarRamo(id) {
  const div = document.getElementById(id);
  if (!div.classList.contains("activo")) return;

  aprobados.add(id);
  localStorage.setItem("aprobados", JSON.stringify(Array.from(aprobados)));
  desactivarRamo(div);

  for (const otroId in ramos) {
    if (!aprobados.has(otroId)) {
      const habilitado = ramos[otroId].prerequisitos.every(req => aprobados.has(req));
      if (habilitado) {
        activarRamo(document.getElementById(otroId));
      }
    }
  }

  actualizarProgreso();
}

function actualizarProgreso() {
  const total = Object.keys(ramos).length;
  const completados = aprobados.size;
  const porcentaje = Math.round((completados / total) * 100);

  const barra = document.getElementById("barra-progreso");
  const texto = document.getElementById("porcentaje-texto");

  barra.style.width = porcentaje + "%";
  texto.textContent = `Progreso: ${porcentaje}%`;
}

function reiniciarMalla() {
  localStorage.removeItem("aprobados");
  location.reload();
}

iniciarMalla();
