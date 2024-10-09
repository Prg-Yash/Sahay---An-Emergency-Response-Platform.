import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";
import io from "socket.io-client";

// Initialize Socket connection
const socket = io("http://localhost:3000"); // Ensure the URL is correct // Replace with your backend URL

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default coordinates
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const [volunteers, setVolunteers] = useState([]);

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

      // Emit user's location to the server once we get it
      socket.emit("userLocation", {
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      // Listen for updated volunteer locations
      socket.on("volunteerLocations", (updatedVolunteers) => {
        setVolunteers(updatedVolunteers);
      });
    })();

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

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

        {/* Render markers for volunteers within 400 meters */}
        {location?.latitude &&
          location?.longitude &&
          volunteers
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
