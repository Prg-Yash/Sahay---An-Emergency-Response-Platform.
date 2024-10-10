import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import io from "socket.io-client";

// Initialize Socket connection
const socket = io("http://192.168.78.177:4000"); // Replace with your backend URL

const MapScreen = ({ role, name, email }) => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default coordinates
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const [nearbyVolunteers, setNearbyVolunteers] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      try {
        // Added error handling for location fetching
        let { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);
        setRegion({
          ...region,
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        console.log("Current location:", coords);

        // Register user or volunteer
        socket.emit("register", {
          role: role, // "user" or "volunteer"
          location: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
          name,
          email,
        });

        // Listen for nearby volunteers
        socket.on("nearbyVolunteers", (volunteers) => {
          setNearbyVolunteers(volunteers);
          console.log("Nearby volunteers:", volunteers);
        });

        // Emit location updates periodically
        const locationInterval = setInterval(async () => {
          const { coords } = await Location.getCurrentPositionAsync({});
          setLocation(coords);
          socket.emit("updateLocation", {
            role: role,
            location: {
              latitude: coords.latitude,
              longitude: coords.longitude,
            },
            name,
            email,
          });
        }, 5000); // Update every 5 seconds

        // Clean up on component unmount
        return () => {
          clearInterval(locationInterval);
          socket.off("nearbyVolunteers"); // Clean up event listener
          socket.disconnect();
        };
      } catch (error) {
        // Catch any errors during location fetching
        console.error("Error fetching location:", error);
      }
    })();
  }, [
    region.latitude,
    region.longitude,
    region.latitudeDelta,
    region.longitudeDelta,
    role,
    socket,
    setLocation,
    setRegion,
  ]);

  return (
    <View style={styles.container}>
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

        {/* Render markers for nearby volunteers */}
        {nearbyVolunteers.map((volunteer, index) => (
          <Marker
            key={index}
            coordinate={volunteer.location}
            title={`Volunteer ${index + 1} - ${volunteer.name}`}
            description={`Email: ${volunteer.email} | Distance: ${getDistance(
              {
                latitude: location.latitude,
                longitude: location.longitude,
              },
              volunteer.location
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
