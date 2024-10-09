import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import { router } from 'expo-router'; // Add this import
import { getDatabase, ref, onValue, set, update } from 'firebase/database'; // Import Firebase database methods
import { auth } from '../firebase';

export default function VolunteerPage({ user }) {
    const [userInfo, setUserInfo] = useState({});
    const [aadharCardNumber, setAadharCardNumber] = useState(''); // State for Aadhar Card Number
    const [isvolunteer, setisvolunteer] = useState(false);
    useEffect(() => {
        if(auth?.currentUser?.uid) {}

        const db = getDatabase();
        const userRef = ref(db, 'users/' + auth?.currentUser?.uid);

        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            console.log("DATA", data)
            if (data) {
                setUserInfo(data);
                setAadharCardNumber(data.aadharCardNumber || ''); // Set Aadhar Card Number from database
            }
        });
    }, [user]);

    function goToPreviousPage() {
        router.replace('/profile'); // Redirect to home page
    };

    const handleSaveAadhar = () => {
        const db = getDatabase();
        const userRef = ref(db, 'users/' + auth?.currentUser?.uid);
        update(userRef, {
            ...userInfo,
            aadharCardNumber: aadharCardNumber,
            isvolunteer: true // Save Aadhar Card Number to database
        }).then(() => {
            console.log("Aadhar Card Number saved successfully!");
            Alert("you are a volenteer now")

        }).catch((error) => {
            console.error("Error saving Aadhar Card Number: ", error);
        });
    };

    return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>User Information</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{userInfo.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userInfo.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{userInfo.address}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Mobile Number:</Text>
          <Text style={styles.value}>{userInfo.mobileNumber}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Aadhar Card Number:</Text>
          <TextInput
            style={styles.input}
            value={aadharCardNumber} // Bind Aadhar Card Number state
            onChangeText={setAadharCardNumber} // Update state on change
            editable={true}
            placeholder="Enter Aadhar Card Number"
          />
        </View>
        <Button title="Apply" onPress={handleSaveAadhar} /> 
        
        <Button title="Go to Profile" onPress={goToPreviousPage} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#4b5563',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    paddingHorizontal: 10,
  },
});
