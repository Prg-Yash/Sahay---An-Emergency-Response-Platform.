import React, { useState } from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import ChatComponent from "../components/ChatComponent";

export default function RootLayout() {
  
  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" />
        <ChatComponent />
      </Stack>
    </View>
  );
}
