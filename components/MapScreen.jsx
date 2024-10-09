import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

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
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
            description="Your current location"
          />
        )}
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
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    width: 300,
    height: 400,
  },
});

export default MapScreen;
