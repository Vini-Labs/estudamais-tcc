import { Stack } from 'expo-router';
import { CronogramaProvider } from '../context/CronogramaContext';

export default function Layout() {
  return (
    <CronogramaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="gerenciarAgenda" />
      </Stack>
    </CronogramaProvider>
  );
}
