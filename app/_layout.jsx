import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function Layout() {
  return (
    // <View>
    //   <Text>DEmo</Text>
    // </View>
    <Stack>
      <Stack.Screen name="home/index" options={{ title: "Home" }} />
      <Stack.Screen name="profile/index" options={{ title: "Profile" }} />
      {/* <Stack.Screen name="settings/index" options={{ title: 'Settings' }}/> */}
    </Stack>
  );
}
