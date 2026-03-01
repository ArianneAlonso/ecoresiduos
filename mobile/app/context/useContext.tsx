import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../src/lib/queryClient";

// Definimos qué datos tendrá nuestro usuario
interface User {
  id: number;
  idUsuario?: number;
  email: string; // Cambiado de username a email para coincidir con tu backend
  nombre?: string;
  rol?: string;
  direccion?: string;
  puntosAcumulados?: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. EFECTO DE CARGA: Se ejecuta al abrir la app
  useEffect(() => {
    const checkSession = async () => {
      try {
        // El servidor lee la cookie y nos devuelve el ID del usuario dueño de esa cookie
        const response = await apiRequest("GET", "/usuarios/me");
        if (response.ok) {
          const data = await response.json();
          // Guardamos el objeto mínimo que tenga el ID (ej: { idUsuario: 2 })
          setUser(data.user || data);
          setIsLoggedIn(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // 2. FUNCIÓN DE LOGIN
  const login = async (initialData: any) => {
    try {
      // 1. Inmediatamente después del login, pedimos el perfil básico (vía cookie)
      const res = await apiRequest("GET", "/usuarios/me");
      const data = await res.json();

      // 2. Extraemos el usuario que contiene el ID
      const userWithId = data.user || data;

      setUser(userWithId);
      setIsLoggedIn(true);
      await AsyncStorage.setItem("@user_data", JSON.stringify(userWithId));

      console.log(
        "🆔 ID rescatado de la cookie:",
        userWithId.idUsuario || userWithId.id,
      );
    } catch (e) {
      console.error("Error al rescatar ID tras login", e);
      // Fallback por si falla el /me
      setIsLoggedIn(true);
    }
  };

  // 3. FUNCIÓN DE LOGOUT
  const logout = async () => {
    try {
      // Avisamos al servidor para que borre la cookie del lado del cliente
      await apiRequest("POST", "/usuarios/logout");
    } catch (e) {
      console.log("Error avisando al servidor del logout");
    } finally {
      // Limpiamos todo localmente
      setUser(null);
      setIsLoggedIn(false);
      await AsyncStorage.removeItem("@user_data");
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log(context);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
