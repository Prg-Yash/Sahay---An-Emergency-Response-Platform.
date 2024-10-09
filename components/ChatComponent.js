import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const ChatComponent = () => {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [apiKey] = useState(process.env.GEMINI_API_KEY); // Replace with your method of accessing the API key

  // Function to generate a response from the API
  const generateResponse = async (inputText, apiKey) => {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBLKcY7xLjfPjz-bPSDiMcLIx-s7wSsixU'; // Replace with the actual endpoint URL for the Generative AI API
    const data = {
      model: 'gemini-1.5-flash',
      prompt: inputText,
      generationConfig: {
        temperature: 1.0,
        topK: 64,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      },
      // You can add safetySettings here if needed
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Assuming response.data contains the needed information
      return response.data;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error; // Rethrow or handle as needed
    }
  };

  // Function to handle the send action
  const handleSend = async () => {
    try {
      const response = await generateResponse(inputText, apiKey);
      setResponseText(response.text || response.candidates[0]?.content.parts[0]?.text || ''); // Adjust based on response structure
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Send" onPress={handleSend} />
      {responseText ? (
        <Text style={styles.response}>{responseText}</Text>
      ) : (
        <Text style={styles.placeholder}>Waiting for response...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  response: {
    marginTop: 10,
    fontSize: 16,
  },
  placeholder: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
});

export default ChatComponent;
