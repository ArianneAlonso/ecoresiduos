import './style.css';

document.addEventListener("DOMContentLoaded", () => {

  const API_URL = "http://localhost:3000";

  const welcome = document.getElementById("welcomeAdmin");
  const userTable = document.getElementById("userTable");
  const logoutBtn = document.getElementById("logoutBtn");
  const mensajeError = document.getElementById("mensajeError");
  const crearUsuarioForm = document.getElementById("crearUsuarioForm");

  /* ================= VALIDAR SESIÓN ================= */
  async function validarSesion() {
    try {
      const res = await fetch(`${API_URL}/usuarios/session`, {
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
      const res = await fetch(`${API_URL}/usuarios`, {
        credentials: "include"
      });

      if (!res.ok) throw new Error("No se pudieron cargar usuarios");

      const users = await res.json();

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

  /* ================= CREAR USUARIO ================= */
  crearUsuarioForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    mensajeError.classList.add("hidden");

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const rol = document.getElementById("rol").value;
    const direccion = document.getElementById("direccion").value.trim();

    try {
      const res = await fetch(`${API_URL}/usuarios/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol,
          direccion
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || "Error al crear usuario");
      }

      alert("Usuario creado correctamente");

      crearUsuarioForm.reset();
      cargarUsuarios();

    } catch (error) {
      mensajeError.classList.remove("hidden");
      mensajeError.textContent = error.message;
    }
  });

  /* ================= LOGOUT ================= */
  logoutBtn.addEventListener("click", async () => {
    try {
      await fetch(`${API_URL}/usuarios/logout`, {
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