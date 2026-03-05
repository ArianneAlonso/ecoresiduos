// index.js
import './style.css';

document.addEventListener("DOMContentLoaded", () => {

  // Inicializar iconos
  if (window.lucide) {
    lucide.createIcons();
  }

  const user = JSON.parse(localStorage.getItem("sessionUser"));

  const navPerfil = document.getElementById("navPerfil");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const toggleDark = document.getElementById("toggleDark");

  // ===============================
  // CONTROL DE SESIÓN
  // ===============================
  if (user) {
    // Usuario logueado
    navPerfil?.classList.remove("hidden");
    logoutBtn?.classList.remove("hidden");

    loginBtn?.classList.add("hidden");
    registerBtn?.classList.add("hidden");
  } else {
    // Usuario NO logueado
    navPerfil?.classList.add("hidden");
    logoutBtn?.classList.add("hidden");

    loginBtn?.classList.remove("hidden");
    registerBtn?.classList.remove("hidden");
  }

  // ===============================
  // LOGOUT
  // ===============================
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("sessionUser");
    window.location.reload();
  });

  // ===============================
  // DARK MODE
  // ===============================
  toggleDark?.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
  });

});