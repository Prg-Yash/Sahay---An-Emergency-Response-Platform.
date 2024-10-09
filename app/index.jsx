import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, signInWithEmailAndPassword, isEmailVerified, signOut, sendEmailVerification, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from "./firebase";

const Stack = createNativeStackNavigator();

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e0f7fa',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#00796b',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00796b',
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 16,
    width: '100%',
    height: 50,
    backgroundColor: '#00796b',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    marginTop: 16,
    color: '#00796b',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginTop: 16,
  },
};

function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [isEmailVerified, setIsEmailVerified] = React.useState(true);

  const handleSubmit = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the email is verified
      if (!user.emailVerified) {
        setIsEmailVerified(false);
        Alert("Please verify your email before logging in.");
        return;
      }

      navigation.navigate('Home', { user }); // Pass user data to Home screen
    } catch (error) {
      console.log(error)
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert("Password reset email sent. Please check your email.");
    } catch (error) {
      Alert("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Forgot Password</Text>
      </TouchableOpacity>
      <Text style={styles.link}>Don't have an account? <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text></Text>
      
      {!isEmailVerified && <Text style={styles.errorText}>Please verify your email before logging in.</Text>}
    </ScrollView>
  );
}

function SignUpScreen({ navigation }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);

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
    <ScrollView contentContainerStyle={styles.container}>
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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}!</Text> 
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
      
    </View>
  );
}

function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;