import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react"; // Added useState and useEffect
import { Text, View } from "react-native";

const EmergencyPage = () => {
  const { eId } = useLocalSearchParams();
  const [alertEnabled, setAlertEnabled] = useState(true); // New state variable

  console.log("EID", eId);

  useEffect(() => {
    setAlertEnabled(false); // Disable alert when on EmergencyPage
    // Optionally, you can reset it when leaving the page
    return () => setAlertEnabled(true); // Reset when leaving
  }, []);

  return (
    <View style={{ height: "100%" }}>
      <Link
        href="/home"
        style={{
          fontSize: 20,
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBottom: 10,
          color: "white",
          backgroundColor: "#007BFF",
          padding: 10,
          borderRadius: 5,
          textAlign: "center",
        }}
      >
        Go Home
      </Link>
      <Text style={{ fontSize: 26, textAlign: "center" }}>
        Emergency Page Id - {eId}
      </Text>
      <View
        style={{
          displayw: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "50%",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>Map View</Text>
        </View>
        <View
          style={{
            width: "100%",
            height: "50%",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>Chat View</Text>
        </View>
      </View>
    </View>
  );
};

export default EmergencyPage;
