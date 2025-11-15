import axios from 'axios';
import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import RecordMessage from './RecordMessage';
import Title from './Title';

interface Message {
    sender: string;
    audioUri: string;
}

function Controller() {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const handleStop = async (audioUri: string) => {
        setIsLoading(true);

        // Append recorded message to messages
        const myMessage: Message = { sender: "me", audioUri };
        const messagesArr = [...messages, myMessage];

        try {
            // Read the audio file
            const audioData = await FileSystem.readAsStringAsync(audioUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Convert base64 to blob-like format for upload
            const formData = new FormData();

            // For React Native, we need to structure the file differently
            const file: any = {
                uri: audioUri,
                type: 'audio/wav',
                name: 'myFile.wav',
            };

            formData.append('file', file);

            // Send form data to API endpoint
            // Note: Update this URL to your actual backend URL when deploying
            const response = await axios.post("http://localhost:8000/post-audio", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: 'arraybuffer',
            });

            // Save the audio response to a temporary file
            const blob = response.data;
            const base64Audio = btoa(
                new Uint8Array(blob).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const tempAudioUri = FileSystem.cacheDirectory + 'response_' + Date.now() + '.mp3';
            await FileSystem.writeAsStringAsync(tempAudioUri, base64Audio, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Append Rachel's response
            const rachelMessage: Message = { sender: "rachel", audioUri: tempAudioUri };
            messagesArr.push(rachelMessage);
            setMessages(messagesArr);

            // Play the audio
            await playAudio(tempAudioUri);
            setIsLoading(false);
        } catch (err: any) {
            console.error('Error processing audio:', err.message);
            setIsLoading(false);
        }
    };

    const playAudio = async (uri: string) => {
        try {
            // Unload previous sound if it exists
            if (sound) {
                await sound.unloadAsync();
            }

            // Set audio mode for playback
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            // Create and play new sound
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true }
            );

            setSound(newSound);

            // Unload sound when finished
            newSound.setOnPlaybackStatusUpdate((status: any) => {
                if (status.didJustFinish) {
                    newSound.unloadAsync();
                }
            });
        } catch (err: any) {
            console.error('Error playing audio:', err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Title setMessages={setMessages} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Conversation */}
                <View style={styles.messagesContainer}>
                    {messages.map((audio, index) => (
                        <View
                            key={index + audio.sender}
                            style={[
                                styles.messageWrapper,
                                audio.sender === "rachel" && styles.messageWrapperRight
                            ]}
                        >
                            <View style={styles.messageContent}>
                                <Text
                                    style={[
                                        styles.senderText,
                                        audio.sender === "rachel" ? styles.rachelText : styles.meText
                                    ]}
                                >
                                    {audio.sender}
                                </Text>
                                <TouchableAudioPlayer uri={audio.audioUri} onPlay={playAudio} />
                            </View>
                        </View>
                    ))}

                    {messages.length === 0 && !isLoading && (
                        <Text style={styles.placeholderText}>Send Ōwairaka AI a message...</Text>
                    )}

                    {isLoading && (
                        <Text style={styles.loadingText}>Give me a few seconds...</Text>
                    )}
                </View>
            </ScrollView>
            <View style={styles.recordContainer}>
                <RecordMessage handleStop={handleStop} />
            </View>
        </View>
    );
}

// Simple audio player component
import { TouchableOpacity } from 'react-native';

interface TouchableAudioPlayerProps {
    uri: string;
    onPlay: (uri: string) => void;
}

function TouchableAudioPlayer({ uri, onPlay }: TouchableAudioPlayerProps) {
    return (
        <TouchableOpacity
            onPress={() => onPlay(uri)}
            style={styles.audioButton}
        >
            <Text style={styles.audioButtonText}>▶ Play Audio</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 200,
    },
    messagesContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    messageWrapper: {
        flexDirection: 'column',
        marginBottom: 16,
    },
    messageWrapperRight: {
        alignItems: 'flex-end',
    },
    messageContent: {
        marginTop: 16,
    },
    senderText: {
        fontStyle: 'italic',
        marginBottom: 4,
    },
    rachelText: {
        textAlign: 'right',
        marginRight: 8,
        color: '#10b981',
    },
    meText: {
        marginLeft: 8,
        color: '#3b82f6',
    },
    audioButton: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d0d0d0',
    },
    audioButtonText: {
        color: '#333',
        fontSize: 14,
    },
    placeholderText: {
        textAlign: 'center',
        fontWeight: '300',
        fontStyle: 'italic',
        marginTop: 40,
        color: '#6b7280',
    },
    loadingText: {
        textAlign: 'center',
        fontWeight: '300',
        fontStyle: 'italic',
        marginTop: 40,
        color: '#6b7280',
    },
    recordContainer: {
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
