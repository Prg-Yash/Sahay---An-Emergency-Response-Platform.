import React, { useState, useEffect } from "react";
import { Text, View, Alert, StyleSheet } from "react-native";
import { Accelerometer } from "expo-sensors";

const DashboardPage = () => {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Subscribe to accelerometer updates
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        const { x, y, z } = accelerometerData;
        if (isShakeDetected(x, y, z)) {
          Alert.alert(
            "Emergency Triggered",
            "Shake detected! Emergency action will be performed."
          );
          // Call your emergency action function here (e.g., send the location)
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Shake the device to trigger an emergency action!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default DashboardPage;
