import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { getDistance } from "geolib";

const volunteersMarker = [
  {
    latitude: 19.3022689,
    longitude: 72.8752289,
  },
  {
    latitude: 19.3002689,
    longitude: 72.8725289,
  },
  {
    latitude: 19.2943789,
    longitude: 72.8758389,
  },
];

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default coordinates
    longitude: -122.4324,
    latitudeDelta: 0.015, // Set appropriate zoom level
    longitudeDelta: 0.015,
  });

  useEffect(() => {
    (async () => {
      // Ask for location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // Get the current location
      let { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);

      // Update the map region to the user's current location
      setRegion({
        ...region,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        {location && (
          <Marker
            coordinate={{
              latitude: location?.latitude,
              longitude: location?.longitude,
            }}
            title="You are here"
            description="Your current location"
          />
        )}

        <Marker
          coordinate={{
            latitude: 19.3082689,
            longitude: 72.8658389,
          }}
          title="You are here"
          description="Your current location"
        />

        {location?.latitude &&
          location?.longitude &&
          volunteersMarker.map((marker, index) => {
            const volunteerDistance = getDistance(
              { latitude: location?.latitude, longitude: location?.longitude },
              marker
            ); // Calculate distance to each volunteer
            return (
              <Marker
                key={index}
                coordinate={marker}
                title={`Volunteer ${index + 1}`}
                description={`Volunteer location - Distance: ${volunteerDistance} meters`} // Updated description
                pinColor="blue" // Change this to your desired color
              />
            );
          })}
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
  distanceText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default MapScreen;
