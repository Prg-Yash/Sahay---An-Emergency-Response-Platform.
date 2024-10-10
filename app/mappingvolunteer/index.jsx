import React, { useState, useEffect } from "react";
import { Text, View, Alert, StyleSheet } from "react-native";
import { Accelerometer } from "expo-sensors";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

const DashboardPage = () => {
  const [subscription, setSubscription] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const isOnEmergencyPage = route.name === "EmergencyPage";

  useFocusEffect(
    React.useCallback(() => {
      if (!isOnEmergencyPage) {
        _subscribe();
      }
      return () => _unsubscribe();
    }, [isOnEmergencyPage])
  );

  const _subscribe = () => {
    _unsubscribe();
    const newSubscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      if (isShakeDetected(x, y, z) && !isOnEmergencyPage) {
        Alert.alert(
          "Emergency Triggered",
          "Shake detected! Navigating to Emergency Page."
        );
        navigation.navigate("EmergencyPage");
      }
    });

    setSubscription(newSubscription);
    Accelerometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    if (subscription) {
      subscription.remove();
    }
    setSubscription(null);
  };

  const isShakeDetected = (x, y, z) => {
    const shakeThreshold = 1.5;
    return (
      Math.abs(x) > shakeThreshold ||
      Math.abs(y) > shakeThreshold ||
      Math.abs(z) > shakeThreshold
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {isOnEmergencyPage
          ? "You are on the Emergency Page. Shake detection is disabled."
          : "Shake the device to trigger an emergency action!"}
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
