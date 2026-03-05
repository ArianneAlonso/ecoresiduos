import { logoutUser } from "./logout.js";
import "./style.css";

const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {

  // =====================================================
  // 📍 MAPA
  // =====================================================
  const map = L.map("map").setView([-26.1775, -58.1781], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // =====================================================
  // 🔔 TOAST MODERNO
  // =====================================================
  function showToast(message, type = "success") {

    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");

    const baseStyle = `
      px-4 py-3 rounded-lg shadow-lg text-white text-sm
      transform transition-all duration-300 ease-in-out
      opacity-0 translate-x-5
    `;

    const types = {
      success: "bg-green-600",
      error: "bg-red-600",
      info: "bg-blue-600"
    };

    toast.className = `${baseStyle} ${types[type] || types.success}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("opacity-0", "translate-x-5");
    }, 50);

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-x-5");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // =====================================================
  // 🗑️ ICONOS
  // =====================================================
  const contenedorIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/679/679720.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  });

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const eventoIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/747/747310.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const eventoInscritoIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  // =====================================================
  // VARIABLES
  // =====================================================
  let CONTENEDORES = [];
  let EVENTOS = [];
  let markers = [];
  let eventMarkers = [];
  let userMarker = null;
  let userPos = null;

  const listaCont = document.getElementById("listaContenedores");
  const listaEventos = document.getElementById("listaEventos");
  const filtro = document.getElementById("filtro");
  const infoCercano = document.getElementById("infoCercano");

  // =====================================================
  // 📦 CONTENEDORES
  // =====================================================
  async function fetchContenedores() {
    try {
      const response = await fetch(`${API_URL}/contenedores`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error();

      const data = await response.json();

      CONTENEDORES = data.contenedores.map(c => ({
        id: c.idContenedor,
        nombre: c.nombreIdentificador,
        direccion: c.direccion,
        lat: parseFloat(c.latitud),
        lng: parseFloat(c.longitud),
        materiales: parseMateriales(c.materialesAceptados),
        horario: c.diasHorariosRecoleccion
      }));

      renderContenedores();

    } catch {
      showToast("Error al cargar contenedores", "error");
    }
  }

  function parseMateriales(str) {
    if (!str) return [];
    return str.replace(/[{}"]/g, "")
      .split(",")
      .map(m => m.trim());
  }

  function renderContenedores() {

    listaCont.innerHTML = "";
    markers.forEach(m => m.remove());
    markers = [];

    const tipo = filtro.value;

    const filtrados = tipo === "Todos"
      ? CONTENEDORES
      : CONTENEDORES.filter(c => c.materiales.includes(tipo));

    filtrados.forEach(c => {

      const li = document.createElement("li");
      li.className = "p-2 border rounded flex justify-between items-start";
      li.innerHTML = `
        <div>
          <div class="font-medium">${c.nombre}</div>
          <div class="text-sm text-gray-600">${c.direccion}</div>
          <div class="text-xs text-gray-500">${c.materiales.join(", ")}</div>
        </div>
        <button class="text-sm text-green-600 hover:underline">Ver</button>
      `;

      li.querySelector("button").addEventListener("click", () => {
        map.flyTo([c.lat, c.lng], 17);
      });

      listaCont.appendChild(li);

      const marker = L.marker([c.lat, c.lng], { icon: contenedorIcon })
        .bindPopup(`<b>${c.nombre}</b><br>${c.direccion}`)
        .addTo(map);

      markers.push(marker);
    });
  }

  filtro.addEventListener("change", renderContenedores);

  // =====================================================
  // 📅 EVENTOS
  // =====================================================
  async function fetchEventos() {
    try {
      const response = await fetch(`${API_URL}/eventos?upcoming=true`, {
        credentials: "include",
      });

      if (response.status === 403) {
        showToast("Sesión expirada", "error");
        return;
      }

      if (!response.ok) throw new Error();

      const result = await response.json();
      EVENTOS = result.data || [];

      renderEventos();

    } catch {
      showToast("Error al cargar eventos", "error");
    }
  }

  function renderEventos() {

    listaEventos.innerHTML = "";
    eventMarkers.forEach(m => m.remove());
    eventMarkers = [];

    EVENTOS.forEach(evento => {

      const li = document.createElement("li");
      li.className = "p-2 border rounded";

      li.innerHTML = `
        <div class="font-medium">${evento.nombre}</div>
        <div class="text-sm text-gray-600">
          ${new Date(evento.fecha).toLocaleDateString()}
        </div>
        <div class="text-xs text-gray-500">
          Asistentes: ${evento.totalAsistentes}
        </div>
        ${
          evento.inscrito
            ? `<div class="text-green-600 text-sm font-semibold mt-1">
                 ✔ Ya estás inscrito
               </div>`
            : `<button 
                class="mt-2 px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                Confirmar asistencia
               </button>`
        }
      `;

      if (!evento.inscrito) {
        li.querySelector("button").addEventListener("click", async () => {
          await confirmarAsistencia(evento.idEvento);
        });
      }

      listaEventos.appendChild(li);

      const marker = L.marker(
        [evento.latitud, evento.longitud],
        { icon: evento.inscrito ? eventoInscritoIcon : eventoIcon }
      ).addTo(map);

      eventMarkers.push(marker);
    });
  }

  async function confirmarAsistencia(idEvento) {
    try {
      const response = await fetch(`${API_URL}/eventos/${idEvento}/inscribir`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        showToast(result.mensaje || "Error al inscribirse", "error");
        return;
      }

      showToast("Te inscribiste correctamente 🎉", "success");
      await fetchEventos();

    } catch {
      showToast("Error del servidor", "error");
    }
  }

  // =====================================================
  // 📍 UBICACIÓN
  // =====================================================
  document.getElementById("btnUbicacion").addEventListener("click", () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;

      if (userMarker) userMarker.remove();

      userMarker = L.marker([latitude, longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup("Tu ubicación")
        .openPopup();

      map.flyTo([latitude, longitude], 15);
      userPos = [latitude, longitude];
    });
  });

  document.getElementById("btnCercano").addEventListener("click", () => {
    if (!userPos) return;

    let nearest = null;
    let minDist = Infinity;

    CONTENEDORES.forEach(c => {
      const d = map.distance(userPos, [c.lat, c.lng]);
      if (d < minDist) {
        minDist = d;
        nearest = { ...c, dist: Math.round(d) };
      }
    });

    if (nearest) {
      infoCercano.classList.remove("hidden");
      infoCercano.innerHTML = `
        <div class="font-semibold">Más cercano</div>
        <div>${nearest.nombre}</div>
        <div>${nearest.direccion}</div>
        <div>${nearest.dist} m</div>
      `;
      map.flyTo([nearest.lat, nearest.lng], 17);
    }
  });

  // =====================================================
  // 🔐 LOGOUT
  // =====================================================
  document.getElementById("logoutBtn")
    ?.addEventListener("click", logoutUser);

  // =====================================================
  // 🚀 INICIAR
  // =====================================================
  await fetchContenedores();
  await fetchEventos();

});