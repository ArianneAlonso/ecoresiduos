import "./style.css";

const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
  const perfilContainer = document.getElementById("perfilContainer");
  const logrosContainer = document.getElementById("logrosContainer");

  await loadProfile(perfilContainer);
  renderAchievements(logrosContainer);
});

//-----------------------------------------------------
// 🔹 CARGAR PERFIL CON COOKIE (credentials: include)
//-----------------------------------------------------
async function loadProfile(container) {
  try {
    const response = await fetch(`${API_URL}/perfil`, {
      method: "GET",
      credentials: "include", // 🔥 ESTO ES CLAVE
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401 || response.status === 403) {
      console.log("No autorizado, redirigiendo...");
      window.location.href = "login.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Error al obtener perfil");
    }

    const usuario = await response.json();

    renderCard(container, usuario);

  } catch (error) {
    console.error("Error cargando perfil:", error);
  }
}

//-----------------------------------------------------
// 🔹 RENDER CARD PERFIL
//-----------------------------------------------------
function renderCard(container, usuario) {

  const nivel = calcularNivel(usuario.puntosAcumulados);

  container.innerHTML = `
    <div class="max-w-sm mx-auto p-6 bg-green-50 rounded-xl shadow-md">
      <img src="../assets/logo.png" 
           class="mx-auto mb-4 w-24 h-24 rounded-full object-cover"/>

      <h3 class="text-2xl font-semibold text-green-700">
        ${usuario.nombre}
      </h3>

      <p class="text-gray-600 mt-1">
        📧 ${usuario.email}
      </p>

      <p class="mt-2">
        💚 Nivel: <b>${nivel}</b>
      </p>

      <p>
        ⭐ Puntos acumulados: <b>${usuario.puntosAcumulados}</b>
      </p>

      <p class="mt-2 text-sm text-gray-500">
        Rol: ${usuario.rol}
      </p>

      <p class="mt-2 text-xs text-gray-400">
        Registrado el: ${new Date(usuario.fechaRegistro).toLocaleDateString()}
      </p>
    </div>
  `;
}

//-----------------------------------------------------
// 🔹 CALCULAR NIVEL
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
    {
      titulo: "Primer reciclaje",
      icono: "♻️",
      descripcion: "Registraste tu primera entrega.",
      progreso: 100,
    },
    {
      titulo: "Eventos ecológicos",
      icono: "🎉",
      descripcion: "Participaste en actividades ambientales.",
      progreso: 60,
    },
    {
      titulo: "Constancia verde",
      icono: "🌱",
      descripcion: "Mantienes actividad constante.",
      progreso: 40,
    },
  ];

  container.innerHTML = logros
    .map(
      (logro) => `
      <div class="p-4 bg-white rounded-xl shadow-md text-center">
        <div class="text-4xl mb-2">${logro.icono}</div>
        <h4 class="font-semibold text-green-700">${logro.titulo}</h4>
        <p class="text-sm text-gray-600 mb-3">${logro.descripcion}</p>
        <div class="bg-gray-200 h-2 rounded-full">
          <div class="bg-green-600 h-2 rounded-full"
               style="width: ${logro.progreso}%;"></div>
        </div>
      </div>
    `
    )
    .join("");
}