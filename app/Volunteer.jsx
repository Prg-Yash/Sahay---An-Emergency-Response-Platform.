import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import io from "socket.io-client";

const SERVER_URL = "http://localhost:3000";
const socket = io(SERVER_URL);

const VolunteerPage = ({ emergencyId }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Join the emergency room with the given ID
    socket.emit("joinEmergencyRoom", emergencyId);

    // Listen for location updates in the emergency room
    socket.on("locationUpdate", (location) => {
      console.log("Location update received:", location);
      setUserLocation(location);
    });

    // Cleanup socket listeners on component unmount
    return () => {
      socket.off("locationUpdate");
    };
  }, [emergencyId]);

  return (
    <View style={styles.container}>
      {userLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title={"User Location"}
            description={"Live location of the user in need"}
          />
        </MapView>
      ) : (
        <Text style={styles.text}>Waiting for location updates...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  text: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 18,
  },
});

export default VolunteerPage;
