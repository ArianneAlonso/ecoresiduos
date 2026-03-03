import "./style.css";
import { createIcons, icons } from "lucide";

document.addEventListener("DOMContentLoaded", async () => {

  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const toggleBtn = document.getElementById("toggleDark");

  // ==================================================
  // 🔐 VERIFICAR SESIÓN
  // ==================================================
  let usuarioAutenticado = false;

  try {
    const res = await fetch("http://localhost:3000/usuarios/session", {
      credentials: "include",
    });

    const data = await res.json();

    if (data.ok) {
      usuarioAutenticado = true;
    }

  } catch (err) {
    console.error("Error verificando sesión:", err);
  }

  // ==================================================
  // 🔥 CAMBIAR BOTONES SEGÚN ESTADO
  // ==================================================
  if (usuarioAutenticado) {

    // Cambiar texto y estilo
    loginBtn.textContent = "Cerrar sesión";
    loginBtn.classList.remove("bg-green-600", "hover:bg-green-700");
    loginBtn.classList.add("bg-red-500", "hover:bg-red-600");

    // Ocultar registrarse
    if (registerBtn) {
      registerBtn.style.display = "none";
    }

    // Evento logout
    loginBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        await fetch("http://localhost:3000/usuarios/logout", {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Error cerrando sesión:", err);
      }

      // 🔁 Redirigir al login
      window.location.href = "/usuarios/login.html";
    });
  }

  // ==================================================
  // 🌙 MODO OSCURO
  // ==================================================
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) applyTheme(savedTheme);

  function setToggleIcon(isDark) {
    const iconEl = toggleBtn.querySelector("[data-lucide]");
    iconEl.setAttribute("data-lucide", isDark ? "sun" : "moon");
    createIcons({ icons });
  }

  setToggleIcon(document.documentElement.classList.contains("dark"));

  toggleBtn.addEventListener("click", () => {
    const isDarkNow = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDarkNow ? "dark" : "light");
    setToggleIcon(isDarkNow);
  });

  // ==================================================
  // 🗂 TARJETAS DE CATEGORÍAS
  // ==================================================
  const categories = [
    {
      name: "Orgánicos",
      description: "Restos de comida, cáscaras, yerba mate, residuos biodegradables.",
      icon: "apple"
    },
    {
      name: "Plásticos",
      description: "Botellas, envases, tapitas, envoltorios limpios.",
      icon: "recycle"
    },
    {
      name: "Vidrio",
      description: "Botellas de vidrio, frascos, envases sin tapa.",
      icon: "wine"
    },
    {
      name: "Papel y Cartón",
      description: "Hojas, cajas limpias, cuadernos, diarios.",
      icon: "file-text"
    },
    {
      name: "Metales",
      description: "Latas, aluminio, envases metálicos.",
      icon: "package"
    },
    {
      name: "Residuos peligrosos",
      description: "Pilas, electrónicos, aceites, medicamentos.",
      icon: "alert-triangle"
    }
  ];

  const container = document.getElementById("categoriesContainer");

  if (container) {
    container.innerHTML = "";

    categories.forEach(cat => {
      const card = document.createElement("div");
      card.className =
        "p-6 bg-white dark:bg-gray-800 shadow rounded-2xl hover:shadow-xl transition border border-gray-200 dark:border-gray-700";

      card.innerHTML = `
        <i data-lucide="${cat.icon}" class="w-10 h-10 mb-4 text-green-600 dark:text-green-400"></i>
        <h3 class="text-xl font-bold mb-2">${cat.name}</h3>
        <p class="text-gray-600 dark:text-gray-300">${cat.description}</p>
      `;

      container.appendChild(card);
    });
  }

  createIcons({ icons });

});
