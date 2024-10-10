import React, { useState, useEffect, useRef } from "react";
import { View, Button, StyleSheet, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

const notifytracker = () => {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const notificationInterval = useRef(null);

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Set up notification response listener
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const actionId = response.actionIdentifier;
        if (actionId === "accept" || actionId === "decline") {
          stopEmergencyNotification();
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
      if (notificationInterval.current) {
        clearInterval(notificationInterval.current);
      }
    };
  }, []);

  const startEmergencyNotification = async () => {
    setNotificationStatus(true);

    // Set up notification categories (for iOS)
    await Notifications.setNotificationCategoryAsync("emergency", [
      {
        identifier: "accept",
        buttonTitle: "Accept",
        options: {
          isDestructive: false,
        },
      },
      {
        identifier: "decline",
        buttonTitle: "Decline",
        options: {
          isDestructive: true,
        },
      },
    ]);

    // Create Android notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("emergency", {
        name: "Emergency Alerts",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF0000",
        sound: "default",
      });
    }

    // Schedule initial notification
    await scheduleNotification();

    // Set up repeating notifications
    notificationInterval.current = setInterval(scheduleNotification, 5000);
  };

  const stopEmergencyNotification = async () => {
    setNotificationStatus(false);
    if (notificationInterval.current) {
      clearInterval(notificationInterval.current);
      notificationInterval.current = null;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.dismissAllNotificationsAsync();
  };

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Emergency Alert!",
        body: "Someone needs immediate assistance!",
        sound: "../assets/sounds/emergency.mp3",
        priority: "max",
        categoryIdentifier: "emergency",
        vibrate: [0, 250, 250, 250],
      },
      trigger: null, // null means send immediately
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title={notificationStatus ? "Cancel Emergency" : "Trigger Emergency"}
        onPress={
          notificationStatus
            ? stopEmergencyNotification
            : startEmergencyNotification
        }
      />
    </View>
  );
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default notifytracker;
