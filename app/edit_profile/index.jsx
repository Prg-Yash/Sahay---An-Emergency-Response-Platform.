import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { getDatabase, ref, update, onValue } from 'firebase/database'; // Import Firebase database methods
import { auth } from '../firebase'; // Adjust the import path as necessary

export default function EditProfilePage ({ user })  {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [mobile, setMobile] = useState(user?.mobileNumber || '');

  useEffect(() => {
    const db = getDatabase();
    const userRef = ref(db, 'users/' + auth.currentUser.uid);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setName(data.name);
        setEmail(data.email);
        setAddress(data.address);
        setMobile(data.mobileNumber);
      }
    });
  }, []);

  const handleSave = () => {
    const db = getDatabase();
    const userRef = ref(db, 'users/' + auth.currentUser.uid);
    
    update(userRef, {
      name,
      email,
      address,
      mobile,
    }).then(() => {
      router.replace('/profile'); // Navigate back to the profile page after saving
    }).catch((error) => {
      console.error("Error updating profile: ", error);
    });
  };

  function goToPreviousPage() {
    router.replace('/profile'); // Redirect to profile page
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Edit Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={setMobile}
        />
        <Button title="Save Changes" onPress={handleSave} />
        <View style={{marginVertical: 2}}/>
        <Button title="Go to Profile" onPress={goToPreviousPage} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 10, // Added padding for better spacing
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  input: {
    height: 50, // Increased height for better touch targets
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
