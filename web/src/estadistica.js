import { logoutUser } from "./logout.js";

document.addEventListener("DOMContentLoaded", async () => {

  //-----------------------------------------------------
  // 🔹 LOGOUT
  //-----------------------------------------------------
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  }

  //-----------------------------------------------------
  // 🔹 CARGAR MÉTRICAS DESDE BACKEND
  //-----------------------------------------------------
  try {
    const response = await fetch("http://localhost:3000/dashboard", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener estadísticas");
    }

    const data = await response.json();

    renderMetricas(data.metricas);
    renderCharts(data.charts);

  } catch (error) {
    console.error("Error cargando estadísticas:", error);
  }

  //-----------------------------------------------------
  // 🔹 MODO OSCURO
  //-----------------------------------------------------
  const toggleDark = document.getElementById("toggleDark");

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }

  toggleDark?.addEventListener("click", () => {
    const newTheme = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";

    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    lucide.createIcons();
  });

});


//-----------------------------------------------------
// 🔹 FUNCIÓN RENDER MÉTRICAS
//-----------------------------------------------------
function renderMetricas(metricas) {

  const container = document.getElementById("metric-container");
  if (!container) return;

  container.innerHTML = "";

  const metrics = [
    {
      title: "Usuarios Totales",
      value: metricas?.usuariosTotal ?? 0,
      icon: "users",
      trend: null,
    },
    {
      title: "Usuarios Activos (Mes)",
      value: metricas?.usuariosActivosMes ?? 0,
      icon: "user-check",
      trend: metricas?.participacionUsuarios
        ? metricas.participacionUsuarios + "%"
        : null,
    },
    {
      title: "Contenedores",
      value: metricas?.totalContenedores ?? 0,
      icon: "map-pin",
      trend: null,
    },
    {
      title: "Kg Reciclados Total",
      value: metricas?.kgRecicladosTotal ?? 0,
      icon: "leaf",
      trend: null,
    },
    {
      title: "Kg Este Mes",
      value: metricas?.kgRecicladosEsteMes ?? 0,
      icon: "calendar",
      trend: metricas?.tendenciaKgMes
        ? metricas.tendenciaKgMes + "%"
        : null,
    },
  ];

  metrics.forEach((m) => {
    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition";

    card.innerHTML = `
      <i data-lucide="${m.icon}" class="w-8 h-8 text-green-600 mb-3"></i>
      <h3 class="text-lg font-semibold dark:text-white">${m.title}</h3>
      <p class="text-2xl font-bold text-gray-800 dark:text-gray-200">${m.value}</p>
      ${
        m.trend
          ? `<p class="text-sm text-green-600 font-medium mt-1">${m.trend}</p>`
          : ""
      }
    `;

    container.appendChild(card);
  });

  lucide.createIcons();
}


//-----------------------------------------------------
// 🔹 FUNCIÓN RENDER CHARTS
//-----------------------------------------------------
function renderCharts(charts) {

  //-----------------------------------------------------
  // 📊 Kg Reciclados
  //-----------------------------------------------------
  const ctxRecycling = document.getElementById("recyclingChart");

  if (ctxRecycling) {
    new Chart(ctxRecycling, {
      type: "bar",
      data: {
        labels: charts?.kgPorMes?.labels || ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
        datasets: [{
          label: "Kg Reciclados",
          data: charts?.kgPorMes?.data || [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: "rgba(34, 197, 94, 0.6)",
          borderColor: "rgba(22, 163, 74, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  //-----------------------------------------------------
  // 📈 Participación
  //-----------------------------------------------------
  const ctxParticipacion = document.getElementById("participacionChart");

  if (ctxParticipacion) {
    new Chart(ctxParticipacion, {
      type: "line",
      data: {
        labels: charts?.participacionMensual?.labels || ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
        datasets: [{
          label: "Participación (%)",
          data: charts?.participacionMensual?.data || [0, 0, 0, 0, 0, 0, 0],
          borderColor: "rgba(34, 197, 94, 1)",
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  //-----------------------------------------------------
  // ♻️ Materiales
  //-----------------------------------------------------
  const ctxMateriales = document.getElementById("materialesChart");

  if (ctxMateriales) {
    new Chart(ctxMateriales, {
      type: "doughnut",
      data: {
        labels: charts?.materiales?.labels || ["Plástico", "Vidrio", "Papel", "Metal", "Orgánico"],
        datasets: [{
          data: charts?.materiales?.data || [0, 0, 0, 0, 0],
          backgroundColor: [
            "rgba(34, 197, 94, 0.8)",
            "rgba(74, 222, 128, 0.8)",
            "rgba(134, 239, 172, 0.8)",
            "rgba(163, 230, 53, 0.8)",
            "rgba(34, 197, 94, 0.4)",
          ],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }
}