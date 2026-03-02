console.log("admin-events.js cargado");

// ========================
// ELEMENTOS
// ========================
const tablaBody = document.getElementById("eventosBody");
const form = document.getElementById("eventoForm");

const idEvento = document.getElementById("idEvento");
const nombre = document.getElementById("nombre");
const descripcion = document.getElementById("descripcion");
const fecha = document.getElementById("fecha");
const puntosOtorgados = document.getElementById("puntosOtorgados");
const latitud = document.getElementById("latitud");
const longitud = document.getElementById("longitud");

// ========================
// MAPA
// ========================
let map = L.map("map").setView([-26.1849, -58.1731], 13);
let marker = null;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(map);

map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  latitud.value = lat.toFixed(6);
  longitud.value = lng.toFixed(6);

  if (marker) marker.remove();
  marker = L.marker([lat, lng]).addTo(map);
});

// ========================
// CARGAR EVENTOS
// ========================
async function cargarEventos() {
  const res = await fetch("http://localhost:3000/eventos", {
    credentials: "include",
  });

  const data = await res.json();
  tablaBody.innerHTML = "";

  data.data.forEach((ev) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="p-2">${ev.idEvento}</td>
      <td class="p-2">${ev.nombre}</td>
      <td class="p-2">${ev.fecha.split("T")[0]}</td>
      <td class="p-2">${ev.latitud ?? "--"}</td>
      <td class="p-2">${ev.longitud ?? "--"}</td>
      <td class="p-2 flex gap-2">
        <button onclick='editarEvento(${JSON.stringify(ev)})'
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          Editar
        </button>

        <button onclick="eliminarEvento(${ev.idEvento})"
          class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
          Eliminar
        </button>
      </td>
    `;

    tablaBody.appendChild(tr);
  });
}
cargarEventos();

// ========================
// MODAL ELIMINAR
// ========================
let eventoAEliminar = null;

const modal = document.getElementById("modalEliminar");
const btnCancelar = document.getElementById("cancelarEliminar");
const btnConfirmar = document.getElementById("confirmarEliminar");

function eliminarEvento(id) {
  eventoAEliminar = id;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

btnCancelar.addEventListener("click", () => {
  eventoAEliminar = null;
  modal.classList.add("hidden");
});

btnConfirmar.addEventListener("click", async () => {
  if (!eventoAEliminar) return;

  try {
    await fetch(`http://localhost:3000/eventos/${eventoAEliminar}`, {
      method: "DELETE",
      credentials: "include",
    });

    cargarEventos();
  } catch (err) {
    console.error(err);
  }

  modal.classList.add("hidden");
  eventoAEliminar = null;
});

// ========================
// GUARDAR EVENTO
// ========================
async function guardarEvento() {
  const evento = {
    nombre: nombre.value.trim(),
    descripcion: descripcion.value || null,
    fecha: fecha.value,
    puntosOtorgados: Number(puntosOtorgados.value),
    latitud: latitud.value ? Number(latitud.value) : null,
    longitud: longitud.value ? Number(longitud.value) : null,
  };

  const editando = Boolean(idEvento.value);

  const url = editando
    ? `http://localhost:3000/eventos/${idEvento.value}`
    : "http://localhost:3000/eventos";

  const method = editando ? "PUT" : "POST";

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evento),
    credentials: "include",
  });

  form.reset();
  idEvento.value = "";
  cargarEventos();
}

function editarEvento(ev) {
  idEvento.value = ev.idEvento;
  nombre.value = ev.nombre;
  descripcion.value = ev.descripcion ?? "";
  fecha.value = ev.fecha.split("T")[0];
  puntosOtorgados.value = ev.puntosOtorgados;
  latitud.value = ev.latitud ?? "";
  longitud.value = ev.longitud ?? "";
}

// ========================
// LOGOUT
// ========================
async function logout() {
  await fetch("http://localhost:3000/usuarios/logout", {
    credentials: "include",
  });

  window.location.href = "/index.html";
}