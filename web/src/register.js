// src/register.js
import './style.css';

// Inicializar iconos Lucide
if (window.lucide) {
  lucide.createIcons();
}

// 👁️ Toggle mostrar / ocultar contraseña
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("togglePassword");

let showing = false;

togglePasswordBtn.addEventListener("click", () => {
  showing = !showing;

  passwordInput.type = showing ? "text" : "password";

  togglePasswordBtn.innerHTML = showing 
    ? '<i data-lucide="eye-off"></i>' 
    : '<i data-lucide="eye"></i>';

  if (window.lucide) lucide.createIcons();
});

// 📌 Contenedor de mensajes
const registerMsg = document.getElementById("registerMsg");

// 📝 Formulario
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const direccion = document.getElementById("direccion").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validación básica frontend
  if (direccion.length > 200) {
    registerMsg.textContent = "La dirección no puede superar los 200 caracteres.";
    registerMsg.className = "text-red-600 text-center mt-3";
    return;
  }

  registerMsg.textContent = "Procesando...";
  registerMsg.className = "text-blue-600 text-center mt-3";

  try {
    const response = await fetch("http://localhost:3000/usuarios/register", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        nombre, 
        email, 
        password, 
        direccion 
      })
    });

    const data = await response.json();

    if (!response.ok) {
      registerMsg.textContent = data.mensaje || "Error al registrarse";
      registerMsg.className = "text-red-600 text-center mt-3";
      return;
    }

    registerMsg.textContent = "Registro exitoso. Redirigiendo...";
    registerMsg.className = "text-green-600 text-center mt-3";

    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1200);

  } catch (error) {
    console.error(error);
    registerMsg.textContent = "Error de conexión con el servidor";
    registerMsg.className = "text-red-600 text-center mt-3";
  }
});