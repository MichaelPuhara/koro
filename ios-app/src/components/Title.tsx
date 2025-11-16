import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { API_ENDPOINTS } from '../config';

type Props = {
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
};

function Title({ setMessages }: Props) {
  const [isResetting, setIsResetting] = useState(false);

  // Reset the conversation
  const resetConversation = async () => {
    setIsResetting(true);

    try {
      const response = await axios.get(API_ENDPOINTS.RESET);
      if (response.status === 200) {
        setMessages([]);
        Alert.alert('Success', 'Conversation reset successful!');
      } else {
        console.error('There was an error with the API to backend');
      }
    } catch (err: any) {
      console.error('Error in resetting conversation:', err.message);
      Alert.alert('Error', 'Failed to reset conversation');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ōwairaka AI</Text>
      <TouchableOpacity
        onPress={resetConversation}
        disabled={isResetting}
        style={styles.button}>
        {isResetting ? (
          <ActivityIndicator color="#93c5fd" size="small" />
        ) : (
          <Text style={styles.resetIcon}>⟳</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    backgroundColor: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    fontStyle: 'italic',
  },
  button: {
    padding: 4,
  },
  resetIcon: {
    color: '#93c5fd',
    fontSize: 24,
  },
});

export default Title;
