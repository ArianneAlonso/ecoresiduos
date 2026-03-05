import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from './app/src/components/ui/toaster';
import { TooltipProvider } from './app/src/components/ui/tooltip';
import { ToastProvider } from './app/src/components/ui/toast';

import WelcomeScreen from './app/src/pages/Welcome';
import Login from './app/src/pages/Login';
import Register from './app/src/pages/Register';
import Home from './app/src/pages/Home';
import PickupRequest from './app/src/pages/PickupRequest';
import { CollectionsProvider } from './app/src/context/CollectionsContext';
import Map from './app/src/pages/Map';
import Points from './app/src/pages/Points';
import Events from './app/src/pages/Events';
import Profile from './app/src/pages/Profile';
import Tips from './app/src/pages/Tips';
import NotFound from './app/src/pages/not-found';

import HomeConductor from './app/src/conductor/homeconductor';
import MapaRecorrido from './app/src/conductor/maparecorrido';
import QR from './app/src/conductor/qr';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ConductorTabs: undefined;
  Events: undefined;
  Tips: undefined;
  NotFound: undefined;
};

const queryClient = new QueryClient();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: '#6c757d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarIcon: () => null,
        tabBarLabelStyle: {
          fontSize: 12,        // tamaño de letra más grande
          fontWeight: 'bold',  // negrita
          textTransform: 'capitalize', // opcional, para capitalizar el texto
        },
      }}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Recoleccion" component={PickupRequest} />
      <Tab.Screen name="Eventos" component={Map} />
      <Tab.Screen name="Puntos" component={Points} />
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  );
}
function ConductorTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#28a745',
        tabBarInactiveTintColor: '#6c757d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarIcon: () => null,
        tabBarLabelStyle: {
          fontSize: 16,       
          fontWeight: 'bold',  
          textTransform: 'capitalize', 
        },
      }}
    >
      <Tab.Screen name="Inicio" component={HomeConductor} />
      <Tab.Screen name="Mapa" component={MapaRecorrido} />
      <Tab.Screen name="QR" component={QR} />
      </Tab.Navigator>
  
  );
}

function AppRouter() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ConductorTabs" component={ConductorTabs} />
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="Tips" component={Tips} />
      <Stack.Screen name="NotFound" component={NotFound} />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <CollectionsProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <TooltipProvider>
            <NavigationContainer>
              <AppRouter />
            </NavigationContainer>
            <Toaster />
          </TooltipProvider>
        </ToastProvider>
      </QueryClientProvider>
    </CollectionsProvider>
  );
}