import { Platform } from "react-native";

// Tu IP fija para el desarrollo
const BASE_URL = Platform.select({
  // Dispositivos físicos o iOS usan la IP de tu red local
  default: "http://192.168.1.3:3000",
});

export async function apiRequest(method: string, endpoint: string, body?: any) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`Solicitando: [${method}] ${url}`);

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const errorData = await res.json(); // Intentamos leer el JSON de error
      console.log(
        res,
        "Error del Servidor Detallado:",
        JSON.stringify(errorData, null, 2),
      );
      return res;
    }

    return res;
  } catch (error) {
    console.error("🚨 Error de conexión:", error);
    throw error;
  }
}
