import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="home/index" options={{ title: 'Home' }}/>
      <Stack.Screen name="profile/index" options={{ title: 'Profile' }}/>
      <Stack.Screen name="settings/index" options={{ title: 'Settings' }}/>
     
    </Stack>
  );
}
