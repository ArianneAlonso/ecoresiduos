import "./style.css";
import { createIcons, icons } from "lucide";

const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {

  //-----------------------------------------------------
  // 🔹 ICONOS LUCIDE
  //-----------------------------------------------------
  createIcons({ icons });

  //-----------------------------------------------------
  // 🔹 MODO OSCURO GLOBAL
  //-----------------------------------------------------

  const toggleDark = document.getElementById("toggleDark");

  function updateIcon() {
    const isDark = document.documentElement.classList.contains("dark");

    toggleDark.innerHTML = `
      <i data-lucide="${isDark ? "sun" : "moon"}"></i>
    `;

    createIcons({ icons });
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    updateIcon();
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  toggleDark?.addEventListener("click", () => {
    const newTheme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });

  //-----------------------------------------------------
  // 🔹 PERFIL
  //-----------------------------------------------------

  const perfilContainer = document.getElementById("perfilContainer");
  const logrosContainer = document.getElementById("logrosContainer");

  await loadProfile(perfilContainer);
  renderAchievements(logrosContainer);

  //-----------------------------------------------------
  // 🔹 CERRAR SESIÓN
  //-----------------------------------------------------

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn?.addEventListener("click", async () => {

    try {
      const response = await fetch(`${API_URL}/usuarios/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }

      // Redirige al login
      window.location.href = "login.html";

    } catch (error) {
      console.error("Error cerrando sesión:", error);
      alert("No se pudo cerrar sesión");
    }
  });

});


//-----------------------------------------------------
// 🔹 CARGAR PERFIL
//-----------------------------------------------------
async function loadProfile(container) {
  try {
    const response = await fetch(`${API_URL}/perfil`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 401 || response.status === 403) {
      window.location.href = "login.html";
      return;
    }

    if (!response.ok) throw new Error("Error al obtener perfil");

    const usuario = await response.json();
    renderCard(container, usuario);

  } catch (error) {
    console.error("Error cargando perfil:", error);
  }
}


//-----------------------------------------------------
// 🔹 RENDER PERFIL
//-----------------------------------------------------
function renderCard(container, usuario) {

  const nivel = calcularNivel(usuario.puntosAcumulados);

  container.innerHTML = `
    <div class="max-w-sm mx-auto p-6 bg-green-50 dark:bg-gray-700 rounded-xl shadow-md transition">
      <img src="../assets/logo.png"
           class="mx-auto mb-4 w-24 h-24 rounded-full object-cover"/>

      <h3 class="text-2xl font-semibold text-green-700 dark:text-green-400">
        ${usuario.nombre}
      </h3>

      <p class="text-gray-600 dark:text-gray-300 mt-1">
        📧 ${usuario.email}
      </p>

      <p class="mt-2 dark:text-gray-200">
        💚 Nivel: <b>${nivel}</b>
      </p>

      <p class="dark:text-gray-200">
        ⭐ Puntos acumulados: <b>${usuario.puntosAcumulados}</b>
      </p>

      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Rol: ${usuario.rol}
      </p>

      <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Registrado el: ${new Date(usuario.fechaRegistro).toLocaleDateString()}
      </p>
    </div>
  `;
}


//-----------------------------------------------------
// 🔹 NIVEL
//-----------------------------------------------------
function calcularNivel(puntos) {
  if (puntos >= 200) return "EcoLeyenda 🌎";
  if (puntos >= 100) return "EcoHeroína 💚";
  if (puntos >= 50) return "EcoActiva ♻️";
  return "EcoInicial 🌱";
}


//-----------------------------------------------------
// 🔹 LOGROS
//-----------------------------------------------------
function renderAchievements(container) {

  const logros = [
    { titulo: "Primer reciclaje", icono: "♻️", descripcion: "Registraste tu primera entrega.", progreso: 100 },
    { titulo: "Eventos ecológicos", icono: "🎉", descripcion: "Participaste en actividades ambientales.", progreso: 60 },
    { titulo: "Constancia verde", icono: "🌱", descripcion: "Mantienes actividad constante.", progreso: 40 }
  ];

  container.innerHTML = logros.map(logro => `
    <div class="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center transition">
      <div class="text-4xl mb-2">${logro.icono}</div>
      <h4 class="font-semibold text-green-700 dark:text-green-400">${logro.titulo}</h4>
      <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">${logro.descripcion}</p>
      <div class="bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
        <div class="bg-green-600 h-2 rounded-full"
             style="width: ${logro.progreso}%;"></div>
      </div>
    </div>
  `).join("");
}