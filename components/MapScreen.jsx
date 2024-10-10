import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import io from "socket.io-client";

// Initialize Socket connection
const SOCKET_URL = "http://192.168.78.177:4000";
let socket; // Declare socket variable

const volunteersMarker = [
  { latitude: 19.3022689, longitude: 72.8752289 },
  { latitude: 19.3002689, longitude: 72.8725289 },
  { latitude: 19.2943789, longitude: 72.8758389 },
];

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default coordinates
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });
  const [connected, setConnected] = useState(false); // Update state variable name

  // Initialize socket connection
  socket = io.connect(SOCKET_URL, {
    transports: ["websocket"], // Ensure websocket transport is used
    reconnectionAttempts: 15,
    // forceWebsockets: true, // Uncomment if needed
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setRegion({
        ...region,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      console.log("Current location:", coords);

      // Emit user's location to the server once we get it
      // socket.emit("userLocation", {
      //   latitude: coords.latitude,
      //   longitude: coords.longitude,
      // });

      // // Listen for updated volunteer locations
      // socket.on("volunteerLocations", (updatedVolunteers) => {
      //   setVolunteers(updatedVolunteers);
      // });
    })();

    // Connect socket and listen for events
    const onConnectSocket = () => {
      if (socket) {
        socket.on("connect", () => {
          console.log("Socket connected"); // Log successful connection
          socket.emit("i-am-connected"); // Emit a message
          setConnected(true); // Update connection status
        });

        // Add error handling
        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error); // Log connection error
        });

        // Add disconnect handling
        socket.on("disconnect", (reason) => {
          console.log("Socket disconnected:", reason); // Log disconnection reason
        });
      }
    };

    onConnectSocket(); // Call the function to connect

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>{connected ? "Connected" : "Not Connected"}</Text>
      {/* Display connection status */}
      <MapView style={styles.map} region={region}>
        {location && (
          <>
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
              description="Your current location"
            />

            {/* Circle representing the 400-meter radius */}
            <Circle
              center={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              radius={400} // 400 meters
              strokeColor="rgba(0, 150, 255, 0.5)"
              fillColor="rgba(0, 150, 255, 0.2)"
            />
          </>
        )}

        {/* Render markers for volunteers within 400 meters */}
        {location?.latitude &&
          location?.longitude &&
          volunteersMarker
            .filter((volunteer) => {
              const distance = getDistance(
                { latitude: location.latitude, longitude: location.longitude },
                volunteer
              );
              return distance <= 400; // Only include volunteers within 400 meters
            })
            .map((volunteer, index) => (
              <Marker
                key={index}
                coordinate={volunteer}
                title={`Volunteer ${index + 1}`}
                description={`Distance: ${getDistance(
                  {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  },
                  volunteer
                )} meters`}
                pinColor="blue"
              />
            ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: 300,
    height: 400,
  },
});

export default MapScreen;
