import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from 'firebase/auth'; // Import Firebase auth methods
import { getDatabase, ref, set } from 'firebase/database'; // Import Firebase database methods
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon from FontAwesome

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the email is verified
      if (!user.emailVerified) {
        setIsEmailVerified(false);
        Alert.alert("Please verify your email before logging in.");
        return;
      }

      navigation.navigate('Home', { user }); // Pass user data to Home screen
    } catch (error) {
      console.log(error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Password reset email sent. Please check your email.");
    } catch (error) {
      Alert.alert("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Forgot Password</Text>
        </TouchableOpacity>
        <Text style={styles.link}>Don't have an account? <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text></Text>
        
        {!isEmailVerified && <Text style={styles.errorText}>Please verify your email before logging in.</Text>}
      </ScrollView>
      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const db = getDatabase();
      const userRef = ref(db, 'users/' + user.uid);
      await set(userRef, {
        userId: user.uid,
        name: name,
        email: email,
        mobileNumber: mobileNumber,
        address: address
      });
      setShowModal(true);
      await sendEmailVerification(user);
      Alert.alert("Verification Email Sent", "Please check your email to verify your account.");
      navigation.navigate('Login'); // Redirect to Login after sign up
    } catch (error) {
      console.log("Error signing up:", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          multiline={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.link}>Already have an account? <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Login</Text></Text>
      </ScrollView>
      <BottomNavBar navigation={navigation} />
    </SafeAreaView>
  );
}

function HomeScreen({ route, navigation }) {
  const { user } = route.params;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Redirect to Login after logout
    } catch (error) {
      console.log("Error logging out:", error.message);
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer independent='true'>
        <LoggedInNavigator user={user} handleLogout={handleLogout} />
        <BottomNavBar navigation={navigation} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// Bottom Navigation Bar Component
const BottomNavBar = ({ navigation }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.navItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Map')}>
        <Text style={styles.navItem}>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Alerts')}>
        <Text style={styles.navItem}>Alerts</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Community')}>
        <Text style={styles.navItem}>Community</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.navItem}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

// Authentication Navigator
function AuthNavigator({ handleLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="SignUp" component={SignUpPage} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// Logged In Navigator
function LoggedInNavigator({ user, handleLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Map') {
            iconName = 'map-pin';
          } else if (route.name === 'Alerts') {
            iconName = 'bell';
          } else if (route.name === 'Community') {
            iconName = 'users';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Map" component={MapPage} />
      <Tab.Screen name="Alerts" component={AlertsPage} />
      <Tab.Screen name="Community" component={CommunityPage} />
      <Tab.Screen name="Profile">
        {props => <ProfilePage {...props} user={user} handleLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Page Components
const LandingPage = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Welcome to Sahay</Text>
      <Text style={styles.subtitle}>Your trusted companion for safety and support</Text>
      <Button title="Get Started" onPress={() => navigation.navigate('SignUp')} />
      <Button
        title="I already have an account"
        variant="outline"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  </SafeAreaView>
);

// ... (rest of the code remains unchanged)

const styles = StyleSheet.create({
  // ... (existing styles)
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
});
