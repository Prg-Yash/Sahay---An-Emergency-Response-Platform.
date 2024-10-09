import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Button, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, signInWithEmailAndPassword, isEmailVerified, signOut, sendEmailVerification, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from "./firebase";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { useState } from 'react';
import { router } from 'expo-router';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Card = ({ children }) => <View style={styles.card}>{children}</View>;
const CardHeader = ({ children }) => <View style={styles.cardHeader}>{children}</View>;
const CardContent = ({ children }) => <View style={styles.cardContent}>{children}</View>;
const CardTitle = ({ children }) => <Text style={styles.cardTitle}>{children}</Text>;
const CardDescription = ({ children }) => <Text style={styles.cardDescription}>{children}</Text>;

const Input = ({ placeholder, value, onChangeText, secureTextEntry }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
  />
);

const Avatar = ({ source, name }) => (
  <View style={styles.avatar}>
    {source ? (
      <Image source={source} style={styles.avatarImage} />
    ) : (
      <Text style={styles.avatarFallback}>{name ? name.charAt(0).toUpperCase() : 'U'}</Text>
    )}
  </View>
);

const Badge = ({ children, variant }) => (
  <View style={[styles.badge, variant === 'success' && styles.badgeSuccess]}>
    <Text style={styles.badgeText}>{children}</Text>
  </View>
);

const Separator = () => <View style={styles.separator} />;

const Switch = ({ value, onValueChange }) => (
  <TouchableOpacity
    style={[styles.switch, value && styles.switchOn]}
    onPress={() => onValueChange(!value)}
  >
    <View style={[styles.switchThumb, value && styles.switchThumbOn]} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f97316',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f97316',
  },
  buttonDestructive: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextOutline: {
    color: '#f97316',
  },
  link: {
    color: '#f97316',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f97316',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarFallback: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeSuccess: {
    backgroundColor: '#22c55e',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 15,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#d1d5db',
    padding: 2,
  },
  switchOn: {
    backgroundColor: '#f97316',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
  },
  switchThumbOn: {
    transform: [{ translateX: 20 }],
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 8,
  },
  alertItem: {
    marginBottom: 15,
  },
  alertMessage: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1f2937',
  },
  alertTime: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 5,
  },
  communityEvent: {
    marginBottom: 20,
  },
  communityEventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1f2937',
  },
  localHeroes: {
    marginBottom: 20,
  },
  localHeroesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1f2937',
  },
  heroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  heroInfo: {
    marginLeft: 15,
  },
  heroName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1f2937',
  },
  heroAction: {
    color: '#4b5563',
    fontSize: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  profileEmail: {
    color: '#4b5563',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
    color: '#1f2937',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  contactRelation: {
    fontSize: 14,
    color: '#4b5563',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactPhone: {
    marginRight: 10,
    fontSize: 14,
    color: '#4b5563',
  },
  safetyTip: {
    backgroundColor: '#fff7ed',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  safetyTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#1f2937',
  },
  safetyTipDescription: {
    fontSize: 14,
    color: '#4b5563',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingDescription: {
    fontSize: 14,
    color: '#4b5563',
  },
  trainingCourse: {
    backgroundColor: '#fff7ed',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  trainingCourseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#1f2937',
  },
  trainingCourseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  trainingCourseDuration: {
    fontSize: 14,
    color: '#4b5563',
  },
  trainingCourseLevel: {
    fontSize: 14,
    color: '#4b5563',
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceDetails: {
    marginLeft: 10,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  resourceMeta: {
    fontSize: 14,
    color: '#4b5563',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  leaderboardRank: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    width: 30,
  },
  leaderboardUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 10,
  },
  leaderboardPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f97316',
  },
  cameraContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    borderRadius: 8,
    marginBottom: 15,
  },
  camera: {
    flex: 1,
  },
  streamControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isEmailVerified, setIsEmailVerified] = React.useState(true);

  const handleSubmit = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the email is verified
      if (!user.emailVerified) {
        setIsEmailVerified(false);
        setError("Please verify your email before logging in.");
        return;
      }

      navigation.navigate('Home', { user }); // Pass user data to Home screen
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent. Please check your email.");
    } catch (error) {
      setError("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <>
     <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome Back to Sahay</Text>
        <Text style={styles.subtitle}>Log in to access your safety network</Text>
        <Input
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Input
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
      {error && <Text style={styles.errorText}>{error}</Text>}
      {!isEmailVerified && <Text style={styles.errorText}>Please verify your email before logging in.</Text>}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Map')}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Map</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Alerts')}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Alerts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Community')}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Community</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Settings</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </>
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
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <>
     <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Your Sahay Account</Text>
        <Text style={styles.subtitle}>Join our community of safety-conscious individuals</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

function HomeScreen({ route, navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Redirect to Login after logout
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
            </CardContent>
          </Card>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Map')}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Alerts')}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Alerts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Community')}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Community</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to Settings</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
  </>
  );
}

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
      <Tab.Screen name="Home" component={HomeScreen}/>
      <Tab.Screen name="Map" component={MapPage} />
      <Tab.Screen name="Alerts" component={AlertsPage} />
      <Tab.Screen name="Community" component={CommunityPage} />
      <Tab.Screen name="Profile" component={HomeScreen}/>
    </Tab.Navigator>
  );
}

