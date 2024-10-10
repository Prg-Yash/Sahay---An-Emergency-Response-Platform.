import { Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text } from "react-native";
import { router } from "expo-router";
import { auth } from "../app/firebase"; // Adjust the import path as necessary
import { useEffect } from "react";

export default function LandingPage({}) {
  const styles = StyleSheet.create({
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 10,
      color: "#1f2937",
    },
    subtitle: {
      fontSize: 16,
      color: "#4b5563",
      marginBottom: 20,
    },
    button: {
      backgroundColor: "#f97316",
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
    },
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/home"); // Redirect to home if user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Sahay</Text>
        <Text style={styles.subtitle}>
          Your trusted companion for safety and support
        </Text>

        <Button title="Get Started" onPress={() => router.replace("/signup")} />
        <View style={{ marginVertical: 8 }} />
        <Button
          title="I already have an account"
          onPress={() => router.replace("/login")}
        />
      </View>
    </SafeAreaView>
  );
}
