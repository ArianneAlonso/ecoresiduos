import { logoutUser } from "./logout.js";
import "./style.css";

const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {

  const map = L.map("map").setView([-34.5612, -58.4565], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  let CONTENEDORES = [];
  let markers = [];
  let userMarker = null;
  let userPos = null;

  const listaCont = document.getElementById("listaContenedores");
  const filtro = document.getElementById("filtro");
  const infoCercano = document.getElementById("infoCercano");

  // =====================================================
  // 🔹 OBTENER CONTENEDORES DEL BACKEND
  // =====================================================
  async function fetchContenedores() {
    try {
      const response = await fetch(`${API_URL}/contenedores`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al obtener contenedores");

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

    } catch (error) {
      console.error("Error cargando contenedores:", error);
    }
  }

  // =====================================================
  // 🔹 PARSEAR MATERIALES
  // =====================================================
  function parseMateriales(str) {
    if (!str) return [];
    return str
      .replace(/[{}"]/g, "")
      .split(",")
      .map(m => m.trim());
  }

  // =====================================================
  // 🔹 RENDER CONTENEDORES
  // =====================================================
  function renderContenedores() {

    listaCont.innerHTML = "";

    const tipo = filtro.value;

    const filtrados = tipo === "Todos"
      ? CONTENEDORES
      : CONTENEDORES.filter(c => c.materiales.includes(tipo));

    // Limpiar marcadores
    markers.forEach(m => m.remove());
    markers = [];

    filtrados.forEach(c => {

      // Lista lateral
      const li = document.createElement("li");
      li.className = "p-2 border rounded flex justify-between items-start";
      li.innerHTML = `
        <div>
          <div class="font-medium">${c.nombre}</div>
          <div class="text-sm text-gray-600">${c.direccion}</div>
          <div class="text-xs text-gray-500">${c.materiales.join(", ")}</div>
        </div>
        <button class="text-sm text-blue-600 hover:underline">Ver</button>
      `;

      li.querySelector("button").addEventListener("click", () => {
        map.flyTo([c.lat, c.lng], 16, { duration: 0.8 });
      });

      listaCont.appendChild(li);

      // Marcador
      const marker = L.marker([c.lat, c.lng])
        .bindPopup(`
          <b>${c.nombre}</b><br>
          ${c.direccion}<br>
          <small>${c.materiales.join(", ")}</small><br>
          <small>${c.horario}</small>
        `)
        .addTo(map);

      markers.push(marker);
    });
  }

  filtro.addEventListener("change", renderContenedores);

  // =====================================================
  // 🔹 UBICACIÓN
  // =====================================================
  document.getElementById("btnUbicacion").addEventListener("click", () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;

      if (userMarker) userMarker.remove();

      userMarker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("Tu ubicación")
        .openPopup();

      map.flyTo([latitude, longitude], 15, { duration: 0.8 });
      userPos = [latitude, longitude];
    });
  });

  // =====================================================
  // 🔹 MÁS CERCANO
  // =====================================================
  document.getElementById("btnCercano").addEventListener("click", () => {

    if (!userPos) return;

    const tipo = filtro.value;
    const filtrados = tipo === "Todos"
      ? CONTENEDORES
      : CONTENEDORES.filter(c => c.materiales.includes(tipo));

    let nearest = null;
    let minDist = Infinity;

    filtrados.forEach(c => {
      const d = distanceMeters(userPos[0], userPos[1], c.lat, c.lng);
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
      map.flyTo([nearest.lat, nearest.lng], 16, { duration: 0.8 });
    }
  });

  // =====================================================
  // 🔹 DISTANCIA
  // =====================================================
  function distanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = deg => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // =====================================================
  // 🔹 LOGOUT
  // =====================================================
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  }

  // 🚀 INICIAR
  await fetchContenedores();
});