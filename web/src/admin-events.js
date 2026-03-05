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
  try {
    const res = await fetch("http://localhost:3000/eventos", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error al obtener eventos");

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
            class="px-2 py-1 bg-blue-600 text-white rounded">
            Editar
          </button>

          <button onclick="eliminarEvento(${ev.idEvento})"
            class="px-2 py-1 bg-red-600 text-white rounded">
            Eliminar
          </button>

          <button onclick="verUsuarios(${ev.idEvento})"
            class="px-2 py-1 bg-purple-600 text-white rounded">
            Usuarios
          </button>
        </td>
      `;

      tablaBody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error cargando eventos:", error);
  }
}
cargarEventos();

// ========================
// VER USUARIOS
// ========================
async function verUsuarios(idEvento) {
  try {
    const res = await fetch(
      `http://localhost:3000/eventos/${idEvento}/usuarios`,
      { credentials: "include" }
    );

    if (!res.ok) {
      alert("No se pudo obtener la lista de usuarios");
      return;
    }

    const data = await res.json();

    const lista = document.getElementById("listaUsuarios");
    lista.innerHTML = "";

    if (!data.data || data.data.length === 0) {
      lista.innerHTML = "<li>No hay usuarios inscriptos</li>";
    } else {
      data.data.forEach((u) => {
        const li = document.createElement("li");
        li.className = "border-b pb-2";
        li.innerHTML = `<strong>${u.nombre}</strong> - ${u.email}`;
        lista.appendChild(li);
      });
    }

    document.getElementById("modalUsuarios").classList.remove("hidden");
    document.getElementById("modalUsuarios").classList.add("flex");

  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    alert("Error del servidor");
  }
}

function cerrarModalUsuarios() {
  document.getElementById("modalUsuarios").classList.add("hidden");
}

// ========================
// GUARDAR EVENTO
// ========================
async function guardarEvento() {
  try {
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

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evento),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Error al guardar evento");

    form.reset();
    idEvento.value = "";
    cargarEventos();

  } catch (error) {
    console.error("Error guardando evento:", error);
    alert("Error al guardar evento");
  }
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
// ELIMINAR EVENTO
// ========================
let eventoAEliminar = null;
const modal = document.getElementById("modalEliminar");

function eliminarEvento(id) {
  eventoAEliminar = id;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

document.getElementById("cancelarEliminar").addEventListener("click", () => {
  modal.classList.add("hidden");
});

document.getElementById("confirmarEliminar").addEventListener("click", async () => {
  if (!eventoAEliminar) return;

  try {
    await fetch(`http://localhost:3000/eventos/${eventoAEliminar}`, {
      method: "DELETE",
      credentials: "include",
    });

    cargarEventos();
  } catch (error) {
    console.error("Error eliminando:", error);
  }

  modal.classList.add("hidden");
  eventoAEliminar = null;
});

// ========================
// LOGOUT
// ========================
async function logout() {
  try {
    await fetch("http://localhost:3000/usuarios/logout", {
      method: "POST", // 👈 importante
      credentials: "include",
    });
  } catch (error) {
    console.error("Error cerrando sesión:", error);
  }

  // Redirige al login
  window.location.replace("/login.html");
}