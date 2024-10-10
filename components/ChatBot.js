import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import { speak, isSpeakingAsync, stop } from "expo-speech";

const ChatBot = () => {
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const API_KEY = "AIzaSyAQ4uFxgKw3inYV7vHBrAoqEusJWK_hMGA"; // Replace with your actual API key

    const handleUserInput = async () => {
        let updatedChat = [
            ...chat,
            {
                role: "user",
                parts: [{ text: userInput }],
            },
        ];

        setLoading(true);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
                {
                    contents: updatedChat,
                }
            );

            console.log("Gemini AI Response:", response.data);

            const modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (modelResponse) {
                // Clean the response by removing markdown characters (*, _, #)
                const cleanedResponse = modelResponse
                    .replace(/[*_#]/g, "") // Removes * _ and # characters
                    .trim();

                const updatedChatWithModel = [
                    ...updatedChat,
                    {
                        role: "model",
                        parts: [{ text: cleanedResponse }],
                    },
                ];

                setChat(updatedChatWithModel);
                setUserInput("");
            }
        } catch (error) {
            console.error("Error calling Gemini Pro Api:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSpeech = async (text) => {
        if (isSpeaking) {
            stop();
            setIsSpeaking(false);
        } else {
            if (!(await isSpeakingAsync())) {
                speak(text);
                setIsSpeaking(true);
            }
        }
    };

    const renderChatItem = ({ item }) => (
        <ChatBubble
            role={item.role}
            text={item.parts[0].text}
            onSpeech={() => handleSpeech(item.parts[0].text)}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI ChatBot</Text>
            <FlatList
                data={chat}
                renderItem={renderChatItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    placeholderTextColor="#aaa"
                    value={userInput}
                    onChangeText={setUserInput}
                />
                <TouchableOpacity style={styles.button} onPress={handleUserInput}>
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
            {loading && <ActivityIndicator style={styles.loading} color="#333" />}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f8f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: "flex-end",
        paddingBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        borderTopColor: "#ccc",
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        backgroundColor: "#f0f0f0",
    },
    button: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: "#00796b",
        borderRadius: 25,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
    },
});

export default ChatBot;
