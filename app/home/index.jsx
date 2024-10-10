import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button, // Ensure Button is imported
} from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
import { signOut } from 'firebase/auth'; // Import Firebase auth methods
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { router } from 'expo-router'; // Import router for navigation
import { auth } from '../firebase'; // Import auth for logout functionality

const Card = ({ children }) => <View style={styles.card}>{children}</View>;
const CardHeader = ({ children }) => <View style={styles.cardHeader}>{children}</View>;
const CardContent = ({ children }) => <View style={styles.cardContent}>{children}</View>;
const CardTitle = ({ children }) => <Text style={styles.cardTitle}>{children}</Text>;
const CardDescription = ({ children }) => <Text style={styles.cardDescription}>{children}</Text>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 10, // Added padding for better spacing
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
    shadowOpacity: 0.2, // Increased shadow opacity for depth
    shadowRadius: 6, // Increased shadow radius
    elevation: 5, // Increased elevation for Android
  },
  cardHeader: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 22, // Increased font size for better visibility
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardDescription: {
    fontSize: 16, // Increased font size for better readability
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

export default function HomeScreen({ route }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login'); // Redirect to Login after logout
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Sahay, {}!</CardTitle>
              <CardDescription>Your safety is our priority.</CardDescription>
            </CardHeader>
            <CardContent>
              <Text>Stay connected and protected with Sahay. Remember, help is just a tap away.</Text>
              <View style={{ marginVertical: 8 }} /> 
              <Button title="Go to Profile" onPress={() => router.replace('/profile')} />
            </CardContent>
          </Card>
          <Button title="Log Out" onPress={handleLogout} />
          <View style={styles.grid}>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}


// Page Components
const LandingPage = ({  }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Welcome to Sahay</Text>
      <Text style={styles.subtitle}>Your trusted companion for safety and support</Text>
      <Button title="Get Started" onPress={() => router.replace('SignUp')} />
      <Button
        title="I already have an account"
        variant="outline"
        onPress={() => router.replace('Login')}
      />
    </View>
  </SafeAreaView>
);
