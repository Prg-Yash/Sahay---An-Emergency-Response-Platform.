import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

import { auth } from '../firebase'; // Adjust the import path as necessary
import { router } from 'expo-router';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#1f2937',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        width: '100%',
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    link: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
});

export default function SignUpScreen({ }) {
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
        router.replace('/login'); // Redirect to Login after sign up
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
          <Text style={styles.link}>Already have an account? <Text style={styles.link} onPress={() => router.replace('/login')}>Login</Text></Text>
        </ScrollView>
    
      </SafeAreaView>
    );
  }