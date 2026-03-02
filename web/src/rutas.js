// ================================
// ELEMENTOS
// ================================
const tbody = document.getElementById("tbodyEntregas");
const logoutBtn = document.getElementById("logoutBtn");

// ================================
// INICIO
// ================================
document.addEventListener("DOMContentLoaded", cargarEntregas);

// ================================
// CARGAR ENTREGAS (ADMIN)
// ================================
async function cargarEntregas() {
  tbody.innerHTML = "";

  try {
    const res = await fetch("http://localhost:3000/entregas", {
      credentials: "include"
    });

    const data = await res.json();

    if (!data.ok) {
      console.error("No autorizado o error en servidor");
      return;
    }

    data.entregas.forEach(entrega => {
      agregarFila(entrega);
    });

  } catch (error) {
    console.error("Error al cargar entregas:", error);
  }
}

// ================================
// BADGES DE ESTADO
// ================================
function obtenerBadgeEstado(estado) {

  switch (estado) {

    case "pendiente":
      return `
        <span class="px-2 py-1 text-xs font-semibold rounded bg-yellow-200 text-yellow-800">
          Pendiente
        </span>
      `;

    case "confirmado":
      return `
        <span class="px-2 py-1 text-xs font-semibold rounded bg-green-200 text-green-800">
          Confirmado
        </span>
      `;

    case "rechazado":
      return `
        <span class="px-2 py-1 text-xs font-semibold rounded bg-red-200 text-red-800">
          Rechazado
        </span>
      `;

    default:
      return estado;
  }
}

// ================================
// CREAR FILA
// ================================
function agregarFila(e) {

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td class="p-2 border-b">${e.idEntrega}</td>
    <td class="p-2 border-b">${e.usuario?.nombre ?? "N/A"}</td>
    <td class="p-2 border-b">${e.detalleMateriales}</td>
    <td class="p-2 border-b">${e.direccion}</td>
    <td class="p-2 border-b">
      ${obtenerBadgeEstado(e.estadoPuntos)}
    </td>
    <td class="p-2 border-b flex gap-2">
      ${
        e.estadoPuntos === "pendiente"
          ? `
            <button onclick="confirmar(${e.idEntrega})"
              class="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded">
              Confirmar
            </button>

            <button onclick="rechazar(${e.idEntrega})"
              class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
              Rechazar
            </button>
          `
          : `<span class="text-gray-400 text-sm">Sin acciones</span>`
      }
    </td>
  `;

  tbody.appendChild(tr);
}

// ================================
// CONFIRMAR ENTREGA
// ================================
window.confirmar = async function (id) {

  const pesoReal = prompt("Ingrese el peso real (kg):");
  const puntos = prompt("Ingrese los puntos a otorgar:");

  if (!pesoReal || !puntos) return;

  try {

    const res = await fetch(`http://localhost:3000/entregas/${id}/confirmar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        pesoReal: Number(pesoReal),
        puntosAOtorgar: Number(puntos)
      })
    });

    if (!res.ok) {
      alert("Error al confirmar entrega");
      return;
    }

    cargarEntregas();

  } catch (error) {
    console.error("Error al confirmar:", error);
  }
};

// ================================
// RECHAZAR ENTREGA
// ================================
window.rechazar = async function (id) {

  const confirmarRechazo = confirm("¿Seguro que desea rechazar esta entrega?");
  if (!confirmarRechazo) return;

  try {

    const res = await fetch(`http://localhost:3000/entregas/${id}/rechazar`, {
      method: "PATCH",
      credentials: "include"
    });

    if (!res.ok) {
      alert("Error al rechazar entrega");
      return;
    }

    cargarEntregas();

  } catch (error) {
    console.error("Error al rechazar:", error);
  }
};

// ================================
// LOGOUT
// ================================
logoutBtn.addEventListener("click", async () => {

  try {
    await fetch("http://localhost:3000/usuarios/logout", {
      credentials: "include"
    });

    window.location.href = "/index.html";

  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }

});