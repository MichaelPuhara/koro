import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RecordIcon from './RecordIcon';

type Props = {
  handleStop: (filePath: string) => void;
};

const audioRecorderPlayer = new AudioRecorderPlayer();

function RecordMessage({ handleStop }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPath, setRecordingPath] = useState('');

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Koro AI Chat needs access to your microphone',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Microphone permission is required to record audio');
      return;
    }

    try {
      const path = Platform.select({
        ios: 'recording.m4a',
        android: 'sdcard/recording.mp4',
      });

      const uri = await audioRecorderPlayer.startRecorder(path);
      setRecordingPath(uri);
      setIsRecording(true);
      console.log('Recording started:', uri);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      console.log('Recording stopped:', result);
      handleStop(result);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const handlePressIn = () => {
    startRecording();
  };

  const handlePressOut = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, isRecording && styles.recordingButton]}
        activeOpacity={0.7}>
        <RecordIcon isRecording={isRecording} />
      </TouchableOpacity>
      <Text style={styles.statusText}>
        {isRecording ? 'Recording...' : 'Hold to record'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordingButton: {
    opacity: 0.7,
  },
  statusText: {
    marginTop: 8,
    color: '#ffffff',
    fontWeight: '300',
  },
});

export default RecordMessage;
