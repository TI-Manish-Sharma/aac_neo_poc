import React from 'react';
import { StyleSheet } from 'react-native';

import ChatBotScreen from '@/components/ChatBotScreen';
import { ThemedView } from '@/components/ThemedView';

export default function AskNeoScreen() {
  return (
    <ThemedView style={styles.container}>
      <ChatBotScreen />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});