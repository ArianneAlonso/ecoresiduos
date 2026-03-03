import "./style.css";

// ================================
// ELEMENTOS
// ================================
const tbody = document.getElementById("tbodyEntregas");
const logoutBtn = document.getElementById("logoutBtn");

let map;
let markersLayer;

// ================================
// INICIO
// ================================
document.addEventListener("DOMContentLoaded", () => {
  inicializarModoOscuro(); // 🌙 Dark mode
  inicializarMapa();
  cargarEntregas();
});

// ================================
// MODO OSCURO
// ================================
function inicializarModoOscuro() {

  const toggleBtn = document.getElementById("toggleDark");
  if (!toggleBtn) return;

  // Cargar preferencia guardada
  const modoGuardado = localStorage.getItem("modoOscuro");

  if (modoGuardado === "true") {
    document.documentElement.classList.add("dark");
  }

  toggleBtn.addEventListener("click", () => {

    document.documentElement.classList.toggle("dark");

    const esOscuro = document.documentElement.classList.contains("dark");

    localStorage.setItem("modoOscuro", esOscuro);
  });
}

// ================================
// INICIALIZAR MAPA
// ================================
function inicializarMapa() {

  map = L.map("map").setView([-34.6037, -58.3816], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
}

// ================================
// CARGAR ENTREGAS (ADMIN)
// ================================
async function cargarEntregas() {

  tbody.innerHTML = "";
  markersLayer.clearLayers();

  try {

    const res = await fetch("http://localhost:3000/entregas", {
      credentials: "include"
    });

    const data = await res.json();

    if (!data.ok) {
      console.error("No autorizado o error en servidor");
      return;
    }

    data.entregas.forEach(entrega => {
      agregarFila(entrega);
      agregarMarcador(entrega);
    });

  } catch (error) {
    console.error("Error al cargar entregas:", error);
  }
}

// ================================
// BADGES
// ================================
function obtenerBadgeEstado(estado) {

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

// ================================
// CREAR FILA
// ================================
function agregarFila(e) {

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td class="p-2 border-b">${e.idEntrega}</td>
    <td class="p-2 border-b">${e.usuario?.nombre ?? "N/A"}</td>
    <td class="p-2 border-b">${e.detalleMateriales}</td>
    <td class="p-2 border-b">${e.direccion}</td>
    <td class="p-2 border-b">${e.latitud ?? "-"}</td>
    <td class="p-2 border-b">${e.longitud ?? "-"}</td>
    <td class="p-2 border-b">${obtenerBadgeEstado(e.estadoPuntos)}</td>
    <td class="p-2 border-b flex gap-2">
      ${
        e.estadoPuntos === "pendiente"
          ? `
            <button onclick="confirmar(${e.idEntrega})"
              class="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded">
              Confirmar
            </button>

            <button onclick="rechazar(${e.idEntrega})"
              class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
              Rechazar
            </button>
          `
          : `<span class="text-gray-400 text-sm">Sin acciones</span>`
      }
    </td>
  `;

  tbody.appendChild(tr);
}

// ================================
// AGREGAR MARCADOR AL MAPA
// ================================
function agregarMarcador(e) {

  if (!e.latitud || !e.longitud) return;

  let color;

  switch (e.estadoPuntos) {
    case "pendiente": color = "orange"; break;
    case "confirmado": color = "green"; break;
    case "rechazado": color = "red"; break;
    default: color = "blue";
  }

  const marker = L.circleMarker([e.latitud, e.longitud], {
    radius: 8,
    color: color,
    fillColor: color,
    fillOpacity: 0.8
  }).addTo(markersLayer);

  marker.bindPopup(`
    <strong>ID:</strong> ${e.idEntrega}<br>
    <strong>Usuario:</strong> ${e.usuario?.nombre ?? "N/A"}<br>
    <strong>Materiales:</strong> ${e.detalleMateriales}<br>
    <strong>Estado:</strong> ${e.estadoPuntos}
  `);
}

// ================================
// CONFIRMAR ENTREGA
// ================================
window.confirmar = async function (id) {

  const pesoReal = prompt("Ingrese el peso real (kg):");
  const puntos = prompt("Ingrese los puntos a otorgar:");

  if (!pesoReal || !puntos) return;

  await fetch(`http://localhost:3000/entregas/${id}/confirmar`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      pesoReal: Number(pesoReal),
      puntosAOtorgar: Number(puntos)
    })
  });

  cargarEntregas();
};

// ================================
// RECHAZAR
// ================================
window.rechazar = async function (id) {

  if (!confirm("¿Seguro que desea rechazar esta entrega?")) return;

  await fetch(`http://localhost:3000/entregas/${id}/rechazar`, {
    method: "PATCH",
    credentials: "include"
  });

  cargarEntregas();
};

// ================================
// LOGOUT
// ================================
logoutBtn.addEventListener("click", async () => {

  await fetch("http://localhost:3000/usuarios/logout", {
    credentials: "include"
  });

  window.location.href = "/index.html";
});