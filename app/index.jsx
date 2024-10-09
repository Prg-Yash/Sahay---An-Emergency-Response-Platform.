import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet, SafeAreaView } from "react-native";
import * as Location from "expo-location";
import MapScreen from "../components/MapScreen";
import { Link } from "expo-router";

export default function Index() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
    // New effect for real-time location tracking

    const intervalId = setInterval(async () => {
      if (location) {
        let newLocation = await Location.getCurrentPositionAsync({});
        setLocation(newLocation);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [location]); // Dependency on location

  let text = "Waiting..";
  let lat = 0;
  let long = 0;
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location.coords);
    // console.log(location);
    lat = location.coords.latitude;
    long = location.coords.longitude;
    // text = JSON.stringify(location);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ padding: 20, fontSize: 20 }}>{text}</Text>
      <Button
        title="Get Current Location"
        onPress={async () => {
          let newLocation = await Location.getCurrentPositionAsync({});
          setLocation(newLocation);
        }}
      />
      <Text>Hello</Text>
      <Link href="/dashboard">Go to Dashboard</Link>

      <SafeAreaView style={styles.container}>
        <MapScreen />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
