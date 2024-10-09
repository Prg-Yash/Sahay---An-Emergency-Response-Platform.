//import { StreamVideoClient } from "@stream-io/video-react-native-sdk";
import { StreamVideoClient } from "@stream-io/video-react-native-sdk";
import { Stack } from "expo-router";
import { Tabs } from "expo-router/tabs"; // Import Tabs from expo-router

export default function RootLayout() {
  const apiKey = "besk2xhggurv";

  const user = {
    id: "1234",
    name: "Yashnimse",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPQHstFutlfl8tgZAtY8nDWucSWEvFM5AETQ&s",
    email: "yashnimse@gmail.com",
  };
  const tokenProvider = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/generateUserToken`,
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            userId: user.id,
            userName: user.name,
            userImage: user.image,
            userEmail: user.email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate token");
      }
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error("Token provider error:", error);
      throw error; // Rethrow or handle as needed
    }
  };

  if (!apiKey || !user) {
    throw new Error("Please set your apiKey .env file");
  }
  const client = StreamVideoClient.getOrCreateInstance({
    apiKey,
    user,
    tokenProvider,
    options: {
      logger: (loglevel, message, ...args) => {},
    },
  });
  return (
    <StreamVideo client={client}>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="create-room" options={{ title: "Create Room" }} />
      </Tabs>
    </StreamVideo>
  );
}
