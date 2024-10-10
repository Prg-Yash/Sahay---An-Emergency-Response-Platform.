import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Button
} from 'react-native';
import { router } from 'expo-router';
import { getDatabase, ref, onValue, set, off } from 'firebase/database';
import { auth } from '../firebase'; // Import auth to get userId
import Icon from 'react-native-vector-icons/Feather'; 

const Card = ({ children }) => <View style={styles.card}>{children}</View>;
const CardHeader = ({ children }) => <View style={styles.cardHeader}>{children}</View>;
const CardContent = ({ children }) => <View style={styles.cardContent}>{children}</View>;
const CardTitle = ({ children }) => <Text style={styles.cardTitle}>{children}</Text>;
const CardDescription = ({ children }) => <Text style={styles.cardDescription}>{children}</Text>;

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 10,
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
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
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
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactName: {
    fontWeight: 'bold',
  },
  contactRelation: {
    color: '#4b5563',
  },
  contactPhone: {
    color: '#1f2937',
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1f2937',
  },
});

const db = getDatabase();

export default function EmergencyContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });
    const [userId, setUserId] = useState('');

    useEffect(() => {
      const user = auth.currentUser; // Get the current user
      if (user) {
        setUserId(user.uid); // Set userId from auth
      }
    }, []);

    useEffect(() => {
      const fetchContacts = () => {
        const contactsRef = ref(db, `users/${userId}/emergencyContacts`);
        onValue(contactsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const contactsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            setContacts(contactsArray);
          } else {
            setContacts([]);
          }
        });
      };
     
      if (userId) {
        fetchContacts();
      }
      return () => {
        const contactsRef = ref(db, `users/${userId}/emergencyContacts`);
        off(contactsRef);
      };
    }, [userId]);

    const addContact = async (contact) => {
      const newContactId = Date.now().toString(); 
      await set(ref(db, `users/${userId}/emergencyContacts/${newContactId}`), { ...contact, userId });
      setNewContact({ name: '', relation: '', phone: '' });
    };
    
    function goToPreviousPage() {
        router.replace('/profile'); 
    };

    const removeContact = async (id) => {
      const contactRef = ref(db, `users/${userId}/emergencyContacts/${id}`);
      await set(contactRef, null);
    };

    const handleSubmit = () => {
      if (newContact.name && newContact.relation && newContact.phone) {
        addContact(newContact);
      } else {
        alert("Please fill in all fields.");
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Card>
            <CardHeader>
              <CardTitle>Your Emergency Contacts</CardTitle>
              <CardDescription>Here are your trusted emergency contacts</CardDescription>
            </CardHeader>
            <CardContent>
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <View key={contact.id} style={styles.contactItem}>
                    <View>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactRelation}>{contact.relation}</Text>
                    </View>
                    <View style={styles.contactActions}>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                      <TouchableOpacity onPress={() => removeContact(contact.id)}>
                        <Icon name="x" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text>No emergency contacts found.</Text>
              )}
              <Separator />
              <Text style={styles.sectionTitle}>Add New Contact</Text>
              <TextInput
                placeholder="Name"
                value={newContact.name}
                onChangeText={(text) => setNewContact({ ...newContact, name: text })}
              />
              <TextInput
                placeholder="Relation"
                value={newContact.relation}
                onChangeText={(text) => setNewContact({ ...newContact, relation: text })}
              />
              <TextInput
                placeholder="Phone Number"
                value={newContact.phone}
                onChangeText={(text) => setNewContact({ ...newContact, phone: text })}
              />
              <Button title="Add New Contact" onPress={handleSubmit} />
            </CardContent>
          </Card>
          <Button title="Go to Profile" onPress={goToPreviousPage} />
        </ScrollView>
      </SafeAreaView>
    );
};