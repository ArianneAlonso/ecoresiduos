import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, View } from "react-native";

// Contexto y Providers
import { AuthProvider, useAuth } from "./app/context/useContext";
import { ToastProvider } from "./app/src/components/ui/toast";
import { Toaster } from "./app/src/components/ui/toaster";

// Pantallas
import Events from "./app/src/pages/Events";
import Home from "./app/src/pages/Home";
import Login from "./app/src/pages/Login";
import Map from "./app/src/pages/Map";
import PickupRequest from "./app/src/pages/PickupRequest";
import Points from "./app/src/pages/Points";
import Profile from "./app/src/pages/Profile";
import Register from "./app/src/pages/Register";
import Tips from "./app/src/pages/Tips";
import WelcomeScreen from "./app/src/pages/Welcome";

// Definición de tipos para la navegación
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Events: undefined;
  Tips: undefined;
  NotFound: undefined;
  Profile: { id: number };
};

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Solicitar Retiro" component={PickupRequest} />
      <Tab.Screen name="Mapa" component={Map} />
      <Tab.Screen name="Puntos" component={Points} />
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  );
}

function AppRouter() {
  const { isLoggedIn, isLoading } = useAuth();

  // Pantalla de carga mientras se verifica la sesión
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e9e1cf",
        }}
      >
        <ActivityIndicator size="large" color="#1f5c2e" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        // Rutas Protegidas
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="Tips" component={Tips} />
          <Stack.Screen name="Profile" component={Profile} />
        </>
      ) : (
        // Rutas Públicas
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <NavigationContainer>
            <AppRouter />
          </NavigationContainer>
          <Toaster />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
