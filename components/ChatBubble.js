import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ChatBubble = ({ role, text, onSpeech }) => {
    return (
        <TouchableOpacity onPress={onSpeech} style={[styles.bubble, role === 'user' ? styles.userBubble : styles.modelBubble]}>
            <Text style={styles.bubbleText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    bubble: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    userBubble: {
        backgroundColor: '#cce5ff',
        alignSelf: 'flex-end',
    },
    modelBubble: {
        backgroundColor: '#e2e3e5',
        alignSelf: 'flex-start',
    },
    bubbleText: {
        fontSize: 16,
    },
});


export default ChatBubble;