const MapPage = () => {
  const [userLocation, setUserLocation] = useState(null);

  const handleLocationTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <CardHeader>
            <CardTitle>Safety Map</CardTitle>
            <CardDescription>View nearby safe zones and emergency services</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.mapPlaceholder}>
              <Text>Interactive Safety Map Coming Soon</Text>
            </View>
            <Button
              title={userLocation ? "Update Location" : "Get My Location"}
              onPress={handleLocationTracking}
            />
            {userLocation && (
              <Text>
                Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              </Text>
            )}
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const AlertsPage = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
      <Card>
        <CardHeader>
          <CardTitle>Safety Alerts</CardTitle>
          <CardDescription>Stay informed about potential risks in your area</CardDescription>
        </CardHeader>
        <CardContent>
          {[
            { id: 1, message: "Severe weather warning: Heavy rainfall expected", time: "10 mins ago" },
            { id: 2, message: "Traffic alert: Major accident on Highway 101", time: "30 mins ago" },
            { id: 3, message: "Community alert: Suspicious activity reported in downtown area", time: "1 hour ago" },
            { id: 4, message: "Health advisory: High pollen count today", time: "2 hours ago" },
            { id: 5, message: "Safety tip: Check your smoke alarms monthly", time: "1 day ago" },
          ].map(alert => (
            <View key={alert.id} style={styles.alertItem}>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  </SafeAreaView>
);

const CommunityPage = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.content}>
      <Card>
        <CardHeader>
          <CardTitle>Sahay Community</CardTitle>
          <CardDescription>Connect with your local safety network</CardDescription>
        </CardHeader>
        <CardContent>
          <View style={styles.communityEvent}>
            <Text style={styles.communityEventTitle}>Upcoming Community Events</Text>
            <Text>Neighborhood Watch Meeting - Next Tuesday, 7 PM</Text>
            <Text>Community Safety Workshop - Saturday, 10 AM</Text>
          </View>
          <View style={styles.localHeroes}>
            <Text style={styles.localHeroesTitle}>Local Heroes</Text>
            {[
              { id: 1, name: "Sarah M.", action: "Organized a successful community clean-up" },
              { id: 2, name: "Alex K.", action: "Assisted in a neighborhood emergency response" },
            ].map((hero) => (
              <View key={hero.id} style={styles.heroItem}>
                <Avatar name={hero.name} />
                <View style={styles.heroInfo}>
                  <Text style={styles.heroName}>{hero.name}</Text>
                  <Text  style={styles.heroAction}>{hero.action}</Text>
                </View>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  </SafeAreaView>
  
);

const ProfilePage = ({ user, handleLogout, navigation }) => {
  const [isKycVerified, setIsKycVerified] = useState(false);

  const handleKycVerification = () => {
    // Simulate KYC verification process
    setTimeout(() => {
      setIsKycVerified(true);
      Alert.alert("Success", "KYC verification successful!");
    }, 3000);
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
              <Avatar source={user?.avatar} name={user?.name} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                {isKycVerified ? (
                  <Badge variant="success">KYC Verified</Badge>
                ) : (
                  <Button title="Verify KYC" onPress={handleKycVerification} />
                )}
              </View>
            </View>
            <Separator />
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <Button title="Edit Profile" onPress={() => navigation.navigate('Settings')} />
            <Button title="Notification Preferences" onPress={() => navigation.navigate('Alerts')} />
            <Button title="Emergency Contacts" onPress={() => navigation.navigate('EmergencyContacts')} />
            <Button title="Help & Support" onPress={() => navigation.navigate('SafetyTips')} />
            <Separator />
            <Button title="Log Out" variant="destructive" onPress={handleLogout} />
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};
const SettingsPage = () => {
  const [locationEnabled, setLocationEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Customize your Sahay experience</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive alerts on your device</Text>
              </View>
              <Button title="Configure" variant="outline" />
            </View>
            <Separator />
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Location Services</Text>
                <Text style={styles.settingDescription}>Allow app to access your location</Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
              />
            </View>
            <Separator />
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Data Usage</Text>
                <Text style={styles.settingDescription}>Control how the app uses your data</Text>
              </View>
              <Button title="Adjust" variant="outline" />
            </View>
            <Separator />
            <View style={styles.settingItem}>
              <View>
                <Text style={styles.settingTitle}>Privacy Settings</Text>
                <Text style={styles.settingDescription}>Manage your privacy preferences</Text>
              </View>
              <Button title="Review" variant="outline" />
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const LeaderboardPage = () => {
  const leaderboard = [
    { id: 1, name: "Alice Johnson", points: 1200, avatar: "/placeholder.svg?height=40&width=40", badge: "Gold" },
    { id: 2, name: "Bob Williams", points: 980, avatar: "/placeholder.svg?height=40&width=40", badge: "Silver" },
    { id: 3, name: "Carol Davis", points: 850, avatar: "/placeholder.svg?height=40&width=40", badge: "Bronze" },
    { id: 4, name: "David Brown", points: 720, avatar: "/placeholder.svg?height=40&width=40", badge: null },
    { id: 5, name: "Eva Wilson", points: 650, avatar: "/placeholder.svg?height=40&width=40", badge: null },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <CardHeader>
            <CardTitle>Community Leaderboard</CardTitle>
            <CardDescription>Recognizing our most active and helpful community members</CardDescription>
          </CardHeader>
          <CardContent>
            <FlatList
              data={leaderboard}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.leaderboardItem}>
                  <Text style={styles.leaderboardRank}>{index + 1}</Text>
                  <View style={styles.leaderboardUser}>
                    <Avatar source={{ uri: item.avatar }} name={item.name} />
                    <Text style={styles.leaderboardName}>{item.name}</Text>
                  </View>
                  <Text style={styles.leaderboardPoints}>{item.points}</Text>
                  {item.badge && (
                    <Badge variant={item.badge.toLowerCase()}>{item.badge}</Badge>
                  )}
                </View>
              )}
            />
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const authenticated = true;


function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={authenticated ? router.replace('') : LoginScreen } />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Community" component={CommunityPage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Settings" component={SettingsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;