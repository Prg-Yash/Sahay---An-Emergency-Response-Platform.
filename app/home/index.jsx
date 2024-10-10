import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button, // Ensure Button is imported
  Alert, // Import Alert for confirmation
} from "react-native";
// import { NavigationContainer } from '@react-navigation/native';
import { signOut } from "firebase/auth"; // Import Firebase auth methods
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Link, router } from "expo-router"; // Import router for navigation
import { auth } from "../firebase"; // Import auth for logout functionality
import { Accelerometer } from "expo-sensors";

const Card = ({ children }) => <View style={styles.card}>{children}</View>;
const CardHeader = ({ children }) => (
  <View style={styles.cardHeader}>{children}</View>
);
const CardContent = ({ children }) => (
  <View style={styles.cardContent}>{children}</View>
);
const CardTitle = ({ children }) => (
  <Text style={styles.cardTitle}>{children}</Text>
);
const CardDescription = ({ children }) => (
  <Text style={styles.cardDescription}>{children}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 10, // Added padding for better spacing
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, // Increased shadow opacity for depth
    shadowRadius: 6, // Increased shadow radius
    elevation: 5, // Increased elevation for Android
  },
  cardHeader: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22, // Increased font size for better visibility
    fontWeight: "bold",
    color: "#1f2937",
  },
  cardDescription: {
    fontSize: 16, // Increased font size for better readability
    color: "#4b5563",
    marginTop: 5,
  },
  cardContent: {},
  grid: {
    flexDirection: "column",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f97316",
  },
  navItem: {
    color: "#fff",
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 20,
  },
});

export default function HomeScreen({ route }) {
  const [subscription, setSubscription] = useState(null);
  const [alertShown, setAlertShown] = useState(false); // Track if alert has been shown

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login"); // Redirect to Login after logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  useEffect(() => {
    // Subscribe to accelerometer updates
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        if (isShakeDetected(x, y, z) && !alertShown) {
          // Check if alert has not been shown
          setAlertShown(true); // Set alert as shown
          // Ask for confirmation
          Alert.alert("Emergency Confirmation", "Is this emergency valid?", [
            {
              text: "No",
              onPress: () => {
                console.log("Emergency dismissed");
                setAlertShown(false); // Reset alert shown state
              },
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => {
                const eId = createEmergencyId(); // Function to create a new emergency ID
                router.replace(`/emergencyscreen/${eId}`);
              },
            },
          ]);
        }
      })
    );

    // Set the update interval for accelerometer data (in ms)
    Accelerometer.setUpdateInterval(100); // Update every 100 ms
  };

  // Unsubscribe from accelerometer updates
  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  // Function to detect if a shake occurred
  const isShakeDetected = (x, y, z) => {
    const shakeThreshold = 1.5; // Adjust based on how sensitive you want it to be
    return (
      Math.abs(x) > shakeThreshold ||
      Math.abs(y) > shakeThreshold ||
      Math.abs(z) > shakeThreshold
    );
  };

  // Function to create a new emergency ID
  const createEmergencyId = () => {
    return Math.random().toString(36).substr(2, 9); // Example ID generation
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Sahay, {}!</CardTitle>
              <CardDescription>Your safety is our priority.</CardDescription>
            </CardHeader>
            <CardContent>
              <Text>
                Stay connected and protected with Sahay. Remember, help is just
                a tap away.
              </Text>
              <View style={{ marginVertical: 8 }} />
              <Button
                title="Go to Profile"
                onPress={() => router.replace("/profile")}
              />
            </CardContent>
          </Card>
          <Button title="Log Out" onPress={handleLogout} />
          <View style={styles.grid}></View>
          <Text style={{ marginTop: 20, textAlign: "center" }}>
            Shake the device to trigger an emergency action!
          </Text>
          <Link href="/notifytracker">Go to Notification</Link>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// Page Components
const LandingPage = ({}) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Welcome to Sahay</Text>
      <Text style={styles.subtitle}>
        Your trusted companion for safety and support
      </Text>
      <Button title="Get Started" onPress={() => router.replace("SignUp")} />
      <Button
        title="I already have an account"
        variant="outline"
        onPress={() => router.replace("Login")}
      />
    </View>
  </SafeAreaView>
);
