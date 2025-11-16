import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import axios from 'axios';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import RecordMessage from './RecordMessage';
import Title from './Title';
import { API_ENDPOINTS } from '../config';

type Message = {
  sender: string;
  audioPath: string;
};

function Controller() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Sound | null>(null);

  const handleStop = async (filePath: string) => {
    setIsLoading(true);

    try {
      // Append recorded message to messages
      const myMessage: Message = { sender: 'me', audioPath: filePath };
      const messagesArr = [...messages, myMessage];

      console.log('Recording file path:', filePath);

      // Create FormData - use the correct filename that backend expects
      const formData = new FormData();
      formData.append('file', {
        uri: filePath,
        type: 'audio/m4a',
        name: 'audio.m4a',
      } as any);

      console.log('Sending to:', API_ENDPOINTS.POST_AUDIO);

      // Send to backend API
      const response = await axios.post(
        API_ENDPOINTS.POST_AUDIO,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'arraybuffer',
          timeout: 60000, // 60 second timeout for AI processing
        },
      );

      console.log('Response received, status:', response.status);

      // Save response audio to file
      const responseAudioPath = `${RNFS.DocumentDirectoryPath}/response_${Date.now()}.mp3`;

      // Convert arraybuffer to base64 using React Native's Buffer
      const arrayBuffer = response.data;
      const base64Audio = Buffer.from(arrayBuffer).toString('base64');

      await RNFS.writeFile(responseAudioPath, base64Audio, 'base64');
      console.log('Response audio saved to:', responseAudioPath);

      // Add AI response to messages
      const aiMessage: Message = {
        sender: 'Ōwairaka AI',
        audioPath: responseAudioPath,
      };
      messagesArr.push(aiMessage);
      setMessages(messagesArr);

      // Play the response audio
      playAudio(responseAudioPath);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error processing audio:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      let errorMessage = 'Failed to process your message.';
      if (error.response?.status === 400) {
        errorMessage = 'Audio format not supported. Please try again.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Check backend is running.';
      }

      Alert.alert('Error', errorMessage);
      setIsLoading(false);
    }
  };

  const playAudio = (audioPath: string) => {
    // Stop currently playing audio if any
    if (currentlyPlaying) {
      currentlyPlaying.stop();
      currentlyPlaying.release();
    }

    const sound = new Sound(audioPath, '', (error) => {
      if (error) {
        console.error('Failed to load sound', error);
        Alert.alert('Error', 'Failed to play audio');
        return;
      }

      sound.play((success) => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed');
        }
        sound.release();
        setCurrentlyPlaying(null);
      });
    });

    setCurrentlyPlaying(sound);
  };

  const handlePlayMessage = (audioPath: string) => {
    playAudio(audioPath);
  };

  return (
    <View style={styles.container}>
      <Title setMessages={setMessages} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <View
              key={index + message.sender}
              style={[
                styles.messageWrapper,
                message.sender === 'Ōwairaka AI' && styles.aiMessageWrapper,
              ]}>
              <View style={styles.messageContent}>
                <Text
                  style={[
                    styles.senderText,
                    message.sender === 'Ōwairaka AI'
                      ? styles.aiSenderText
                      : styles.userSenderText,
                  ]}>
                  {message.sender}
                </Text>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => handlePlayMessage(message.audioPath)}>
                  <Text style={styles.playButtonText}>▶ Play</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {messages.length === 0 && !isLoading && (
            <Text style={styles.emptyText}>Send Ōwairaka AI a message...</Text>
          )}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text style={styles.loadingText}>Give me a few seconds...</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.recordingContainer}>
        <RecordMessage handleStop={handleStop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  messagesContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  messageWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  aiMessageWrapper: {
    alignItems: 'flex-end',
  },
  messageContent: {
    maxWidth: '80%',
  },
  senderText: {
    fontStyle: 'italic',
    marginBottom: 4,
  },
  userSenderText: {
    color: '#3b82f6',
    marginLeft: 8,
  },
  aiSenderText: {
    color: '#10b981',
    marginRight: 8,
    textAlign: 'right',
  },
  playButton: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 4,
  },
  playButtonText: {
    color: '#3730a3',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    fontWeight: '300',
    fontStyle: 'italic',
    marginTop: 40,
    color: '#6b7280',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    textAlign: 'center',
    fontWeight: '300',
    fontStyle: 'italic',
    marginTop: 16,
    color: '#6b7280',
  },
  recordingContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
  },
});

export default Controller;
