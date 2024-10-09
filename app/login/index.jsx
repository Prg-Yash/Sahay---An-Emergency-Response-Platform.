import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

import { Link, router } from 'expo-router';

export default function LoginScreen() {
   
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

            
            router.replace("/home")

        } catch (error) {
            console.log("Login error:", error.message);
            Alert.alert("Login failed. Please check your credentials and try again.");
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
        <SafeAreaView>
            <ScrollView>
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
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
                    <Text style={styles.buttonText}>Forgot Password</Text>
                </TouchableOpacity>
                <Text>Don't have an account? <Text style={styles.link} onPress={() => router.replace('/signup')}>Sign Up</Text></Text>

                {!isEmailVerified && <Text style={styles.errorText}>Please verify your email before logging in.</Text>}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    link: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});