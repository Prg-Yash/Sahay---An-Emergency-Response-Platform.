// app/index.jsx
import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

export default function IndexScreen() {
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = () => {
    // Logic to create a room
    console.log("Creating room...");
  };

  const handleJoinRoom = () => {
    // Logic to join a room using roomCode
    console.log("Joining room:", roomCode);
  };

  return (
    <View style={styles.container}>
      <Button title="Create Room" onPress={handleCreateRoom} />
      <Text style={styles.orText}>OR</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Room Code"
        value={roomCode}
        onChangeText={setRoomCode}
      />
      <Button title="Join Room" onPress={handleJoinRoom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  orText: {
    marginVertical: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "80%",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
