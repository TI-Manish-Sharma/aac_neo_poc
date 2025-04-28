import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, Alert } from 'react-native';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import ChatUI from '@/components/ChatUI';
import { useColorScheme } from '@/hooks/useColorScheme';

// Mock Azure DirectLine secret (replace with your actual secret in production)
const DIRECT_LINE_SECRET = "YOUR_DIRECT_LINE_SECRET";

// Direct Line API endpoints
const BASE_URL = "https://directline.botframework.com";
const CONVERSATION_ENDPOINT = `${BASE_URL}/v3/directline/conversations`;

export default function ChatBotScreen() {
    const colorScheme = useColorScheme();
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [watermark, setWatermark] = useState<string | null>(null);

    // Initialize the conversation with Direct Line
    useEffect(() => {
        initializeConversation();
    }, []);

    // Create a new conversation with the bot
    const initializeConversation = async () => {
        try {
            setIsConnecting(true);

            // In a real app, you would call your secure backend to get a token
            // This is just a placeholder for the Direct Line API call
            /*
            const response = await fetch(CONVERSATION_ENDPOINT, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${DIRECT_LINE_SECRET}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              throw new Error(`Failed to start conversation: ${response.status}`);
            }
            
            const data = await response.json();
            setConversationId(data.conversationId);
            setToken(data.token);
            */

            // For demo purposes, we'll simulate a successful connection
            setTimeout(() => {
                setConversationId('mock-conversation-id');
                setToken('mock-token');
                setIsConnecting(false);
            }, 1500);

        } catch (error) {
            console.error('Error initializing conversation:', error);
            Alert.alert(
                'Connection Error',
                'Failed to connect to the chatbot. Please try again later.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }
    };

    // Send a message to the bot and get a response
    const sendMessage = async (message: string): Promise<string> => {
        try {
            // In a real implementation, you would send the message to Direct Line API
            // This is a placeholder for the actual API call
            /*
            const response = await fetch(`${CONVERSATION_ENDPOINT}/${conversationId}/activities`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                type: 'message',
                from: { id: 'user' },
                text: message
              })
            });
            
            if (!response.ok) {
              throw new Error(`Failed to send message: ${response.status}`);
            }
            
            // Get bot response
            const botResponse = await pollForBotResponse();
            return botResponse;
            */

            // For demo purposes, let's simulate bot responses
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

            // Simulate different responses based on the message content
            const lowerMessage = message.toLowerCase();

            if (lowerMessage.includes('mukund') && lowerMessage.includes('who')) {
                return "Mukund Joshi is India's renowned AAC Consultant and Business Coach, a seasoned Concrete Technologist and AAC (Autoclaved Aerated Concrete) Specialist with over 30 years of experience.";
            } else if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
                return "Mukund Joshi has 30+ years of global experience, having worked in 12+ countries on projects like Burj Khalifa, Bahrain Financial Harbor, Kaiga Atomic Reactor, and Mumbai Marine Outfalls.";
            } else if (lowerMessage.includes('mission')) {
                return "Mukund Joshi's mission is to empower AAC block manufacturers in India to set up and scale manufacturing plants efficiently using minimum resources.";
            } else if (lowerMessage.includes('book')) {
                return "Mukund Joshi's bestselling book 'Mastering AAC Blocks' provides a comprehensive guide to AAC technology, including manufacturing, testing, usage tips, tobermorite chemistry, and methods to avoid wall cracks.";
            } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
                return "You can contact Mukund Joshi at +91 91580 10000 or via email at mj@mukundjoshi.com. His office is located at 02, Tirtharaj Apartment, Behind Prakash Petrol Pump, Govind Nagar, Nashik ‑ 422009, India.";
            } else if (lowerMessage.includes('consult') || lowerMessage.includes('book')) {
                return "Interested clients can submit a 'Free Consultation' form on the website or schedule a free 30-minute video call via the 'Book Consultation' option.";
            } else {
                return "I'm sorry, I don't have specific information about that. Would you like to know about Mukund Joshi's experience, services, or how to contact him?";
            }

        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Failed to get a response from the bot');
        }
    };

    // Poll for bot response (in a real implementation)
    const pollForBotResponse = async (): Promise<string> => {
        try {
            const response = await fetch(
                `${CONVERSATION_ENDPOINT}/${conversationId}/activities?watermark=${watermark || ''}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to get activities: ${response.status}`);
            }

            const data = await response.json();
            setWatermark(data.watermark);

            // Find the most recent bot message
            const botMessages = data.activities.filter(
                (activity: any) => activity.from.id !== 'user' && activity.type === 'message'
            );

            if (botMessages.length > 0) {
                return botMessages[botMessages.length - 1].text;
            }

            // If no bot message is found, poll again after a short delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            return pollForBotResponse();

        } catch (error) {
            console.error('Error polling for bot response:', error);
            return "I'm having trouble connecting. Please try again later.";
        }
    };

    if (isConnecting) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00D2E6" />
                <Text style={styles.loadingText}>Connecting to Neo...</Text>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ChatUI
                initialMessage="Hello! I'm Neo, your AAC expert assistant. I can answer questions about Mukund Joshi and his AAC consulting services. How can I help you today?"
                onSendMessage={sendMessage}
                chatTitle="Ask Neo about AAC"
                placeholderText="Ask me anything about AAC..."
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#555555',
    },
});