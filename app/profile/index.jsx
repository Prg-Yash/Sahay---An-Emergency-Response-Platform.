import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database"; // Import Firebase database methods
import { router } from "expo-router";
import { auth } from "../firebase";
import MapScreen from "../../components/MapScreen";

const Card = ({ children }) => <View style={styles.card}>{children}</View>;
const CardHeader = ({ children }) => (
  <View style={styles.cardHeader}>{children}</View>
);
const CardContent = ({ children }) => (
  <View style={styles.cardContent}>{children}</View>
);
const CardTitle = ({ children }) => (
  <Text style={styles.cardTitle}>{children}</Text>
);
const CardDescription = ({ children }) => (
  <Text style={styles.cardDescription}>{children}</Text>
);

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 10, // Added padding for better spacing
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, // Increased shadow opacity for depth
    shadowRadius: 6, // Increased shadow radius
    elevation: 5, // Increased elevation for Android
  },
  cardHeader: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  cardDescription: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 5,
  },
  cardContent: {},
  grid: {
    flexDirection: "column",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#f97316",
  },
  navItem: {
    color: "#fff",
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 20,
  },
});

export default function ProfilePage({ user, handleLogout }) {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (auth?.currentUser?.uid) {
    }
    const db = getDatabase();
    const userRef = ref(db, "users/" + auth?.currentUser?.uid); // Fetch user info from database

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserInfo(data);
      }
    });
  }, [auth?.currentUser?.uid]);

  function goToPreviousPage() {
    router.replace("/home");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <CardHeader>
            <CardTitle>Your Sahay Profile</CardTitle>
            <CardDescription>
              Manage your account and safety preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.profileHeader}>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userInfo?.name}</Text>
                <Text style={styles.profileEmail}>{userInfo?.email}</Text>
              </View>
            </View>
            <Separator />
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.options}>
              <Button
                title="Edit Profile"
                onPress={() => router.replace("/edit_profile")}
              />
              <View style={{ marginVertical: 2 }} />
              <Button
                title="Apply for Volenteer"
                onPress={() => router.replace("/volenteer")}
              />
              <View style={{ marginVertical: 2 }} />
              <Button
                title="Emergency Contacts"
                onPress={() => router.replace("/emergency_contacts")}
              />
            </View>

            <Separator />
            <View style={{ marginVertical: 2 }} />
            <Button
              title="Log Out"
              variant="destructive"
              onPress={handleLogout}
            />

            <View style={{ marginVertical: 8 }} />
            <Button title="Go to Home" onPress={goToPreviousPage} />
          </CardContent>
        </Card>
        <MapScreen
          isVolunteer={userInfo?.isvolunteer ? "volunteer" : "user"}
          role={userInfo?.isvolunteer ? "volunteer" : "user"}
          name={userInfo?.name}
          email={userInfo?.email}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
