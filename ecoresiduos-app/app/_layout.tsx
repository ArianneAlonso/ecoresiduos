import { Stack } from 'expo-router';
import { ToastProvider } from './src/components/ui/toast';

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ToastProvider>
  );
}
