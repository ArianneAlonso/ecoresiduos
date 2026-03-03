import './style.css'

/* =========================================
   CONFIG
========================================= */

const API = "http://localhost:3000";

const tbody = document.getElementById("tablaEntregas");
const formularioContainer = document.getElementById("formularioContainer");
const btnMostrarForm = document.getElementById("btnMostrarForm");
const btnCancelar = document.getElementById("btnCancelar");
const formEntrega = document.getElementById("formEntrega");

/* =========================================
   MAPA
========================================= */

let map;
let markersLayer;

function inicializarMapa() {
  map = L.map("map").setView([-34.6037, -58.3816], 12); // Buenos Aires default

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
}

/* =========================================
   CARGAR MIS ENTREGAS
========================================= */

async function cargarEntregas() {
  try {
    const res = await fetch(`${API}/entregas/mis-entregas`, {
      method: "GET",
      credentials: "include"
    });

    if (res.status === 401) {
      alert("Debes iniciar sesión.");
      window.location.href = "/login.html";
      return;
    }

    const data = await res.json();

    tbody.innerHTML = "";
    markersLayer.clearLayers();

    if (!data.entregas || data.entregas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center p-4 text-gray-500">
            No tienes entregas aún.
          </td>
        </tr>
      `;
      return;
    }

    const coordenadas = [];

    data.entregas.forEach(e => {
      agregarFila(e);
      agregarMarcador(e);

      if (e.latitud && e.longitud) {
        coordenadas.push([e.latitud, e.longitud]);
      }
    });

    // Centrar mapa automáticamente
    if (coordenadas.length > 0) {
      map.fitBounds(coordenadas);
    }

  } catch (error) {
    console.error("Error cargando entregas:", error);
    alert("Error al cargar las entregas.");
  }
}

/* =========================================
   BADGES DE ESTADO
========================================= */

function badgeEstado(estado) {
  switch (estado) {
    case "pendiente":
      return `
        <span class="px-2 py-1 text-xs font-semibold rounded bg-yellow-200 text-yellow-800">
          Pendiente
        </span>`;
    case "confirmado":
      return `
        <span class="px-2 py-1 text-xs font-semibold rounded bg-green-200 text-green-800">
          Confirmado
        </span>`;
    case "rechazado":
      return `
        <span class="px-2 py-1 text-xs font-semibold rounded bg-red-200 text-red-800">
          Rechazado
        </span>`;
    default:
      return estado;
  }
}

/* =========================================
   AGREGAR FILA A TABLA
========================================= */

function agregarFila(e) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td class="p-2 border-b">
      ${new Date(e.fechaSolicitud).toLocaleDateString()}
    </td>
    <td class="p-2 border-b">${e.detalleMateriales}</td>
    <td class="p-2 border-b">${e.direccion}</td>
    <td class="p-2 border-b">${e.latitud ?? "-"}</td>
    <td class="p-2 border-b">${e.longitud ?? "-"}</td>
    <td class="p-2 border-b">${badgeEstado(e.estadoPuntos)}</td>
  `;

  tbody.appendChild(tr);
}

/* =========================================
   AGREGAR MARCADOR AL MAPA
========================================= */

function agregarMarcador(e) {

  if (!e.latitud || !e.longitud) return;

  const marker = L.marker([e.latitud, e.longitud]).addTo(markersLayer);

  marker.bindPopup(`
    <strong>Materiales:</strong> ${e.detalleMateriales}<br>
    <strong>Dirección:</strong> ${e.direccion}<br>
    <strong>Estado:</strong> ${e.estadoPuntos}
  `);
}

/* =========================================
   MOSTRAR / OCULTAR FORMULARIO
========================================= */

btnMostrarForm.addEventListener("click", () => {
  formularioContainer.classList.remove("hidden");
});

btnCancelar.addEventListener("click", () => {
  formularioContainer.classList.add("hidden");
});

/* =========================================
   CREAR ENTREGA
========================================= */

formEntrega.addEventListener("submit", async function (e) {
  e.preventDefault();

  const materialesSeleccionados = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map(c => c.value);

  if (materialesSeleccionados.length === 0) {
    alert("Debes seleccionar al menos un material.");
    return;
  }

  const body = {
    materiales: materialesSeleccionados,
    tipoEnvase: document.getElementById("tipoEnvase").value,
    direccion: document.getElementById("direccion").value,
    horarioPreferencia: document.getElementById("horario").value
  };

  try {
    const res = await fetch(`${API}/entregas`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (res.status === 401) {
      alert("Sesión expirada. Inicia sesión nuevamente.");
      window.location.href = "/login.html";
      return;
    }

    const data = await res.json();

    if (res.ok) {
      alert("Solicitud creada correctamente 🎉");
      formEntrega.reset();
      formularioContainer.classList.add("hidden");
      cargarEntregas(); // 🔄 Recargar tabla y mapa
    } else {
      alert(data.message || "Error al crear la solicitud.");
    }

  } catch (error) {
    console.error("Error creando entrega:", error);
    alert("Error interno al crear la solicitud.");
  }
});

/* =========================================
   INICIAR
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  inicializarMapa();
  cargarEntregas();
});