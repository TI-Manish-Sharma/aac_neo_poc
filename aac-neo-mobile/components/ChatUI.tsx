import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Animated,
    Keyboard,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

// Message type definition
interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

// ChatUI component props
interface ChatUIProps {
    initialMessage?: string;
    onSendMessage?: (message: string) => Promise<string>;
    placeholderText?: string;
    chatTitle?: string;
}

export const ChatUI: React.FC<ChatUIProps> = ({
    initialMessage = "Hi! I'm Neo, your AAC expert assistant. How can I help you today?",
    onSendMessage,
    placeholderText = "Type your message...",
    chatTitle = "Ask Neo"
}) => {
    const colorScheme = useColorScheme() || 'light';
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Initialize with bot welcome message
    useEffect(() => {
        if (initialMessage) {
            setMessages([
                {
                    id: '0',
                    text: initialMessage,
                    isUser: false,
                    timestamp: new Date()
                }
            ]);
        }

        // Start entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        // Set up keyboard listeners
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // Scroll to bottom when new messages are added
    useEffect(() => {
        if (messages.length > 0 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        // Add user message to chat
        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            let responseText = "I understand your question about AAC. Let me find the answer for you.";

            // If onSendMessage prop is provided, use it to get response
            if (onSendMessage) {
                responseText = await onSendMessage(inputText);
            }

            // Add bot response to chat
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error getting bot response:', error);

            // Add error message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                isUser: false,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Format timestamp for messages
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Render a single message bubble
    const renderMessage = ({ item }: { item: Message }) => {
        return (
            <View style={[
                styles.messageContainer,
                item.isUser ? styles.userMessageContainer : styles.botMessageContainer
            ]}>
                {!item.isUser && (
                    <View style={styles.botAvatar}>
                        <Text style={styles.botAvatarText}>N</Text>
                    </View>
                )}

                <View style={[
                    styles.messageBubble,
                    item.isUser ? styles.userMessageBubble : styles.botMessageBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        item.isUser ? styles.userMessageText : styles.botMessageText
                    ]}>
                        {item.text}
                    </Text>
                    <Text style={[
                        styles.timestampText,
                        item.isUser ? styles.userTimestampText : styles.botTimestampText
                    ]}>
                        {formatTime(item.timestamp)}
                    </Text>
                </View>
            </View>
        );
    };

    // Main render
    return (
        <Animated.View style={[
            styles.container,
            {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
            }
        ]}>
            {/* Chat Header */}
            {!keyboardVisible && (
                <LinearGradient
                    colors={colorScheme === 'dark' ? ['#004052', '#002535'] : ['#e6f7ff', '#ccf2ff']}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <FontAwesome name="comments" size={24} color={Colors[colorScheme].tint} />
                        <Text style={styles.headerTitle}>{chatTitle}</Text>
                    </View>
                    <View style={styles.headerDivider} />
                </LinearGradient>
            )}

            {/* Chat Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesContainer}
                showsVerticalScrollIndicator={false}
            />

            {/* Loading indicator */}
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#00D2E6" />
                    <Text style={styles.loadingText}>Neo is typing...</Text>
                </View>
            )}

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.textInput}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={placeholderText}
                        placeholderTextColor="#999"
                        multiline
                        maxLength={1000}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !inputText.trim() && styles.disabledSendButton
                        ]}
                        onPress={handleSendMessage}
                        disabled={!inputText.trim() || isLoading}
                    >
                        <FontAwesome
                            name="send"
                            size={20}
                            color={inputText.trim() ? "#FFFFFF" : "#AAAAAA"}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 12,
        color: '#333333',
    },
    headerDivider: {
        height: 2,
        width: '40%',
        backgroundColor: '#00D2E6',
        marginTop: 10,
        borderRadius: 2,
    },
    messagesContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 6,
        maxWidth: '90%',
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
    },
    botMessageContainer: {
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
    },
    messageBubble: {
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 10,
        maxWidth: '90%',
    },
    userMessageBubble: {
        backgroundColor: '#00D2E6',
        borderBottomRightRadius: 4,
    },
    botMessageBubble: {
        backgroundColor: '#F0F0F0',
        borderBottomLeftRadius: 4,
        marginLeft: 8,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userMessageText: {
        color: '#FFFFFF',
    },
    botMessageText: {
        color: '#333333',
    },
    timestampText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    userTimestampText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    botTimestampText: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
    botAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#00D2E6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    botAvatarText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 50,
        marginBottom: 10,
    },
    loadingText: {
        color: '#888',
        marginLeft: 8,
        fontSize: 12,
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        backgroundColor: '#FFFFFF',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 120,
        fontSize: 16,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#00D2E6',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledSendButton: {
        backgroundColor: '#E0E0E0',
    },
});

export default ChatUI;