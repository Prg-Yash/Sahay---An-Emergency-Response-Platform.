import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button,
} from 'react-native';

import { router } from 'expo-router';
const Card = ({ children }) => <View style={styles.card}>{children}</View>;
const CardHeader = ({ children }) => <View style={styles.cardHeader}>{children}</View>;
const CardContent = ({ children }) => <View style={styles.cardContent}>{children}</View>;
const CardTitle = ({ children }) => <Text style={styles.cardTitle}>{children}</Text>;
const CardDescription = ({ children }) => <Text style={styles.cardDescription}>{children}</Text>;

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Light background color for the entire screen
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 5,
  },
  cardContent: {},
  grid: {
    flexDirection: 'column',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f97316',
  },
  navItem: {
    color: '#fff',
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
  },
});

export default function ProfilePage({ user, handleLogout }) {
    function goToPreviousPage() {
        router.replace('/home'); // Redirect to home page
      };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Card>
            <CardHeader>
              <CardTitle>Your Sahay Profile</CardTitle>
              <CardDescription>Manage your account and safety preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <View style={styles.profileHeader}>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{user?.name}</Text>
                  <Text style={styles.profileEmail}>{user?.email}</Text>
                </View>
              </View>
              <Separator />
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <Button title="Edit Profile" onPress={() => router.replace('/edit_profile')} />
              <Button title="Apply for Volenteer" onPress={() => router.replace('/volenteer')} />
              <Button title="Emergency Contacts" onPress={() => router.replace('/emergencycontacts')} />
              <Separator />
             
              <Button title="Log Out" variant="destructive" onPress={handleLogout} />
              <Button title="Go to Home" onPress={goToPreviousPage} />
            </CardContent>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
};