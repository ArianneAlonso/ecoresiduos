import './style.css';

document.addEventListener("DOMContentLoaded", () => {

  const welcome = document.getElementById("welcomeAdmin");
  const userTable = document.getElementById("userTable");
  const logoutBtn = document.getElementById("logoutBtn");
  const mensajeError = document.getElementById("mensajeError");

  /* ================= VALIDAR SESIÓN ================= */
  async function validarSesion() {
    try {
      const res = await fetch("http://localhost:3000/usuarios/session", {
        credentials: "include"
      });

      const data = await res.json();

      if (!data.ok || data.user.role !== "administrador") {
        return window.location.href = "/login.html";
      }

      welcome.textContent = `¡Bienvenido, Administrador!`;
      cargarUsuarios();

    } catch (error) {
      console.error("Error verificando sesión:", error);
      window.location.href = "/login.html";
    }
  }

  /* ================= CARGAR USUARIOS ================= */
  async function cargarUsuarios() {
    try {
      const res = await fetch("http://localhost:3000/usuarios", {
        credentials: "include"
      });

      const users = await res.json();

      // Solo mostramos nombre, email y rol
      userTable.innerHTML = users.map(u => `
        <tr>
          <td class="border px-4 py-2">${u.nombre}</td>
          <td class="border px-4 py-2">${u.email}</td>
          <td class="border px-4 py-2 capitalize">${u.rol}</td>
        </tr>
      `).join("");

    } catch (err) {
      mensajeError.classList.remove("hidden");
      mensajeError.textContent = "Error al cargar usuarios.";
    }
  }

  /* ================= LOGOUT ================= */
  logoutBtn.addEventListener("click", async () => {
    try {
      await fetch("http://localhost:3000/usuarios/logout", {
        method: "POST",
        credentials: "include"
      });

      window.location.href = "/login.html";
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    }
  });

  validarSesion();

});