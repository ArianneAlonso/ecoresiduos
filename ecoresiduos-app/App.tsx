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
import Map from './app/src/pages/Map';
import Points from './app/src/pages/Points';
import Events from './app/src/pages/Events';
import Profile from './app/src/pages/Profile';
import Tips from './app/src/pages/Tips';
import NotFound from './app/src/pages/not-found';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  Events: undefined;
  Tips: undefined;
  NotFound: undefined;
};

const queryClient = new QueryClient();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Pickup" component={PickupRequest} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Points" component={Points} />
      <Tab.Screen name="Profile" component={Profile} />
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
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="Tips" component={Tips} />
      <Stack.Screen name="NotFound" component={NotFound} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
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
  );
}
