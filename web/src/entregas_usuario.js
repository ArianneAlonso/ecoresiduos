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
const toastExito = document.getElementById("toastExito");

let map;
let markersLayer;
let seleccionLayer;

let latSeleccionada = null;
let lngSeleccionada = null;

/* =========================================
   MAPA - FORMOSA
========================================= */

function inicializarMapa() {

  const formosaCoords = [-26.1775, -58.1781];

  map = L.map("map").setView(formosaCoords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  seleccionLayer = L.layerGroup().addTo(map);

  map.on("click", function (e) {

    const { lat, lng } = e.latlng;

    latSeleccionada = lat;
    lngSeleccionada = lng;

    seleccionLayer.clearLayers();

    const marker = L.marker([lat, lng]).addTo(seleccionLayer);

    marker.bindPopup(`
      <strong>Ubicación seleccionada</strong><br>
      Lat: ${lat.toFixed(6)}<br>
      Lng: ${lng.toFixed(6)}
    `).openPopup();

    mostrarFilaSeleccionada(lat, lng);
  });
}

/* =========================================
   MOSTRAR FILA SELECCIONADA
========================================= */

function mostrarFilaSeleccionada(lat, lng) {

  const filaAnterior = document.getElementById("filaSeleccionada");
  if (filaAnterior) filaAnterior.remove();

  const tr = document.createElement("tr");
  tr.id = "filaSeleccionada";

  tr.innerHTML = `
    <td class="p-2 border-b text-blue-600 font-semibold">
      Nueva
    </td>
    <td class="p-2 border-b">
      Seleccionado en mapa
    </td>
    <td class="p-2 border-b">
      Formosa, Argentina
    </td>
    <td class="p-2 border-b font-semibold text-green-600">
      ${lat.toFixed(6)}
    </td>
    <td class="p-2 border-b font-semibold text-green-600">
      ${lng.toFixed(6)}
    </td>
    <td class="p-2 border-b">
      <span class="px-2 py-1 text-xs font-semibold rounded bg-blue-200 text-blue-800">
        Pendiente de enviar
      </span>
    </td>
  `;

  tbody.prepend(tr);
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

    if (coordenadas.length > 0) {
      map.fitBounds(coordenadas);
    }

  } catch (error) {
    console.error("Error cargando entregas:", error);
  }
}

/* =========================================
   BADGE ESTADO
========================================= */

function badgeEstado(estado) {

  switch (estado) {
    case "pendiente":
      return `<span class="px-2 py-1 text-xs font-semibold rounded bg-yellow-200 text-yellow-800">Pendiente</span>`;
    case "confirmado":
      return `<span class="px-2 py-1 text-xs font-semibold rounded bg-green-200 text-green-800">Confirmado</span>`;
    case "rechazado":
      return `<span class="px-2 py-1 text-xs font-semibold rounded bg-red-200 text-red-800">Rechazado</span>`;
    default:
      return estado;
  }
}

/* =========================================
   AGREGAR FILA DESDE BACKEND
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
   MARCADOR ENTREGAS
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
   MOSTRAR / OCULTAR FORM
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

  if (!latSeleccionada || !lngSeleccionada) {
    alert("Debes seleccionar una ubicación en el mapa.");
    return;
  }

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
    horarioPreferencia: document.getElementById("horario").value,
    latitud: latSeleccionada,
    longitud: lngSeleccionada
  };

  try {

    const res = await fetch(`${API}/entregas`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (res.ok) {

      // Mostrar toast animado
      toastExito.classList.remove("translate-x-full", "opacity-0");
      toastExito.classList.add("translate-x-0", "opacity-100");

      setTimeout(() => {
        toastExito.classList.remove("translate-x-0", "opacity-100");
        toastExito.classList.add("translate-x-full", "opacity-0");
      }, 3000);

      formEntrega.reset();
      formularioContainer.classList.add("hidden");
      seleccionLayer.clearLayers();
      latSeleccionada = null;
      lngSeleccionada = null;

      cargarEntregas();

    } else {
      alert(data.message || "Error al crear la solicitud.");
    }

  } catch (error) {
    console.error("Error creando entrega:", error);
  }
});

/* =========================================
   INICIAR
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  inicializarMapa();
  cargarEntregas();
});