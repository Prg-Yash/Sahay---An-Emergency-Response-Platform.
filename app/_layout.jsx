import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function RootLayout() {
  return (
    // <View>
    //   <Text>DEmo</Text>
    // </View>
    <Stack>
      <Stack.Screen name="index" />
    </Stack>
  );
}
