import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import RecordIcon from './RecordIcon';

type Props = {
    handleStop: (uri: string) => void;
};

function RecordMessage({ handleStop }: Props) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [status, setStatus] = useState<string>('idle');

    useEffect(() => {
        // Request audio permissions on component mount
        (async () => {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant microphone permissions to record audio.');
            }
        })();
    }, []);

    const startRecording = async () => {
        try {
            setStatus('acquiring_media');

            // Configure audio mode for recording
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: newRecording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(newRecording);
            setStatus('recording');
        } catch (err: any) {
            console.error('Failed to start recording', err);
            setStatus('idle');
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            setStatus('stopping');
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            setRecording(null);
            setStatus('stopped');

            if (uri) {
                handleStop(uri);
            }

            // Reset audio mode
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });

            setStatus('idle');
        } catch (err: any) {
            console.error('Failed to stop recording', err);
            setStatus('idle');
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'recording':
                return 'Recording...';
            case 'acquiring_media':
                return 'Preparing...';
            case 'stopping':
                return 'Processing...';
            case 'stopped':
                return 'Stopped';
            default:
                return 'Hold to record';
        }
    };

    const getIconColor = () => {
        return status === 'recording' ? '#ef4444' : '#0ea5e9';
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPressIn={startRecording}
                onPressOut={stopRecording}
                style={styles.button}
                activeOpacity={0.7}
            >
                <RecordIcon color={getIconColor()} size={48} />
            </TouchableOpacity>
            <Text style={styles.statusText}>{getStatusText()}</Text>
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
    statusText: {
        marginTop: 8,
        color: '#ffffff',
        fontWeight: '300',
        fontSize: 14,
    },
});

export default RecordMessage;
