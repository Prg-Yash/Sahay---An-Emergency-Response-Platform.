import { Text, View } from "react-native";
import ChatComponent from "../components/ChatComponent";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <ChatComponent  />
    </View>
  );
}
