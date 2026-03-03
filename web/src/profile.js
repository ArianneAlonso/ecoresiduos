document.addEventListener("DOMContentLoaded", () => {
  cargarPerfil();
  configurarLogout();
  configurarModoOscuro();
});

// ========================
// CARGAR PERFIL
// ========================
async function cargarPerfil() {
  try {
    const res = await fetch("http://localhost:3000/perfil", {
      credentials: "include"
    });

    if (res.status === 401) {
      window.location.href = "/index.html";
      return;
    }

    const data = await res.json();

    cargarInfoUsuario(data);
    cargarEntregas(data.historialEntregas || []);
    cargarEventos(data.participacionEventos || []);

  } catch (err) {
    console.error("Error al cargar perfil:", err);
  }
}

// ========================
// INFO USUARIO
// ========================
function cargarInfoUsuario(u) {
  const div = document.getElementById("profileInfo");

  div.innerHTML = `
    <p><strong>Nombre:</strong> ${u.nombre}</p>
    <p><strong>Email:</strong> ${u.email}</p>
    <p><strong>Rol:</strong> ${u.rol}</p>
    <p><strong>Puntos acumulados:</strong>
      <span class="text-green-600 font-bold">
        ${u.puntosAcumulados}
      </span>
    </p>
    <p><strong>Miembro desde:</strong>
      ${new Date(u.fechaRegistro).toLocaleDateString()}
    </p>
  `;
}

// ========================
// ENTREGAS
// ========================
function cargarEntregas(lista) {
  const tbody = document.getElementById("tablaEntregas");
  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-4 text-center text-gray-500">
          No hay entregas registradas.
        </td>
      </tr>
    `;
    return;
  }

  lista.forEach(e => {
    tbody.innerHTML += `
      <tr class="border-b border-gray-300 dark:border-gray-700">
        <td class="p-2">${e.material}</td>
        <td class="p-2">${e.pesoKg} kg</td>
        <td class="p-2 font-semibold text-green-500">${e.puntosGanados}</td>
        <td class="p-2">${e.estado}</td>
        <td class="p-2">${e.contenedor}</td>
        <td class="p-2">${new Date(e.fecha).toLocaleString()}</td>
      </tr>
    `;
  });
}

// ========================
// EVENTOS
// ========================
function cargarEventos(eventos) {
  const tbody = document.getElementById("tablaEventos");
  tbody.innerHTML = "";

  if (eventos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="p-4 text-center text-gray-500">
          No participaste en eventos aún.
        </td>
      </tr>
    `;
    return;
  }

  eventos.forEach(ev => {
    tbody.innerHTML += `
      <tr class="border-b border-gray-300 dark:border-gray-700">
        <td class="p-2">${ev.idTransaccion}</td>
        <td class="p-2 font-bold text-green-500">${ev.puntosGanados}</td>
        <td class="p-2">${new Date(ev.fecha).toLocaleString()}</td>
        <td class="p-2">${ev.idReferenciaEvento}</td>
      </tr>
    `;
  });
}

// ========================
// LOGOUT
// ========================
function configurarLogout() {
  const btnLogout = document.getElementById("btnLogout");

  if (!btnLogout) return;

  btnLogout.addEventListener("click", async () => {
    try {
      await fetch("http://localhost:3000/usuarios/logout", {
        credentials: "include"
      });

      window.location.href = "/index.html";
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  });
}

// ========================
// MODO OSCURO
// ========================
function configurarModoOscuro() {
  const toggleBtn = document.getElementById("toggleDark");
  const html = document.documentElement;

  // Aplicar modo guardado
  if (localStorage.getItem("darkMode") === "true") {
    html.classList.add("dark");
  }

  toggleBtn.addEventListener("click", () => {
    html.classList.toggle("dark");

    const isDark = html.classList.contains("dark");
    localStorage.setItem("darkMode", isDark);
  });
}