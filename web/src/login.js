// login.js

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const togglePassword = document.getElementById("togglePassword");

  if (!form) return;

  // ==================================
  // 👁 MOSTRAR / OCULTAR CONTRASEÑA
  // ==================================
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const passwordInput = document.getElementById("password");
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";

      togglePassword.innerHTML = `
        <i data-lucide="${isPassword ? "eye-off" : "eye"}"></i>
      `;
      lucide.createIcons();
    });
  }

  // ==================================
  // 🚀 ENVÍO DEL FORMULARIO
  // ==================================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      mostrarError("Completa todos los campos.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("RESPUESTA LOGIN:", data);

      if (!res.ok || !data.ok) {
        mostrarError(data.mensaje || "Credenciales incorrectas.");
        return;
      }

      // ===============================
      // 💾 GUARDAR SESIÓN
      // ===============================
      const sessionData = {
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        role: data.role || data.rol
      };

      localStorage.setItem("sessionUser", JSON.stringify(sessionData));

      // ===============================
      // 🔄 REDIRECCIÓN POR ROL
      // ===============================
      switch (sessionData.role) {
        case "administrador":
          window.location.href = "/admin.html";
          break;

        case "operador":
          window.location.href = "/repartidor/main.html";
          break;

        case "usuario":
          window.location.href = "/";
          break;

        default:
          mostrarError("Rol no reconocido.");
      }

    } catch (error) {
      console.error("Error en login:", error);
      mostrarError("Error de conexión con el servidor.");
    }
  });

});


// ===============================
// ❌ MOSTRAR ERRORES
// ===============================
function mostrarError(msg) {
  const box = document.getElementById("loginError");

  if (!box) return;

  box.textContent = msg;
  box.classList.remove("hidden");

  setTimeout(() => {
    box.classList.add("hidden");
  }, 5000);
}