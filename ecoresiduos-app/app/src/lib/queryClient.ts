import { QueryClient, QueryFunction, QueryKey } from "@tanstack/react-query";
import { Platform } from "react-native";

// 1. Definir la BASE_URL (Igual que antes, vital para móviles)
const BASE_URL = Platform.select({
  android: "http://10.0.2.2:3000", // IP del host en emulador Android
  ios: "http://192.168.1.3:3000", // Tu IP local para iOS/Físico
  default: "http://192.168.1.3:3000",
});

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown,
): Promise<Response> {
  // Construir URL completa
  const url = `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Importante para tus sesiones Express
  });

  if (res.status !== 401) {
    await throwIfResNotOk(res);
  }
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

// 2. Corregir el QueryFunction para móviles
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // En web queryKey.join("/") funciona, en móvil necesitamos la BASE_URL
    const endpoint = queryKey.join("/");
    const url = `${BASE_URL}/${endpoint}`;

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null as any;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
